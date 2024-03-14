const { Router } = require('express');
const ProductManager = require('./../productManager');

const filename = `${__dirname}/../../assets/Products.json`;
const productsManager = new ProductManager(filename);

const initializeProductManager = async () => {

        await productsManager.initialize();
        // await productsManager.addProduct(
        //     "Skirt",
        //     "Skirt de algodón",
        //     52.99,
        //     "img/skirt.jpg",
        //     "SKT001",
        //     100,
        //     "Apparel"
        // );
        // await productsManager.addProduct(
        //     "Shirt",
        //     "Shirt de pima",
        //     22.99,
        //     "img/shirt.jpg",
        //     "SHT001",
        //     100,
        //     "Apparel"
        // );
        // await productsManager.addProduct(
        //     "Medias",
        //     "Medias de algodón",
        //     1.99,
        //     "img/medias.jpg",
        //     "MED001",
        //     100,
        //     "Apparel"
        // );
        // await productsManager.addProduct(
        //     "Zapatos",
        //     "Zapatos de cuero",
        //     152.99,
        //     "img/zapatos.jpg",
        //     "ZPT001",
        //     100,
        //     "Apparel"
        // );
        // await productsManager.addProduct(
        //     "Camisa",
        //     "Camisa a cuadros",
        //     42.99,
        //     "img/camisa.jpg",
        //     "CMS001",
        //     100,
        //     "Apparel"
        // );
        // await productsManager.addProduct(
        //     "Medias",
        //     "Medias cortas",
        //     0.99,
        //     "img/medias_c.jpg",
        //     "MEDC001",
        //     100,
        //     "Apparel"
        // );
        // await productsManager.addProduct(
        //     "Jeans",
        //     "Jeans negro",
        //     62.99,
        //     "img/jeans_n.jpg",
        //     "JNN001",
        //     100,
        //     "Apparel"
        // );
        // await productsManager.addProduct(
        //     "Jeans",
        //     "Jeans denim",
        //     22.99,
        //     "img/jeans_d.jpg",
        //     "JND001",
        //     100,
        //     "Apparel"
        // );
        // await productsManager.addProduct(
        //     "Guantes",
        //     "Guantes de algodón",
        //     18.99,
        //     "img/guantes_a.jpg",
        //     "GUA001",
        //     100,
        //     "Apparel"
        // );
        // await productsManager.addProduct(
        //     "Guantes",
        //     "Guantes de cuero",
        //     52.99,
        //     "img/guantes_c.jpg",
        //     "GUC001",
        //     100,
        //     "Apparel"
        // );
}

initializeProductManager();

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
        const { title, description, price, thumbnails, code, stock, category } = req.body;
        if (!title || !description || !code || !price || isNaN(stock) || stock < 0 || !category) {
            return res.status(400).json({ error: 'All fields are required except thumbnails'});
        }

        await productsManager.addProduct(title, description, price, thumbnails, code, stock, category);
        res.status(201).json({ message: 'Product added successfully to cart'});
    } catch (error) {
        res.status(500).json({ error: 'Error adding product to cart'});
        console.log(error);
    }
});

router.put('/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        const updatedFields = req.body;
        await productsManager.updateProduct(productId, updatedFields);
        res.json({ message: 'Product updated successfully'});
    } catch (error) {
        res.status(500).json({ error: 'Error updating product'});
    }
});

router.delete('/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        await productsManager.deleteProduct(productId);
        res.json({ message: 'Product deleted'});
    } catch (error) {
        res.status(500).json({ error: 'Error deleting product'});
    }
});

module.exports = { router, productsManager };