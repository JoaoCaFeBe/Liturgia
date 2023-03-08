const init = () => {
    $.get('/Modules')
        .done(data => {
            let item = Object.keys(data).length;
            Object.keys(data).forEach(module => {
                if (module === 'Global') return;
                let option = document.createElement('option');
                option.value = module;
                option.innerHTML = module;
                modulo.appendChild(option);
                if (modulo.value === '') modulo.value = module;
                if ((--item === 0) && (queryTag('options').length < 2)) modulo.classList.add('d-none');
            });
        });
}

const login = () => {
    pwd.value = pwd.value.toUpperCase();
    $.post('/Login', { email: email.value, password: pwd.value, module: modulo.value })
        .done(data => {
            if (data.status) {
                parent.Module.name = modulo.value;
                parent.Module.menu = data.menu;
                parent.Module.permissões = data.permissões;
                parent.Module.arquivos = data.arquivos;
                parent.User.name = data.name;
                parent.User.email = data.email;
                parent.User.dados = data.dados;
                parent.User.group = data.group;
                parent.$.menu(data.menu, data.name, data.permissões, data.arquivos);
            }
        })
}

const keyPress = (e) => {
    if (e.keyCode === 13) login();
}