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
        console.log(req.session)
        console.log(req.session.user)
        console.log(req.session.user.role)
        
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


    // Middleware para chequaer si un usuario es Admin o Premium
    isAdminOrPremium: (req, res, next) => {
        console.log(req.session)
        console.log(req.session.user)
        console.log(req.session.user.role)

        if (req.session && req.session.user && ['admin', 'premium'].includes(req.session.user.role)) {
            return next();
        } else {
            return res.status(400).json({ message: 'Forbidden: Product creation is restricted to Admins or Premium users only' });
        }
    },

    isOwnerOrAdmin: (req, res, next) => {
        console.log(req.session)
        console.log(req.session.user)
        console.log(req.session.user.role)

        const { user } = req.session;
        const productId = req.params.pid;

        Product.findById(productId).then((product) => {
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            if (product.owner === user.email || user.role === 'admin') {
                return next();
            } else {
                return res.status(403).json({ message: 'Forbidden: Owners or Admins only' });
            }
        }).catch(err => {
            req.logger.error(err);
            res.status(500).json({ message: 'Product not found or server error' });
        });
    }
}