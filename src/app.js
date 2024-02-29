const ProductManager = require('./productManager')
const fs = require('fs').promises;
const express = require('express')

const app = express()

const filename = './Products.json'
const productManager = new ProductManager(filename);

app.get('/products', async () => {
    await productManager.getProducts();
});

app.get('/products/:pid', async (req, res) => {
    const product = await productManager.getProductById(req.params.pid);

    if (!product) {
        res.send({ status: 'ERROR', message: 'Product not found.'});
        return;
    };

    res.json(product);
});

app.get('/', (req, res) => {
    res.end('Test slash');
});

app.get('/test', async (_, res) => {
    res.end('Hi, tester!');
});

app.get('/file', async (req, res) => {
    const fileContents = await fs.readFile('./Products.json', 'utf-8');
    res.end(fileContents);
})

// productManager
//     .initialize()
//     .then(() => {
//         console.log('ProductManager initialized.')
//         app.listen(3000, () => {
//             console.log('Server ready!')
//         })
//     })
//     .catch(err => {
//         console.log('Error initializing server.')
//         console.error(err)
//     })

const main = async () => {

    try {
        await productManager.initialize()
        app.listen(3000, () => {
            console.log('Server ready!')
        })
    } catch (error) {
        console.log('Error initializing server.')
    }
}

main()
