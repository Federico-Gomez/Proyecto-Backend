const { Router } = require('express');
const CartManager = require('./../cartManager');

const cartsFilename = `${__dirname}/../../assets/Carts.json`;
const cartsManager = new CartManager(cartsFilename);

const initializeCartManager = async () => {

    await cartsManager.initialize();

}

initializeCartManager();

const router = Router();

router.post('/', async (req, res) => {
    try {
        const newCart = await cartsManager.createCart();
        console.log(newCart);
        res.status(201).json(newCart);
        console.log(newCart);
    } catch (error) {
        res.status(500).json({ error: 'Error creating new cart'});
    }
});

router.get('/:cid', async (req, res) => {
    try {
        const cartId = parseInt(req.params.cid);
        const cartProducts = await cartsManager.getCartProducts(cartId);
        res.json(cartProducts);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving products from cart'});
        console.log(error);
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = parseInt(req.params.cid);
        const productId = parseInt(req.params.pid);
        const { quantity } = req.body;
        await cartsManager.addProductToCart(cartId, productId, quantity);
        res.status(201).json({ message: 'Product successfully added to cart'})
    } catch (error) {
        res.status(500).json({ error: 'Error adding product cart'});
        console.log(error);
    }
});

module.exports = router;