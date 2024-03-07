const fs = require('fs').promises;

class ProductManager {
    #products

    constructor(filePath) {
        // this.#products = [];
        this.path = filePath;
        this.productIdCounter = 1;
    }

     async initialize() {
         this.#products = await this.readFromFile();
         const maxId = this.#products.reduce((max, product) => Math.max(max, product.id), 0);
             this.productIdCounter = maxId + 1;
             console.log('Products loaded successfully.');
     }

    async addProduct(title, description, price, thumbnails, code, stock, category) {
        try {

            const product = {
                title,
                description,
                price,
                thumbnails,
                code,
                stock,
                category,
                id: this.productIdCounter
            };

            // Verificar si ya existe un producto con el mismo código.
            // console.log(this.#products);
            const existingProduct = this.#products.find(p => p.code === code);
            if (existingProduct) {
                console.error("A product with this code already exists.");
                return;
            }

            console.log(this.productIdCounter);
            this.#products.push(product);
            this.productIdCounter++;
            await this.saveToFile(this.#products);
            console.log("Product added succesfully:", product);

        } catch (error) {
            console.error("Error adding product:", error);
        }
    }

    async getProducts() {
        try {
            const products = await fs.readFile(this.path, 'utf-8');
            console.log('Products read from file:', products);
            return JSON.parse(products);
        } catch (error) {
            console.error("Error obtaining products:", error);
            return [];
        }
    }

    async getProductById(id) {
        try {
            const products = await this.getProducts();
            const prod = products.find(p => p.id === id);
            if (prod) {
                return prod;
            } else {
                console.error("Product not found.");
            }
        } catch (error) {
            console.error("Error obtaining product by ID:", error);
            return null;
        }
    }

    async updateProduct(id, updatedFields) {
        try {
            let products = await this.readFromFile();
            const index = products.findIndex(p => p.id === id);
            if (index !== -1) {
                products[index] = { ...products[index], ...updatedFields };
                await this.saveToFile(products);
                console.log("Product updated:", products[index]);
            } else {
                console.error("Error finding product to update.");
            }
        } catch (error) {
            console.error("Error updating product:", error);
        }
    }

    async deleteProduct(id) {
        try {
            let products = await this.readFromFile();
            products = products.filter(p => p.id !== id);
            await this.saveToFile(products);
            console.log("Product deleted, remaining products:", products)
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    }

    async readFromFile() {
        try {
            // Verificar si el archivo existe antes de intentar leerlo
            const fileExists = await fs.access(this.path, fs.constants.F_OK)
                .then(() => true)
                .catch(() => false);
    
            // Si el archivo existe, proceder a leerlo
            if (fileExists) {
                const products = await fs.readFile(this.path, 'utf-8');
                return JSON.parse(products);
            } else {
                // Si el archivo no existe, crearlo con un array vacío
                await fs.writeFile(this.path, '[]', 'utf-8');
                return [];
            }
        } catch (error) {
            // Manejar cualquier otro error lanzándolo
            throw error;
        }
    }

    async saveToFile(products) {
        try {
            const data = JSON.stringify(products, null, '\t');
            await fs.writeFile(this.path, data, 'utf-8');
        }
        catch (error) {
            console.error("Error saving file:", error);
        }
    }

}

// Use case

// const main = async () => {

//     try {
//         const manager = new ProductManager(`${__dirname}/../assets/Products.json`); 
//         await manager.initialize();
//         await manager.addProduct(
//             "Skirt",
//             "Skirt de algodón",
//             52.99,
//             "img/skirt.jpg",
//             "SKT001",
//             100
//         );
//         await manager.addProduct(
//             "Shirt",
//             "Shirt de pima",
//             22.99,
//             "img/shirt.jpg",
//             "SHT001",
//             100
//         );
//         await manager.addProduct(
//             "Medias",
//             "Medias de algodón",
//             1.99,
//             "img/medias.jpg",
//             "MED001",
//             100
//         );
//         await manager.addProduct(
//             "Jean",
//             "Jeans negro",
//             19.99,
//             "img/jeanbl.jpg",
//             "JB007",
//             10
//         );

//         // Comandos para probar las funcionalidades:

//          // Obtener todos los productos
//         // const products = await manager.getProducts();
//         // console.log("All products:", products);

//         // // Obtener un producto por ID
//         // const productById = await manager.getProductById(2); 
//         // console.log("Product by ID:", productById);

//         // // Actualizar un producto
//         // await manager.updateProduct(1, { price: 19.99 });
//         // console.log("Product updated.");

//         // // Eliminar un producto
//         // await manager.deleteProduct(2);
//         // console.log("Product deleted.");
        
//     } catch (error) {
//         console.log('Error.', error);
//     }
// }

// main();

module.exports = ProductManager;