const dotenv = require('dotenv');
const { Command } = require('commander');

const command = new Command();
command.option('-m, --mode <mode>', 'Modo de ejecución', 'dev');
command.parse();

const options = command.opts();

const environment = options.mode;

dotenv.config({
    path: environment === 'prod' ? '.env.prod' : '.env.dev'
});

module.exports = {
    MONGO_URI: process.env.MONGO_URI,
    ENV: process.env.ENV,
    SECRET: process.env.SECRET,
    PORT: process.env.PORT,
    PRIVATE_KEY: process.env.PRIVATE_KEY,
    GH_CLIENT_ID: process.env.GH_CLIENT_ID,
    GH_CLIENT_SECRET: process.env.GH_CLIENT_SECRET,
    GH_CALLBACK_URL: process.env.GH_CALLBACK_URL,
    GMAIL_ACCOUNT: process.env.GMAIL_ACCOUNT,
    GMAIL_PASSWORD: process.env.GMAIL_PASSWORD,
    TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
    TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    BASE_URL: process.env.BASE_URL
}