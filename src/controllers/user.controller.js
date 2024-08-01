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

    deleteInactiveUsers: async () => {
        const deletedInactiveUsers = await userServices.deleteInactiveUsers();
        if (!deletedInactiveUsers) {
            return res.sendError({ message: 'No inactive users' });
        }
        return res.sendSuccess(deletedInactiveUsers);
    }
}