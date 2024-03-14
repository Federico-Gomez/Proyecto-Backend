const { router: productsRouter, productsManager } = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');
const viewsRouter = require('./routes/views.router');
const usersRouter = require('./routes/users.router');
// const petsRouter = require('./routes/pets.router');
const fs = require('fs').promises;
const express = require('express');
const handlebars = require('express-handlebars');
const { Server } = require('socket.io');

const app = express();

// Config de handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');

app.use(express.static(`${__dirname}/../public`));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);
app.use('/api/users', usersRouter);
// app.use('/api/pets', petsRouter);

const httpServer = app.listen(8080, () => {
    console.log('Server ready!');
});
const wsServer = new Server(httpServer);

// Manejo de errores de inicialización de servidor
httpServer.on('error', (error) => {
    console.error('Error en el servidor:', error);
});
wsServer.on('error', (error) => {
    console.error('Error en el servidor WebSocket:', error);
});

wsServer.on('connection', (clientSocket) => {
    console.log(`Client connected, ID: ${clientSocket.id}`);

    clientSocket.on('addProduct', async (product) => {
        try {
            const { title, description, thumbnails, code, category } = product;
            const price = parseInt(product.price);
            const stock = parseInt(product.stock);
            if (!title || !description || !code || !price || isNaN(stock) || stock < 0 || !category) {
                return res.status(400).json({ error: 'All fields are required except thumbnails' });
            }

            const productId = await productsManager.addProduct(title, description, price, thumbnails, code, stock, category);
            product.id = productId;
            console.log('Added product:', product);
            wsServer.emit('newProductAdded', product);

        } catch (error) {
            console.error('Error al agregar el producto:', error);
            wsServer.emit('newProductError', error.message);
        }
    });

     // Escuchar evento 'deleteProduct' emitido por el cliente
     clientSocket.on('deleteProduct', async (productId) => {
        try {
            const id = parseInt(productId);
            if (isNaN(id)) {
                throw new Error('Invalid productId: ' + productId);
            }
            // Borrar producto por ID
            await productsManager.deleteProduct(id);
            // Emitir evento 'productDeleted' a los clientes
            wsServer.emit('productDeleted', id);
            console.log('Product deleted:', id);
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    });
});

app.set('ws', wsServer);



