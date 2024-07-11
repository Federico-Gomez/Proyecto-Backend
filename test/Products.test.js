// test/Products.test.js
const assert = require('assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const requester = supertest('http://localhost:8080');
const { Product } = require('../src/dao/models');
const config = require('../config');

describe('Products API', function () {
    let adminAgent;
    let connection = null;
    let productId;

    before(async function () {
        // Connect to a test database
        const mongoConnection = await mongoose.connect(config.MONGO_URI, {
            dbName: 'testing'
        });

        connection = mongoConnection.connection;

        const product = await Product.create({
            title: 'Dummy Product',
            description: 'Dummy Description',
            price: 0,
            code: 'DUMMY001',
            stock: 0,
            category: 'Dummy',
            owner: 'fedehgz@hotmail.com'
        });
        productId = product._id.toString();

        // Log in as an admin user to get session
        adminAgent = supertest.agent('http://localhost:8080');

        const loginResponse = await adminAgent
            .post('/api/sessions/login')
            .send({ email: 'email_de_user_premium', password: 'password_de_user_premium' }) // Reemplazar con los detalles de un premium user.
            .expect(302); // Assuming the login endpoint redirects

        console.log('Admin login response session:', loginResponse.headers['set-cookie']);
    });

    // after(async function () {
    //     const collections = await mongoose.connection.db.listCollections().toArray();
    //     for (const collection of collections) {
    //         await mongoose.connection.db.collection(collection.name).drop();
    //     }
    //     await mongoose.connection.close();
    // });

    // Test GET /api/products endpoint
    describe('GET /api/products', function () {
        it('should get all products', function (done) {
            requester.get('/api/products')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (err, res) {
                    if (err) return done(err);
                    assert.strictEqual(res.body.status, 'success');
                    assert(Array.isArray(res.body.payload));
                    // Add more assertions as needed
                    done();
                });
        });
    });

    // Test POST /api/products endpoint
    describe('POST /api/products', () => {
        it('should allow admin user to create a product', async () => {
            const productData = {
                title: 'Test Product',
                description: 'Test Description',
                price: 99.99,
                code: 'TEST003',
                stock: 10,
                category: 'Electronics'
            };

            const response = await adminAgent
                .post('/api/products')
                .send(productData);

            console.log('Admin product creation response:', response.body);

            // Check response structure
            assert(response.body.payload, 'Response body does not have payload');

            productId = response.body.payload._id;
            assert(productId, 'Product ID is not defined');

            if (response.status !== 201) {
                console.error('Response body:', response.body);
                console.error('Response status:', response.status);
            }

            assert.strictEqual(response.status, 201);
        });
    });

    // Test DELETE /api/products/:pid endpoint
    describe.skip('DELETE /api/products/:pid', function () {
        it('should allow admin user to delete a product', async function () {
            const response = await adminAgent
                .delete(`/api/products/${productId}`);

            console.log('Admin product deletion response:', response.body);

            assert.strictEqual(response.status, 200);
            assert.strictEqual(response.body.message, 'Product deleted');
        });
    });
});
