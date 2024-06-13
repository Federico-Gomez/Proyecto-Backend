const { User, Cart } = require('../models');
const { fakerES: faker } = require('@faker-js/faker');
const { logger } = require('../../utils/logger');

class UserDAO {

    constructor() {
    }

    async prepare() {
        // Chequear que la conexión existe y está funcionando
        if (User.db.readyState !== 1) {
            throw new Error('must connect to mongodb!')
        }
    }

    async getUsers() {
        try {
            const users = await User.find();
            return users.map(t => t.toObject());
        } catch (error) {
            throw new Error('Something went wrong ' + error.message);
        }
    }

    async getUser(userId) {
        try {
            const user = await User.findById(userId);

            return user.toObject() ?? false;

        } catch (error) {
            throw new Error('Error finding user: ' + error.message);
        }
    }

    async createUser(userData) {
        try {

            const newUser = new User(userData);
            return await newUser.save();

        } catch (error) {
            logger.error('Error creating user in DAO:', error);
            throw new Error('Error creating user: ' + error.message);
        }
    }

    async createMockUsers(n) {
        try {
            const cart = await Cart.create({ products: [], text: 'New cart' });

            const NUM = n;
            for (let i = 0; i < NUM; i++) {
                await User.create({
                    firstName: faker.person.firstName(),
                    lastName: faker.person.lastName(),
                    age: faker.person.age(),
                    email: faker.internet.email(),
                    password: faker.password(),
                    role: 'user',
                    cartId: cart._id
                });
            }

        } catch (error) {
            logger.error('Error creating users in DAO:', error);
            throw new Error('Error creating users: ' + error.message);
        }
    }

    async deleteUser(userId) {
        try {
            const userToDelete = await User.deleteOne(userId);
            return userToDelete.toObject() ?? false;
        } catch (error) {
            logger.error('Error deleting user in DAO:', error);
            throw new Error('Error deleting user: ' + error.message);
        }
    }
}

module.exports = UserDAO