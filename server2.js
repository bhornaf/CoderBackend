const express = require("express");
const { Router } = express;
const handlebars = require("express-handlebars");
const fs = require("fs");
const contenedor = require("./Contenedor");

const productos = new contenedor("productos.txt");
const router = Router();

const app = express();
const hbs = handlebars.create({
    extname: ".hbs",
    defaultLayout: "products",
    layoutsDir: "./handlebars",
});

app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");
app.set("views", "./handlebars");

// app.get("/", (req, res) => {
//     res.render("index", {});
// });

app.get("/productos", (req, res) => {
    console.log("productos");
    productos
        .getAll()
        .then((data) => {
            res.render("products", { products: data });
        })
        .catch((err) => {
            console.log(err);
        });
});

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

const PORT = 8080;

const server = app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

server.on("error", (err) => {
    console.log(err);
});
