const mongoose = require('mongoose');
const Product = require('./product.model');

const collection = 'carts';

const productSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number}
});

const cartSchema = new mongoose.Schema({
   products: {
    type: [productSchema]
   },
   text: { type: String}
});

cartSchema.virtual('id').get(function() {
    return this._id.toString();
});

module.exports  = mongoose.model('Cart', cartSchema, collection );