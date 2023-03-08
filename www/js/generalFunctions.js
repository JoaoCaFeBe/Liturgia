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
// Parametros
// ******************************************************************************************************************
bootbox.addLocale('pt-BR', {
    OK: 'Ok',
    CONFIRM: 'Confirmar',
    CANCEL: 'Cancelar'
});
bootbox.setDefaults({ 'locale': 'pt-BR' });
toastr.options = {
    "closeButton": false,
    "debug": false,
    "newestOnTop": false,
    "progressBar": true,
    "positionClass": "toast-bottom-right",
    "preventDuplicates": true,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
}
// ******************************************************************************************************************
// Padrões campos
// ******************************************************************************************************************
var padraoCampo = {
    type: "string",
    key: false,
    input: "text",
    value: "",
    defaultValue: "",
    title: "label",
    placeholder: "",
    size: 0,
    decimais: 0,
    table: {
        origin: "",
        key: "",
        return: ""
    },
    fields: {
        id: { type: "string", title: "ID", placeholder: "ID", required: true, value: 0 }
    },
    class: "",
    parentClass: "",
    style: "",
    on: {},
    list: {
        active: false,
        sort: "asc",
        class: {
            title: "",
            body: ""
        },
    },
    required: true
};
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

$.fn.extend({
    capitalize: function (lower = false) {
        $(this).val((lower ? $(this).val().toLowerCase() : $(this).val()).replace(/(?:^|\s|["'([{])+\S/g, match => match.toUpperCase()));
    },
    cep: function (cep) {
        return new Promise((resolve, reject) => {
            var object = this;
            $.getJSON(`https://brasilapi.com.br/api/cep/v2/${cep.replace(/[^0-9]/g, '')}`)
                .done(function (CEP) {
                    let endereco = CEP.street + ', nº , ' + CEP.neighborhood + ', ' + CEP.city + ', ' + CEP.state;
                    $(object).val(endereco);
                    resolve(endereco);
                })
                .fail(() => {
                    reject('CEP não encontrado');
                });
        });
    },
    endereco: function (cep) {
        return new Promise((resolve, reject) => {
            var object = this;
            $.getJSON(`https://brasilapi.com.br/api/cep/v2/${cep.replace(/[^0-9]/g, '')}`)
                .done(function (CEP) {
                    let endereco = CEP.street + ', nº , ' + CEP.neighborhood + ', ' + CEP.city + ', ' + CEP.state;
                    $(object).val(endereco);
                    resolve({ endereco: endereco, rua: CEP.street, bairro: CEP.neighborhood, cidade: CEP.city, estado: CEP.state });
                })
                .fail(() => {
                    reject('CEP não encontrado');
                });
        });
    },
    seleciona: function (desmarcar = true) {
        let objeto = this[0];
        if (desmarcar) {
            $(objeto).parent().find('.selecionado').removeClass('selecionado');
            $(objeto).addClass('selecionado');
        } else {
            $(objeto).toggleClass('selecionado');
        }
    },
    serializeObject: function () {
        let retorno = {};
        form = this[0];
        if (typeof form == 'object' && form.nodeName == "FORM") {
            Object.values(form.elements).forEach(field => {
                if (field.name && !field.disabled && field.type != 'file' && field.type != 'reset' && field.type != 'submit' && field.type != 'button') {
                    if (field.type == 'select-multiple') {
                        Object.values(field).forEach(option => {
                            if (option.selected) {
                                retorno[field.name] = option.value;
                            }
                        })
                    } else if ((field.type != 'checkbox' && field.type != 'radio') || field.checked) {
                        retorno[field.name] = field.value;
                    }
                }
            });
        }
        return retorno;
    },
    loadJC: function (url, params = {}) {
        var container = this[0];
        return new Promise((resolve, reject) => {
            let formData = new FormData();
            Object.entries(params).forEach(([key, value]) => {
                if (typeof value === 'object')
                    value = JSON.stringify(value);
                formData.append(key, value);
            });
            var http = new XMLHttpRequest();
            http.open('POST', url, true);
            http.onreadystatechange = function () {
                if (http.readyState == 4) {
                    if (http.status == 200) {
                        $(container).html(this.response);
                        resolve(true);
                    } else {
                        $(container).html("");
                        reject(false);
                    }
                }
            };
            http.send(formData);
        })
    },
    filtra: function (texto, tamanho = 3) {
        Object.values(this).forEach(obj => {
            if (texto.length >= tamanho) {
                switch (obj.nodeName) {
                    case "TABLE":
                        $(obj).find(`tbody>tr:containsAny('${texto}')`).css('display', "table-row");
                        $(obj).find(`tbody>tr:not(:containsAny('${texto}'))`).css('display', "none");
                        break;
                    case "UL":
                        $(obj).find(`li:containsAny('${texto}')`).css('display', "");
                        $(obj).find(`li:not(:containsAny('${texto}'))`).css('display', "none");
                        break;
                    default:
                        break;
                }
            } else {
                switch (obj.nodeName) {
                    case "TABLE":
                        $(obj).find(`tbody>tr`).css('display', "table-row");
                        break;
                    case "UL":
                        $(obj).find(`li`).css('display', "");
                        break;
                    default:
                        break;
                }
            }
        })
    }
});
// ******************************************************************************************************************
// Extensões jQuery - Funções
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

$.formToObj = (formulario) => {
    let resultado = {};
    $(formulario).serializeArray().forEach(campo => {
        resultado[campo.name] = campo.value;
    })
    return resultado;
}

$.funcoesTabela = (tabela, ...args) => {
    let id = 0,
        selecao = false;

    if (args.length > 0) {
        args.forEach(arg => {
            if ((typeof arg === "number") || (typeof arg === "string")) id = arg;
            if (typeof arg === "boolean") selecao = arg;
        });
    }

    let funcao = selecao ? 'selecao' : 'cadastro',
        colunas = queryAll(`#tabela${tabela}>tbody>tr>td:not(.noClick)`),
        i = colunas.length;

    const clickColuna = function () {
        let id = (isNaN(this.parentElement.id)) ? this.parentElement.id : parseInt(this.parentElement.id);
        if (id === 'edit') {
            if ((typeof window[`${funcao}${tabela}`] === "function")) window[`${funcao}${tabela}`](id);
        } else {
            if ($(this).index() === 0) window[`cadastro${tabela}`](id);
            if ((funcao !== 'cadastro') && ((typeof window[`${funcao}`] === "function"))) window[`${funcao}${tabela}`](id);
        }
        if (selecao) $(this).parent().seleciona();
    }

    colunas.forEach(coluna => {
        coluna.removeEventListener("click", clickColuna);
        coluna.addEventListener("click", clickColuna);
        if (--i) {
            if ((id !== 0) && (selecao)) document.querySelector(`#tabela${tabela}>tbody>tr[id="${id}"]>td:nth-child(2)`).click();
        }
    });
}

$.formulario = (classe, id = 0) => {
    return new Promise((resolve) => {
        classe = classe.toAllFirstCase();
        $.get(`/${classe}/definitions/${id}`)
            .done(definicoes => {
                qtdeCampos = Object.keys(definicoes).length;
                let form = `<form id="form${classe.toAllFirstCase()}" class="d-grid gap-2" autocomplete=off>\n`;
                let i = 0, fields = [];
                Object.entries(definicoes).forEach(async campo => {
                    fields[i++] = await $.formularioCampos(campo);
                    if (!--qtdeCampos) {
                        form += (fields.join('\n') + `</form>`);
                        resolve(form);
                    }
                });
            });
    });
}

$.formularioCampos = (campo) => {
    return new Promise((resolve) => {
        let name = campo[0], form = ``;
        campo = Object.assign({}, padraoCampo, campo[1]);
        // ---------------------------------------------------------------------------------------------------------------------------------------
        if (campo.input === 'hidden') {
            let valor = campo.value;
            if (['object', 'array'].indexOf(campo.type) >= 0) valor = JSON.stringify(campo.value).replace('\\\\', '');
            form += `<input type="hidden" id="${name}" name="${name}" value='${valor}'>\n`;
            resolve(form);
        } else {
            let on = Object.entries(campo.on).map(([evento, funcao]) => `on${evento}="${funcao}"`).join(' ');
            switch (campo.type) {
                // ---------------------------------------------------------------------------------------------------------------------------------------
                case "string":
                    let tamanho = campo.tamanho ? `maxlength="${campo.tamanho}" ` : '';
                    form += ` <div class="form-floating ${campo.parentClass}">\n`;
                    form += `  <input type="${campo.input}" class="form-control form-control-sm ${campo.class}" style="${campo.style}" ${tamanho}id="${name}" name="${name}" value="${campo.value}" placeholder="${campo.placeholder}" aria-describedby="basic-addon2" ${on} ${campo.required ? 'required' : ''}>\n`;
                    form += `  <label for="${name}">${campo.title}</label>\n`;
                    form += ` </div>\n`;
                    resolve(form);
                    break;
                // ---------------------------------------------------------------------------------------------------------------------------------------
                case "integer":
                case "decimal":
                    step = campo.type === 'integer' ? 'step="1" ' : 'step="0.01" ';
                    form += ` <div class="form-floating ${campo.parentClass}">\n`;
                    form += `  <input type="${campo.input}" class="form-control form-control-sm ${campo.class}" style="${campo.style}" ${step}id="${name}" name="${name}" value="${campo.value}"  placeholder="${campo.placeholder}" aria-describedby="basic-addon2" ${on} ${campo.required ? 'required' : ''}>\n`;
                    form += `  <label for="${name}">${campo.title}</label>\n`;
                    form += ` </div>\n`;
                    resolve(form);
                    break;
                // ---------------------------------------------------------------------------------------------------------------------------------------
                case "boolean":
                    form += ` <div class="form-check form-switch ${campo.parentClass}">\n`;
                    form += `  <label class="form-check-label" for="${name}">${campo.title}</label>\n`;
                    form += `  <input class="form-check-input ${campo.class}" style="${campo.style}" type="checkbox" id="${name}" name="${name}" ${on} ${campo.value ? 'checked' : ''} ${campo.required ? 'required' : ''}>\n`;
                    form += ` </div>\n`;
                    resolve(form);
                    break;
                // ---------------------------------------------------------------------------------------------------------------------------------------
                case "array":
                case "object":
                    form += ` <div class="bg-opacity-25 bg-secondary mb-2 px-2 pb-2 ${campo.parentClass}">\n`;
                    form += `   <label for="${name}" class="border-bottom border-light col-form-label form-control-sm fs-5 mb-2 w-100 py-2">${campo.title}</label>\n`;
                    form += `   <div class="campoJSON ${campo.input} ${campo.class} d-grid gap-2" id="${name}" valorPadrao='${campo.defaultValue}'>\n`;
                    qtdeFields = Object.keys(campo.fields).length;
                    if (qtdeFields === 0) {
                        form += `   </div>\n`;
                        form += ` </div>\n`;
                        resolve(form);
                    }
                    // ---------------------------------------------------------------------------------------------------------------------------------------
                    if (campo.input === 'tableJSON') {
                        form += `     <table id="tabela${campo}" class="table table-sm table-hover m-0 rounded-1">\n`;
                        form += `       <tbody>\n`;
                        Object.entries(campo.fields).forEach(async ([index, item]) => {
                            form += `         <tr id="${index}" class="linhaJSON">\n`;

                            form += `         </tr>\n`;
                            if (!--qtdeFields) {
                                form += `       </tbody>\n`;
                                form += `     </table>\n`;
                                form += `   </div>\n`;
                                form += ` </div>\n`;
                                resolve(form);
                            }
                        });
                        // ---------------------------------------------------------------------------------------------------------------------------------------
                    } else if (campo.input === 'fieldJSON') {
                        Object.entries(campo.fields).forEach(async ([index, item]) => {
                            let onField = Object.entries(campo.on).map(([evento, funcao]) => `on${evento}="${funcao}"`).join(' ');
                            let field = await new Promise((resolve) => {
                                let form = ``;
                                switch (item.type) {
                                    case "hidden":
                                        form += `<input type="hidden" id="${index}" name="${index}" value="${item.value}">\n`;
                                        resolve(form);
                                        break;
                                    case "select":
                                        form += ` <div class="form-floating">`;
                                        form += `     <select class="form-select" id="${index}" name="${index}" value="${item.value}" aria-label="" defaultType="${item.type}">`;
                                        form += `         <option value="0" ${item.value === 0 ? 'selected' : ''}>Selecione a opção...</option>`;
                                        $.post(`${parent.location.pathname}src/${item.definition.class}Front.php`, { acao: 'getAll' })
                                            .done(tabela => {
                                                let qtdeTable = Object.keys(tabela).length;
                                                Object.values(tabela).forEach(record => {
                                                    let other = (item.definition.fields).split(',');
                                                    form += `         <option value="${record[item.definition.key]}" ${item.value == record[item.definition.key] ? 'selected' : ''}>${record[other[0]]}</option>`;
                                                    if (!--qtdeTable) {
                                                        form += `     </select>`;
                                                        form += `     <label for="${index}">${item.title}</label>`;
                                                        form += ` </div>`;
                                                        resolve(form);
                                                    }
                                                })
                                            })
                                        break;
                                    default:
                                        form += ` <div class="form-floating ${item.parentClass}">\n`;
                                        form += `  <input type="${item.input}" class="form-control form-control-sm ${item.class}" style="${item.style}" id="${index}" name="${index}" value="${item.value}" placeholder="${item.placeholder}" aria-describedby="basic-addon2" ${onField} ${item.required ? 'required' : ''}  defaultType="${item.type}">\n`;
                                        form += `  <label for="${index}">${item.title}</label>\n`;
                                        form += ` </div>\n`;
                                        resolve(form);
                                        break;
                                }
                            });
                            form += field;
                            if (!--qtdeFields) {
                                form += `   </div>\n`;
                                form += ` </div>\n`;
                                resolve(form);
                            }
                        });
                    }
                    break;
                default:
                    break;
            }
        }
    })
}

$.getFormJson = async (form) => {
    let fieldsJSON = form.querySelectorAll('.campoJSON');
    return new Promise((resolve) => {
        let qtde = fieldsJSON.length,
            ret = {};
        if (qtde === 0) resolve(ret);
        fieldsJSON.forEach(field => {
            let name = field.id;
            if (field.classList.contains("tableJSON")) {
                let linhas = field.querySelectorAll('.linhaJSON');
                ret[name] = [];
                linhas.forEach(linha => {
                    let campos = linha.querySelectorAll('.form-control, .form-select');
                    let obj = {};
                    campos.forEach(campo => {
                        obj[campo.name] = campo.value;
                    });
                    ret[name].push(obj);
                });
            } else if (field.classList.contains("fieldJSON")) {
                let campos = field.querySelectorAll('.form-control, .form-select');
                ret[name] = {};
                campos.forEach(campo => {
                    let value = campo.getAttribute("defaultType") === 'integer' ? parseInt(campo.value) : campo.value;
                    ret[name][campo.name] = value;
                });
            }
            if (!--qtde) {
                resolve(ret);
            }
        });
    });
}

$.validarFormulario = (tabela = '') => {
    return new Promise((resolve, reject) => {
        // tabela = tabela.toLowerCase();
        let form = (typeof tabela === "string") ? query('#Form_' + tabela) : tabela;
        if (form.checkValidity() === false) {
            $(form).addClass('was-validated');
            let invalido = query("input:invalid");
            invalido.focus();
            invalido.select();
            reject(invalido.getAttribute("erro") ?? "Existem informações inválidas no cadastro !");
        } else {
            $(form).addClass('was-validated');
            resolve(queryAll('.campoJSON').length);
        }
    })
}

$.aguarde = (Mensagem = 'Aguarde, processando dados...', Classe = 'alert-info') => {
    Classe = 'alert mb-0 ' + Classe;
    $('.aguarde').modal('hide');
    bootbox.dialog({
        message: '<div class="fa-2x"><i class="fas fa-circle-notch fa-spin"></i>&nbsp;' + Mensagem + '</div>',
        closeButton: false,
        className: 'aguarde bootbox-secondary',
        centerVertical: true,
        size: "large",
    }).init(function () {
        $('.aguarde .modal-body').addClass(Classe).addClass("text-nowrap");
    });
}

$.mensagem = (Mensagem = '', ...params) => {
    let titulo = '',
        background = 'info' /* warning, success, error */;
    params.forEach(param => {
        if (['info', 'warning', 'success', 'error'].includes(param)) {
            background = param;
        } else {
            titulo = param;
        }
    });

    return new Promise(resolve => {
        let opcoes = {
            onHidden: function () {
                resolve(true);
            }
        };
        switch (background) {
            case 'warning':
                toastr.warning(Mensagem, titulo, opcoes);
                break;
            case 'success':
                toastr.success(Mensagem, titulo, opcoes);
                break;
            case 'error':
                toastr.error(Mensagem, titulo, opcoes);
                break;
            default:
                toastr.info(Mensagem, titulo, opcoes);
                break;
        }
    })
}

$.alerta = (Mensagem = '', ...params) => {
    let titulo = '',
        background = 'info' /* warning, success, error */;
    params.forEach(param => {
        if (['info', 'warning', 'success', 'error'].includes(param)) {
            background = param;
        } else {
            titulo = param;
        }
    });

    return new Promise(resolve => {
        let opcoes = {
            timeOut: 0,
            extendedTimeOut: 0,
            onHidden: function () {
                resolve(true);
            }
        };
        switch (background) {
            case 'warning':
                toastr.warning(Mensagem, titulo, opcoes);
                break;
            case 'success':
                toastr.success(Mensagem, titulo, opcoes);
                break;
            case 'error':
                toastr.error(Mensagem, titulo, opcoes);
                break;
            default:
                toastr.info(Mensagem, titulo, opcoes);
                break;
        }
    })
}
// ******************************************************************************************************************
// Funções
// ******************************************************************************************************************
function iframeForm(Url, Target = "AreaDeTrabalho") {
    var object = this;
    object.time = new Date().getTime();
    object.form = $('<form action="' + Url + '" target="' + Target + '" method="get" style="display:none;" id="form' + object.time + '" name="form' + object.time + '"></form>');

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