const express = require("express");
const { Router } = express;

const contenedor = require("./Contenedor");
const productos = new contenedor("productos.txt");

const app = express();
const router = Router();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// router.get("/", (req, res) => {
//     res.send("Hello World!");
// });

router.get("/productos", (req, res) => {
    productos
        .getAll()
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.send(err);
        });
});

router.get("/producto/:id", (req, res) => {
    console.log(req.params.id);
    const id = parseInt(req.params.id);
    productos
        .getById(id)
        .then((data) => {
            res.send(data ? data : "Producto no encontrado");
            // if (data) {
            //     res.send(data);
            // } else {
            //     res.send("No existe el producto");
            // }
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
