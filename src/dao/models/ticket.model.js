const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const collection = 'tickets';

const ticketSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    purchase_datetime: { type: Date, required: true },
    amount: { type: Number, required: true },
    purchaser: { type: String, required: true },
    purchasedProducts: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            quantity: { type: Number, required: true }
        }
    ],
    pendingStockProducts: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        }
    ]
});

ticketSchema.virtual('id').get(function () {
    return this._id.toString();
});

ticketSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Ticket', ticketSchema, collection);