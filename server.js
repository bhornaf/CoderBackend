const express = require("express");
const { Router } = express;
const { Server: HTTPServer } = require("http");
const { Server: SocketServer } = require("socket.io");
const events = require("./socket_events");

const messages = [];

const app = express();
const router = Router();

const contenedor = require("./Contenedor");
const productos = new contenedor("productos.txt");
const httpServer = new HTTPServer(app);
const socketServer = new SocketServer(httpServer);

socketServer.on("connection", (socket) => {
    console.log("Nuevo client conectado");
    socketServer.emit(
        events.UPDATE_MESSAGES,
        "Bienvenido al WebSocket",
        messages
    );

    socket.on(events.POST_MESSAGE, (msg) => {
        const date = new Date.now();
        console.log(date);
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

        const _msg = {
            ...msg,
            socket_id: socket.id,
            likes: 0,
            date: `${month}/${day}/${year} ${hour}:${minutes}:${seconds}`,
        };

        console.log(
            `Holaaaa: ${month}/${day}/${year} ${hour}:${minutes}:${seconds}`
        );
        messages.push(_msg);
        socketServer.sockets.emit(events.NEW_MESSAGE, _msg);
    });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./pages");
app.get("/", (req, res) => {
    res.render("index");
});
app.get("/productos", (req, res) => {
    productos
        .getAll()
        .then((data) => {
            res.render("ProductList", { products: data });
        })
        .catch((err) => {
            console.log(err);
        });
});

app.get("/productos/:id", (req, res) => {
    const id = parseInt(req.params.id);
    productos
        .getById(id)
        .then((data) => {
            res.render("Product", { product: data });
        })
        .catch((err) => {
            console.log(err);
        });
});

// // Use pug
// app.set("views", "./views");
// app.set("view engine", "pug");
// app.get("/", (req, res) => {
//     res.render("index.pug", {});
// });

// app.get("/productos", (req, res) => {
//     productos
//         .getAll()
//         .then((productos) => {
//             res.render("productos.pug", { productos: productos });
//         })
//         .catch((err) => {
//             console.log(err);
//         });
// });

// app.get("/producto/:id", (req, res) => {
//     const id = parseInt(req.params.id);
//     productos
//         .getById(id)
//         .then((producto) => {
//             res.render("producto.pug", { productos: producto });
//         })
//         .catch((err) => {
//             console.log(err);
//         });
// });

// router.get("/productos", (req, res) => {
//     productos
//         .getAll()
//         .then((data) => {
//             res.send(data);
//         })
//         .catch((err) => {
//             res.send(err);
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

const server = app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

server.on("error", (err) => {
    console.log(err);
});
