const fs = require('fs').promises;
const { Router } = require('express');
const { Server } = require('socket.io');

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


// Middleware para utilizar httpServer
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

router.get('/home', async (_, res) => {
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

// POST para agregar productos a la vista '/realtimeproducts' desde el servidor
router.post('/realtimeproducts', async (req, res) => {
    console.log(req.body);

    // Se ejecuta cuando se agrega un producto desde el formulario
    // 1 -> Agregar producto desde el manager
    try {
        const { title, description, thumbnails, code, category } = req.body;
        const price = parseInt(req.body.price);
        const stock = parseInt(req.body.stock);
        if (!title || !description || !code || !price || isNaN(stock) || stock < 0 || !category) {
            return res.status(400).json({ error: 'All fields are required except thumbnails' });
        }

        const productManager = req.app.get('productManager');
        await productManager.addProduct(title, description, price, thumbnails, code, stock, category);

        // 2 -> Notificar a los clientes desde WS que se agregó un producto nuevo
        req.wsServer.emit('newProductAdded', { title, description, price, thumbnails, code, stock, category })
        res.redirect('/realtimeproducts');
    } catch (error) {
        // res.status(500).json({ error: 'Error al cargar el producto' });
        req.wsServer.emit('newProductError', 'Error al cargar el producto: ' + error.message);
    }
});

// router.delete('/realtimeproducts/pid', async (req, res) => {
//     const productId = req.params.pid;
//     try {
//         // Eliminar el producto del archivo Products.json
//         await productsManager.deleteProduct(productId);

//         // Emitir evento de eliminación a través de WebSocket
//         req.wsServer.emit('productDeleted', productId);

//         return res.status(200).json({ message: 'Product deleted successfully' });
//     } catch (error) {
//         return res.status(500).json({ error: 'Error deleting product' });
//     }
// });

module.exports = router;