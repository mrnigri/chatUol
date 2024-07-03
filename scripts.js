
// UUID: d0efb251-d6c8-48ec-b730-ad64e01f50d3



// VARIÁVEIS GLOBAIS

let listaMensagens = [];
let listaParticipantes = [];

let usuario = "";
let destinatario = "Todos";
let visibilidade = "Público";
let tipoMensagem = "message";

let linkMensagens = "https://mock-api.driven.com.br/api/v6/uol/messages/";
let linkParticipantes = "https://mock-api.driven.com.br/api/v6/uol/participants/";
let linkStatus = "https://mock-api.driven.com.br/api/v6/uol/status/";
let uuid = "d0efb251-d6c8-48ec-b730-ad64e01f50d3";



// EXECUÇÃO INICAL

perguntarNome();
setInterval(buscarMensagens, 3000);
setInterval(manterConexao, 5000, usuario);
setInterval(buscarParticipantes, 10000);



// ENTRADA NA SALA

function perguntarNome() {
    usuario = prompt("Qual é o seu nome?");
    const objetoParticipante = {
        name: usuario
    }
    cadastrarNome(objetoParticipante);
}

function cadastrarNome(objetoParticipante) {
    const promessa = axios.post(linkParticipantes+uuid, objetoParticipante);
    promessa.then(entrarSala);
    promessa.catch(perguntarNovoNome);
}

function perguntarNovoNome() {
    usuario = prompt("O nome que você colocou já está em uso. Por favor, coloque um novo nome:");
    const objetoParticipante = {
        name: usuario
    }
    cadastrarNome(objetoParticipante);
}

function entrarSala() {
    buscarMensagens();
    buscarParticipantes();
}


// BUSCAR MENSAGENS

function buscarMensagens() {
    const promessa = axios.get(linkMensagens+uuid);
    promessa.then(atualizarMensagens);
    promessa.catch(recarregarPagina);
}

function atualizarMensagens(resposta) {
    const listaTodasMensagens = resposta.data;
    listaMensagens = listaTodasMensagens.filter(filtrarReservadas);
    renderizarMensagens(listaMensagens);
}

function filtrarReservadas(mensagem) {
    if (mensagem.type === "status" || 
        mensagem.type === "message" || 
        (mensagem.type === "private_message" && mensagem.to === usuario) ||
        (mensagem.type === "private_message" && mensagem.from === usuario) ||
        (mensagem.type === "private_message" && mensagem.to === "Todos")) {
        return true;
    }
}

function recarregarPagina() {
    window.location.reload(true);
}


// BUSCAR PARTICIPANTES

function buscarParticipantes() {
    const promessa = axios.get(linkParticipantes+uuid);
    promessa.then(atualizarParticipantes);
    promessa.catch(recarregarPagina);
}

function atualizarParticipantes(resposta) {
    const listaTodosParticipantes = resposta.data;
    listaParticipantes = listaTodosParticipantes.filter(meFiltrar);
    renderizarParticipantes(listaParticipantes);
}

function meFiltrar(pessoa) {
    return pessoa.name !== usuario;
}


// MANTER CONEXÃO

function manterConexao(usuario) {
    const objetoParticipante = {
        name: usuario
    }
    const promessa = axios.post(linkStatus+uuid, objetoParticipante);
}


// RENDERIZAR MENSAGENS

function renderizarMensagens(listaMensagens) {

    const ul = document.querySelector(".mensagens");
    ul.innerHTML = "";

    for (let i=0; i<listaMensagens.length; i++) {
        switch (listaMensagens[i].type) {
            case "status":
                renderizarStatus(listaMensagens[i], i);
            break;
            case "message":
                renderizarMessage(listaMensagens[i], i);
            break;
            case "private_message":
                renderizarPrivateMessage(listaMensagens[i], i);
            break;
        }
        

        const ultimaMensagem = document.querySelector(`.mensagem-${i}`);
        ultimaMensagem.scrollIntoView();
    }
}

function renderizarStatus(mensagem, id) {
    const ul = document.querySelector(".mensagens");
    ul.innerHTML += `
        <li class="status mensagem-${id}">
            <span class="horario">(${mensagem.time}) </span>
            <span class="usuario">${mensagem.from}</span>
            ${mensagem.text}
        </li>
        `;
}

function renderizarMessage(mensagem, id) {
    const ul = document.querySelector(".mensagens");
    ul.innerHTML += `
        <li class="mensagem-publica mensagem-${id}">
            <span class="horario">(${mensagem.time}) </span>
            <span class="usuario">${mensagem.from} </span>
            para 
            <span class="usuario">${mensagem.to}:</span>
             ${mensagem.text}
        </li>
    `;
}

