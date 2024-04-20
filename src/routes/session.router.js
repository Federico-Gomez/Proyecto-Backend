const { Router } = require('express');
const { User } = require('../dao/models/');

const router = Router();

router.post('/login', async (req, res) => {
    console.log(req.body);
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Chequeamos si el usuario es admin dependiendo de su email y password
    if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
        req.session.user = { email, role: 'admin' };
        return res.redirect('/products');
    }

    // Buscamos usuario en la DB
    const user = await User.findOne({ email, password });

    if (!user) {
        return res.status(400).json({ error: 'User not found' });
    }

    // Asignamos el rol 'user'
    req.session.user = { email, _id: user._id.toString(), role: 'user' };
    res.redirect('/products');
});

router.get('/logout', (req, res) => {
    req.session.destroy(_ => {
        res.redirect('/');
    });
})

router.post('/register', async (req, res) => {
    console.log(req.body);
    try {
        const { firstName, lastName, age, email, password } = req.body;
        const user = await User.create({
            firstName,
            lastName,
            age: +age,
            email,
            password
        });

        req.session.user = { email, _id: user._id.toString() };
        res.redirect('/');

    } catch (error) {
        return res.status(500).json({ error: 'error' })
    }
});

module.exports = router;