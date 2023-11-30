//AQUI VAO SER COLOCADOS TODOS OS VALIDADORES DO FRONT
//A CHAMADA FICARÁ NOS RESPECTIVOS SCRIPTS

//VETORES DE ID SEPARADOS POR CADASTRAR E SEPARAR

const vetorAeronaveCad = ["comboFabricantesCadastrar", "modeloCadastrar", "referenciaCadastrar", "anoFabCadastrar", "totalAssentosCadastrar"];
const vetorAeronaveAlt = ["comboFabricantesAlterar", "modeloAlterar", "referenciaAlterar", "anoFabAlterar", "totalAssentosAlterar"];
const vetorAeroportoCad = ["nomeCadastrar", "siglaCadastrar", "cidadeCadastrar"];
const vetorAeroportoAlt = ["nomeAlterar", "siglaAlterar", "cidadeAlterar"];
const vetorCidadeCad = ["nome", "uf", "pais"];
const vetorCidadeAlt = ["nomeCidade", "ufCidade", "paisCidade"];
const vetorTrechoCad = ["nomeCad", "selectOrigemAeroportoCad", "selectDestinoAeroportoCad", "selectAeronaveCad"];
const vetorTrechoAlt = ["codAlt", "nomeAlt", "selectOrigemAeroportoAlt", "selectAeronaveAlt"];
const vetorVooCad = ["codigoCadastrar", "dataCadastrar", "hrSaidaCadastrar", "hrChegadaCadastrar", "valorCadastrar", "trechoCadastrar"];
const vetorVooAlt = ["codigoAlterar", "dataAlterar", "hrSaidaAlterar", "hrChegadaAlterar", "valorAlterar", "trechoAlterar"];

////////////////////////////////////////////////

function validaAeronave(vetor) {
    let mensagem = "";

    var fabricante = document.getElementById(vetor[0]).value;
    if(fabricante=="0") {
        mensagem = "Selecione o fabricante da aeronave.";
        return mensagem; 
    }

    var modelo = document.getElementById(vetor[1]).value;
    if(modelo.length==0) {
        mensagem = "Preencha o modelo da aeronave.";
        return mensagem;
    }

    var referencia = document.getElementById(vetor[2]).value;
    if(referencia.length==0) {
        mensagem = "Preencha a referência da aeronave.";
        return mensagem;
    }

    var anoFabricacao = document.getElementById(vetor[3]).value;
    if(anoFabricacao.length==0) {
        mensagem = "Preencha o ano de fabricação da aeronave.";
        return mensagem;
    }
    if(anoFabricacao < 1990 || anoFabricacao > 2026) {
        mensagem = "O ano de fabricação deve estar entre 1990 e 2026.";
        return mensagem;
    }

    var assentos = document.getElementById(vetor[4]).value;
    if(assentos.length==0) {
        mensagem = "Preencha a quantidade de assentos da aeronave.";
        return mensagem;
    }
    if(assentos<100 || assentos>1000) {
        mensagem = "A quantidade de assentos deve estar entre 100 e 1000."
        return mensagem;
    }

}

function validaAeroporto(vetor) {
    let mensagem = "";

    var nome = document.getElementById(vetor[0]).value;
    if(nome.length==0) {
        mensagem = "Preencha o nome do aeroporto."
        return mensagem;
    }

    var sigla = document.getElementById(vetor[1]).value;
    if(sigla.length==0) {
        mensagem = "Preencha a sigla do aeroporto."
        return mensagem;
    }
    if(sigla.length<3) {
        mensagem = "A sigla deve ser formada por 3 letras."
        return mensagem;
    }

    var cidade = document.getElementById(vetor[2]).value;
    if(cidade=="0") {
        mensagem = "Selecione a cidade do aeroporto."
        return mensagem;
    }
}

function validaCidade(vetor) {
    console.log(vetor);
    let mensagem = "";

    var nome = document.getElementById(vetor[0]).value;
    if(nome.length==0) {
        mensagem = "Preencha o nome da cidade.";
        return mensagem;
    }

    var estado = document.getElementById(vetor[1]).value;
    if(estado=="0") {
        mensagem = "Selecione o Estado da cidade."
        return mensagem;
    }

    var pais = document.getElementById(vetor[2]).value;
    if(pais.length==0) {
        mensagem = "Preencha o país do Estado.";
        return mensagem;
    }
}

function validaTrecho(vetor) {
    let mensagem = "";

    var nome = document.getElementById(vetor[0]).value;
    if(nome.length==0) {
        mensagem = "Preencha o nome do trecho.";
        return mensagem;
    }

    var origem = document.getElementById(vetor[1]).value;
    if(origem=="0") {
        mensagem = "Preencha a origem do trecho."
        return mensagem;
    }

    var destino = document.getElementById(vetor[2]).value;
    if(destino=="0") {
        mensagem = "Preencha a destino do trecho."
        return mensagem;
    }

    var aeronave = document.getElementById(vetor[3]).value;
    if(aeronave=="0") {
        mensagem = "Preencha a aeronave responsável pelo trecho."
        return mensagem;
    }
}

function validaVoo(vetor) {
    let mensagem = "";

    var codigo = document.getElementById(vetor[0]).value;
    if(codigo.length==0) {
        mensagem = "Preencha o código do voo.";
        return mensagem;
    }
    if(codigo<0) {
        mensagem = "O código digitado é inválido.";
        return mensagem;
    }

    var data = document.getElementById(vetor[1]).value;
    if(data.length==0) {
        mensagem = "Preencha a data do voo";
        return mensagem;
    }

    var formatoData = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!formatoData.test(data)) {
        mensagem = "Formato de data inválido. Use o formato dd/mm/aaaa.";
        return mensagem;
    }

    var horaSaida = document.getElementById(vetor[2]).value;
    if(horaSaida==0) {
        mensagem = "Preencha o horário de saída do voo.";
        return mensagem;
    }

    var formatoHora = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
    if (!formatoHora.test(horaSaida)) {
        mensagem = "Formato de hora de saída inválido. Use o formato hh:mm:ss.";
        return mensagem;
    }

    var horaChegada = document.getElementById(vetor[3]).value;
    if(horaChegada.length==0) {
        mensagem = "Preencha o horário de chegada do voo.";
        return mensagem;
    }

    if (!formatoHora.test(horaChegada)) {
        mensagem = "Formato de hora de chegada inválido. Use o formato hh:mm:ss.";
        return mensagem;
    }

    var valor = document.getElementById(vetor[4]).value;
    if(valor.length==0) {
        mensagem = "Preencha o valor da passagem deste voo em R$."
        return mensagem;
    }
    if(valor<0) {
        mensagem = "Digite um valor válido."
        return mensagem;
    }

    var trecho = document.getElementById(vetor[5]).value;
    if(trecho==0) {
        mensagem = "Preencha o trecho do voo."
        return mensagem;
    }

}