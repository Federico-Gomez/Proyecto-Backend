const { userServices } = require('../services');

module.exports = {

    createMockUsers: async (req, res) => {
        const mockUsersNumber = req.body;
        const newMockUsers = await userServices.createMockUsers(mockUsersNumber);
        if (!newMockUsers) {
            return res.sendError({ message: 'Something went wrong' });
        }
        return res.sendSuccess(newMockUsers);
    }
}