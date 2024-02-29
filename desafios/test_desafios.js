class ProductManager {
    constructor() {
        this.products = [];
        this.productIdCounter = 1;
    }

    addProduct(title, description, price, thumbnail, code, stock) {
        // Validar que todos los campos sean obligatorios
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.error("Todos los campos son obligatorios.");
            return;
        }

        // Validar que el código no esté repetido
        const existingProduct = this.products.find(product => product.code === code);
        if (existingProduct) {
            console.error("Ya existe un producto con este código.");
            return;
        }

        // Agregar el producto con un id autoincrementable
        const newProduct = {
            id: this.productIdCounter++,
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        };
        this.products.push(newProduct);
        console.log("Producto agregado:", newProduct);
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        const product = this.products.find(product => product.id === id);
        if (product) {
            return product;
        } else {
            console.error("Producto no encontrado.");
        }
    }
}

// Ejemplo de uso
const manager = new ProductManager();
manager.addProduct("Camiseta", "Camiseta de algodón", 15.99, "img/camiseta.jpg", "CAM001", 100);
manager.addProduct("Pantalón", "Pantalón vaquero", 29.99, "img/pantalon.jpg", "PAN001", 50);

console.log("Todos los productos:", manager.getProducts());

const productId = 2;
const product = manager.getProductById(productId);
if (product) {
    console.log("Producto encontrado:", product);
}
