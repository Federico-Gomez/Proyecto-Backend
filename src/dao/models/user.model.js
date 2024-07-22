const mongoose = require('mongoose');

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
    cartId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' }, // Referencia al Cart model
    documents: [
        {
            name: { type: String },
            reference: { type: String }
        }
    ],
    last_connection: { type: Date }
});

module.exports  = mongoose.model('User', userSchema, collection);