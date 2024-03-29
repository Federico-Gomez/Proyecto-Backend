const { Router } = require('express');

const router = Router();

router.get('/', async (req, res) => {
    try {
        const productManager = req.app.get('productManager');
        const products = await productManager.getProducts();
        const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : undefined;
        res.json(limit ?
            products.slice(0, limit)
            : products);
        return;
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving products.' });
    }
});

router.get('/:pid', async (req, res) => {
    try {
        const productManager = req.app.get('productManager');
        const product = await productManager.getProductById(Number.parseInt(req.params.pid));

        if (!product) {
            res.status(404).json({ status: 'ERROR', message: 'Product not found.' + req.params.pid });
            return;
        };

        res.json(product);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving product.' + req.params.pid });
    }
});

router.post('/', async (req, res) => {
    try {
        const { title, description, price, thumbnails, code, stock, category } = req.body;
        if (!title || !description || !code || !price || isNaN(stock) || stock < 0 || !category) {
            return res.status(400).json({ error: 'All fields are required except thumbnails'});
        }

        const productManager = req.app.get('productManager');
        await productManager.addProduct(title, description, price, thumbnails, code, stock, category);
        res.status(201).json({ message: 'Product added successfully to cart'});
    } catch (error) {
        res.status(500).json({ error: 'Error adding product to cart'});
        console.log(error);
    }
});

router.put('/:pid', async (req, res) => {
    try {
        const productManager = req.app.get('productManager');
        const productId = parseInt(req.params.pid);
        const updatedFields = req.body;
        await productManager.updateProduct(productId, updatedFields);
        res.json({ message: 'Product updated successfully'});
    } catch (error) {
        res.status(500).json({ error: 'Error updating product'});
    }
});

router.delete('/:pid', async (req, res) => {
    try {
        const productManager = req.app.get('productManager');
        const productId = parseInt(req.params.pid);
        await productManager.deleteProduct(productId);
        res.json({ message: 'Product deleted'});
    } catch (error) {
        res.status(500).json({ error: 'Error deleting product'});
    }
});

module.exports = router;