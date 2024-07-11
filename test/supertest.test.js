const chai = require('chai');
const supertest = require('supertest');

const expect = chai.expect;
const requester = supertest('http://localhost:8080')

describe('Testing Users', () => {
    describe('Test de users', () => {

        it('POST /api/users => debe eliminar un usuario', async () => {
            const userMock = {
                
                lastName: 'Gómez',
                age: 45,
                email: 'fedehgz@hotmail.com',
                password: 'testpass',
                role: 'premium',
                cartId: 1234
            }

            const { statusCode, ok } = await requester.post('api/users').send(userMock);
            expect(statusCode).to.equals(400);
            expect(ok).to.be.false;

        });

        it('DELETE /api/users/:id => debe fallar si no se proporciona firstName', async () => {
            const userMock = {
                firstName: 'Federico',
                lastName: 'Gómez',
                age: 45,
                email: 'fedehgz@hotmail.com',
                password: 'testpass',
                role: 'premium',
                cartId: 1234
            }

            // Crear el usuario
            const createUserResponse = await requester.post('api/users').send(userMock);
            expect(createUserResponse.statusCode).to.equals(200);
            
            // Guardar user ID
            const userId = createUserResponse.body.payload._id;

            // Eliminar el user
            const deleteUserResponse = await requester.delete(`api/users/${userId}`);
            expect(deleteUserResponse.statusCode).to.equals(200);
            expect(deleteUserResponse.ok).to.be.true;

            // Hacer un getUsers y ver que no está
            const getAllResponse = await requester.get('/api/users');
            expect(getAllResponse.ok).to.be.true;

            const deletedUser = getAllResponse.body.payload.find(u => u._id == userId);
            expect(deletedUser).to.not.exist;

        });
    });
});