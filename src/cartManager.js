const fs = require('fs').promises;

class CartManager {
    #carts

    constructor(filePath) {
        // this.#carts = [];
        this.path = filePath;
        this.cartIdCounter = 1;
    }

     async initialize() {
         this.#carts = await this.readFromFile();
         const maxId = this.#carts.reduce((max, cart) => Math.max(max, cart.id), 0);
             this.cartIdCounter = maxId + 1;
             console.log('Carts loaded successfully.');
             console.log("cartIdCounter:" + this.cartIdCounter);
             console.log("maxId:" + maxId);
     }

    async createCart() {
        try {
            console.log("cartIdCounter:" + this.cartIdCounter);
            const carts = await this.readFromFile();
            const newCart = {
                id: this.cartIdCounter,
                products: []
            };

            carts.push(newCart);
            this.cartIdCounter++;
            await this.saveToFile(carts);
            return newCart;

        } catch (error) {
            console.error("Error creating Cart:", error);
        }
    }

    async getCartProducts(cid) {
        const carts = await this.readFromFile();
        const cart = carts.find(c => c.id === cid);
        return cart ?
            cart.products
            : [];
    }

    async addProductToCart(cid, pid, quantity = 1) {
        const carts = await this.readFromFile();
        const cartIndex = carts.findIndex(c => c.id ===cid);
        if (cartIndex !== -1) {
            const cart = carts[cartIndex];
            const existingProductIndex = cart.products.findIndex(p => p.pid === pid);
            console.log("EPIndex:" + existingProductIndex);
            if (existingProductIndex !== -1) {
                cart.products[existingProductIndex].quantity += quantity;
            } else {
                cart.products.push({ pid, quantity});
            }
            await this.saveToFile(carts);
        } else {
            throw new Error('Cart not found')
        }
    }

    async getCarts() {
        try {
            const carts = await fs.readFile(this.path, 'utf-8');
            console.log('Carts read from file:', carts);
            return JSON.parse(carts);
        } catch (error) {
            console.error("Error obtaining carts:", error);
            return [];
        }
    }

    async getCartById(id) {
        try {
            const carts = await this.getCarts();
            const cart = carts.find(c => c.id === id);
            if (cart) {
                return cart;
            } else {
                console.error("Cart not found.");
            }
        } catch (error) {
            console.error("Error obtaining cart by ID:", error);
            return null;
        }
    }

    async updateCart(id, updatedFields) {
        try {
            let carts = await this.readFromFile();
            const index = carts.findIndex(c => c.id === id);
            if (index !== -1) {
                carts[index] = { ...carts[index], ...updatedFields };
                await this.saveToFile(carts);
                console.log("Cart updated:", carts[index]);
            } else {
                console.error("Error finding cart to update.");
            }
        } catch (error) {
            console.error("Error updating cart:", error);
        }
    }

    async deleteCart(id) {
        try {
            let carts = await this.readFromFile();
            carts = carts.filter(c => c.id !== id);
            await this.saveToFile(carts);
            console.log("Cart deleted, remaining carts:", carts)
        } catch (error) {
            console.error("Error deleting cart:", error);
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
                const carts = await fs.readFile(this.path, 'utf-8');
                return JSON.parse(carts);
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

    async saveToFile(carts) {
        try {
            const data = JSON.stringify(carts, null, '\t');
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
//         const manager = new CarttManager(`${__dirname}/../assets/Carts.json`); 
//         await manager.initialize();
//         await manager.addCart(
                // { 
                //     id: 
                //     quantity:

                // },
                // { 
                //     id: 
                //     quantity:

                // }
//         );

// main();

module.exports = CartManager;