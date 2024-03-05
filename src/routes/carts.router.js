const { Router } = require('express');
const CartManager = require('./../cartManager');

const cartsFilename = `${__dirname}/../assets/Carts.json`;
const cartsManager = new CartManager(cartsFilename);

const router = Router();

router.post('/', async (_, res) => {
    try {
        const newCart = await cartsManager.createCart();
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({ error: 'Error creating new cart'})
    }
});

router.get('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cartProducts = await cartsManager.getCartProducts(cartId);
        res.json(cartProducts);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving products from cart'})
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = req.body;
        await cartsManager.addProductToCart(cartId, productId, quantity);
        res.status(201).json({ message: 'Product successfully added to cart'})
    } catch (error) {
        res.status(500).json({ error: 'Error adding product cart'})
    }
});

module.exports = router;