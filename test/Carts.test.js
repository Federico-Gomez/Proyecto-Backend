// test/Carts.test.js
const assert = require('assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const requester = supertest('http://localhost:8080');
const { Cart, Product } = require('../src/dao/models');
const config = require('../config');

describe('Carts API', function () {
    let adminAgent;
    let userAgent;
    let connection = null;
    let cartId;

    before(async function () {
        // Connect to a test database
        const mongoConnection = await mongoose.connect(config.MONGO_URI, {
            dbName: 'testing'
        });

        connection = mongoConnection.connection;

        // Log in as an admin user to get session
        adminAgent = supertest.agent('http://localhost:8080');

        const loginResponse = await adminAgent
            .post('/api/sessions/login')
            .send({ email: 'email_de_user_premium', password: 'password_de_user_premium' }) // Reemplazar con los detalles de un premium user.
            .expect(302);

        userAgent = supertest.agent('http://localhost:8080');

        await userAgent
            .post('/api/sessions/login')
            .send({ email: 'email_de_user', password: 'password_de_user' }) //  Reemplazar con los detalles de un user.
            .expect(302); // Assuming the login endpoint redirects

        console.log('Admin login response session:', loginResponse.headers['set-cookie']);
    });

    after(async function () {
        const collections = await mongoose.connection.db.listCollections().toArray();
        for (const collection of collections) {
            await mongoose.connection.db.collection(collection.name).drop();
        }
        await mongoose.connection.close();
    });

    // Test POST /api/carts endpoint
    describe('POST /api/carts', function () {
        it('should allow admin user to create a cart', async function () {
            const response = await adminAgent
                .post('/api/carts');

            console.log('Admin cart creation response:', response.body);

            // Check response structure
            assert(response.body.payload, 'Response body does not have payload');

            cartId = response.body.payload._id;
            assert(cartId, 'Cart ID is not defined');

            if (response.status !== 201) {
                console.error('Response body:', response.body);
                console.error('Response status:', response.status);
            }

            assert.strictEqual(response.status, 201);
            assert.strictEqual(response.body.message, 'Cart created successfully in database');
        });
    });

    // Test GET /api/carts/:cid endpoint >>> Ir al endpoint api/carts/:cid en carts.router.js y modificar la response (cambiar de render a json)
    describe('GET /api/carts/:cid', function () {
        it('should allow authenticated user to get a cart', async function () {
            const response = await userAgent
                .get(`/api/carts/${cartId}`);

            console.log('User cart retrieval response:', response.body);

            // Check response structure
            assert(response.body, 'Response body is empty');

            if (response.status !== 201) {
                console.error('Response body:', response.body);
                console.error('Response status:', response.status);
            }

            assert.strictEqual(response.status, 201);
            assert(response.body.cart, 'Cart object is missing in response body');
            assert.strictEqual(response.body.cart._id, cartId, 'Cart ID does not match');
        });

        it('should return 404 for a non-existing cart', async function () {
            const response = await userAgent
                .get('/api/carts/nonexistentid');

            assert.strictEqual(response.status, 404);
            assert.strictEqual(response.body.message, 'Cart not found');
        });
    });

    // Test DELETE /api/carts/:cid endpoint
    describe('DELETE /api/carts/:cid', function () {
        it('should allow admin user to delete a cart', async function () {
            const response = await adminAgent
                .delete(`/api/carts/${cartId}`);

            console.log('Admin cart deletion response:', response.body);

            assert.strictEqual(response.status, 200);
            assert.strictEqual(response.body.message, 'Cart deleted');
        });
    });

});

