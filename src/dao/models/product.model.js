const mongoose = require('mongoose');

const collection = 'products';

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true},
    thumbnails: { type: String },
    code: { type: String, required: true, unique: true},
    stock: { type: Number, required: true},
    category: { type: String, required: true}
});

productSchema.virtual('id').get(function() {
    return this._id.toString();
});

module.exports  = mongoose.model(collection, productSchema);