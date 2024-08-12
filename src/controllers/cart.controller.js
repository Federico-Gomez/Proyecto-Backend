const { cartServices, ticketServices } = require('../services');
const { logger } = require('../utils/logger');

module.exports = {

    purchaseCart: async (req, res) => {
        const { cid } = req.params;
        const userEmail = req.user.email;
        logger.info(`Cart ID received:', ${cid}`); // Log cartId

        try {
            // Obtener cart por su ID
            const purchaseResult = await cartServices.purchaseCart(cid);
            const { productsToPurchase, insufficientStockProducts } = purchaseResult;
            
            if (productsToPurchase.length > 0) {
                // Calcular el total de la compra
                let amount = 0;
                for (const product of productsToPurchase) {
                    const productTotal = product.quantity * product._id.price;
                    logger.info(`Product Name: ${product._id.title}, Product ID: ${product._id._id}, Quantity: ${product.quantity}, Price: ${product._id.price}, Total: ${productTotal}`);
                    amount += productTotal;
                }

                logger.info(`Total amount calculated: ${amount}`);

                if (isNaN(amount)) {
                    logger.error(`Invalid amount: ${amount}`);
                    return res.status(500).json({ status: 'error', message: 'Invalid amount calculated' });
                }

                // Crear ticket de compra
                const ticketData = {
                    purchase_datetime: new Date(),
                    amount,
                    purchaser: userEmail,
                    code: generateUniqueCode(),
                    purchasedProducts: productsToPurchase.map(p => ({
                        productId: p._id._id,
                        quantity: p.quantity,
                        name: p._id.title
                    })),
                    pendingStockProducts: insufficientStockProducts.map(p => ({
                        productId: p._id._id,
                        name: p._id.title
                    })),
                };

                logger.info('Ticket Data:', ticketData);
                
                const ticket = await ticketServices.createTicket(ticketData);

                res.json({ 
                    success: true,
                    ticket,
                });

                // return res.status(200).json({ status: 'success', ticket });
            } else if (productsToPurchase.length === 0 && insufficientStockProducts.length === 0) {
                return res.status(400).render('purchaseTicket', {
                    success: false,
                    message: 'No products in Cart',
                });
            } else {
                return res.status(400).render('purchaseTicket', {
                    success: false,
                    message: 'No products could be purchased due to insufficient stock',
                    insufficientStockProducts
                });
            }

        } catch (err) {
            logger.error(err);
            res.status(500).json({ status: 'error', message: 'Something went wrong' });
        }
    }
}

// Function to generate a unique code
function generateUniqueCode() {
    return 'TICKET-' + Math.random().toString(36).slice(2, 9).toUpperCase();
}
