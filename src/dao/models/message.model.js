const mongoose = require('mongoose');

const collection = 'messages';

const messageSchema = new mongoose.Schema({
    username: { type: String },
    message: { type: String }
});

module.exports  = mongoose.model(collection, messageSchema);