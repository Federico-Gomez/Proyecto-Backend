const MongoStore = require('connect-mongo');
const session = require('express-session');
const defaultOptions = require('./defaultOptions');

const storage = MongoStore.create({
    dbName: 'ecommerce',
    mongoUrl: 'mongodb+srv://fedehgz:Amard0nandShem1n@ecommerce.nojdknt.mongodb.net/?retryWrites=true&w=majority',
    ttl: 360
});

module.exports = session({
    store: storage,
    ...defaultOptions
});
