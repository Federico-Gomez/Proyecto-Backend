const { Router } = require('express');
const { User } = require('../dao/models');
const uploader = require('../middlewares/multerUploadFile');
const UserDTO = require('../utils/DTOs/userDTO');
const userController = require('../controllers/user.controller');
const { isAdmin } = require('../middlewares/auth.middleware');

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
            const usersWithDTO = users.map(u => new UserDTO(u));
            return res.json(usersWithDTO);
        } catch (err) {
            return res.status(500).json({
                message: err.message
            });
        }

    });

    router.get('/:id', isAdmin, async (req, res) => {

        try {
            const user = await User.findOne({ _id: req.params.id });

            if (!user) {
                return res.status(404).json({ message: 'user not found' });
            }

            res.render('manage_user', {
                title: 'Manage User',
                user,
                styles: [
                    'user-role-switch.css'
                ]
            });

            //return res.json(user);
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

    router.get('/:uid/upload', async (req, res) => {
        try {
            const { uid } = req.params;

            res.render('fileUpload', {
                title: 'Upload documents',
                userId: uid,
                styles: [
                    'fileUpload.css'
                ]
            });

        } catch (error) {
            req.logger.error('Error rendering upload documents view: ', error);
            res.status(500).json({ error: 'Error rendering upload documents view' });
        }
    });

    router.post('/:uid/documents',
        uploader.fields([
            { name: 'profile', maxCount: 1 },
            { name: 'product', maxCount: 10 },
            { name: 'document', maxCount: 10 }]),
        async (req, res) => {
            console.log('Upload documents endpoint hit');
            console.log('Files:', req.files);
            try {
                const user = await User.findById(req.params.uid);
                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }

                const documents = [
                    ...(req.files['profile'] || []).map(file => ({ name: file.originalname, reference: file.path })),
                    ...(req.files['product'] || []).map(file => ({ name: file.originalname, reference: file.path })),
                    ...(req.files['document'] || []).map(file => ({ name: file.originalname, reference: file.path }))
                ];
                console.log("Documents to upload:", documents);

                user.documents.push(...documents);
                await user.save();
                console.log("Documents uploaded:", user.documents);

                res.status(200).json({ message: 'Documents uploaded successfully', documents });

            } catch (error) {
                req.logger.error('Error uploading documents: ', error);
                res.status(500).json({ error: 'Error uploading documents' });
            }
        });

    router.post('/premium/:uid', async (req, res) => {
        try {
            const { uid } = req.params;
            const user = await User.findById(uid);

            if (!user) {
                return res.status(400).json({ message: 'User not found' });
            }

            if (user.role === 'user') {
                const requiredDocuments = ['Identificacion', 'Prueba de domicilio', 'Estado de cuenta'];
                const userDocuments = user.documents.map(doc => doc.name.split('.').slice(0, -1).join('.'));
                console.log('User documents:', userDocuments);
                const hasAllDocuments = requiredDocuments.every(doc => userDocuments.includes(doc));
                console.log('User documents:', hasAllDocuments);

                if (!hasAllDocuments) {
                    return res.status(404).json({ message: 'User has not completed documentation process, one or more required documents have not been correctly uploaded' })
                }
            }

            user.role = 'premium';
            await user.save();

            res.status(200).json({ message: 'User role updated', user });

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

    router.post('/role_switch/:uid', async (req, res) => {
        try {
            const { uid } = req.params;
            const user = await User.findById(uid);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            user.role = user.role === 'user' ? 'premium' : 'user';

            await user.save();
            return res.status(200).json({ message: `User role switched to ${user.role}`, user });

        } catch (error) {
            req.logger.error('Error switching user role: ', error);
            return res.status(500).json({ error: 'Error switching user role' });
        }

    });

    router.delete('/inactive', userController.deleteInactiveUsers);

    router.delete('/:uid', userController.deleteUser);

    return router;
}

module.exports = { createRouter };