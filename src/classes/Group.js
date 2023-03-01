const fs = require('fs');

class Group {
    constructor(name) {
        this.get(name);
    }

    get(name) {
        let group = Groups[name] || { name: "", modules: [] };
        this.name = group.name;
        this.modules = group.modules;
        return this;
    }

    post(group) {
        Groups[group.name] = group;
        fs.writeFileSync('./src/security/groups.json', JSON.stringify(Groups));
        return this;
    }

    put(group) {
        Groups[group.name] = group;
        fs.writeFileSync('./src/security/groups.json', JSON.stringify(Groups));
        return this;
    }

    delete(name) {
        delete Groups[name];
        fs.writeFileSync('./src/security/groups.json', JSON.stringify(Groups));
        return this;
    }

    static getAll() {
        return Groups;
    }
}

module.exports = Group;