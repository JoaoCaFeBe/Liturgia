// ******************************************************************************************************************
// Pesquisa
// ******************************************************************************************************************
var query = document.querySelector.bind(document),
    queryAll = document.querySelectorAll.bind(document),
    queryId = document.getElementById.bind(document),
    queryName = document.getElementsByName.bind(document),
    queryTag = document.getElementsByTagName.bind(document),
    queryClass = document.getElementsByClassName.bind(document);
// ******************************************************************************************************************
// Extensões JS
// ******************************************************************************************************************
String.prototype.toAllFirstCase = function () {
    return this.toLowerCase().replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
}
// ******************************************************************************************************************
// Extensões jQuery
// ******************************************************************************************************************
$.each(["put", "delete"], function (_i, method) {
    jQuery[method] = function (url, data, callback, type) {

        // Shift arguments if data argument was omitted
        if ($.isFunction(data)) {
            type = type || callback;
            callback = data;
            data = undefined;
        }

        // The url can be an options object (which then must have .url)
        return jQuery.ajax(jQuery.extend({
            url: url,
            type: method,
            dataType: type,
            data: data,
            success: callback
        }, jQuery.isPlainObject(url) && url));
    };
});
// ******************************************************************************************************************
// Extensões jQuery - Funções do menu
// ******************************************************************************************************************
$.menu = (Opcoes, grupo, permissoes = {}, arquivos) => {
    let i = Object.keys(Opcoes).length,
        html = ``;
    Object.entries(Opcoes).forEach(([nome, menu]) => {
        menu.desativado = menu?.desativado ?? false;
        if (menu.tipo !== "menuPrincipal") {
            if (!permissoes[nome]) {
                if ((menu.liberado) || (grupo === "Administradores do sistema")) {
                    permissoes[nome] = { ver: true, acessar: true, incluir: true, alterar: true, excluir: true };
                } else {
                    permissoes[nome] = { ver: false, acessar: false, incluir: false, alterar: false, excluir: false };
                }
            }
        }

        let classes = "";
        if (menu?.classList) classes = " " + menu?.classList;
        if (menu.desativado) classes += " d-none"

        switch (menu.tipo) {
            case "menuPrincipal":
                {
                    html += `<li class='nav-item dropdown dropstart${classes}' >
                    <a class='nav-link dropdown-toggle' href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class='${menu.icone}' data-bs-toggle="tooltip" data-bs-html="true" title='${menu.titulo}'></i>
                        <span class='d-none'>&nbsp;${menu.titulo}</span>
                    </a>                
                    <ul class='dropdown-menu rounded border shadow-lg' aria-labelledby='${menu.titulo}'>`;

                    Object.entries(menu.sub).forEach(([funcao, subMenu]) => {
                        let classes = "";
                        if (menu?.classList) classes = " " + menu?.classList;
                        switch (subMenu.tipo) {
                            case "submenu":
                                if (!permissoes[funcao]) {
                                    if ((subMenu.liberado) || (grupo === "Administradores do sistema")) {
                                        permissoes[funcao] = { ver: true, acessar: true, incluir: true, alterar: true, excluir: true };
                                    } else {
                                        permissoes[funcao] = { ver: false, acessar: false, incluir: false, alterar: false, excluir: false };
                                    }
                                }
                                if (permissoes[funcao].acessar) {
                                    html += `<li class='dropdown-item d-flex align-items-center${classes}' onclick='$.carregarJanela("${arquivos.local + subMenu.link}", "${funcao}", "${subMenu.titulo}", "${subMenu.icone}")'><i class='${subMenu.icone}' data-bs-toggle="tooltip" data-bs-html="true" title='${subMenu.titulo}'></i>&nbsp;${subMenu.titulo}</li>`;
                                } else {
                                    html += `<li class='dropdown-item d-flex align-items-center${classes}'><i class='${subMenu.icone}' data-bs-toggle="tooltip" data-bs-html="true" title='${subMenu.titulo}'></i>&nbsp;${subMenu.titulo}</li>`;
                                }
                                break;
                            case "divisao":
                                html += `<li class="dropdown-divider"></li>`;
                                break;
                        }
                    })
                    html += `</ul></li> `;
                }
                break;
            case "menu":
                if (permissoes[nome].acessar) {
                    html += `<li class='nav-item${classes}'><a class='nav-link' onclick='$.carregarJanela("${arquivos.local + menu.link}", "${nome}", "${menu.titulo}", "${menu.icone}")'><i class='${menu.icone}' data-bs-toggle="tooltip" data-bs-html="true" title='${menu.titulo}'></i><span class='d-none'>&nbsp;${menu.titulo}</span></a></li> `;
                } else {
                    html += `<li class='nav-item${classes}'><a class='nav-link'><i class='${menu.icone}' data-bs-toggle="tooltip" data-bs-html="true" title='${menu.titulo}'></i><span class='d-none'>&nbsp;${menu.titulo}</span></a></li> `;
                }
                break;
            case "menuModal":
                html += `<li class="nav-item${classes}"><a class="nav-link" onclick="$.executaMenuModal('${menu.link}', '${nome}', '${menu.titulo}', '${menu.icone}', ${menu?.botoes ?? {}}, ${menu?.parametros ?? {}})"><i class="${menu.icone}" data-toggle="tooltip" data-placement="auto" title="${menu.titulo}"></i><span class="d-none">&nbsp;${menu.titulo}</span></a></li>`;
                break;
            case "menuFuncao":
                html += `<li class="nav-item${classes}"><a class="nav-link" onclick="${nome}('${menu.titulo}', '${menu.icone}', '${menu.parametros}')"><i class="${menu.icone}" data-toggle="tooltip" data-placement="auto" title="${menu.titulo}"></i><span class="d-none">&nbsp;${menu.titulo}</span></a></li>`;
                break;
            case "menuLink":
                html += `<li class="nav-item${classes}"><a class="nav-link" onclick="${menu.link}"><i class="${menu.icone}" data-toggle="tooltip" data-placement="auto" title="${menu.titulo}"></i><span class="d-none">&nbsp;${menu.titulo}</span></a></li>`;
                break;
        }
        if (!--i) {
            Logomarca.setAttribute("href", arquivos.local + arquivos.capa);
            carregar(arquivos.local + arquivos.capa);
            Menu.insertAdjacentHTML("beforeend", html);

            let objAdmin = queryAll('.d-admin');
            if (User.group === "Administradores do sistema") {
                objAdmin.forEach(element => { element.classList.remove('d-none'); });
            } else {
                objAdmin.forEach(element => { element.classList.add('d-none'); });
            }
            return true;
        }
    })

}

