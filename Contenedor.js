const fs = require("fs");

class Contenedor {
    constructor(fileName) {
        this.fileName = fileName;
        this.data = [];
    }

    readFile = async () => {
        const data = await fs.promises.readFile(this.fileName, "utf8");
        this.data = JSON.parse(data);
        return this.data;
    };

    getAll = async () => {
        const data = await this.readFile();
        return this.data;
    };

    getRandom = async () => {
        const data = await this.getAll();
        const randomIndex = Math.floor(Math.random() * data.length);
        return data[randomIndex];
    };

    getById = async (id) => {
        const data = await this.getAll();
        const producto = data.find((producto) => producto.id === id);
        return producto;
    };

    save = async (producto) => {
        const data = await this.getAll();
        const maxId = data.reduce((max, producto) => {
            return producto.id > max ? producto.id : max;
        }, 0);
        const id = maxId + 1;
        const newProducto = { ...producto, id };

        const maxLength = data.length;
        this.data[maxLength] = newProducto;
        await fs.promises.writeFile(this.fileName, JSON.stringify(this.data));
        return id;
    };

    deleteById = async (id) => {
        const data = await this.getAll();
        const index = data.findIndex((producto) => producto.id === id);
        data.splice(index, 1);
        await fs.promises.writeFile(this.fileName, JSON.stringify(data));
    };

    updateById = async (id, producto) => {
        const data = await this.getAll();
        const index = data.findIndex((producto) => producto.id === id);
        data[index] = producto;
        await fs.promises.writeFile(this.fileName, JSON.stringify(data));
    };

    deleteAll = async () => {
        this.data = [];
        await fs.promises.writeFile(this.fileName, JSON.stringify([]));
    };
}

exports = module.exports = Contenedor;
