const { Router } = require('express');
const ProductManager = require('./../productManager');

const filename = `${__dirname}/../../assets/Products.json`;
const productsManager = new ProductManager(filename);

const router = Router();

router.get('/', async (req, res) => {
    try {
        const products = await productsManager.getProducts();
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
        const product = await productsManager.getProductById(Number.parseInt(req.params.pid));

        if (!product) {
            res.status(404).json({ status: 'ERROR', message: 'Product not found.' + req.params.pid });
            return;
        };

        res.json(product);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving product.' + req.params.pid });
    }
});

router.get('/test', (_, res) => {
    res.end('Hi, tester!');
});

router.post('/', async (req, res) => {
    try {
        const { title, description, code, price, stock, category, thumbnails } = req.body;
        if (!title || !description || !code || !price || !stock || !category) {
            res.status(400).json({ error: 'All fields are required except thumbnails'});
            return;
        }

        const product = {
            title,
            description,
            code,
            price,
            stock,
            category,
            status: true,
            thumbnails
        }

        await productsManager.addProduct(product);
        res.status(201).json({ message: 'Product added successfully to cart'});
    } catch (error) {
        res.status(500).json({ error: 'Error adding product to cart'});
    }
});

router.put('/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;
        const updatedFields = req.body;
        await productsManager.updateProduct(productId, updatedFields);
        res.json({ message: 'Product updated successfully'});
    } catch (error) {
        res.status(500).json({ error: 'Error updating product'});
    }
});

router.delete('/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;
        await productsManager.deleteProduct(productId);
        res.json({ message: 'Product deleted'});
    } catch (error) {
        res.status(500).json({ error: 'Error deleting product'});
    }
});

module.exports = router;