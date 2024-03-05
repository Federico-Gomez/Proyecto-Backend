const { Router } = require('express');
const ProductManager = require('./../productManager');

const filename = `${__dirname}/../../assets/Products.json`;
const productsManager = new ProductManager(filename);

const router = Router();

router.get('/', async (_, res) => {
    try {
        const products = await productsManager.getProducts();
        res.json(products);
        return;
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving products.' });
    }
});

router.get('/:pid', async (req, res) => {
    try {
        const product = await productsManager.getProductById(Number.parseInt(req.params.pid));

        if (!product) {
            res.json({ status: 'ERROR', message: 'Product not found.' + req.params.pid });
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

router.post('/', (req, res) => {
    products.push(req.body);
    res.json(req.body);
});

router.put('/:pid', (req, res) => {
    
});

router.delete('/:pid', (req, res) => {
    
});

module.exports = router;