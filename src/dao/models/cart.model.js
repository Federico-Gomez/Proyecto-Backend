const mongoose = require('mongoose');

const collection = 'carts';

const productSchema = new mongoose.Schema({
    _id: { type: String },
    quantity: { type: Number}
});

const cartSchema = new mongoose.Schema({
   products: {
    type: [productSchema]
   }
});

cartSchema.virtual('id').get(function() {
    return this._id.toString();
});

module.exports  = mongoose.model(collection, cartSchema);