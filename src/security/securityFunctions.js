const md5 = require('md5');

const login = (email, password, module) => {
    retorno = { status: false };
    if (Users[email] && Users[email].password == md5(password)) {
        if (Modules[module].Usuários[email]) {
            retorno.name = Users[email].name;
            retorno.data = Users[email].data;
            retorno.group = Modules[module].Usuários[email];
            retorno.menu = { ...Modules[module].Menu, ...Modules.Global.Menu };
            retorno.permissões = { ...Groups[retorno.group][module].Menu, ...Groups[retorno.group].Global.Menu, ...Groups[retorno.group][module].Permissões, ...Groups[retorno.group].Global.Permissões };
            retorno.arquivos = Groups[retorno.group][module].Arquivos;
            retorno.status = true;
        }
    }
    return retorno;
}

module.exports = { login };