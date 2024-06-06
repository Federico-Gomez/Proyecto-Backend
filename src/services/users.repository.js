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

}

module.exports = { UsersRepository }
