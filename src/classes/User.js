const fs = require('fs'),
    md5 = require('md5');

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
        if (user.password !== Users[user.email]?.password) {
            if (user.password !== '') user.password = md5(user.password);
            else user.password = md5(Users[user.email].email);
        }
        Users[user.email] = user;
        fs.writeFileSync('./src/security/users.json', JSON.stringify(Users));
        return this;
    }

    put(user) {
        if (user.password !== Users[user.email].password) {
            if (user.password !== '') user.password = md5(user.password);
            else user.password = md5(Users[user.email].email);
        }
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

    static list() {
        return new Promise(resolve => {
            let list = {},
                obj = this.getAll(),
                i = Object.keys(obj).length;
            list.table = "User";
            list.layout = "clear";
            // list.edit = true;
            list.theader = ["Nome", "Email"];
            list.tbody = {};
            // let total = 0;
            Object.entries(obj).forEach(([key, value]) => {
                list.tbody[key] = [
                    { value: value.name },
                    { value: value.email, class: `col-minima` }
                ];
                // total += value.valor;
                if (--i === 0) {
                    // list.footer = { name: "Total", total: total };
                    resolve(list);
                }
            });
        });
    }

    static definitions(email = '') {
        let fieldsDefinitions = {
            email: {
                title: "Email",
                type: "string",
                input: "email",
                required: true,
                defaultValue: "",
                placeholder: "Email",
                class: "col-12 col-md-6",
                value: ""
            },
            name: {
                title: "Nome",
                type: "string",
                input: "text",
                required: true,
                defaultValue: "",
                placeholder: "Nome",
                class: "col-12 col-md-6",
                value: ""
            },
            password: {
                title: "Senha",
                type: "string",
                input: "hidden",
                required: true,
                defaultValue: "",
                placeholder: "Senha",
                class: "col-12 col-md-6",
                value: ""
            }
        };
        if (email) {
            let user = new User(email);
            fieldsDefinitions.email.value = user.email;
            fieldsDefinitions.name.value = user.name;
            fieldsDefinitions.password.value = user.password;
        }

        return fieldsDefinitions;
    };
}

module.exports = User;