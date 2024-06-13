const { Cart } = require('../models');
const { Product } = require('../models');
const { logger } = require('../../utils/logger');

class CartDAO {
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

            const cart = await Cart.create({
                products: [],
                text: 'Text for testing update endpoints'
            });
            return cart._id;

        } catch (error) {
            logger.error("Error creating Cart:", error);
            throw error;
        }
    }

    async getCart(cid) {
        try {

            const cart = await Cart.findOne({ _id: cid }).populate('products._id').lean();

            return cart ? cart : null;

        } catch (error) {
            logger.error("Error obtaining product by ID:", error);
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
            logger.debug(cart);
            const existingProductIndex = cart.products.findIndex(p => p._id.toString() === pid);
            logger.debug("EPIndex:" + existingProductIndex);

            if (existingProductIndex !== -1) {
                cart.products[existingProductIndex].quantity += parseInt(quantity);
            } else {
                cart.products.push({ _id: pid, quantity });
            }

            await cart.save();

        } catch (error) {
            logger.error('Error adding product to cart: ', error);
            throw error;
        }
    }

    async getCarts() {
        try {
            const carts = await Cart.find();
            logger.info('Carts obtained:', carts);
            return carts.map(c => c.toObject({ virtuals: true }));
        } catch (error) {
            logger.error("Error obtaining carts:", error);
            return [];
        }
    }

    async updateCart(cid, cartData) {
        try {
            const updatedCart = await Cart.updateOne({ _id: cid }, cartData);
            return updatedCart;
        } catch (error) {
            logger.error("Error updating cart:", error);
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
            logger.error('Error updating product quantity', error);
            throw error;
        }
    }

    async deleteCart(cid) {
        try {
            await Cart.deleteOne({ _id: cid });
            logger.info("Cart deleted");
        } catch (error) {
            logger.error("Error deleting cart:", error);
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
            logger.error('Error removing product from cart', error);
            throw error;
        }
    }

    async purchaseCart(cartId) {
        logger.info(`Looking for cart with ID: ${cartId}`);
        // Obtener cart por su ID
        const cart = await Cart.findById(cartId).populate('products._id');
        if (!cart) {
            throw new Error('Cart not found');
        }

        // Evaluar stock y modificar cantidades
        const productsToPurchase = [];
        const insufficientStockProducts = [];
        for (const p of cart.products) {
            const product = await Product.findById(p._id);
            if (product.stock >= p.quantity) {
                // Stock suficiente -> actualizar stock
                product.stock -= p.quantity;
                await product.save();
                productsToPurchase.push(p);
            } else {
                // Stock insuficiente
                insufficientStockProducts.push(p);
            }
        }

        logger.info('Purchased: ' + productsToPurchase);
        logger.info('Out of Stock: ' + insufficientStockProducts);
        
        // Quitar productos comprados del cart
        cart.products = cart.products.filter(item => !productsToPurchase.find(p => p._id === item._id));
        await cart.save();

        return {
            cart,
            productsToPurchase,
            insufficientStockProducts
        }
    }
}

module.exports = CartDAO;