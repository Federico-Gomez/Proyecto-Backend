const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    MONGO_URI: process.env.MONGO_URI,
    ENV: process.env.ENV,
    SECRET: process.env.SECRET,
    PORT: process.env.PORT,
    PRIVATE_KEY: process.env.PRIVATE_KEY,
    GH_CLIENT_ID: process.env.GH_CLIENT_ID,
    GH_CLIENT_SECRET: process.env.GH_CLIENT_SECRET,
    GH_CALLBACK_URL: process.env.GH_CALLBACK_URL
}