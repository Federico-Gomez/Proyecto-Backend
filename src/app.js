const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');
// const viewsRouter = require('./routes/views.router');
// const petsRouter = require('./routes/pets.router');
const express = require('express');

const app = express();

// app.engine('handlebars', handlebars.engine());
// app.set('views', `${__dirname}/views`);
// app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/../public`));

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
// app.use('views', viewsRouter);
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
const main = async () => {

    try {
        app.listen(8080, () => {
            console.log('Server ready!');
        });
    } catch (error) {
        console.log('Error initializing server.');
    }
}

main();
