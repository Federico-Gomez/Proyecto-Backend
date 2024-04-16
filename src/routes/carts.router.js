const { Router } = require('express');
const { Product } = require('../dao/models');
const { Cart } = require('../dao/models');

const router = Router();

router.post('/', async (req, res) => {
    try {
        const cartManager = req.app.get('cartManager');
        const newCart = await cartManager.createCart();
        console.log(newCart);
        res.status(201).json(newCart);
        console.log(newCart);
    } catch (error) {
        res.status(500).json({ error: 'Error creating new cart'});
    }
});


// router.get('/:cid', async (req, res) => {
//     try {
//         const cartManager = req.app.get('cartManager');
//         const cartId = req.params.cid;
//         const cart = await cartManager.getCart(cartId);
//         if (!cart) {
//             return res.status(404).json({ error: 'Cart not found' });
//         }
//         res.render('cart', {
//             cart
//         });
//     } catch (error) {
//         console.error('Error retrieving cart:', error);
//         res.status(500).json({ error: 'Error retrieving cart' });
//     }
// });

router.get('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await Cart.findById(cartId).populate('products._id').lean();
        console.log(cart);
        res.render('cart', {
            cart
        });
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving cart' });
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cartManager = req.app.get('cartManager');
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const { quantity } = req.body;
        await cartManager.addProductToCart(cartId, productId, quantity);
        res.status(201).json({ message: 'Product successfully added to cart'})
    } catch (error) {
        res.status(500).json({ error: 'Error adding product cart'});
        console.log(error);
    }
});

router.put('/:cid/products/:pid', async (req,res) => {
    try {
        const cartManager = req.app.get('cartManager');
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        const parsedQuantity = parseInt(quantity);
        await cartManager.updateProductQuantity(cid, pid, parsedQuantity);
        res.status(200).json({ message: 'Product quantity updated successfully'});
    } catch (error) {
        res.status(500).json({ error: 'Error updating product in cart' });
        console.error(error);
    }
});

router.put('/:cid', async (req,res) => {
    try {
        const cartManager = req.app.get('cartManager');
        const cid = req.params.cid;
        const updatedCart = req.body;
        await cartManager.updateCart(cid, updatedCart);
        res.status(200).json({ message: 'Cart updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error updating cart' });
        console.error(error);
    }
});

router.delete('/:cid/products/:pid', async (req,res) => {
    try {
        const cartManager = req.app.get('cartManager');
        const { cid, pid } = req.params;
        await cartManager.removeProductFromCart(cid, pid);
        // res.status(204).send();
        res.json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Error removing product from cart' });
        console.error(error);
    }
});

router.delete('/:cid', async (req,res) => {
    try {
        const cartManager = req.app.get('cartManager');
        const cid = req.params.cid;
        await cartManager.deleteCart(cid);
        // res.status(204).send();
        res.json({ message: 'Cart deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting cart' });
        console.error(error);
    }
});

module.exports = router;