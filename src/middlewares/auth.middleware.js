const { Product } = require("../dao/models");

module.exports = {
    userIsLoggedIn: (req, res, next) => {
        const isLoggedIn = ![null, undefined].includes(req.session.user);

        if (!isLoggedIn) {
            return res.status(401).json({ message: 'User should be logged in' });
        }

        next();
    },

    userIsNotLoggedIn: (req, res, next) => {
        const isLoggedIn = ![null, undefined].includes(req.session.user);

        if (isLoggedIn) {
            return res.status(401).json({ message: 'User is already logged in' });
        }

        next();
    },

    checkLoginType: (req, res, next) => {
        const { email, password, login_type } = req.body;

        if (login_type === 'admin') {
            if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
                req.session.user = { email, role: 'admin' };
                return res.redirect('/products');
            } else {
                return res.status(401).json({ message: 'Invalid admin credentials' });
            }
        } else {
            next(); // Pass control to the next middleware (passport.authenticate)
        }
    },

    // Middleware to check if the user is logged in
    isAuthenticated: (req, res, next) => {
        if (req.session && req.session.user) {
            return next();
        } else {
            return res.status(401).json({ message: 'Unauthorized' });
        }
    },

    // Middleware to check if the user is an admin
    isAdmin: (req, res, next) => {
        if (req.session && req.session.user && req.session.user.role === 'admin') {
            return next();
        } else {
            return res.status(403).json({ message: 'Forbidden: Admins only' });
        }
    },

    isNotAdmin: (req, res, next) => {
        const isNotAdmin = !['admin'].includes(req.session.user.role);
        if (!isNotAdmin) {
            return res.status(403).json({ message: 'Forbidden: Users only' });
        }
        next();
    },

    isOwnerOrAdmin: (req, res, next) => {
        const { user } = req.session;
        const { productId } = req.params;

        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        Product.findById(productId).then((product) => {
            if (product.owner === user.email || user.role === 'admin') {
                return next();
            } else {
                return res.status(403).json({ message: 'Forbidden: Owners or Admins only' });
            }
        });
    }
}