const fs = require("fs");
const express = require("express");
const { Router } = express;
const handlebars = require("express-handlebars");

const { Server: HTTPServer } = require("http");
const { Server: SocketServer } = require("socket.io");
const events = require("./socket_events");
const contenedor = require("./Contenedor");
const ContenedorData = require("./utils/contenedor");

const contenedor_msg = new ContenedorData("./data.json");
const messages = contenedor_msg.getAll();

const productos = new contenedor("productos.txt");
// const productos_list = productos.getAll().then((data) => {
//     data;
// });

const router = Router();

const app = express();
const httpServer = new HTTPServer(app);
const socketServer = new SocketServer(httpServer);

app.use(express.static("handlebars"));

const hbs = handlebars.create({
    extname: ".hbs",
    defaultLayout: "index",
    layoutsDir: "./handlebars",
});

app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");
app.set("views", "./handlebars");

app.get("/", (req, res) => {
    res.render("index", {});
});

const getDateNow = () => {
    const date = new Date();
    const [month, day, year] = [
        date.getMonth(),
        date.getDate(),
        date.getFullYear(),
    ];
    const [hour, minutes, seconds] = [
        date.getHours(),
        date.getMinutes(),
        date.getSeconds(),
    ];

    return `${month}/${day}/${year} ${hour}:${minutes}:${seconds}`;
};

socketServer.on("connection", (socket) => {
    console.log("Nuevo client conectado");

    socketServer.emit(
        events.UPDATE_MESSAGES,
        "Bienvenido al WebSocket",
        messages
    );

    const listProducts = productos.getAll();
    listProducts
        .then((data) => {
            socketServer.emit(events.UPDATE_LIST, "Lista de productos", data);
        })
        .catch((err) => {
            console.log(err);
        })
        .finally(() => {
            console.log("Lista de productos enviada");
        });

    socket.on(events.POST_MESSAGE, (msg) => {
        const _msg = {
            ...msg,
            socket_id: socket.id,
            likes: 0,
            date: getDateNow(),
        };
        contenedor_msg.save(_msg);
        socketServer.sockets.emit(events.NEW_MESSAGE, _msg);
    });

    socket.on(events.POST_PRODUCT, (product) => {
        productos
            .save(product)
            .then(() => {
                socketServer.sockets.emit(events.NEW_PRODUCT, product);
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                console.log("Producto agregado");
            });

        // socketServer.sockets.emit(events.NEW_PRODUCT, product);
    });
});

// app.get("/", (req, res) => {
//     console.log("productos");
//     productos
//         .getAll()
//         .then((data) => {
//             res.render("products", { products: data });
//         })
//         .catch((err) => {
//             console.log(err);
//         });
// });

router.get("/producto/:id", (req, res) => {
    console.log(req.params.id);
    const id = parseInt(req.params.id);
    productos
        .getById(id)
        .then((data) => {
            res.send(data ? data : "Producto no encontrado");
        })
        .catch((err) => {
            res.send(err);
        });
});

router.get("/productoRandom", (req, res) => {
    productos
        .getRandom()
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.send(err);
        });
});

router.post("/productos", (req, res) => {
    productos
        .save(req.body)
        .then((data) => {
            res.send("El id es: " + data);
        })
        .catch((err) => {
            res.send(err);
        });
});

router.put("/productos/:id", (req, res) => {
    productos
        .updateById(req.params.id, req.body)
        .then((data) => {
            res.send("El producto se actualizo correctamente");
        })
        .catch((err) => {
            res.send(err);
        });
});

router.delete("/productos/:id", (req, res) => {
    productos
        .deleteById(req.params.id)
        .then((data) => {
            res.send("El producto se elimino correctamente");
        })
        .catch((err) => {
            res.send(err);
        });
});

app.use("/api", router);

const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
