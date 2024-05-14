const mongoose = require('mongoose');
const Cart = require('./cart.model');

const collection = 'users';

const userSchema = new mongoose.Schema({
    firstName: { type: String },
    lastName: { type: String },
    age: { type: Number },
    email: { 
        type: String, 
        unique: true
    },
    password: { type: String },
    role: { type: String, default: 'user'}, // Rol por defecto es 'user'
    cartId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' } // Reference to Cart model
});

module.exports  = mongoose.model('User', userSchema, collection);