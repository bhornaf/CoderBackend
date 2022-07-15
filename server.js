const express = require("express");
const contenedor = require("./Contenedor");
const productos = new contenedor("productos.txt");

productos.readFile();

const app = express();

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.get("/productos", (req, res) => {
    res.send(productos.getAll());
});

app.get("/productoRandom", (req, res) => {
    const product = productos.getRandom();
    res.send(product);
});

const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

server.on("error", (err) => {
    console.log(err);
});