function renderizarPrivateMessage(mensagem, id) {
    const ul = document.querySelector(".mensagens");
    ul.innerHTML += `
        <li class="mensagem-privada mensagem-${id}">
            <span class="horario">(${mensagem.time}) </span>
            <span class="usuario">${mensagem.from} </span>
            reservadamente para 
            <span class="usuario">${mensagem.to}:</span>
             ${mensagem.text}
        </li>
    `;
}


// RENDERIZAR PARTICIPANTES

function renderizarParticipantes(listaParticipantes) {
    
    const ul = document.querySelector(".participantes");

    if (destinatario === "Todos") {
        ul.innerHTML = `
            <li class="participante" onclick="escolherDestinatario(this)">
                <div class="caixa-participante">
                    <ion-icon name="person-circle-sharp"></ion-icon>
                    <p>Todos</p>
                </div>
                <ion-icon name="checkmark-sharp" class="check display-check"></ion-icon>
            </li>
        `;
    } else {
        ul.innerHTML = `
            <li class="participante" onclick="escolherDestinatario(this)">
                <div class="caixa-participante">
                    <ion-icon name="person-circle-sharp"></ion-icon>
                    <p>Todos</p>
                </div>
                <ion-icon name="checkmark-sharp" class="check"></ion-icon>
            </li>
        `;
    }

    for (let i=0; i<listaParticipantes.length; i++) {

        if (destinatario === listaParticipantes[i].name) {
            ul.innerHTML += `
            <li class="participante" onclick="escolherDestinatario(this)">
                <div class="caixa-participante">
                    <ion-icon name="person-circle-sharp"></ion-icon>
                    <p>${listaParticipantes[i].name}</p>
                </div>
                <ion-icon name="checkmark-sharp" class="check display-check"></ion-icon>
            </li>
            `;
        } else {
            ul.innerHTML += `
            <li class="participante" onclick="escolherDestinatario(this)">
                <div class="caixa-participante">
                    <ion-icon name="person-circle-sharp"></ion-icon>
                    <p>${listaParticipantes[i].name}</p>
                </div>
                <ion-icon name="checkmark-sharp" class="check"></ion-icon>
            </li>
        `;
        }
    }
}


// ENVIAR MENSAGEM (ON CLICK)

function enviarMensagem(elemento) {
    const pai = elemento.parentNode;
    const mensagem = pai.querySelector("input").value;
    pai.querySelector("input").value = "";

    const objetoMensagem = {
        from: usuario,
	    to: destinatario,
	    text: mensagem,
	    type: tipoMensagem
    }

    const promessa = axios.post(linkMensagens+uuid, objetoMensagem);
    promessa.then(buscarMensagens);
    promessa.catch(recarregarPagina);
}


// MENU LATERAL (ON CLICK)

function abrirMenu() {
    const cover = document.querySelector(".cover");
    cover.classList.remove("escondido");
    const menuLateral = document.querySelector(".menu-lateral");
    menuLateral.classList.add("aberto");
}

function fecharMenu() {
    const cover = document.querySelector(".cover");
    cover.classList.add("escondido");
    const menuLateral = document.querySelector(".menu-lateral");
    menuLateral.classList.remove("aberto");
}


// MENU LATERAL (SELEÇÃO ON CLICK) 

function escolherDestinatario(elemento) {
    const destinatarioEscolhido = elemento.querySelector(".check")
    destinatario = elemento.querySelector("p").innerHTML;
    const ul = elemento.parentNode;
    const destinatarioAnterior = ul.querySelector(".display-check");
    destinatarioAnterior.classList.remove("display-check");
    destinatarioEscolhido.classList.add("display-check");
    document.querySelector(".texto-destinatario").innerHTML = `
        Enviando para ${destinatario} (${visibilidade})
    `;
}

function escolherVisibilidade(elemento) {
    const visibilidadeEscolhida = elemento.querySelector(".check")
    visibilidade = elemento.querySelector("p").innerHTML;
    const ul = elemento.parentNode;
    const visibilidadeAnterior = ul.querySelector(".display-check");
    visibilidadeAnterior.classList.remove("display-check");
    visibilidadeEscolhida.classList.add("display-check");
    document.querySelector(".texto-destinatario").innerHTML = `
        Enviando para ${destinatario} (${visibilidade})
    `;
    if (visibilidade === "Público") {
        tipoMensagem = "message";
    } else {
        tipoMensagem = "private_message";
    }
}