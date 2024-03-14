// BROWSER

document.addEventListener('DOMContentLoaded', () => {

    const socket = io(); // Conexión al Servidor Socket.io
    console.log('Conexión establecida con el servidor WebSocket');

    const productList = document.getElementById('product-list');
    const addProductForm = document.getElementById('add-product-form');

    // Escucha para agregar productos a la vista '/realtimeproducts' desde el cliente (Browser)
    // addProductForm.addEventListener('submit', (event) => {
    //     event.preventDefault();

    //     const formData = new FormData(addProductForm);
    //     const title = formData.get('title');
    //     const description = formData.get('description');
    //     const price = formData.get('price');
    //     const thumbnails = formData.get('thumbnails');
    //     const code = formData.get('code');
    //     const stock = formData.get('stock');
    //     const category = formData.get('category');

    //     const newProduct = { title, description, price, thumbnails, code, stock, category };

    //     // Enviar datos a través de Socket.io
    //     socket.emit('addProduct', newProduct);
    //     console.log(newProduct);
    // });

    // Escucha para eventos de 'Eliminar' en los botones de la lista de productos 
    // document.addEventListener('click', (event) => {
    //     if (event.target.classList.contains('delete-product')) {
    //         const productId = event.target.dataset.productId;
    //         socket.emit('deleteProduct', productId); // Emitir evento al servidor para borrar producto
    //     }
    // });

    productList.addEventListener('click', (event) => {
        if (event.target.classList.contains('delete-product')) {
            const productId = event.target.getAttribute('data-product-id'); // Obtener el ID del producto a eliminar
            console.log('Product ID to delete:', productId);
            socket.emit('deleteProduct', productId); // Emitir evento al servidor para borrar producto
        }
    });

    // Escucha del evento 'newProductAdded' emitido por el servidor para agregar a la vista '/realtimeproducts' una nueva 'li'

    socket.on('newProductAdded', (product) => {
        // Agregar el nuevo producto al HTML
        const newProductItem = document.createElement('li');
        newProductItem.id = product.id;
        newProductItem.innerHTML = `
        ${product.title} - ${product.description} - ${product.price} - ${product.thumbnails} - ${product.code} - ${product.stock} - ${product.category}
        <button class="delete-product" ${product.id ? `data-product-id="${product.id}"` : ''}>Eliminar</button>`;
        productList.appendChild(newProductItem);
        console.log(newProductItem);
    });


    // Escucha del evento de 'productDeleted' proveniente del servidor y actualiza la vista '/realtimeproducts' eliminando el elemento 'li' correspondiente
    socket.on('productDeleted', (productId) => {
        const productToDelete = document.getElementById(productId);
        if (productToDelete) {
            productToDelete.remove(); // Eliminar el producto quitado del array de productos de la lista del DOM
        }
    });

    socket.on('newProductError', (errorMessage) => {
        alert(errorMessage);
    });
});