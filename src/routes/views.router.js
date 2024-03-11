const fs = require('fs').promises;
const ProductManager = require('./../productManager');
const { Router } = require('express');
const { Server } = require('socket.io');

const filename = `${__dirname}/../../assets/Products.json`;
const productsManager = new ProductManager(filename);

const initializeProductManager = async () => {
    await productsManager.initialize();
}

initializeProductManager();

const router = Router();

const users = [
    { firstname: 'Federico', lastname: 'Gomez', age: 45, email: 'fedehgz@hotmail.com', phone: '1132053844', role: 'admin', password: '1234' },
    { firstname: 'Gonzalo', lastname: 'Morla', age: 44, email: 'gon.morla@hotmail.com', phone: '1155620456', role: 'admin', password: '1234' },
    { firstname: 'Hippis', lastname: 'Chimuelo', age: 4, email: 'soy.hippis@hotmail.com', phone: '1153453998', role: 'user', password: '1234' },
    { firstname: 'Emet', lastname: 'Selch', age: 12345, email: 'e_selch@aanyder.com', phone: '1121778208', role: 'ancient', password: '1234' }
];

const food = [
    { itemname: 'Burger', itemprice: 25 },
    { itemname: 'Empanada (x3)', itemprice: 20 },
    { itemname: 'Sushi', itemprice: 32 },
    { itemname: 'Helado', itemprice: 7 }
];

router.use((req, _, next) => {
    req.wsServer = req.app.get('ws');
    next();
});

router.get('/users', (_, res) => {
    const userIndex = parseInt(Math.random() * users.length);
    const user = users[userIndex];

    res.render('user', {
        title: 'Datos del usuario',
        user,
        isAdmin: user.role === 'admin',
        food,
        styles: [
            'user.css'
        ],
        scripts: [
            'user.js'
        ]
    });
});

router.get('/', (req, res) => {
    res.render('index', {
        title: 'My test webpage',
        name: 'Tester'
    });
});

router.get('/chat', (req, res) => {
    res.render('chat', {
        title: 'Chat App',
        name: req.query.name
    });
});

router.get('/validate', (_, res) => {
    res.render('validate-integers', {
        title: 'Validar entero',
        styles: [
            'validate-integers.css'
        ],
        scripts: [
            'validate-integers.js'
        ]
    });
});

router.get('/register', (_, res) => {
    res.render('register', {
        title: 'Registrar usuario',
        styles: [],
        scripts: []
    });
});

router.get('/home', async (req, res) => {
    try {
        // Leer el archivo Products.json
        const productsData = await fs.readFile(`${__dirname}/../../assets/Products.json`);
        const products = JSON.parse(productsData);

        // Renderizar home.handlebars y pasar los datos de los productos
        res.render('home', {
            title: 'Home',
            products
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al cargar los productos' });
    }
});

router.get('/realtimeproducts', async (_, res) => {
    try {
        const productsData = await fs.readFile(`${__dirname}/../../assets/Products.json`);
        const products = JSON.parse(productsData);

        res.render('realTimeProducts', {
            title: 'Productos en tiempo real',
            products,
            useWS: true, // Establecemos useWS en verdadero
            scripts: [
                'realTimeProducts.js'
            ]
        });

    } catch (error) {
        res.status(500).json({ error: 'Error al cargar los productos' });
    }
});

router.post('/realtimeproducts', async (req, res) => {
    try {
        // Extraigo los datos del producto a agregar de req.body
        const { title, description, price, thumbnails, code, stock, category } = req.body;

        // Agrego el producto al array Products.json
        const productAdded = await productsManager.addProduct(title, description, price, thumbnails, code, stock, category);

        if (productAdded) {
            // Si se agregó el producto correctamente, emitir evento de nuevo producto a través de Socket.IO
            req.wsServer.emit('newProductAdded', productAdded); 
            return res.status(201).json({ message: 'Product added successfully' });
        } else {
            return res.status(500).json({ error: 'Error adding product' });
        }

    } catch (error) {
        return res.status(500).json({ error: 'Error al cargar los productos' });
    }
});

// router.post('/realtimeproducts', async (req, res) => {
//     try {
//         // Extraigo los datos del producto a agregar de req.body
//         const { title, description, price, thumbnails, code, stock, category } = req.body;

//         // Agregar el producto al archivo Products.json
//         await productsManager.addProduct(title, description, price, thumbnails, code, stock, category);

//         // Obtener la lista actualizada de productos
//         const productsData = await fs.readFile(`${__dirname}/../../assets/Products.json`);
//         const products = JSON.parse(productsData);

//         res.render('realTimeProducts', {
//             title: 'Productos en tiempo real',
//             products,
//             useWS: true, // Establecemos useWS en verdadero
//             scripts: [
//                 'realTimeProducts.js'
//             ]
//         });

//     } catch (error) {
//         res.status(500).json({ error: 'Error al cargar los productos' });
//     }
// });

module.exports = router;