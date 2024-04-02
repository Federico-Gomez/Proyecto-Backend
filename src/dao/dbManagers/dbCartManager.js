const { Cart } = require('../models');

class CartManager {
    #carts

    constructor() {
        // this.cartIdCounter = 1;
    }

    //  async initialize() {
    //      const maxId = this.#carts.reduce((max, cart) => Math.max(max, cart.id), 0);
    //          this.cartIdCounter = maxId + 1;
    //          console.log('Carts loaded successfully.');
    //          console.log("cartIdCounter:" + this.cartIdCounter);
    //          console.log("maxId:" + maxId);
    //  }

    async prepare() { 
        // Chequear que la conexión existe y está funcionando
        if (Cart.db.readyState !== 1) {
            throw new Error('must connect to mongodb!')
        }
    }

    async createCart() {
        try {
            
            await Cart.create({
                products: []
            });

        } catch (error) {
            console.error("Error creating Cart:", error);
            throw error;
        }
    }

    async getCartProducts(cid) {
        try {
            const cart = await Cart.findOne({ _id: cid });

            return cart ?
            cart.products
            : [];
            
        } catch (error) {
            console.error("Error obtaining product by ID:", error);
            return null;
        }
    }

    async addProductToCart(cid, pid, quantity) {
        try {
        let cart = await Cart.findOne({ _id: cid });
        if (!cart) {
            await this.createCart();
            cart = await Cart.findOne({ _id: cid });
        }
           
            const existingProductIndex = cart.products.findIndex(p => p._id === pid);
            console.log("EPIndex:" + existingProductIndex);

            if (existingProductIndex !== -1) {
                cart.products[existingProductIndex].quantity += parseInt(quantity);
            } else {
                cart.products.push({ _id: pid, quantity });
            }

            await cart.save();

        } catch (error) {
            console.error('Error adding product to cart: ', error);
            throw error;
        }
    }

    async getCarts() {
        try {
            const carts = await Cart.find();
            console.log('Carts obtained:', carts);
            return carts.map(c => c.toObject({ virtuals: true }));
        } catch (error) {
            console.error("Error obtaining carts:", error);
            return [];
        }
    }

    async getCartById(cid) {
        try {
            const cart = await Cart.findOne({ _id: cid });
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

    async updateCart(cid, updatedFields) {
        try {
            const carts = await Cart.find();
            const index = carts.findIndex(c => c._id === cid);
            if (index !== -1) {
                carts[index] = { ...carts[index], ...updatedFields };
                console.log("Cart updated:", carts[index]);
            } else {
                console.error("Error finding cart to update.");
            }
        } catch (error) {
            console.error("Error updating cart:", error);
        }
    }

    async deleteCart(cid) {
        try {
            await Cart.deleteOne({ _id: cid });
            console.log("Cart deleted, remaining carts:", carts)
        } catch (error) {
            console.error("Error deleting cart:", error);
        }
    }
}

module.exports = CartManager;