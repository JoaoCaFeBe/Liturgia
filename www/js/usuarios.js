function init() {
    $.get('/Lista/User')
        .done(result => { $('#bodyUsuarios').html(result); })
        .always(() => { $.funcoesTabela('User') });
};

function cadastroUser(id) {
    var salvarNovo = {
        label: 'Salvar +',
        className: 'btn-success',
        callback: async () => {
            let dados = await $.formToObj(formUser);
            $.validarFormulario(formUser)
                .then(qtde => $.getFormJson(formUser))
                .then(enviar => $.post('/User', { ...dados, ...enviar }))
                .then(data => { init(); return true; })
                .then(incluirUsuarios.click())
                .catch(msg => { $.mensagem(msg); return false; });
        }
    }

    var salvar = {
        label: 'Salvar',
        className: 'btn-success',
        callback: async () => {
            let dados = await $.formToObj(formUser);
            $.validarFormulario(formUser)
                .then(qtde => $.getFormJson(formUser))
                .then(enviar => $.post('/User', { ...dados, ...enviar }))
                .then(data => { init(); return true; })
                .catch(msg => { $.mensagem(msg); return false; });
        }
    }

    var excluir = {
        label: 'Excluir',
        className: 'btn-danger',
        callback: () => {
            bootbox.confirm('Tem certeza que deseja excluir ?', result => {
                if (result) {
                    $.delete('/User', { email: id })
                        .done(() => { init(); return true; })
                        .fail(msg => { $.mensagem(msg); return false; });
                }
            });
        }
    }

    var ressetar = {
        label: 'Ressetar senha',
        className: 'btn-danger',
        callback: () => {
            bootbox.confirm('Tem certeza que deseja ressetar a senha ?', async result => {
                if (result) {
                    let dados = await $.formToObj(formUser);
                    dados.password = md5(dados.email);
                    $.put('/User', dados)
                        .done(retorno => {
                            init();
                            $.mensagem('Senha ressetada com sucesso !');
                        });
                }
            });
        }
    }

    let botoes = { confirm: salvarNovo, salvar: salvar },
        Titulo = 'Incluir usuário';
    if (id > 0) {
        Titulo = 'Alterar usuário nº ' + id;
        botoes.ressetar = ressetar;
        if (Permissoes.excluir) {
            botoes.excluir = excluir;
        }
    }

    $.formulario('User', id)
        .then(result => {
            bootbox.dialog({
                size: 'large',
                title: Titulo,
                message: result,
                onEscape: true,
                closeButton: true,
                buttons: botoes,
                centerVertical: true,
                scrollable: true,
                className: 'userForm',
                onShow: function () {
                    $('body').addClass('modal-open');
                    $('input').off('click').on('click', function () { this.focus(); this.select(); });
                },
                onShown: function () {
                    $('.foco').focus().select();
                },
                onHidden: function () {
                    $('body').removeClass('modal-open');
                }
            });
        })
        .catch(msg => { $.mensagem(msg); });
}

function ressetarSenha(id) {
    parent.Usuario.senha = parent.Usuario.login;
    $.post('/Anamnese/src/usuarioFront.php', { acao: 'save', usuario: parent.Usuario })
        .done(() => {
            $.mensagem('Senha ressetada com sucesso !');
        });
}

function mudaLogin(texto) {
    texto += ' ';
    login.value = texto.substring(0, texto.indexOf(' ')).toUpperCase();
}