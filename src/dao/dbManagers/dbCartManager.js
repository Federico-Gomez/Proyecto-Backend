const { Cart } = require('../models');
const mongoose = require('mongoose');

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
                products: [],
                text: 'for testing update endpoints'
            });

        } catch (error) {
            console.error("Error creating Cart:", error);
            throw error;
        }
    }

    async getCart(cid) {
        try {

            const cart = await Cart.findOne({ _id: cid }).populate('products._id').lean();

            return cart ? cart : null;
            
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

    async updateCart(cid, updatedCart) {
        try {
            await Cart.updateOne({ _id: cid }, updatedCart);
        } catch (error) {
            console.error("Error updating cart:", error);
            throw error;
        }
    }

    async updateProductQuantity(cid, pid, quantity) {
        try {
            const cart = await Cart.findOne({ _id: cid });
            if (!cart) {
                throw new Error('Cart not found');
            }
            const productIndex = cart.products.findIndex(p => p._id.toString() === pid);
            if (productIndex != -1) {
                cart.products[productIndex].quantity = quantity;
                await cart.save();
            } else {
                throw new Error('Product not found');
            }
        } catch (error) {
            console.error('Error updating product quantity', error);
            throw error;
        }
    }

    async deleteCart(cid) {
        try {
            await Cart.deleteOne({ _id: cid });
            console.log("Cart deleted");
        } catch (error) {
            console.error("Error deleting cart:", error);
        }
    }

    async removeProductFromCart(cid, pid) {
        try {
            const cart = await Cart.findOne({ _id: cid });
            if (!cart) {
                throw new Error('Cart not found');
            }
            cart.products = cart.products.filter(p => p._id.toString() !== pid);
            await cart.save();
        } catch (error) {
            console.error('Error removing product from cart', error);
            throw error;
        }
    }
}

module.exports = CartManager;