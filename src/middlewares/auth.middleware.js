module.exports = {
    userIsLoggedIn: (req, res, next) => {
        const isLoggedIn = ![null, undefined].includes(req.session.user);
        
        if (!isLoggedIn) {
            return res.status(401).json({ message: 'User should be logged in'});
        }

        next();
    },

    userIsNotLoggedIn: (req, res, next) => {
        const isLoggedIn = ![null, undefined].includes(req.session.user);

        if (isLoggedIn) {
            return res.status(401).json({ message: 'User is already logged in'});
        }

        next();
    }
}