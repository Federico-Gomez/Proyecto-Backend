const { Product } = require('../models');

class ProductManager {
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

    async getProductById(id) {
        try {
            await Product.findOne({ _id: id });
        } catch (error) {
            console.error("Error obtaining product by ID:", error);
            return null;
        }
    }

    async updateProduct(id, updatedFields) {
        try {
            const products = await Product.find();
            const index = products.findIndex(p => p._id === id);
            if (index !== -1) {
                products[index] = { ...products[index], ...updatedFields };
                console.log("Product updated:", products[index]);
            } else {
                console.error("Error finding product to update.");
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

module.exports = ProductManager;