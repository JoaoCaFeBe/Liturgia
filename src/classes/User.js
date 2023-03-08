const e = require('express');

const fs = require('fs'),
    md5 = require('md5'),
    toAllFirstCase = require('../functions').toAllFirstCase;

class User {
    constructor(email) {
        this.get(email);
    }

    get(email) {
        let user = Users[email] || {
            name: "",
            password: "",
            email,
            dados: {
                endereço: "",
                telefone: ""
            }
        };
        this.email = user.email;
        this.name = user.name;
        this.password = user.password;
        this.dados = user.dados;
        return this;
    }

    post(user) {

        user.dados = {};
        user.dados.endereço = user.endereço;
        user.dados.telefone = user.telefone;
        delete user.endereço;
        delete user.telefone;

        if (user.password !== Users[user.email]?.password) {
            user.password = user.password.toUpperCase();
            if (user.password !== '') user.password = md5(user.password);
            else user.password = md5(user.email);
        }

        Users[user.email] = user;

        fs.writeFileSync('./src/security/users.json', JSON.stringify(Users));
        return this;
    }

    // put(user) {

    //     user.password = user.password.toUpperCase();
    //     user.dados = {};
    //     user.dados.endereço = user.endereço;
    //     user.dados.telefone = user.telefone;
    //     delete user.endereço;
    //     delete user.telefone;

    //     if (user.password !== Users[user.email].password) {
    //         if (user.password !== '') user.password = md5(user.password);
    //         else user.password = md5(Users[user.email].email);
    //     }

    //     Users[user.email] = user;

    //     fs.writeFileSync('./src/security/users.json', JSON.stringify(Users));
    //     return this;
    // }

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
        if (email == 0) email = '';
        let fieldsDefinitions = {
            email: {
                title: "Email",
                type: "string",
                input: "email",
                required: true,
                defaultValue: "",
                placeholder: "Email",
                class: "",
                value: ""
            },
            name: {
                title: "Nome",
                type: "string",
                input: "text",
                required: true,
                defaultValue: "",
                placeholder: "Nome",
                class: "",
                value: "",
                on: {
                    "change": "this.value = this.value.toAllFirstCase();"
                }
            },
            password: {
                title: "Senha",
                type: "string",
                input: "hidden",
                required: true,
                defaultValue: "",
                placeholder: "Senha",
                class: "",
                value: ""
            },
            dados: {
                title: "Dados",
                type: "object",
                input: "fieldJSON",
                required: false,
                defaultValue: {
                    endereço: "",
                    telefone: ""
                },
                placeholder: "Dados",
                class: ""
            }
        };
        let user = new User(email);
        Object.entries(fieldsDefinitions).forEach(([key, value]) => {
            fieldsDefinitions[key].value = user[key];
            if (["object", "array"].includes(value.type)) {
                let fields = {};
                let i = Object.keys(fieldsDefinitions[key].defaultValue).length;
                Object.entries(fieldsDefinitions[key].defaultValue).forEach(([key2, value2]) => {
                    fields[key2] = {};
                    fields[key2].type = typeof value2;
                    switch (fields[key2].type) {
                        case "string":
                            fields[key2].input = "text";
                            break;
                        case "number":
                            fields[key2].input = "number";
                            break;
                        case "boolean":
                            fields[key2].input = "checkbox";
                            break;
                        default:
                            fields[key2].input = "text";
                            break;
                    }
                    fields[key2].title = toAllFirstCase(key2);
                    fields[key2].placeholder = toAllFirstCase(key2);
                    fields[key2].required = false;
                    fields[key2].value = user[key][key2];
                    fields[key2].class = "";
                    fields[key2].style = "";
                    fields[key2].parentClass = "";
                    fields[key2].on = [];
                    if (!--i) fieldsDefinitions[key].fields = fields;
                })
            }
        });
        return fieldsDefinitions;
    };
}

module.exports = User;