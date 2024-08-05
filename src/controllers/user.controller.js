const { userServices } = require('../services');

module.exports = {

    createMockUsers: async (req, res) => {
        const mockUsersNumber = req.body;
        const newMockUsers = await userServices.createMockUsers(mockUsersNumber);
        if (!newMockUsers) {
            return res.sendError({ message: 'Something went wrong creating mock users' });
        }
        return res.sendSuccess(newMockUsers);
    },

    deleteUser: async (req, res) => {
        const { uid } = req.params;
        const userToDelete = await userServices.deleteUser(uid);
        if (!userToDelete) {
            return res.sendError({ message: 'Something went wrong deleting user' });
        }
        return res.sendSuccess(userToDelete);
    },

    deleteInactiveUsers: async (req, res) => {
        try {
            const deletedInactiveUsers = await userServices.deleteInactiveUsers();
            if (!deletedInactiveUsers) {
                console.log('No inactive users to delete');
                return res.sendError({ message: 'No inactive users' }, 404);
            }
            console.log('Deleted inactive users:', deletedInactiveUsers);
            return res.sendSuccess(deletedInactiveUsers);
        } catch (error) {
            console.log('Error deleting inactive users:', error.message);
            return res.sendError({ error: error.message });
        }
    }
}