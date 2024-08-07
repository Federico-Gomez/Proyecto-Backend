const fs = require('fs').promises;
const { Router } = require('express');
const { Server } = require('socket.io');
const { Product } = require('../dao/models');
const { Cart } = require('../dao/models');
const { User } = require('../dao/models');
const { userIsLoggedIn, userIsNotLoggedIn, isAdmin, isAuthenticated, isNotAdmin, isAdminOrPremium, isOwnerOrAdmin } = require('../middlewares/auth.middleware');
const { productServices, cartServices, ticketServices } = require('../services');
const UserDTO = require('../utils/DTOs/userDTO');
const ticketController = require('../controllers/ticket.controller');
const productController = require('../controllers/product.controller');
const { generateMockProduct, generateMockUser } = require('../utils/mocks/mockGenerator');
const { verifyPasswordResetToken } = require('../utils/jwt');

const createRouter = async () => {

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

    router.get('/simulatemockproducts', (req, res) => {

        const mockProducts = [];
        for (let i = 0; i < 50; i++) {
            mockProducts.push(generateMockProduct());
        }

        res.json(mockProducts);
    });

    router.get('/simulatemockusers', (req, res) => {

        const mockUsers = []
        for (let i = 0; i < 50; i++) {
            mockUsers.push(generateMockUser());
        }

        res.json(mockUsers);
    });

    router.get('/loggerTest', (req, res) => {
        req.logger.fatal('This is a fatal message');
        req.logger.error('This is an error message');
        req.logger.warning('This is a warning message');
        req.logger.info('This is an info message');
        req.logger.http('This is an http message');
        req.logger.debug('This is a debug message');
        res.send(`Logger test: ${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`);
    });

    router.get('/users', (req, res) => {
        req.logger.info('Fetching users');
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
        const isLoggedIn = ![null, undefined].includes(req.session.user);

        res.render('index', {
            title: 'Home',
            isLoggedIn,
            isNotLoggedIn: !isLoggedIn,
            styles: [
                'landing.css'
            ]
        });
    });

    router.get('/login', userIsNotLoggedIn, async (req, res) => {
        req.logger.info('Rendering login page');
        res.render('login', {
            title: 'Login',
            styles: [
                'login.css'
            ]
        });
    });

    // router.get('/login/admin', userIsNotLoggedIn, async (_, res) => {
    //     res.render('adminlogin', {
    //         title: 'Admin Login'
    //     });
    // });

    router.get('/request_reset_password', userIsNotLoggedIn, async (req, res) => {
        req.logger.info('Rendering reset password page');
        res.render('request_reset_password', {
            title: 'Reset Password',
            styles: [
                'reset-password.css'
            ]
        });
    });

    router.get('/reset_password', userIsNotLoggedIn, async (req, res) => {
        req.logger.info('Rendering reset password page');
        res.render('reset_password', {
            title: 'Reset Password',
            styles: [
                'reset-password.css'
            ]
        });
    });

    router.get('/reset_password/:token', userIsNotLoggedIn, async (req, res) => {
        const { token } = req.params;
        const decoded = verifyPasswordResetToken(token);

        if (!decoded) {
            return res.redirect('/api/sessions/request_password_reset');
        }

        req.logger.info('Rendering reset password page');
        res.render('reset_password', {
            title: 'Reset Password',
            token,
            styles: [
                'reset-password.css'
            ]
        });
    });

    router.get('/register', userIsNotLoggedIn, async (req, res) => {
        req.logger.info('Rendering register page');
        res.render('register', {
            title: 'Register',
            styles: [
                'register.css'
            ]
        });
    });

    router.get('/profile', userIsLoggedIn, async (req, res) => {
        try {
            const idFromSession = req.session.user._id;

            const user = await User.findOne({ _id: idFromSession });

            const ownedProducts = await Product.find({ owner: user.email });

            req.logger.info(`Rendering profile page for user: ${user.email}`);

            res.render('profile', {
                title: 'My profile',
                user: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    age: user.age,
                    email: user.email,
                    role: user.role,
                    cartId: user.cartId
                },
                ownedProducts,
                styles: ['profile.css']
            });

        } catch (error) {
            req.logger.error('Error retrieving user profile', error);
            res.status(500).json({ status: 'error', error: 'Error retrieving profile' });
        }
    });

    router.get('/chat', isNotAdmin, (req, res) => {
        req.logger.info('Rendering chat page');
        res.render('chat', {
            title: 'Chat App',
            useWS: true,
            useSweetAlert: true,
            username: req.query.username,
            styles: [
                'chat.css'
            ],
            scripts: [
                'chat.js'
            ]
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

    router.get('/realtimeproducts', isAdmin, async (req, res) => {
        try {
            // const productsData = await fs.readFile(`${__dirname}/../../assets/Products.json`);
            // const products = JSON.parse(productsData);

            // const productDAO = req.app.get('productDAO');
            const products = await productServices.getProducts();
            req.logger.info('Rendering real-time products page');
            // res.status(200).json(products);

            res.render('realTimeProducts', {
                title: 'Productos en tiempo real',
                products,
                useWS: true, // Establecemos useWS en verdadero
                scripts: [
                    'realTimeProducts.js',
                ]
            });

        } catch (error) {
            req.logger.error('Error loading real-time products: ', error);
            res.status(500).json({ error: 'Error al cargar los productos' });
        }
    });

    router.get('/realtimecarts', isAdminOrPremium, async (req, res) => {
        try {

            // const cartDAO = req.app.get('cartDAO');
            const carts = await cartServices.getCarts();
            req.logger.info('Rendering real-time carts page');
            // res.status(200).json(products);

            res.render('realTimeCarts', {
                title: 'Carritos en tiempo real',
                carts,
                useWS: true, // Establecemos useWS en verdadero
                scripts: [
                    // 'realTimeCarts.js'
                ]
            });

        } catch (error) {
            req.logger.error('Error loading real-time carts: ', error);
            res.status(500).json({ error: 'Error al cargar los productos' });
        }
    });

    // POST para agregar productos a la vista '/realtimeproducts' desde el servidor
    router.post('/realtimeproducts', isAdmin, async (req, res) => {
        console.log(req.body);

        // Se ejecuta cuando se agrega un producto desde el formulario
        // 1 -> Agregar producto desde el manager
        try {
            const { title, description, thumbnails, code, category } = req.body;
            const price = parseInt(req.body.price);
            const stock = parseInt(req.body.stock);

            // const productDAO = req.app.get('productDAO');
            await productServices.addProduct(title, description, price, thumbnails, code, stock, category);
            req.logger.info('Product added successfully');

            // 2 -> Notificar a los clientes desde WS que se agregó un producto nuevo
            // req.wsServer.emit('newProductAdded', { title, description, price, thumbnails, code, stock, category });
            res.redirect('/realtimeproducts');
        } catch (error) {
            req.logger.error('Error adding product: ', error);
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

    router.post('/realtimecarts', isAdmin, async (req, res) => {
        try {
            // const cartDAO = req.app.get('cartDAO');
            await cartServices.createCart();
            req.logger.info('Cart created successfully');
            res.redirect('/realtimecarts');
        } catch (error) {
            req.logger.error('Error creating cart: ', error);
            res.status(500).json({ error: 'Failed to create cart' });
        }
    });

    router.post('/realtimecarts/products', isAdmin, async (req, res) => {
        try {
            const { cartId, productId, quantity } = req.body;
            // const cartDAO = req.app.get('cartDAO');
            await cartServices.addProductToCart(cartId, productId, quantity);
            req.logger.info(`Product added to cart: ${cartId}`);
            res.redirect('/realtimecarts');
        } catch (error) {
            req.logger.error('Error adding product to cart: ', error);
            res.status(500).json({ error: 'Failed to add product to cart' });
        }
    });

    // Para usar con sessions, se puede cambiar req.user por req.session.user
    router.get('/products', async (req, res) => {
        try {
            const isLoggedIn = ![null, undefined].includes(req.session.user);
            const isAdmin = req.session.user.role === 'admin';
            const isPremium = req.session.user.role === 'premium';

            let firstName = '';
            let lastName = '';
            let cartId = '';

            if (isLoggedIn && !isAdmin) {
                const userId = req.session.user._id;
                const user = await User.findOne({ _id: userId });
                firstName = user.firstName;
                lastName = user.lastName;
                cartId = user.cartId;
            } else if (isAdmin) {
                firstName = 'Admin';
                lastName = '';
            }

            // Extract query parameters
            const { limit = 10, page = 1, sort, category } = req.query;

            // Build conditions object for the query
            const conditions = {};

            // Apply category filter if provided
            if (category) {
                conditions.category = category; // Use $in operator for category filter
            }

            // Build options object for pagination
            const options = {
                limit: parseInt(limit),
                page: parseInt(page),
                lean: true
            };

            // Apply sorting if provided
            if (sort) {
                options.sort = { price: sort === 'desc' ? -1 : 1 };
            }

            // Perform paginated query for products
            const result = await Product.paginate(conditions, options);

            // Check ownership for each product
            const payload = result.docs.map(product => {
                return {
                    ...product,
                    owner: product.owner
                }
            });

            req.logger.info('Rendering products page with filters');

            // Send response with the specified format
            res.render('products', {
                title: 'Product List',
                isLoggedIn,
                isAdmin,
                isPremium,
                firstName,
                lastName,
                cartId,
                email: req.session.user.email,
                role: req.session.user.role,
                isNotLoggedIn: !isLoggedIn,
                status: 'success',
                payload,
                totalPages: result.totalPages,
                prevPage: result.prevPage,
                nextPage: result.nextPage,
                page: result.page,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                styles: ['products.css']
            });

        } catch (error) {
            // Error handling
            req.logger.error('Error retrieving products:', error);
            res.status(500).json({ status: 'error', error: 'Error retrieving products.' });
        }
    });


    router.get('/current', async (req, res) => {
        if (!req.user && !req.session.user) {
            req.logger.warning('Unauthorized access to /current');
            return res.status(401).json({ error: 'User not authenticated' });
        }

        let userDTO;
        if (req.session.user && req.session.user.role === 'admin') {
            // Admin user
            userDTO = {
                email: req.session.user.email,
                role: req.session.user.role
            };
        } else {
            // Regular user
            userDTO = new UserDTO(req.user);
        }

        req.logger.info(`User data fetched for ${req.session.user.email}`);
        return res.status(200).json(userDTO);
    });

    router.get('/create-product', isAdminOrPremium, async (req, res) => {
        try {
            req.logger.info('Rendering create-product page');
            res.render('create-product', {
                title: 'Create product',
                styles: ['create-product.css']
            });

        } catch (error) {
            req.logger.error('Error rendering create-product page: ', error);
            res.status(500).json({ error: 'Error crear el producto' });
        }
    });

    router.get('/update-product/:pid', isOwnerOrAdmin, async (req, res) => {
        try {
            const productId = req.params.pid;
            console.log('Update product:' + productId);
            const product = await productServices.getProductById(productId);

            if (!product) {
                req.logger.info('Product not found');
                return res.status(404).json({ message: 'Product not found' });
            }
    
            req.logger.info('Rendering update-product page');
            res.render('update-product', {
                title: 'Update product',
                styles: ['update-product.css'],
                product: product
            });
    
        } catch (error) {
            req.logger.error('Error rendering update-product page: ', error);
            res.status(500).json({ error: 'Error editar el producto' });
        }
    });
    
    router.post('/add-to-cart', isAuthenticated, async (req, res) => {
        try {
            if (!req.session.user) {
                req.logger.warning('Unauthorized add to cart attempt');
                return res.status(401).json({ message: 'You need to be logged in to purchase products' });
            }

            const userId = req.session.user._id;
            const user = await User.findById(userId);
            const { productId, quantity } = req.body;

            if (!user) {
                req.logger.error('User not found');
                return res.status(404).json({ message: 'User not found' });
            }

            const cartId = user.cartId;
            await cartServices.addProductToCart(cartId, productId, quantity);

            req.logger.info(`Product added to cart for user: ${user.email}`);
            res.redirect('/products');

        } catch (error) {
            req.logger.error('Error adding product to cart:', error);
            res.status(500).send('Error adding product to cart.')
        }
    });

    // GET ticket by ID for React App
    // router.get('/:tid', isAuthenticated, async (req, res) => {
    //     try {
    //         const ticketId = req.params.tid;
    //         const ticket = await ticketServices.getTicket(ticketId);
    //         if (!ticket) {
    //             return res.status(404).json({ message: 'Ticket not found' });
    //         }

    //         res.json('Purchase Ticket: ',{ ticket });

    //     } catch (error) {
    //         console.error('Error fetching ticket:', error);
    //         res.status(500).json({ message: 'Internal server error' });
    //     }
    // });

    router.post('/mockingproducts', productController.createMockProducts);

    router.get('/:tid', isAuthenticated, ticketController.getTicket);

    return router;
}

module.exports = { createRouter };