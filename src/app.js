const ProductManager = require('./productManager');
const fs = require('fs').promises;
const express = require('express');

const app = express();

const filename = `${__dirname}/../assets/Products.json`;
const productsManager = new ProductManager(filename);

app.get('/products', async (_, res) => {
    try {
        const products = await productsManager.getProducts();
        res.json(products);
        return;
    } catch (error) {
        res.json({ error: 'Error retreiving products.' });
    }
});

app.get('/products/:pid', async (req, res) => {
    try {
        const product = await productsManager.getProductById(req.params.pid);

        if (!product) {
            res.json({ status: 'ERROR', message: 'Product not found.' + req.params.pid});
            return;
        };

        res.json(product);
    } catch (error) {
        res.json({ error: 'Error retrieving product.' + req.params.pid});
    }

});

app.get('/', (req, res) => {
    res.end('Test slash');
});

app.get('/test', async (_, res) => {
    res.end('Hi, tester!');
});

app.get('/file', async (req, res) => {
    const fileContents = await fs.readFile(`${__dirname}/../assets/Products.json`, 'utf-8');
    res.end(fileContents);
})

// productManager
//     .initialize()
//     .then(() => {
//         console.log('ProductManager initialized.');
//         app.listen(3000, () => {
//             console.log('Server ready!');
//         });
//     });
//     .catch(err => {
//         console.log('Error initializing server. + error');
//         console.error(err);
//     });

const main = async () => {

    try {
        await productsManager.initialize()
        app.listen(3000, () => {
            console.log('Server ready!')
        })
    } catch (error) {
        console.log('Error initializing server.')
    }
}

main()
