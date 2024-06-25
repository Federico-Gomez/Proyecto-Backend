const nodemailer = require('nodemailer');
const config = require('../../config');

const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    secure: false, // Disable SSL/TLS
    auth: {
        user: config.GMAIL_ACCOUNT,
        pass: config.GMAIL_PASSWORD
    },

    tls: {
        rejectUnauthorized: false
    }
});

module.exports = transport