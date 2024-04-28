const passport = require('passport');
const { Strategy } = require('passport-github2');
const { User } = require('../dao/models');
const hashingUtils = require('../utils/hashing');
const { clientID, clientSecret, callbackURL } = require('./github.private');

const initializeStrategyGitHub = () => {

    passport.use('github', new Strategy({
        clientID,
        clientSecret,
        callbackURL
    }, async (_accessToken, _refreshToken, profile, done) => {
        try {
            console.log('GitHub profile: ', profile);

            const user = await User.findOne({ email: profile._json.email });
            if (user) {
                return done(null, user);
            }

            //Crear el usuario si no existe
            const fullName = profile._json.name;
            const firstName = fullName.substring(0, fullName.lastIndexOf(' '));
            const lastName = fullName.substring(fullName.lastIndexOf(' ') + 1);
            const newUser = {
                firstName,
                lastName,
                email: profile._json.email,
                password: ''
            }
            const result = await User.create(newUser);
            done(null, result);

        } catch (error) {
            done(error);
        }
    }));

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

module.exports = initializeStrategyGitHub;