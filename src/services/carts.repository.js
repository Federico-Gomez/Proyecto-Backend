class CartsRepository {

    constructor(dao) {
        this.dao = dao;
    }

    async createCart() {
        return this.dao.createCart();
    }

    async getCart(cid) {
        return this.dao.getCart(cid);
    }

    async getCarts() {
        return this.dao.getCarts();
    }

    async addProductToCart(cid, pid, quantity) {
        return this.dao.addProductToCart(cid, pid, quantity);
    }

    async updateCart(cid, cartData) {
        return this.dao.updateCart(cid, cartData);
    }

    async updateProductQuantity(cid, pid, quantity) {
        return this.dao.updateProductQuantity(cid, pid, quantity);
    }

    async deleteCart(cid) {
        return this.dao.deleteCart(cid);
    }

    async removeProductFromCart(cid, pid) {
        return this.dao.removeProductFromCart(cid, pid);
    }

    async purchaseCart(cartId) {
        return this.dao.purchaseCart(cartId);
    }
}

module.exports = { CartsRepository }