const nodemailer = require('nodemailer');
const { sendSMS } = require('./twilio');

const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    secure: false, // Disable SSL/TLS
    auth: {
        user: process.env.GMAIL_ACCOUNT,
        password: process.env.GMAIL_PASSWORD
    }
});

// app.get('/sms', async(req, res) => {
//     const { name, totalPrice, phone } = req.body;
//     await sendSMS('Test message', '+12072093266');
    
// });

module.exports = transport