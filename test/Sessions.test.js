// test/Carts.test.js
const assert = require('assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const requester = supertest('http://localhost:8080');
const config = require('../config');
const { User } = require('../src/dao/models');

describe('Sessions API', function () {

    let connection = null;
    let sessionCookie = null;

    before(async function () {
        this.timeout(10000);
        // Connect to a test database
        const mongoConnection = await mongoose.connect(config.MONGO_URI, {
            dbName: 'ecommerce'
        });

        connection = mongoConnection.connection;

    });

    // after(async function () {
    //     const collections = await mongoose.connection.db.listCollections().toArray();
    //     for (const collection of collections) {
    //         await mongoose.connection.db.collection(collection.name).drop();
    //     }
    //     await mongoose.connection.close();
    // });

    // beforeEach(async function () {
    //     await User.deleteMany({});
    // });

    it('Debe registrar un nuevo usuario', async function () {
        
        this.timeout(5000);
        const response = await requester
            .post('/api/sessions/register')
            .send({
                firstName: 'Carlos',
                lastName: 'Kinto',
                age: 34,
                email: 'carloskinto@gmail.com',
                password: 'carlos123'
            });

        assert.strictEqual(response.status, 302, 'Expected status 302');

        const user = await User.findOne({ email: 'carloskinto@gmail.com' });
        console.log('Usuario encontrado en DB:', user);
        assert(user, 'No se creó el usuario en la base de datos');

    });

    it('Debe hacer el login de un usuario registrado', async function () {
        
        const loginResponse = await requester
            .post('/api/sessions/login')
            .send({
                email: 'carloskinto@gmail.com',
                password: 'carlos123'
            });

        sessionCookie = loginResponse.headers['set-cookie'];
        console.log('Session cookie:', sessionCookie);
        assert(sessionCookie, 'No se estableció cookie luego del login');

    });

    it('Debe devolver el usuario actualmente logueado', async function () {
        
        const response = await requester
            .get('/api/sessions/current')
            .set('Cookie', sessionCookie);

        console.log('Session cookie:', sessionCookie);
        console.log('Response:', response.body);

        assert.strictEqual(response.status, 200);
        assert.strictEqual(response.body.email, 'carloskinto@gmail.com', 'El usuario devuelto no se corresponde con el usuario logueado');

    });
});