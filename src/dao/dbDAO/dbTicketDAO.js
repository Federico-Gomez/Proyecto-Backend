const { Ticket } = require('../models');

class TicketDAO {

    constructor() {
    }

    async prepare() {
        // Chequear que la conexión existe y está funcionando
        if (Ticket.db.readyState !== 1) {
            throw new Error('must connect to mongodb!')
        }
    }

    async getTickets() {
        try {
            const tickets = await Ticket.find();
            return tickets.map(t => t.toObject());
        } catch (error) {
            throw new Error('Something went wrong ' + error.message);
        }
    }

    async getTicket(ticketId) {
        try {
            const ticket = await Ticket.findById(ticketId);

            return ticket.toObject() ?? false;

        } catch (error) {
            throw new Error('Error finding ticket: ' + error.message);
        }
    }

    async createTicket(ticketData) {
        try {

            const newTicket = new Ticket(ticketData);
            return await newTicket.save();

        } catch (error) {
            console.error('Error creating ticket in DAO:', error);
            throw new Error('Error creating ticket: ' + error.message);
        }
    }

    async deleteTicket(ticketId) {
        try {
            const ticketToDelete = await Ticket.deleteOne(ticketId);
            return ticketToDelete.toObject() ?? false;
        } catch (error) {
            throw new Error('Something went wrong ' + error.message);
        }
    }
}

module.exports = TicketDAO