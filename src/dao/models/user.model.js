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
    cartId: { 
        type: Number,
        unique: true
     },
    password: { type: String },
    role: { type: String, default: 'user'} // Rol por defecto es 'user'
});

// Function to generate a random cartId
function generateRandomCartId() {
    return Math.floor(Math.random() * 19000) + 100;
}

// Middleware to generate a random cartId before saving
userSchema.pre('save', function(next) {
    // Generate a random cartId if it's not already set
    if (!this.cartId) {
        this.cartId = generateRandomCartId();
    }
    next();
});

module.exports  = mongoose.model('User', userSchema, collection);