document.addEventListener('DOMContentLoaded', () => {
    
    const socket = io(); // Conexión al Servidor Socket.io
    console.log('Conexión establecida con el servidor WebSocket');

    const productList = document.getElementById('product-list');
    const addProductForm = document.getElementById('add-product-form');

    // Escuchar nuevo evento de agregar producto
    socket.on('newProduct', (product) => {
        const newProductItem = document.createElement('li');
        newProductItem.textContent = `${product.title} - ${product.description} - ${product.price} - ${product.thumbnails} - ${product.code} - ${product.stock} - ${product.category}`;
        productList.appendChild(newProductItem);
        console.log(newProductItem);
    });

    // Envío de formulario para agregar producto
    addProductForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = new FormData(addProductForm);
        const title = formData.get('title');
        const description = formData.get('description');
        const price = formData.get('price');
        const thumbnails = formData.get('thumbnails');
        const code = formData.get('code');
        const stock = formData.get('stock');
        const category = formData.get('category');

        const newProduct = { title, description, price, thumbnails, code, stock, category };

        // Enviar datos a través de Socket.io
        socket.emit('addProduct', newProduct);
        console.log(newProduct);
    });

});