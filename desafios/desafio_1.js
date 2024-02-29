class ProductManager {

    constructor() {
        this.products = [];
        this.idCounter = 0;
    }

    addProduct(title, description, price, thumbnail, code, stock) {

            if (!title || !description || !price || !thumbnail || !code || !stock) {
                console.error("All input fields are mandatory.");
                return;
            }

            const existingProduct = this.products.find(p => p.code === code);
            if (existingProduct) {
                console.error("A product with this code already exists.");
                return;
            }

            const newProduct = {
                id: this.idCounter++,
                title,
                description,
                price,
                thumbnail,
                code,
                stock
            };

            this.products.push(newProduct);
            console.log("Product added succesfully:", newProduct);
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        const prod = this.products.find(p => p.id === id);
        if (prod) {
            return prod;
        } else {
            console.error("Not found.")
        }
    }
}