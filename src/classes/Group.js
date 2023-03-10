const fs = require('fs');
const { Module } = require('module');

class Group {
    constructor(name) {
        this.get(name);
    }

    get(name) {
        let group = Groups[name] || { name: name, modules: modules() };
        this.name = group.name;
        this.modules = group.modules;
        return this;
    }

    post(group) {
        Groups[group.name] = JSON.parse(group.modules);
        fs.writeFileSync('./src/security/groups.json', JSON.stringify(Groups));
        return this;
    }

    // put(group) {
    //     Groups[group.name] = group;
    //     fs.writeFileSync('./src/security/groups.json', JSON.stringify(Groups));
    //     return this;
    // }

    delete(name) {
        delete Groups[name];
        fs.writeFileSync('./src/security/groups.json', JSON.stringify(Groups));
        return this;
    }

    static getAll() {
        return Groups;
    }

    static list() {
        return new Promise(resolve => {
            let list = {},
                obj = this.getAll(),
                i = Object.keys(obj).length;
            list.table = "Group";
            list.layout = "clear";
            // list.edit = true;
            list.theader = ["Grupo"];
            list.tbody = {};
            // let total = 0;
            Object.entries(obj).forEach(([key, value]) => {
                list.tbody[key] = [
                    { value: key }
                ];
                // total += value.valor;
                if (--i === 0) {
                    // list.footer = { name: "Total", total: total };
                    resolve(list);
                }
            });
        });
    }

    static async definitions(id = '') {
        if (id == 0) id = '';
        let fieldsDefinitions = {
            name: {
                title: "Nome",
                type: "string",
                input: "text",
                required: true,
                defaultValue: "{}",
                placeholder: "Nome",
                class: "",
                value: id,
                on: {
                    "change": "this.value = this.value.toAllFirstCase();"
                }
            },
            modules: {
                title: "Módulos",
                type: "text",
                input: "hidden",
                required: false,
                defaultValue: '{}',
                placeholder: "Módulos",
                class: "",
                value: await modules(id)
            }
        };

        // let group = new Group(id);
        // Object.entries(fieldsDefinitions).forEach(([key, value]) => {
        //     fieldsDefinitions[key].value = group[key];
        //     if (["object", "array"].includes(value.type)) {
        //         let fields = {};
        //         let i = Object.keys(fieldsDefinitions[key].defaultValue).length;
        //         Object.entries(fieldsDefinitions[key].defaultValue).forEach(([key2, value2]) => {
        //             fields[key2] = {};
        //             fields[key2].type = typeof value2;
        //             switch (fields[key2].type) {
        //                 case "string":
        //                     fields[key2].input = "text";
        //                     break;
        //                 case "number":
        //                     fields[key2].input = "number";
        //                     break;
        //                 case "boolean":
        //                     fields[key2].input = "checkbox";
        //                     break;
        //                 default:
        //                     fields[key2].input = "text";
        //                     break;
        //             }
        //             fields[key2].title = toAllFirstCase(key2);
        //             fields[key2].placeholder = toAllFirstCase(key2);
        //             fields[key2].required = false;
        //             fields[key2].value = group[key][key2];
        //             fields[key2].class = "";
        //             fields[key2].style = "";
        //             fields[key2].parentClass = "";
        //             fields[key2].on = [];
        //             if (!--i) fieldsDefinitions[key].fields = fields;
        //         })
        //     }
        // });

        return fieldsDefinitions;
    };

}

const modules = (id) => {
    console.clear();

    let i = Object.keys(Modules).length,
        retorno = {};
    return new Promise(resolve => {
        Object.entries(Modules).forEach(([key, value]) => {
            retorno[key] = { Menu: {}, Permissões: value.Permissões };
            let padrao = (id === 'Administradores do sistema');

            Object.entries(value.Permissões).forEach(([key2]) => {
                retorno[key].Permissões[key2] = padrao;
                if (typeof Groups[id] != "undefined")
                    if (typeof Groups[id][key])
                        retorno[key].Permissões[key2] = Groups[id][key].Permissões[key2];
            });


            let menu = { ver: padrao, acessar: padrao, incluir: padrao, alterar: padrao, excluir: padrao };
            if (typeof Groups[id] != "undefined")
                if (typeof Groups[id][key])
                    menu = Groups[id][key].Menu;

            Object.entries(value.Menu).forEach(([key2, value2]) => {
                if (value2.tipo !== 'menuPrincipal') {

                    console.log(menu[key2]);

                    retorno[key].Menu[key2] = {
                        "ver": menu[key2]?.ver ?? padrao,
                        "acessar": menu[key2]?.acessar ?? padrao,
                        "incluir": menu[key2]?.incluir ?? padrao,
                        "alterar": menu[key2]?.alterar ?? padrao,
                        "excluir": menu[key2]?.excluir ?? padrao
                    };
                } else {
                    Object.keys(value2.sub).forEach(key3 => {
                        retorno[key].Menu[key3] = {
                            "ver": menu[key3]?.ver ?? padrao,
                            "acessar": menu[key3]?.acessar ?? padrao,
                            "incluir": menu[key3]?.incluir ?? padrao,
                            "alterar": menu[key3]?.alterar ?? padrao,
                            "excluir": menu[key3]?.excluir ?? padrao
                        };
                    });
                }

            });
            if (!--i) resolve(JSON.stringify(retorno));
        });
    });
}

module.exports = Group;