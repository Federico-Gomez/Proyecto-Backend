const { Router } = require('express');
const { Product } = require('../dao/models');

const router = Router();


// router.get('/', async (req, res) => {
//     try {
//         const productManager = req.app.get('productManager');
//         const products = await productManager.getProducts();
//         const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : undefined;
//         res.json(limit ?
//             products.slice(0, limit)
//             : products);
//         return;
//     } catch (error) {
//         res.status(500).json({ error: 'Error retrieving products.' });
//     }
// });


// router.get('/', async (req, res) => {
//     try {
//         // Extraer los parámetros de consulta
//         const { limit = 10, page = 1, sort, query } = req.query;

//         // Construir el objeto de opciones para la paginación
//         const options = {
//             limit: parseInt(limit),
//             page: parseInt(page),
//             lean: true
//         };

//         // Construir el objeto de condiciones para la consulta
//         const conditions = {};

//         // Aplicar filtro de búsqueda si se proporciona
//         if (query) {
//             conditions.category = { $regex: query, $options: 'i' }; // Búsqueda insensible a mayúsculas y minúsculas
//         }

//         // Aplicar ordenamiento si se proporciona
//         if (sort) {
//             options.sort = { price: sort === 'desc' ? -1 : 1 };
//         }

//         // Realizar la consulta paginada de productos
//         const result = await Product.paginate(conditions, options);
//         console.log(result);

//         // Enviar la respuesta con el formato especificado
//         res.render('products', {
//             title: 'Product List',
//             status: 'success',
//             payload: result.docs,
//             totalPages: result.totalPages,
//             prevPage: result.prevPage,
//             nextPage: result.nextPage,
//             page: result.page,
//             hasPrevPage: result.hasPrevPage,
//             hasNextPage: result.hasNextPage,
//             styles: [
//                 'products.css'
//             ]
//         });

//     } catch (error) {
//         // Manejo de errores
//         console.error('Error retrieving products:', error);
//         res.status(500).json({ status: 'error', error: 'Error retrieving products.' });
//     }
// });

router.get('/', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort = null, category } = req.query;
        console.log('Category:', category);

        const conditions = {};

        if (category) {
            conditions.category = category;
        }

        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: sort ? { price: sort === 'asc' ? 1 : -1 } : null,
        };

        // Perform paginated query for products
        const result = await Product.paginate(conditions, options);
        console.log(result);

        const prevLink = result.hasPrevPage ? `/api/products?limit=${limit}&page=${result.prevPage}` : null;
        const nextLink = result.hasNextPage ? `/api/products?limit=${limit}&page=${result.nextPage}` : null;

        // Send response with the specified format
        res.status(200).json({
            title: 'Product List',
            status: 'success',
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: prevLink,
            hasNextPage: nextLink
        });
        
    } catch (error) {
        console.error("Error obtaining products:", error);
        res.status(500).json({ status: 'error', error: 'Error obtaining products' });
    }
});

router.get('/:pid', async (req, res) => {
    try {
        const productManager = req.app.get('productManager');
        const product = await productManager.getProductById((req.params.pid));

        if (!product) {
            res.status(404).json({ status: 'ERROR', message: 'Product not found.' + req.params.pid });
            return;
        };

        res.json(product);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving product.' + req.params.pid });
    }
});

router.post('/', async (req, res) => {
    try {
        const { title, description, price, thumbnails, code, stock, category } = req.body;
        if (!title || !description || !code || !price || isNaN(stock) || stock < 0 || !category) {
            return res.status(400).json({ error: 'All fields are required except thumbnails' });
        }

        const productManager = req.app.get('productManager');
        await productManager.addProduct(title, description, price, thumbnails, code, stock, category);
        res.status(201).json({ message: 'Product added successfully to cart' });
    } catch (error) {
        res.status(500).json({ error: 'Error adding product to cart' });
        console.log(error);
    }
});

router.put('/:pid', async (req, res) => {
    try {
        const productManager = req.app.get('productManager');
        const productId = req.params.pid;
        const updatedFields = req.body;
        await productManager.updateProduct(productId, updatedFields);
        res.json({ message: 'Product updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error updating product' });
    }
});

router.delete('/:pid', async (req, res) => {
    try {
        const productManager = req.app.get('productManager');
        const productId = req.params.pid;
        await productManager.deleteProduct(productId);
        res.json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting product' });
    }
});

module.exports = router;