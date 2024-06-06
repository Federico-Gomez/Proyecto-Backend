const CartDAO = require("../dao/dbDAO/dbCartDAO");
const ProductDAO = require("../dao/dbDAO/dbProductDAO");
const TicketDAO = require('../dao/dbDAO/dbTicketDAO');
const UserDAO = require('../dao/dbDAO/dbUserDAO');
const { CartsRepository } = require("./carts.repository");
const { ProductsRepository } = require("./products.repository");
const { TicketsRepository } = require('./tickets.repository');
const { UsersRepository } = require('./users.repository');

module.exports = {
   
    productServices: new ProductsRepository(new ProductDAO()),
    cartServices: new CartsRepository(new CartDAO()),
    ticketServices: new TicketsRepository(new TicketDAO()),
    userServices: new UsersRepository(new UserDAO())

}