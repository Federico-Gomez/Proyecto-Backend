const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');
const viewsRouter = require('./routes/views.router');
const usersRouter = require('./routes/users.router');
// const petsRouter = require('./routes/pets.router');
const express = require('express');
const handlebars = require('express-handlebars');
const { Server } = require('socket.io');

const app = express();

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
// const main = async () => {

//     try {
//         const httpServer = app.listen(8080, () => {
//             console.log('Server ready!');
//         });

//         const wsServer = new Server(httpServer);
        
//         // Manejo de errores de inicialización de servidor
//         httpServer.on('error', (error) => {
//             console.error('Error en el servidor:', error);
//         });
//         wsServer.on('error', (error) => {
//             console.error('Error en el servidor WebSocket:', error);
//         });

//         // const messages = [];
//         wsServer.on('connection', (clientSocket) => {
//             console.log(`Client connected, ID: ${clientSocket.id}`);

//             // clientSocket.on('new-message', (msg) => {
//             //     const message = { id: clientSocket.id, text: msg };
//             //     messages.push(message);
//             //     wsServer.emit('message', message);
//             // });

//             // // comunicarme con el cliente actual
//             // clientSocket.emit('greeting', `Client connected, ID: ${clientSocket.id}`);

//             // // comunicarme con todos los clientes, menos el actual
//             // clientSocket.broadcast.emit('greeting', `Client connected, ID: ${clientSocket.id}`);

//         });

//         // comunicarme con todos los clientes
//         // setInterval(() => {
//         //     wsServer.emit('greeting', 'Greetings to everyone from my express server!');
//         // }, 3000);

//         // setInterval(() => {
//         //     clientSocket.emit('greeting', new Date().toISOString());
//         // }, 1000);

//         app.set('ws', wsServer);

//     } catch (error) {
//         console.log('Error initializing server.');
//     }
// }

// main();

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
});

app.set('ws', wsServer);



