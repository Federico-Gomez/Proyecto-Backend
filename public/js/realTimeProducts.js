document.addEventListener('DOMContentLoaded', () => {

    const socket = io(); // Conexión al Servidor Socket.io
    console.log('Conexión establecida con el servidor WebSocket');

    const productList = document.getElementById('product-list');
    const addProductForm = document.getElementById('add-product-form');

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

    // // Escuchar el evento "addProduct" enviado por el cliente
    // socket.on('addProduct', async (newProductData) => {
    //     try {
    //         products.push(newProductData);
    //         console.log(newProductData);
    //         await fs.writeFile(`${__dirname}/../assets/Products.json`, JSON.stringify(products, null, '/t'), 'utf-8');

    //         socket.emit('productAdded', newProductData);

    //     } catch (error) {
    //         console.error('Error al agregar el producto:', error);
    //     }
    // });

    // Escuchar el evento de agregar producto y también agregarlo a la lista
    socket.on('newProductAdded', (product) => {
        const newProductItem = document.createElement('li');
        newProductItem.textContent = `${product.title} - ${product.description} - ${product.price} - ${product.thumbnails} - ${product.code} - ${product.stock} - ${product.category}`;
        productList.appendChild(newProductItem);
        console.log(newProductItem);
    });

});