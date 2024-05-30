const { Product } = require('../models');
const { faker } = require('@faker-js/faker');

class ProductDAO {
    #products

    constructor() {
        // this.productIdCounter = 1;
    }

    // async initialize() {
    //     const maxId = this.#products.reduce((max, product) => Math.max(max, product.id), 0);
    //         this.productIdCounter = maxId + 1;
    // }

    async prepare() {
        // Chequear que la conexión existe y está funcionando
        if (Product.db.readyState !== 1) {
            throw new Error('must connect to mongodb!')
        }
    }

    async addProduct(title, description, price, thumbnails, code, stock, category) {
        try {

            if (!title || !description || !code || !price || isNaN(stock) || stock < 0 || !category) {
                throw new Error('All fields are required except thumbnails');
            }

            await Product.create({
                title,
                description,
                price,
                thumbnails,
                code,
                stock,
                category
                // id: this.productIdCounter
            })
                .then((prod) => {
                    console.log("Product added succesfully:" + prod);
                });


        } catch (error) {
            console.error("Error adding product: ", error);
            throw new Error("Error adding product: " + error.message);
        }
    }

    async addFakeProducts(n) {
        try {
            const pickRandom = arr => arr[parseInt(Math.random() * arr.length)];
            const randomCategory = () => pickRandom(["Apparel", "Accessories", "Footwear"]);

            const NUM = n;
            for (let i = 0; i < NUM; i++) {
                await Product.create({
                    title: faker.commerce.productName(),
                    description: faker.lorem.sentences(),
                    price: faker.commerce.price(),
                    thumbnails: faker.image.url(),
                    code: faker.string.uuid(),
                    stock: faker.number.int({ min: 1, max: 100}),
                    category: randomCategory()
                });
            }

            console.log('Products created!');


        } catch (error) {
            console.error("Error adding product: ", error);
            throw new Error("Error adding product: " + error.message);
        }
    }

    async getProducts(filters = null) {
        try {
            const { title, category } = { title: null, category: null, ...filters };
            const queryConditions = [];

            if (title) {
                queryConditions.push({ title });
            };

            if (category) {
                queryConditions.push({ category });
            };

            const products = queryConditions.length
                ? await Product.find({ $and: queryConditions })
                : await Product.find();

            return products.map(p => p.toObject({ virtuals: true }));

        } catch (error) {
            console.error("Error obtaining products:", error);
            return [];
        }
    }

    async getProductsWithPagination(filters = {}) {
        try {
            const { limit = 10, page = 1, sort = null, query = {} } = filters;
            const { title, category } = query;

            const queryConditions = {};

            if (title) {
                queryConditions.title = title;
            }

            if (category) {
                queryConditions.category = category;
            }

            const options = {
                page,
                limit,
                sort: sort ? { price: sort === 'asc' ? 1 : -1 } : null,
            };

            const paginatedResults = await Product.paginate(queryConditions, options);

            return {
                status: 'success',
                payload: paginatedResults.docs,
                totalPages: paginatedResults.totalPages,
                page: paginatedResults.page,
                prevPage: paginatedResults.prevPage,
                nextPage: paginatedResults.nextPage,
                hasPrevPage: paginatedResults.hasPrevPage,
                hasNextPage: paginatedResults.hasNextPage,
                prevLink: paginatedResults.hasPrevPage ? `/api/products?limit=${limit}&page=${paginatedResults.prevPage}` : null,
                nextLink: paginatedResults.hasNextPage ? `/api/products?limit=${limit}&page=${paginatedResults.nextPage}` : null,
            };
        } catch (error) {
            console.error("Error obtaining products:", error);
            return {
                status: 'error',
                error: 'Error obtaining products'
            };
        }
    }

    async getProductById(id) {
        try {
           const product = await Product.findOne({ _id: id });
           return product.toObject({ virtuals: true });
        } catch (error) {
            console.error("Error obtaining product by ID:", error);
            return null;
        }
    }

    async updateProduct(id, updatedFields) {
        try {
            // Update the product directly in the database
            const updatedProduct = await Product.findByIdAndUpdate(id, updatedFields, { new: true });
            
            if (updatedProduct) {
                console.log("Product updated:", updatedProduct);
                return updatedProduct.toObject();
            } else {
                console.error("Error finding or updating product.");
            }
        } catch (error) {
            console.error("Error updating product:", error);
        }
    }

    async deleteProduct(id) {
        try {
            await Product.deleteOne({ _id: id });
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    }
}

module.exports = ProductDAO;