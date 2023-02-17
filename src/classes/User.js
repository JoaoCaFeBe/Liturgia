const fs = require('fs');

class User {
    constructor(email) {
        this.get(email);
    }

    get(email) {
        let user = Users[email] || { name: "", password: "", email };
        this.email = user.email;
        this.name = user.name;
        this.password = user.password;
        return this;
    }

    post(user) {
        Users[user.email] = user;
        fs.writeFileSync('./src/security/users.json', JSON.stringify(Users));
        return this;
    }

    put(user) {
        Users[user.email] = user;
        fs.writeFileSync('./src/security/users.json', JSON.stringify(Users));
        return this;
    }

    static delete(email) {
        delete Users[email];
        fs.writeFileSync('./src/security/users.json', JSON.stringify(Users));
        return Users;
    }

    static getAll() {
        return Users;
    }
}

module.exports = User;