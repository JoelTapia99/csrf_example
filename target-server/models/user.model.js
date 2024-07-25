const fs = require("fs");

class User {
    constructor() {
        this._users = JSON.parse(fs.readFileSync(`${__dirname}/../db.json`, 'utf8'));
        console.log(this._users)
    }

    findUserByEmail(email) {
        return this._users.find((user) => user.email === email);
    }

    findUserById(id) {
        console.log("id", id)
        return this._users.find((user) => user.id === id);
    }
}

module.exports = {
    User
}