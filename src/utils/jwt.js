const jwt = require('jsonwebtoken');
const config = require('../../config');
//const PRIVATE_KEY = 'claveprivadajwtasasecret';


const generateToken = user => {
        const token = jwt.sign({ user }, config.PRIVATE_KEY, { expiresIn: '48h' });
        return token;
    }

const verifyToken = (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(400).json({ error: 'Authentication error' });
        }

        const [, token] = authHeader.split(' ');
        jwt.verify(token, config.PRIVATE_KEY, (error, signedPayload) => {
            if (error) {
                return res.status(401).json({ error: 'Invalid access token' });
            }
            
            req.authUser = signedPayload.user;
            next();
        });
    }

module.exports = { generateToken, verifyToken, secret: config.PRIVATE_KEY};