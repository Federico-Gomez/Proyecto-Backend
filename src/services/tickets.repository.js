const { logger } = require('../utils/logger');

class TicketsRepository {

    constructor(dao) {
        this.dao = dao;
    }

    async getTickets() {
        return this.dao.getTickets();
    }

    async getTicket(ticketId) {
        return this.dao.getTicket(ticketId);
    }

    async createTicket(ticketData) {
        logger.info('Creating ticket with data:', ticketData);
        return this.dao.createTicket(ticketData);
    }

    async deleteTicket(ticketId) {
        return this.dao.deleteTicket(ticketId);
    }

}

module.exports = { TicketsRepository }