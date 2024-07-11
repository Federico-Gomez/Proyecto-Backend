const mongoose = require('mongoose');
const UserDAO = require('../src/dao/dbDAO/dbUserDAO');
const Assert = require('assert');
// const chai = require('chai');
const config = require('../config');

const assert = Assert.strict;
// const expect = chai.expect;

const suma = (a, b) => a + b;

describe('suite 1', () => {

    it('debería realizar la suma correctamente', () => {

        const expectedResult = 5;
        const result = suma(2, 3);

        assert.strictEqual(result, expectedResult);

    });
});

describe('Testing Users DAO', () => {

    const usersDAOTest = new UserDAO();
    let connection = null;

    before(async function () {
        this.timeout(10000);
        const mongoConnection = await mongoose.connect(config.MONGO_URI, {
            dbName: 'mocha_testing'
        });

        connection = mongoConnection.connection
    });

    after(async function () {
        const collections = await mongoose.connection.db.listCollections().toArray();
        for (const collection of collections) {
            await mongoose.connection.db.collection(collection.name).drop();
        }
        await mongoose.connection.close();
    });

    beforeEach(async function () {
        this.timeout(5000);
        const collections = await mongoose.connection.db.listCollections().toArray();
        for (const collection of collections) {
            await mongoose.connection.db.collection(collection.name).drop();
        }
    });

    it('el resultado de get debe ser un array', async () => {

        const result = await usersDAOTest.getUsers();
        assert.strictEqual(Array.isArray(result), true);

    });

    it('debe agregar correctamente un usuario nuevo', async () => {

        const mockUser = {
            firstName: 'Tester',
            lastName: 'Tester',
            email: 'tester_tester22@gmail.com',
            password: 'tester123',
            role: 'user'
        };

        const result = await usersDAOTest.createUser(mockUser);
        assert.ok(result._id);

    });

    it('debe poder devolver un usuario por su id', async () => {

        const mockUser = {
            firstName: 'Tester',
            lastName: 'Tester',
            email: 'tester_tester22@gmail.com',
            password: 'tester123',
            role: 'user'
        };

        const createdUser = await usersDAOTest.createUser(mockUser);

        const user = await usersDAOTest.getUser(createdUser._id);
        assert.ok(user._id);
        assert.strictEqual(user.firstName, 'Tester');

    });

    // it('debe poder eliminar un usuario', async () => {

    //     const mockUser = {
    //         firstName: 'Tester',
    //         lastName: 'Tester',
    //         email: 'tester_tester22@gmail.com',
    //         password: 'tester123',
    //         role: 'user'
    //     }

    //     const createdUser = await usersDAOTest.createUser(mockUser);

    //     const user = await usersDAOTest.deleteUser(createdUser._id);
    //     assert.strictEqual(user.deletedCount, 1);

    // });

});

