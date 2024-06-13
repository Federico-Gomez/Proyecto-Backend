const { Message } = require('../models');
const { logger } = require('../../utils/logger');

class MessageDAO {

    async saveMessage(username, message) {
        try {
            const savedMessage = await Message.create({ username, message });
            logger.info('Message saved successfully: ', savedMessage);
        } catch (error) {
            logger.error('Error saving message: ', error);
            throw error;
        }
    }

    async getAllMessages() {
        try {
            const messages = await Message.find();
            return messages;
        } catch (error) {
            logger.error('Error retrieving messages: ', error);
            throw error;
        }
    }
}

module.exports = MessageDAO;