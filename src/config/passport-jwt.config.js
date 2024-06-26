const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const { User } = require('../dao/models');
const { secret } = require('../utils/jwt');

const cookieExtractor = req => req && req.cookies ? req.cookies['accessToken'] : null;

const initializeStrategyJWT = () => {

    passport.use('jwt', new Strategy({

        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: secret,

    }, async (jwtPayload, done) => {
        try {
            return done(null, jwtPayload.user);
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

module.exports = initializeStrategyJWT;