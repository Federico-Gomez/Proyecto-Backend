const { Router } = require('express');
const { Cart, Product } = require('../dao/models');
const { cartServices } = require('../services');
const cartController = require('../controllers/cart.controller');
const mongoose = require('mongoose');
const { isAuthenticated, isAdmin, isNotAdmin, isAdminOrPremium } = require('../middlewares/auth.middleware');

const createRouter = async () => {
    
    const router = Router();

    router.post('/', isAdminOrPremium, async (_, res) => {
        try {
            // const cartDAO = req.app.get('cartDAO');
            const newCart = await cartServices.createCart();
            console.log(newCart);
            res.status(201).json({ message: 'Cart created successfully in database', payload: newCart });
            console.log(newCart);
        } catch (error) {
            res.status(500).json({ error: 'Error creating new cart' });
        }
    });

    router.get('/:cid', isAuthenticated, isNotAdmin, async (req, res) => {
        try {
            const cartId = req.params.cid;
            const cart = await cartServices.getCart(cartId);
            if (!cart) {
                return res.status(404).json({ status: 'error', message: 'Cart not found' });
            }

            console.log(cart);
            
            res.render('cart', {
                cart,
                cartId,
                useSweetAlert: true,
                scripts: [
                    'delete-product.js',
                    'purchase-cart.js'
                ],
                styles: ['cart.css']
            });

            // Usar la response de abajo y comentar res.render para el test de Carts.test.js
            // res.status(201).json({ message: 'Cart successfully obtained', cart });
            
        } catch (error) {
            res.status(500).json({ error: 'Error retrieving cart' });
        }
    });

    router.post('/:cid/product/:pid', isAdmin, async (req, res) => {
        try {
            // const cartDAO = req.app.get('cartDAO');
            const cartId = req.params.cid;
            const productId = req.params.pid;
            const { quantity } = req.body;

            // Prevent adding owner´s own products to cart
            const { user } = req.session;
            const product = await Product.findById(productId);
            if (user.role === 'premium' && product.owner === user.email) {
                return res.status(400).json({ message: 'Cannot add a product you own to your cart' });
            }

            await cartServices.addProductToCart(cartId, productId, quantity);
            res.status(201).json({ message: 'Product successfully added to cart' });
        } catch (error) {
            res.status(500).json({ error: 'Error adding product cart' });
            console.log(error);
        }
    });

    router.put('/:cid/products/:pid', isAdmin, async (req, res) => {
        try {
            // const cartDAO = req.app.get('cartDAO');
            const { cid, pid } = req.params;
            const { quantity } = req.body;
            const parsedQuantity = parseInt(quantity);
            await cartServices.updateProductQuantity(cid, pid, parsedQuantity);
            res.status(200).json({ message: 'Product quantity updated successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Error updating product in cart' });
            console.error(error);
        }
    });

    router.put('/:cid', isAdmin, async (req, res) => {
        try {
            // const cartDAO = req.app.get('cartDAO');
            const cid = req.params.cid;
            const updatedCart = req.body;
            await cartServices.updateCart(cid, updatedCart);
            res.status(200).json({ message: 'Cart updated successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Error updating cart' });
            console.error(error);
        }
    });

    router.delete('/:cid/products/:pid', isAuthenticated, async (req, res) => {
        try {
            // const cartDAO = req.app.get('cartDAO');
            const { cid, pid } = req.params;
            await cartServices.removeProductFromCart(cid, pid);
            // res.status(204).send();
            res.status(200).json({ message: 'Product deleted' });
        } catch (error) {
            res.status(500).json({ error: 'Error removing product from cart' });
            console.error(error);
        }
    });

    router.delete('/:cid', isAdminOrPremium, async (req, res) => {
        try {
            // const cartDAO = req.app.get('cartDAO');
            const cid = req.params.cid;
            await cartServices.deleteCart(cid);
            

            // res.status(204).send();
            res.status(200).json({ message: 'Cart deleted' });
        } catch (error) {
            res.status(500).json({ error: 'Error deleting cart' });
            console.error(error);
        }
    });

    router.post('/:cid/purchase', isAuthenticated, cartController.purchaseCart);

    return router;
}

module.exports = { createRouter }