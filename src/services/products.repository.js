class ProductsRepository {

    constructor(dao) {
        this.dao = dao;
    }

    async addProduct(title, description, price, thumbnails, code, stock, category) {
        return this.dao.addProduct(title, description, price, thumbnails, code, stock, category);
    }

    async createMockProducts(n) {
        return this.dao.createMockProducts(n);
    }

    async getProducts(filters) {
        return this.dao.getProducts(filters = null);
    }

    async getProductsWithPagination(filters) {
        return this.dao.getProductsWithPagination(filters = {});
    }

    async getProductById(id) {
        return this.dao.getProductById(id);
    }

    async updateProduct(id, updatedFields) {
        return this.dao.updateProduct(id, updatedFields);
    }

    async deleteProduct(id) {
        return this.dao.deleteProduct(id);
    }
}

module.exports = { ProductsRepository }