const vetorDropdownOrigem = ["selectOrigemAeroportoCad","selectOrigemAeroportoAlt"];
const vetorDropdownDestino = ["selectDestinoAeroportoCad", "selectDestinoAeroportoAlt"];

document.addEventListener('DOMContentLoaded', function () {
  exibirAeroporto();
});

  // Bloqueia a data de volta caso a passagem seja somente de ida
  const selecionaTipoPassagem = document.getElementById('tipoPassagem');
  const selecionaDataVolta = document.getElementById('dataVolta');

  selecionaTipoPassagem.addEventListener('change', () => {
    if (selecionaTipoPassagem.value == 'somenteIda') {
      selecionaDataVolta.disabled = true;
    } else {
      selecionaDataVolta.disabled = false;
    }
  });
function RequisiçãoGETaeroporto() {
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  };
  return fetch('http://localhost:3000/listarAeroportos', requestOptions)
    .then(T => T.json());
}

function exibirAeroporto() {
  console.log('Entrou no exibir...');
  RequisiçãoGETaeroporto()
    .then(customResponse => {
      if (customResponse.status === "SUCCESS") {
        console.log("Deu certo a busca de dados");
        console.log('Payload:' + JSON.stringify(customResponse.payload));
        preencherSelect(customResponse.payload, vetorDropdownOrigem, 'nome');
        preencherSelect(customResponse.payload, vetorDropdownDestino, 'nome'); 
      } else {
        console.log(customResponse.message);
      }
    })
    .catch((e) => {
      console.log("Não foi possível exibir." + e);
    });
}


function preencherSelect(options, vetor, casca) {
  for(i=0;i<vetor.length;i++) {
    const selectDrop = document.getElementById(vetor[i]);

    if (selectDrop) {
      // Se o elemento existe, prossegue com a manipulação
      selectDrop.innerHTML = '';
  
      const defaultOption = document.createElement('option');
      defaultOption.value = '0';
      defaultOption.text = 'Selecione uma opção';
      selectDrop.appendChild(defaultOption);
      options.forEach(optionValue => {
        console.log("Código: " + JSON.stringify(optionValue));
        const option = document.createElement('option');
        option.value = optionValue.codigo; 
        option.innerHTML = optionValue[casca]; 
        selectDrop.appendChild(option);
      });
  } else {
    console.error(`Elemento com ID ${vetor[i]} não encontrado.`);
  }
}}


function RequisiçãoPOSTDados(body) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  };
  return fetch('http://localhost:3000/listarBuscaVoos', requestOptions)
    .then(response => response.json());
}

async function selecionarVoos() {
  const data = document.getElementById('dataIda').value;
  const origem = document.getElementById('selectOrigemAeroportoCad').options[document.getElementById('selectOrigemAeroportoCad').selectedIndex].text;
  const destino = document.getElementById('selectDestinoAeroportoCad').options[document.getElementById('selectDestinoAeroportoCad').selectedIndex].text;
  // Formatar a data antes de enviar para o backend
  const dataFormatada = new Date(data + "T00:00:00").toLocaleDateString();

  console.log(dataFormatada);
  console.log(origem);
  console.log(destino);
  await RequisiçãoPOSTDados({
    data: dataFormatada,
    origem: origem,
    destino: destino
  })
  .then(customResponse => {
    if (customResponse.status === "SUCCESS") {
      exibirVoos(customResponse.payload);
    } else {
      console.log(customResponse.message);
    }
  })
  .catch((e) => {
    console.log("Não foi possível buscar." + e);
  });
}

function exibirVoos(voos) {
  console.log('Entrou no exibir...');
  preencherTabela(voos);
}

function preencherTabela(voos) {
  const tblBody = document.getElementById('listaVoos');
  tblBody.innerHTML = ""; // Limpar a tabela antes de preenchê-la novamente

  voos.forEach((voo) => {
    const row = document.createElement('tr');
    row.classList.add('tableHover');
    row.innerHTML = `
    <td id="codigo">${voo.codigo}</td>
    <td>${voo.data}</td>
    <td>${voo.trecho}</td>
    <td>${voo.hrSaida}</td>
    <td>${voo.hrChegada}</td>
    <td>${voo.origem}</td>
    <td>${voo.destino}</td>
    <td>${voo.valor}</td>
    <td><a href="../screens/Assentos.html?codigo=${voo.codigo}&valor=${encodeURIComponent(voo.valor)}"><img class="icon-carrinho" src="../../assets/images/carrinho-de-compras.png"></a></td>`;    
    tblBody.appendChild(row);
  });

  if(tblBody.innerHTML == "") {
    alternarDivs('retornoBusca', 'notFound');
    validaCampos();
}
  else {
    alternarDivs('notFound', 'retornoBusca');
  }

function alternarDivs(divVisivel, divOculta) {
  let divOne = document.getElementById(divVisivel);
  let divTwo = document.getElementById(divOculta);

  if (divOne.style.display != 'none') {
    divOne.style.display = 'none';
    divTwo.style.display = 'block';
  }
}


function formatarData(data) {
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();
  return `${dia}/${mes}/${ano}`;
}

function formatarData(data) {
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();
  return `${dia}/${mes}/${ano}`;
}


}

function validaCampos() {
  let msg = "";
  const pMensagem = document.getElementById('pMensagem');
  pMensagem.textContent = "";

  const tipoPass = document.getElementById('tipoPassagem').value;
  console.log(tipoPass);
  if(tipoPass=="0") {
    msg = "Selecione o tipo de passagem.";
    pMensagem.textContent = msg;
    return;
  }

  const dataSaida = document.getElementById('dataIda').value;
  if(dataSaida=='') {
    msg = "Escolha a data de ida para realizar a busca.";
    pMensagem.textContent = msg;
    return;
  }

  const dataChegada = document.getElementById('dataVolta').value;
  if(dataChegada=='' && tipoPass=="idaVolta") {
    msg = "Escolha a data de volta para realizar a busca.";
    pMensagem.textContent = msg;
    return;
  }

  const cidOrigem = document.getElementById('selectOrigemAeroportoCad').value;
  if(cidOrigem=="0") {
    msg = "Selecione a cidade de origem.";
    pMensagem.textContent = msg;
    return;
  }

  const cidDestino = document.getElementById('selectDestinoAeroportoCad').value;
  if(cidDestino=="0") {
    msg = "Selecione a cidade de destino.";
    pMensagem.textContent = msg;
    return;
  }

  pMensagem.textContent = "Nenhum voo encontrado para a busca acima."

}
