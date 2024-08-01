class UsersRepository {

    constructor(dao) {
        this.dao = dao;
    }

    async createUser(userData) {
        return this.dao.createUser(userData);
    }

    async createMockUsers(n) {
        return this.dao.createMockUsers(n);
    }

    async deleteUser(userId) {
        return this.dao.deleteUser(userId);
    }

    async deleteInactiveUsers() {
        return this.dao.deleteInactiveUsers();
    }

}

module.exports = { UsersRepository }
