const express = require('express');
const mongoose = require('mongoose');
const handlebars = require('express-handlebars');
const { Server } = require('socket.io');

const FilesProductManager = require('./dao/fileManagers/productManager');
const DbProductManager = require('./dao/dbManagers/dbProductManager');

const FilesCartManager = require('./dao/fileManagers/cartManager');
const DbCartManager = require('./dao/dbManagers/dbCartManager');

const app = express();

const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');
const viewsRouter = require('./routes/views.router');
const usersRouter = require('./routes/users.router');
// const petsRouter = require('./routes/pets.router');

// Config de handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');

app.use(express.static(`${__dirname}/../public`));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/users', usersRouter);
// app.use('/api/pets', petsRouter);

// const httpServer = app.listen(8080, () => {
//     console.log('Server ready!');
// });
// const wsServer = new Server(httpServer);

// // Manejo de errores de inicialización de servidor
// httpServer.on('error', (error) => {
//     console.error('Error en el servidor:', error);
// });
// wsServer.on('error', (error) => {
//     console.error('Error en el servidor WebSocket:', error);
// });

// wsServer.on('connection', (clientSocket) => {
//     console.log(`Client connected, ID: ${clientSocket.id}`);

        // Agrega productos via escucha de evento generado en cliente
//     clientSocket.on('addProduct', async (product) => {
//         try {
//             const { title, description, thumbnails, code, category } = product;
//             const price = parseInt(product.price);
//             const stock = parseInt(product.stock);
//             if (!title || !description || !code || !price || isNaN(stock) || stock < 0 || !category) {
//                 return res.status(400).json({ error: 'All fields are required except thumbnails' });
//             }

//             const productId = await productsManager.addProduct(title, description, price, thumbnails, code, stock, category);
//             product.id = productId;
//             console.log('Added product:', product);
//             wsServer.emit('newProductAdded', product);

//         } catch (error) {
//             console.error('Error al agregar el producto:', error);
//             wsServer.emit('newProductError', error.message);
//         }
//     });

//      // Escuchar evento 'deleteProduct' emitido por el cliente
//      clientSocket.on('deleteProduct', async (productId) => {
//         try {
//             const id = parseInt(productId);
//             if (isNaN(id)) {
//                 throw new Error('Invalid productId: ' + productId);
//             }
//             // Borrar producto por ID
//             await productsManager.deleteProduct(id);
//             // Emitir evento 'productDeleted' a los clientes
//             wsServer.emit('productDeleted', id);
//             console.log('Product deleted:', id);
//         } catch (error) {
//             console.error('Error deleting product:', error);
//         }
//     });
// });

// app.set('ws', wsServer);

const main = async () => {

    await mongoose.connect(
        'mongodb+srv://fedehgz:Amard0nandShem1n@proyectobackendcoder.75803kx.mongodb.net/?retryWrites=true&w=majority'
        // 'mongodb://127.0.0.1:27017/'
        ,

        {
            dbName: 'Proyecto_Backend_FG'
        }

    );

    // CON WEB SOCKET
    const httpServer = app.listen(8080, () => {
        console.log('Server ready!');
    });

    const wsServer = new Server(httpServer);
    app.set('ws', wsServer);

    const productsfilename = `${__dirname}/../assets/Products.json`;
    const productManager = new FilesProductManager(productsfilename);
    await productManager.initialize();
    app.set('productManager', productManager);

    const cartsFilename = `${__dirname}/../assets/Carts.json`;
    const cartManager = new FilesCartManager(cartsFilename);
    await cartManager.initialize();
    app.set('cartManager', cartManager);

    wsServer.on('connection', (clientSocket) => {
    console.log(`Client connected, ID: ${clientSocket.id}`);

     // Escuchar evento 'deleteProduct' emitido por el cliente
     clientSocket.on('deleteProduct', async (productId) => {
        try {
            const id = parseInt(productId);
            if (isNaN(id)) {
                throw new Error('Invalid productId: ' + productId);
            }
            // Borrar producto por ID
            await productManager.deleteProduct(id);
            // Emitir evento 'productDeleted' a los clientes
            wsServer.emit('productDeleted', id);
            console.log('Product deleted:', id);
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    });
});

    // SIN WEB SOCKET
    // app.listen(8080, () => {
    //     console.log('Server ready!');
    // });
}

main();



