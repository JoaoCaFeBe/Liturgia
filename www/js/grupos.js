function init() {
    $.get('/Lista/Group')
        .done(result => { $('#bodyGroup').html(result); })
        .always(() => { $.funcoesTabela('Group') });
};

function cadastroGroup(id) {
    var salvarNovo = {
        label: 'Salvar +',
        className: 'btn-success',
        callback: async () => {
            let dados = await $.formToObj(formGroup);
            $.validarFormulario(formGroup)
                .then(qtde => $.getFormJson(formGroup))
                .then(enviar => $.post('/Group', { ...dados, ...enviar }))
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
            $.validarFormulario(formGroup)
                .then(qtde => $.getFormJson(formGroup))
                .then(enviar => {
                    // console.log(enviar);
                    let dados = $.formToObj(formGroup);
                    // dados = { ...dados, ...enviar };
                    $.post('/Group', dados)
                        .done(groups => console.log(groups))
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
                    $.delete(`/Group/${id}`)
                        .done(() => { init(); return true; })
                        .fail(msg => { $.mensagem(msg); return false; });
                }
            });
        }
    }

    let botoes = { confirm: salvarNovo, salvar: salvar },
        Titulo = 'Incluir grupo';
    if (id !== 0) {
        Titulo = 'Alterar grupo ' + id;
        // if (Permissoes.excluir) {
        botoes.excluir = excluir;
        // }
    }

    $.formulario('Group', id)
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
                className: 'GroupForm',
                onShow: function () {
                    $('body').addClass('modal-open');
                    $('input').off('click').on('click', function () { this.focus(); this.select(); });
                },
                onShown: function () {
                    document.querySelector('form input,select').focus();
                },
                onHidden: function () {
                    $('body').removeClass('modal-open');
                }
            });
        })
        .catch(msg => { $.mensagem(msg); });
}