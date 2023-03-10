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
            $.validarFormulario(formUser)
                .then(qtde => $.getFormJson(formUser))
                .then(enviar => {
                    // console.log(enviar);
                    let dados = $.formToObj(formUser);
                    // dados = { ...dados, ...enviar };
                    $.post('/User', dados);
                })
                .then(data => {
                    init();
                    incluirUsuarios.click();
                    return true;
                })
                .catch(msg => {
                    $.mensagem(msg);
                    return false;
                });
        }
    }

    var salvar = {
        label: 'Salvar',
        className: 'btn-success',
        callback: () => {
            $.validarFormulario(formUser)
                .then(qtde => $.getFormJson(formUser))
                .then(enviar => {
                    // console.log(enviar);
                    let dados = $.formToObj(formUser);
                    // dados = { ...dados, ...enviar };
                    $.post('/User', dados);
                })
                .then(data => {
                    init();
                    return true;
                })
                .catch(msg => {
                    $.mensagem(msg);
                    return false;
                });
        }
    }

    var excluir = {
        label: 'Excluir',
        className: 'btn-danger',
        callback: () => {
            bootbox.confirm('Tem certeza que deseja excluir ?', result => {
                if (result) {
                    $.delete(`/User/${id}`)
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
                    dados.password = '';
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
        Titulo = 'Incluir usu??rio';
    if (id !== 0) {
        Titulo = 'Alterar usu??rio ' + id;
        botoes.ressetar = ressetar;
        // if (Permissoes.excluir) {
        botoes.excluir = excluir;
        // }
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
                    document.querySelector('form input,select').focus();
                    // $('.foco').focus().select();
                },
                onHidden: function () {
                    $('body').removeClass('modal-open');
                }
            });
        })
        .catch(msg => { $.mensagem(msg); });
}