const CartDAO = require("../dao/dbDAO/dbCartDAO");
const ProductDAO = require("../dao/dbDAO/dbProductDAO");
const TicketDAO = require('../dao/dbDAO/dbTicketDAO');
const { CartsRepository } = require("./carts.repository");
const { ProductsRepository } = require("./products.repository");
const { TicketsRepository } = require('./tickets.repository');

module.exports = {
   
    productServices: new ProductsRepository(new ProductDAO()),
    cartServices: new CartsRepository(new CartDAO()),
    ticketServices: new TicketsRepository(new TicketDAO())

}