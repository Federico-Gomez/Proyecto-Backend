// mockGenerator.js
const { faker } = require('@faker-js/faker');

const randomCategory = () => {
    const categories = ['Food', 'Electronics', 'Clothing', 'Books'];
    return categories[Math.floor(Math.random() * categories.length)];
};

module.exports = {
    generateMockProduct: () => {
        return {
            title: faker.commerce.productName(),
            description: faker.lorem.sentences(),
            price: faker.commerce.price(),
            thumbnails: faker.image.url(),
            code: faker.string.uuid(),
            stock: faker.number.int({ min: 1, max: 100 }),
            category: randomCategory(),
            id: faker.database.mongodbObjectId()
        };
    },

    generateMockUser: () => {
        return {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            birthdate: faker.date.birthdate(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            role: 'user',
            cartId: faker.database.mongodbObjectId(),
            id: faker.database.mongodbObjectId()
        };
    }
};

