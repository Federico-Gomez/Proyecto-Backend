const { Router } = require('express');
const { User } = require('../dao/models');
const { userServices } = require('../services');

const createRouter = async () => {

    const router = Router();

    // const users = [
    //     { firstname: 'Federico', lastname: 'Gomez', age: 45, email: 'fedehgz@hotmail.com', phone: '1132053844', role: 'admin', password: '1234' },
    //     { firstname: 'Gonzalo', lastname: 'Morla', age: 44, email: 'gon.morla@hotmail.com', phone: '1155620456', role: 'admin', password: '1234' },
    //     { firstname: 'Hippis', lastname: 'Chimuelo', age: 4, email: 'soy.hippis@hotmail.com', phone: '1153453998', role: 'user', password: '1234' },
    //     { firstname: 'Emet', lastname: 'Selch', age: 12345, email: 'e_selch@aanyder.com', phone: '1121778208', role: 'ancient', password: '1234' }
    // ];

    // router.get('/', (_, res) => {
    //     res.status(200).json(users);
    // });

    // router.post('/', (req, res) => {
    //     const user = req.body;
    //     user.id = Number.parseInt(Math.random() * 1000);
    //     user.role = 'user';

    //     users.push(user);

    //     res.status(201).json;
    // });

    router.get('/', async (_, res) => {

        try {
            const users = await User.find({});

            return res.json(users);
        } catch (err) {
            return res.status(500).json({
                message: err.message
            });
        }

    });

    router.get('/:id', async (req, res) => {

        try {
            const user = await User.findOne({ _id: req.params.id });

            if (!user) {
                return res.status(404).json({ message: 'user not found' });
            }

            return res.json(user);
        } catch (err) {
            return res.status(500).json({
                message: err.message
            });
        }

    });

    router.post('/', async (req, res) => {

        const { firstName, lastName, age, email, password, role, cartId } = req.body;

        try {
            const result = await User.create({
                firstName,
                lastName,
                age,
                email,
                password,
                role,
                cartId
            });

            return res.json(result);
        } catch (err) {
            return res.status(400).json({
                message: err.message
            });
        }
    });

    router.post('/premium/:uid', async (req, res) => {
        try {
            const { uid } = req.params;
            const user = await User.findById(uid);

            if (!user) {
                return res.status(400).json({ message: 'User not found' });
            }

            user.role = user.role === 'user' ? 'premium' : 'user';
            await user.save();

            res.status(200).json({ message: 'User role updated', user});

        } catch (error) {
            req.logger.error('Error changing user role: ', error);
            res.status(500).json({ error: 'Error changing user role' });
        }
    });

    router.get('/premium/:uid', async (req, res) => {
        try {
            const { uid } = req.params;
            const user = await User.findById(uid);

            if (!user) {
                return res.status(400).json({ message: 'User not found' });
            }

            res.render('user_role_switch', {
                title: 'Switch User Role',
                user,
                styles: [
                    'user-role-switch.css'
                ]
            });

        } catch (error) {
            req.logger.error('Error rendering user role change view: ', error);
            res.status(500).json({ error: 'Error rendering user role change view' });
        }
    });

    return router;
}


module.exports = { createRouter };