$.executaMenuModal = (Url, Funcao = null, Titulo = "Janela", Icone = "fa fa-table", botoes, parametros) => {
    $.post(Url, parametros)
        .done(function (result) {
            bootbox.dialog({
                size: "extra-large",
                message: result,
                onEscape: true,
                closeButton: false,
                backdrop: true,
                centerVertical: true,
                scrollable: true,
                buttons: botoes,
                title: `<i class="${Icone}" data-toggle="tooltip" data-placement="auto" ></i>&nbsp;${Titulo}`,
                onShow: function () {
                    $("body").addClass("modal-open");
                    if (typeof window[`${Funcao} `] === "function") window[`${Funcao} `];
                },
                onHidden: function () {
                    $("body").removeClass("modal-open");
                }
            });
        });
}

$.carregarJanela = (Url, Funcao = null, Titulo = "Janela", Icone = "fa fa-table") => {
    let janela = new iframeForm(Url);
    janela.addParameter('funcao', Funcao);
    janela.addParameter('titulo', Titulo);
    janela.addParameter('icone', Icone);
    let permissoesLocal = Module.permissões[Funcao];
    janela.addParameter('permissoes', JSON.stringify(permissoesLocal ?? { "acessar": true, "incluir": true, "alterar": true, "excluir": true, "imprimir": true }));
    janela.send();
}

// ******************************************************************************************************************
// Funções
// ******************************************************************************************************************
function iframeForm(Url, Target = "AreaDeTrabalho") {
    var object = this;
    object.time = new Date().getTime();
    object.form = $('<form action="' + Url + '" target="' + Target + '" method="post" style="display:none;" id="form' + object.time + '" name="form' + object.time + '"></form>');

    object.addParameters = function (obj) {
        Object.entries(obj).forEach(([campo, valor]) => {
            $("<input type='hidden' />")
                .attr("name", campo)
                .attr("value", valor)
                .appendTo(object.form);
        })
    };

    object.addParameter = function (parameter, value) {
        $("<input type='hidden' />")
            .attr("name", parameter)
            .attr("value", value)
            .appendTo(object.form);
    };

    object.send = function () {
        $("body").append(object.form);
        object.form.submit();
        object.form.remove();
    };
}