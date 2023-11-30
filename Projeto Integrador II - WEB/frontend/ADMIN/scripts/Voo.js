//CADASTRAR0

function fetchInserir(body) {
  const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
  };

  return fetch('http://localhost:3000/inserirVoo', requestOptions)
      .then(response => response.json());
}

function inserirVoo() {

    let msg = validaVoo(vetorVooCad);
    if(msg!=undefined) {
        showStatusMessage(msg, true, "statusCadastrar");
        return;
  }

  const codigo = document.getElementById("codigoCadastrar").value;
  const hrSaida = document.getElementById("hrSaidaCadastrar").value;
  const hrChegada = document.getElementById("hrChegadaCadastrar").value;
  const dataVoo = document.getElementById("dataCadastrar").value;
  const valor = document.getElementById("valorCadastrar").value;
  const trecho = document.getElementById("trechoCadastrar").options[document.getElementById("trechoCadastrar").selectedIndex].value;

  fetchInserir({
      codigo: codigo,
      dataVoo: dataVoo,
      hrChegada: hrChegada,
      hrSaida: hrSaida,
      valor: valor,
      trecho: trecho,
  })
      .then(customResponse => {
          if (customResponse.status === "SUCCESS") {
              showStatusMessage("Voo cadastrado com sucesso.", false, "statusCadastrar");
              exibirVoos();
          } else {
              showStatusMessage("Erro ao cadastrar voo: " + customResponse.message, true, "statusCadastrar");
              console.log(customResponse.message);
          }
      })
      .catch((e) => {
          showStatusMessage("Erro técnico ao cadastrar... Contate o suporte.", true, "statusCadastrar");
          console.log("Falha grave ao cadastrar." + e);
      });

}


//ALTERAR0 


function fetchAlterar(body) {
  const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
  };

  return fetch('http://localhost:3000/alterarVoo', requestOptions)
      .then(response => response.json());
}

function alterarVoo() {

    let msg = validaVoo(vetorVooAlt);
    if(msg!=undefined) {
        showStatusMessage(msg, true, "statusAlterar");
        return;
  }


  const hrSaida = document.getElementById("hrSaidaAlterar").value;
  const hrChegada = document.getElementById("hrChegadaAlterar").value;
  const dataVoo = document.getElementById("dataAlterar").value;
  const valor = document.getElementById("valorAlterar").value;
  const trecho = document.getElementById("trechoAlterar").options[document.getElementById("trechoAlterar").selectedIndex].value;
  const codigo = document.getElementById("codigoAlterar").value;
  console.log(hrSaida, hrChegada, dataVoo, valor, trecho, codigo);        
  
  fetchAlterar({
      dataVoo: dataVoo,
      hrChegada: hrChegada,
      hrSaida: hrSaida,
      valor: valor,
      trecho: trecho,
      codigo: codigo
  })
      .then(customResponse => {
          if (customResponse.status === "SUCCESS") {
              showStatusMessage("Voo alterado com sucesso.", false, "statusAlterar");
              exibirVoos();
          } else {
              showStatusMessage("Erro ao alterar voo: " + customResponse.message, true, "statusAlterar");
              console.log(customResponse.message);
          }
      })
      .catch((e) => {
          showStatusMessage("Erro técnico ao alterar... Contate o suporte.", true, "statusAlterar");
          console.log("Falha grave ao cadastrar." + e);
      });

    }


//DELETAR0
  
function fetchDeletar(body) {
  const requestOptions = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
  };

  return fetch('http://localhost:3000/excluirVoo', requestOptions)
      .then(response => response.json());
}

function deletarVoo(codigo) {
  const requestOptions = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ codigo: codigo })
  };

  fetch('http://localhost:3000/excluirVoo', requestOptions)
      .then(response => response.json())
      .then(customResponse => {
          if (customResponse.status === "SUCCESS") {
              showStatusMessage("Voo deletado com sucesso.", false, "statusDelete");
              exibirVoos();
          } else {
            if (customResponse.message.includes('ORA-02292')) {
              showStatusMessage("Você não pode excluir este voo, pois atualmente ele está vinculado à outro(s) registro(s). Verifique e tente novamente.", true, "statusDelete");
            } else {
              showStatusMessage("Erro ao deletar voo: " + customResponse.message, true, "statusDelete");
              console.log(customResponse.message);
            }
          }
      })
      .catch((e) => {
          showStatusMessage("Erro técnico ao deletar... Contate o suporte.", true, "statusDelete");
          console.log("Falha grave ao deletar." + e);
      });
}

//EXIBIR0

function RequisiçãoGETlistar() {
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  };
  return fetch('http://localhost:3000/listarDados', requestOptions)
    .then(T => T.json());
}


function preencherVoos(dados) {
  let linha = 1;
  defineAlturaTabela();
  const tblBody = document.querySelector("tbody");

  dados.forEach((voo) => {
      const row = document.createElement("tr");
      row.classList.add('tableHover');
      if(linha%2!=0) {
          row.classList.add('zebraOne');
      }
      else {
          row.classList.add('zebraTwo');
      }
      row.innerHTML = `
          <td class=" padRow text-center align-middle " id="codigo">${voo.codigo}</td>
          <td class="align-middle">${voo.data}</td>
          <td class="align-middle">${voo.hrSaida}</td>
          <td class="align-middle">${voo.hrChegada}</td>
          <td class="align-middle">${voo.valor}</td>
          <td class="align-middle" valorRaiz="${voo.trechoNome}">${voo.trecho}</td>           
          <td class="align-middle">${voo.origem}</td>
          <td class="align-middle">${voo.destino}</td>
          <td class="align-middle"><img class="iconList" src="../../assets/images/lapisicon.png" onclick=" preencherAlterar(this, vetorIdsLabelVoo); exibeCodigo('${voo.codigo}', 'pcodAlter'); alternarDivs('divCadastrar', 'divAlterar')" ></td>
          <td class="align-middle"><img class="iconList" src="../../assets/images/lixeiraicon.png" onclick=" alternarDivs('divAlterar', 'divCadastrar'); exibeCodigo('${voo.codigo}', 'pcodDelete'); popUpDeletar('${voo.codigo}')"></td>
          
      `;
    
      tblBody.appendChild(row);
      linha = linha +1;
  });
}

function exibirVoos() {
  limparTabela();
  console.log('Entrou no exibir...');
  RequisiçãoGETlistar()
    .then(customResponse => {
      if (customResponse.status === "SUCCESS") {
        console.log("Deu certo a busca de dados");
        console.log('Payload:' + JSON.stringify(customResponse.payload));
        preencherVoos(customResponse.payload);
      } else {
        console.log(customResponse.message);
      }
    })
    .catch((e) => {
      console.log("Não foi possível exibir." + e);
    });
}


//SELECT0

function RequisiçãoGETtrecho() {
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  };
  return fetch('http://localhost:3000/listarTrechos', requestOptions)
    .then(T => T.json());
}


function exibirTrechos() {
console.log('Entrou no exibir...');
RequisiçãoGETtrecho()
  .then(customResponse => {
    if (customResponse.status === "SUCCESS") {
      console.log("Deu certo a busca de dados");
      console.log('Payload:' + JSON.stringify(customResponse.payload));
      preencherSelect(customResponse.payload, vetorDropdownTrecho, 'nome');
    } else {
      console.log(customResponse.message);
    }
  })
  .catch((e) => {
    console.log("Não foi possível exibir." + e);
  });
}