const { ticketServices } = require('../services');

module.exports = {

    getTickets: async (_, res) => {
        const tickets = await ticketServices.getTickets();
        if (!tickets) {
            return res.sendError({ message: 'Something went wrong' });
        }
        return res.sendSuccess(tickets);
    },

    getTicket: async (req, res) => {
        try {
            const ticketId = req.params.tid;
            const ticket = await ticketServices.getTicket(ticketId);

            if (!ticket) {
                return res.status(404).send({ message: 'Ticket not found' });
            }

            const pendingStockProducts = ticket.pendingStockProducts || [];
            const purchasedProducts = ticket.purchasedProducts || [];

            console.log('Purchased:', purchasedProducts);
            console.log('Insufficient Stock:', pendingStockProducts);

            res.render('purchaseTicket', {
                success: true,
                ticket,
                purchasedProducts,
                pendingStockProducts,
                styles: ['ticket.css']
            });

        } catch (error) {
            console.error('Error in getTicket:', error);
            res.sendError({ message: 'Something went wrong' }, 500);
        }
    },

    createTicket: async (req, res) => {
        const ticketData = req.body;
        const newTicket = await ticketServices.createTicket(ticketData);
        if (!newTicket) {
            return res.sendError({ message: 'Something went wrong' });
        }
        return res.sendSuccess(newTicket);
    },

    deleteTicket: async (req, res) => {
        const ticketId = req.params.tid;
        const ticket = await ticketServices.deleteTicket(ticketId);
        if (!ticket) {
            return ticket === false
                ? res.sendError({ message: 'Not found' }, 404)
                : res.sendError({ message: 'Something went wrong' }, 500);
        }
        res.sendSuccess(ticket);
    }
}