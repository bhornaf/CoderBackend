const fs = require("fs");

class Contenedor {
    constructor(fileName) {
        this.fileName = fileName;
        this.data = [];
    }

    readFile() {
        const data = fs.readFileSync(this.fileName, "utf-8");
        this.data = JSON.parse(data);
    }

    save(product) {
        const maxId = this.data.reduce((max, product) => {
            return product.id > max ? product.id : max;
        }, 0);

        const id = maxId + 1;
        const newProduct = {
            ...product,
            id,
        };
        const length = this.data.length;

        this.data[length] = newProduct;
        fs.writeFileSync(this.fileName, JSON.stringify(this.data));
        return id;
    }
    getById(id) {
        const product = this.data.find((product) => product.id === id);
        return product;
    }

    getAll() {
        return this.data;
    }

    deleteById(id) {
        const index = this.data.findIndex((product) => product.id === id);
        this.data.splice(index, 1);
        fs.writeFileSync(this.fileName, JSON.stringify(this.data));
    }

    deleteAll() {
        this.data = [];
        fs.writeFileSync(this.fileName, JSON.stringify(this.data));
    }

    getRandom() {
        const index = Math.floor(Math.random() * this.data.length);
        return this.data[index];
    }
}

exports = module.exports = Contenedor;

// const contenedor = new Contenedor("productos.txt");
// contenedor.readFile();
// console.log(contenedor.getAll());

// const product = {
//     title: "Laptop",
//     price: 1000,
//     thumbnail:
//         "https://images-na.ssl-images-amazon.com/images/I/61-YZ-X-8L._AC_SL1500_.jpg",
// };

// console.log(contenedor.save(product));
// console.log(contenedor.getById(1));
// contenedor.deleteById(2);
