const { Router } = require('express');
const transport = require('../mailing/transport');
const { sendSMS } = require('../mailing/twilio');

const createRouter = async () => {

    const router = Router();

    router.get('/mail', async (req, res) => {
        try {
            await transport.sendMail({
                from: 'Federico',
                to: 'fedehgz@hotmail.com',
                html: `
                <div>
                    This email was sent for test purposes.
                    <img src='cid:my_dni' />
                </div>
                `,
                subject: 'test email',
                attachments: [
                    {
                        filename: 'dni.jpg',
                        path: `${__dirname}/../public/images/dni.jpg`,
                        cid: 'my_dni'
                    }
                ]
            });

            transport.on('error', (error) => {
                console.error('Transport error:', error);
            });

            res.send('Mail sent!');
        } catch (error) {
            console.error('Error sending mail:', error);
            res.status(500).send('Internal Server Error');
        }
    });

    router.get('/sms', async(req, res) => {
        // const { name, totalPrice } = req.query;
        await sendSMS('Test message from Twilio', '+541132053844');
        // await sendSMS(`Hola ${name}! La play ya sale ${totalPrice}`, '+541158384818');
        res.send('Message sent using Twilio!');
    });

    return router;

}

module.exports = { createRouter }