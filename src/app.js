const ProductManager = require('./productManager');
const CartManager = require('./cartManager');
const fs = require('fs').promises;
const productsRouter = require('./routes/products.router');
// const petsRouter = require('./routes/pets.router');
const cartsRouter = require('./routes/carts.router');
const express = require('express');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static(`${__dirname}/../public`));

app.use('/api/products', productsRouter);
// app.use('/api/pets', petsRouter);
app.use('/api/carts', cartsRouter);

const productsFilename = `${__dirname}/../assets/Products.json`;
const productsManager = new ProductManager(productsFilename);

const cartsFilename = `${__dirname}/../assets/Carts.json`;
const cartsManager = new CartManager(cartsFilename);

app.get('/products', async (_, res) => {
    try {
        const products = await productsManager.getProducts();
        res.json(products);
        return;
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving products.' });
    }
});

app.get('/products/:pid', async (req, res) => {
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

app.get('/file', async (_, res) => {
    const fileContents = await fs.readFile(`${__dirname}/../assets/Products.json`, 'utf-8');
    res.end(fileContents);
});

app.get('/', (_, res) => {
    res.end('App Test');
});

// Forma 1
// productsManager
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

//Forma2
const main = async () => {

    try {
        await productsManager.initialize();
        await cartsManager.initialize();
        await productsManager.addProduct(
            "Skirt",
            "Skirt de algodón",
            52.99,
            "img/skirt.jpg",
            "SKT001",
            100
        );
        await productsManager.addProduct(
            "Shirt",
            "Shirt de pima",
            22.99,
            "img/shirt.jpg",
            "SHT001",
            100
        );
        await productsManager.addProduct(
            "Medias",
            "Medias de algodón",
            1.99,
            "img/medias.jpg",
            "MED001",
            100
        );
        await productsManager.addProduct(
            "Zapatos",
            "Zapatos de cuero",
            152.99,
            "img/zapatos.jpg",
            "ZPT001",
            100
        );
        await productsManager.addProduct(
            "Camisa",
            "Camisa a cuadros",
            42.99,
            "img/camisa.jpg",
            "CMS001",
            100
        );
        await productsManager.addProduct(
            "Medias",
            "Medias cortas",
            0.99,
            "img/medias_c.jpg",
            "MEDC001",
            100
        );
        await productsManager.addProduct(
            "Jeans",
            "Jeans negro",
            62.99,
            "img/jeans_n.jpg",
            "JNN001",
            100
        );
        await productsManager.addProduct(
            "Jeans",
            "Jeans denim",
            22.99,
            "img/jeans_d.jpg",
            "JND001",
            100
        );
        await productsManager.addProduct(
            "Guantes",
            "Guantes de algodón",
            18.99,
            "img/guantes_a.jpg",
            "GUA001",
            100
        );
        await productsManager.addProduct(
            "Guantes",
            "Guantes de cuero",
            52.99,
            "img/guantes_c.jpg",
            "GUC001",
            100
        );
        app.listen(8080, () => {
            console.log('Server ready!');
        });
    } catch (error) {
        console.log('Error initializing server.');
    }
}

main();
