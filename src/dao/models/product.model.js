const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const collection = 'products';

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true},
    thumbnails: { type: String },
    code: { type: String, required: true, unique: true},
    stock: { type: Number, required: true},
    category: { type: String, required: true},
    owner: { type: String, default: 'admin'} // Default owner is always admin
});

productSchema.virtual('id').get(function() {
    return this._id.toString();
});

productSchema.plugin(mongoosePaginate);

module.exports  = mongoose.model('Product', productSchema, collection);