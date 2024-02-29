const fs = require('fs').promises;

class ProductManager {

    constructor(filePath) {
        this.path = filePath;
        this.products = [];
        this.productIdCounter = 1;
    }

    async initialize() {
        try {
            const fileContent = await fs.readFile(this.path, 'utf-8');
            this.products = JSON.parse(fileContent);

            const maxId = this.products.reduce((max, product) => Math.max(max, product.id), 0);
            this.productIdCounter = maxId + 1;
            console.log('Products loaded successfully.');

        } catch (error) {
            console.error('Error initializing PM.', error);
            return [];
        }
    }

    async addProduct(title, description, price, thumbnail, code, stock) {
        try {

            // Verificar si ya existe un producto con el mismo código.
            const existingProduct = this.products.find(p => p.code === code);
            if (existingProduct) {
                console.error("A product with this code already exists.");
                return;
            }

            const product = {
                title,
                description,
                price,
                thumbnail,
                code,
                stock,
                id: this.productIdCounter
            };

            this.productIdCounter++;
            this.products.push(product);
            await this.saveToFile();
            console.log("Product added succesfully:", product);

        } catch (error) {
            console.error("Error adding product:", error);
        }
    }

    async getProducts() {
        try {
            const products = await fs.readFile(this.path, 'utf-8');
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
            console.log("Product deleted.")
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    }

    async readFromFile() {
        try {
            const products = await fs.readFile(this.path, 'utf-8');
            return JSON.parse(products);
        }
        catch (error) {
            console.error("Error reading file:", error);
            return [];
        }
    }

    async saveToFile() {
        try {
            const data = JSON.stringify(this.products, null, 2);
            await fs.writeFile(this.path, data, 'utf-8');
            console.log('Products successfully saved to file.');
        }
        catch (error) {
            console.error("Error saving file:", error);
        }
    }

    async createFileIfNonExistant() {

        try {
            await fs.writeFile(this.path, 'utf-8');
        }
        catch (error) {
            console.error("Error creating file:", error);
        }
    }
}

// Use case

const manager = new ProductManager('Products.json');


// Añadir un producto
// manager.addProduct(
//     "Medias",
//     "Medias de algodón",
//     1.99,
//     "img/medias.jpg",
//     "MED001",
//     100
// )


const main = async () => {
    await manager.initialize();

    await manager.addProduct(
        "Skirt",
        "Skirt de algodón",
        52.99,
        "img/skirt.jpg",
        "SKT001",
        100
    );

    await manager.addProduct(
        "Shirt",
        "Skirt de pima",
        52.99,
        "img/shirt.jpg",
        "SHT001",
        100
    );

    const products = await manager.getProducts();
    console.log("All products:", products);

};

main();

// Comandos para probar las funcionalidades:

// Obtener todos los productos
// const products = await manager.getProducts();
// console.log("All products:", products);

// // Obtener un producto por ID
// manager.getProductById(1).then(product => console.log("Product by ID:", product));

// // Actualizar un producto
// manager.updateProduct(1, { price: 19.99 }).then(() => console.log("Product updated."));

// // Eliminar un producto
// manager.deleteProduct(1).then(() => console.log("Product deleted."));