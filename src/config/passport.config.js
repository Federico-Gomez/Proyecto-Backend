const passport = require('passport');
const { Strategy } = require('passport-local');
const { User, Cart } = require('../dao/models');
const hashingUtils = require('../utils/hashing');
const config = require('../../config');

const initializeStrategy = () => {

    passport.use('register', new Strategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async (req, username, password, done) => {

        const { firstName, lastName, age, email } = req.body;
        console.log('Received registration request:', req.body);

        try {
            const cart = await Cart.create({ products: [], text: 'New cart' });
            const user = await User.findOne({ email: username });
            if (user) {
                //error, usaurio con ese email ya existe
                return done(null, false);
            }

            const newUser = {
                firstName,
                lastName,
                age: +age,
                email,
                password: hashingUtils.hashPassword(password),
                cartId: cart._id
            }

            const result = await User.create(newUser);
            console.log('User created successfully:', result);

            //Usuario nuevo creado exitosamente
            return done(null, result);

        } catch (error) {

            // Error inesperado
            return done('Error al crear el usuario: ' + error);
        }
    }));

    passport.use('login', new Strategy({
        usernameField: 'email'
    }, async (username, password, done) => {
        try {
            if (!username || !password) {
                return done(null, false);
            }

            const user = await User.findOne({ email: username });

            if (!user) {
                //error, usaurio no existe
                return done(null, false);
            }

            if (!hashingUtils.isValidPassword(password, user.password)) {
                return done(null, false);
            }

            return done(null, user);

        } catch (error) {
            // Error inesperado
            return done('Invalid credentials : ' + error);
        }
    }));

    // passport.use('admin', new Strategy({
    //     usernameField: 'email'
    // }, async (username, password, done) => {
    //     try {
    //         if (username === config.ADMIN_EMAIL && password === config.ADMIN_PASSWORD) {
    //             const adminUser = {
    //                 email: config.ADMIN_EMAIL,
    //                 role: 'admin'
    //             };
    //             return done(null, adminUser);
    //         } else {
    //             return done(null, false);
    //         }
    //     } catch (error) {
    //         return done('Invalid credentials: ' + error);
    //     }
    // }));

    passport.serializeUser((user, done) => {
        console.log('Serialized:', user);
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        console.log('Deserialized:', id);
        const user = await User.findById(id);
        done(null, user);
    });

}

module.exports = initializeStrategy;