const { Message } = require('../models');

class MessageDAO {

    async saveMessage(username, message) {
        try {
            const savedMessage = await Message.create({ username, message });
            console.log('Message saved successfully: ', savedMessage);
        } catch (error) {
            console.error('Error saving message: ', error);
            throw error;
        }
    }

    async getAllMessages() {
        try {
            const messages = await Message.find();
            return messages;
        } catch (error) {
            console.error('Error retrieving messages: ', error);
            throw error;
        }
    }
}

module.exports = MessageDAO;