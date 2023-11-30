
function alternarDivsPagamento() {
    let divOne1 = document.getElementById('divFormularioPagamento');
    let divOne2 = document.getElementById('divFormularioPix');
    let opcModalPix = document.getElementById('pix');
    let opcModalCard = document.getElementById('credit');

    if (opcModalPix.checked) {
        divOne2.style.display = 'block';
        divOne1.style.display = 'none';
    } else {
        divOne2.style.display = 'none';
        divOne1.style.display = 'block';
    }
}

document.getElementById('pix').addEventListener('change', alternarDivsPagamento);
document.getElementById('credit').addEventListener('change', alternarDivsPagamento);


function limparFormulario() { // type = reset nao funcionou
    const vetIdForm = ["cardholder-name", "cardholder-email", "card-number", "cardholder-expiryDate", "card-cvv-number"];

    for (let i = 0; i < vetIdForm.length; i++) {
        document.getElementById(vetIdForm[i]).value = '';
    }
}

let numeroAleatorio = Math.floor(Math.random() * 10) + 1;
console.log(numeroAleatorio);

let n = 0;
let lastCardNumber = ""; 

function processPayment() {
    let email = document.getElementById('cardholder-email');
    let mensagem = document.getElementById('mensagemPagamento');

    let mensagemValidacao = ValidaFormCred();

    let nCartao = document.getElementById('card-number');
    let buyButton = document.getElementById('buy');

    if (mensagemValidacao === "") {
        n++;

        if (n < numeroAleatorio) {
            mensagem.innerText = "Ocorreu um erro com o pagamento, tente novamente com outro cartão";
            disableButton(buyButton);

        } else if (n === numeroAleatorio) {
            mensagem.innerText = `Pagamento concluído com sucesso! Um voucher está sendo enviado para o seu email: ${email.value}`;
            alterarAssentos();
            inserirPassagem();
            return;
        } 
    } else {
        mensagem.innerText = mensagemValidacao;
    }

    if (nCartao.value !== lastCardNumber) {
        enableButton(buyButton);
        lastCardNumber = nCartao.value;
    }
}

function disableButton(button) {
    button.disabled = true;
}

function enableButton(button) {
    button.disabled = false;
}

function ValidaFormCred() {
    let mensagem = "";
    const vetIdForm = ["cardholder-name", "cardholder-email", "card-number", "cardholder-expiryDate", "card-cvv-number"];

    var nome = document.getElementById(vetIdForm[0]).value;
    if (nome === "") {
        mensagem = "Preencha o nome do cartão.";
        return mensagem;
    }

    var email = document.getElementById(vetIdForm[1]).value;
    if (email === "") {
        mensagem = "Preencha o e-mail.";
        return mensagem;
    }

    var numeroCartao = document.getElementById(vetIdForm[2]).value;
    if (numeroCartao === "") {
        mensagem = "Preencha o número do cartão.";
        return mensagem;
    }

    var dataExpiracao = document.getElementById(vetIdForm[3]).value;
    if (dataExpiracao === "") {
        mensagem = "Preencha a data de expiração do cartão.";
        return mensagem;
    }

    var cvv = document.getElementById(vetIdForm[4]).value;
    if (cvv === "") {
        mensagem = "Preencha o CVV do cartão.";
        return mensagem;
    }

    return mensagem;
}


// Função para obter o valor de um parâmetro da URL
function obterParametroDaURL(parametro) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(parametro);
}

// Função para verificar os parâmetros da URL e realizar a lógica necessária
function exibirParametrosNaPagina() {
    // Obter os parâmetros da URL
    const codigoVoo = obterParametroDaURL('codigoVoo');
    const valorVoo = obterParametroDaURL('valorVoo');
    const assentosSelecionadosParam = obterParametroDaURL('assentos');
    const assentosSelecionados = assentosSelecionadosParam ? assentosSelecionadosParam.split(',') : [];
    const quantidadeAssentos = assentosSelecionados.length
    const valorTotal = calcularValorTotal(quantidadeAssentos, valorVoo);

    // Exibir os parâmetros no HTML
    document.getElementById('codigoVoo').textContent = `Código do Voo: ${codigoVoo}`;
    document.getElementById('valorVoo').textContent = `Valor do Voo: ${valorVoo}`;
    document.getElementById('assentosSelecionados').textContent = `Assentos Selecionados: ${assentosSelecionados.join(', ')}`;
    document.getElementById('valorTotal').textContent = `Valor Total: ${valorTotal.toFixed(2)}`; // Arredondar para 2 casas decimais (centavos)
}

document.addEventListener("DOMContentLoaded", function () {
    exibirParametrosNaPagina();
});

// Função para calcular o valor total da compra
function calcularValorTotal(quantidadeAssentos, valorVoo) {
    return quantidadeAssentos * valorVoo;
}

function fetchAlterarAssento(body) {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    };
  
    return fetch('http://localhost:3000/alterarAssento', requestOptions)
        .then(response => response.json());
  }

  function alterarAssentos() {
    const codigoVoo = obterParametroDaURL('codigoVoo');
    const assentosSelecionadosParam = obterParametroDaURL('assentos');
    const assentosSelecionados = assentosSelecionadosParam ? assentosSelecionadosParam.split(',') : [];

    // Mapeia os assentosSelecionados para um array de promessas
    const promessasAlteracao = assentosSelecionados.map(numeroAssento => {
        return fetchAlterarAssento({
            voo: codigoVoo,
            numero: numeroAssento,
        });
    });

    // Executa todas as promessas em paralelo
    Promise.all(promessasAlteracao)
        .then(respostas => {
            // Processa as respostas
            respostas.forEach((customResponse, index) => {
                if (customResponse.status === "SUCCESS") {
                    console.log(`Assento ${assentosSelecionados[index]} alterado com sucesso.`);
                } else {
                    console.error(`Erro ao alterar assento ${assentosSelecionados[index]}: ${customResponse.message}`);
                }
            });
        })
        .catch((e) => {
            console.error("Erro técnico ao alterar assentos. Contate o suporte.", e);
        });
}

function fetchInserirPassagem(body) {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    };

    return fetch('http://localhost:3000/inserirPassagem', requestOptions)
        .then(response => response.json());
}

function inserirPassagem() {
    
    const codigoVoo = obterParametroDaURL('codigoVoo');
    const assentosIdsParam = obterParametroDaURL('assentosIds');
    const assentosIds = assentosIdsParam ? assentosIdsParam.split(',') : [];
    const nome = document.getElementById("cardholder-name").value;
    const email = document.getElementById("cardholder-email").value;


    const passagemInsert= assentosIds.map(idAssento => {
        return fetchInserirPassagem({
            nome: nome,
            email: email,
            voo: codigoVoo,
            assento: idAssento,
        });
    });

    // Executa todas as promessas em paralelo
    Promise.all(passagemInsert)
        .then(respostas => {
            // Processa as respostas
            respostas.forEach((customResponse, index) => {
                if (customResponse.status === "SUCCESS") {
                    console.log(`Passagem inserida do assento ${assentosIds[index]}: com sucesso.`);
                } else {
                    console.error(`Erro ao inserir passagem ${assentosIds[index]}: ${customResponse.message}`);
                }
            });
        })
        .catch((e) => {
            console.error("Erro técnico ao alterar assentos. Contate o suporte.", e);
        });
}