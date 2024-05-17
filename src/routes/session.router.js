const { Router } = require('express');
const { User } = require('../dao/models/');
const { hashPassword, isValidPassword } = require('../utils/hashing');
const passport = require('passport');
const { generateToken, verifyToken } = require('../utils/jwt');

const router = Router();

// router.post('/login', async (req, res) => {
//     console.log(req.body);

//     const { email, password } = req.body;
//     if (!email || !password) {
//         return res.status(400).json({ error: 'Invalid credentials' });
//     }

//     // Chequeamos si el usuario es admin dependiendo de su email y password
//     if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
//         req.session.user = { email, role: 'admin' };
//         return res.redirect('/products');
//     }

//     // Buscamos usuario en la DB
//     const user = await User.findOne({ email });
//     if (!user) {
//         return res.status(401).json({ error: 'User not found' });
//     }

//     // Validamos el password
//     if (!isValidPassword(password, user.password)) {
//         return res.status(401).json({ error: 'Invalid password' });
//     }

//     // Asignamos el rol 'user'
//     req.session.user = { email, _id: user._id.toString(), role: 'user' };
//     res.redirect('/products');
// });

//Login con Passport Sessions

router.post('/login', passport.authenticate('login', {failureRedirect: '/api/sessions/fail_login'}), async (req, res) => {
    console.log(req.body);
    
    req.session.user = { email: req.user.email, _id: req.user._id.toString(), role: 'user' };

    res.redirect('/products');

});

// // Login con JWT
// router.post('/login', async (req, res) => {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });
//     console.log(user);
//     if (!user) {
//         return res.status(400).json({ error: 'User not found'});
//     }
//     if (!isValidPassword(password, user.password)) {
//         return res.status(401).json({ error: 'Invalid password'});
//     }

//     const credentials = { id: user._id.toString(), email: user.email, role: user.role };
//     console.log(credentials);
//     const accessToken = generateToken(credentials);
//     console.log('Access token: ' + accessToken);
//     res.cookie('accessToken', accessToken, { maxAge: 60*60*1000, httpOnly: true });
//     // res.redirect('/products');
//     res.status(200).json({ status: 'success' });
// });

router.get('/current', async (req, res) => {
    return res.json(req.user);
});

router.get('/private', verifyToken, (req, res) => {
    const { email } = req.authUser;
    res.send(`Welcome: ${email}, this is private and protected content`)
});

router.get('/fail_login', (_, res) => {
    res.send('Login failed');
});

router.get('/logout', (req, res) => {
    req.session.destroy(_ => {
        res.redirect('/');
    });
});

// router.post('/register', async (req, res) => {
//     console.log(req.body);
//     try {
//         const { firstName, lastName, age, email, password } = req.body;
//         const user = await User.create({
//             firstName,
//             lastName,
//             age: +age,
//             email,
//             password: hashPassword(password)
//         });

//         req.session.user = { email, _id: user._id.toString() };
//         res.redirect('/');

//     } catch (error) {
//         return res.status(500).json({ error: 'error' });rs
//     }
// });

// Register con Passport

router.post('/register', passport.authenticate('register', {failureRedirect: '/api/sessions/failregister'}), async (req, res) => {
    console.log('Usuario:', req.user);
    res.redirect('/');
});

router.get('/failregister', (_, res) => {
    res.send('Error registering user');
});

router.post('/reset_password', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Verificar que el usuario exista en la DB
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ error: 'User not found' });
    }

    //Actualizar la contraseña
    await User.updateOne({ email }, { $set: { password: hashPassword(password) } });

    res.redirect('/');
});

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => {});

router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/' }), async (req, res) => {
    req.session.user = req.user;
    res.redirect('/products');
});

module.exports = router;