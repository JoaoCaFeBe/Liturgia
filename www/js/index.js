var Module = {}, User = {};

function init() {
    Menu.innerHTML = "";
    carregar('login.html');
}

function carregar(pagina) { queryId('AreaDeTrabalho').src = pagina; };