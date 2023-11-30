//CADASTRAR0

function fetchInserir(body) {
  const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
  };

  return fetch('http://localhost:3000/inserirAeroporto', requestOptions)
      .then(response => response.json());
  }

function inserirAeroporto(){

  let msg = validaAeroporto(vetorAeroportoCad);
  console.log(msg);
  if(msg!=undefined) {
      showStatusMessage(msg, true, "statusCadastrar");
      return;
}

  const nome = document.getElementById("nomeCadastrar").value;
  const sigla = document.getElementById("siglaCadastrar").value;
  const cidade = document.getElementById("cidadeCadastrar").options[document.getElementById("cidadeCadastrar").selectedIndex].value;

  fetchInserir({ 
      nome: nome, 
      sigla: sigla,
      cidade: cidade
  })
  .then(customResponse => {
    if(customResponse.status === "SUCCESS"){
      showStatusMessage("Aeroporto cadastrado com sucesso.", false, "statusCadastrar");
      exibirAeroporto();
    } else {
      showStatusMessage("Erro ao cadastrar aeroporto: " + customResponse.message, true, "statusCadastrar");
      console.log(customResponse.message);
    }
  })
  .catch((e)=>{
    showStatusMessage("Erro técnico ao cadastrar... Contate o suporte.", true, "statusCadastrar");
    console.log("Falha grave ao cadastrar." + e)
  });

}

//ALTERAR0

function fetchAlterar(body) {
  const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
  };

  return fetch('http://localhost:3000/alterarAeroporto', requestOptions)
      .then(response => response.json());
  }

function alterarAeroporto(){

  let msg = validaAeroporto(vetorAeroportoAlt);
  console.log(msg);
  if(msg!=undefined) {
      showStatusMessage(msg, true, "statusAlterar");
      return;
}

  const nome = document.getElementById("nomeAlterar").value;
  const sigla = document.getElementById("siglaAlterar").value;
  const cidade = document.getElementById("cidadeAlterar").options[document.getElementById("cidadeAlterar").selectedIndex].value;
  const codigo = document.getElementById("codigoAlterar").value;
  
  fetchAlterar({ 
      nome: nome, 
      sigla: sigla,
      cidade: cidade,
      codigo: codigo
  })
  .then(customResponse => {
    if(customResponse.status === "SUCCESS"){
      showStatusMessage("Aeroporto alterado com sucesso.", false, "statusAlterar");
      exibirAeroporto();
    } else {
      showStatusMessage("Erro ao alterar aeroporto: " + customResponse.message, true, "statusAlterar");
      console.log(customResponse.message);
    }
  })
  .catch((e)=>{
    showStatusMessage("Erro técnico ao alterar... Contate o suporte.", true, "statusAlterar");
    console.log("Falha grave ao alterar." + e)
  });

}

//EXIBIR0

function RequisiçãoGETaeroportoTable() {
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  };
  return fetch('http://localhost:3000/listarAeroportos', requestOptions)
    .then(T => T.json());
}


function preencherAeroportos(aeroportos) {
  let linha = 1;
  defineAlturaTabela();
  const tblBody = document.querySelector("tbody");
  aeroportos.forEach((aeroporto) => {
    const row = document.createElement("tr");
    row.classList.add('tableHover');
    if (linha % 2 != 0) {
      row.classList.add('zebraOne');
    } else {
      row.classList.add('zebraTwo');
    }


    row.innerHTML += `
      <td class="padRow text-center align-middle">${aeroporto.codigo}</td>
      <td class="text-center align-middle">${aeroporto.nome}</td>
      <td class="text-center align-middle">${aeroporto.sigla}</td>
      <td class="text-center align-middle" valorRaiz="${aeroporto.cidade}">${aeroporto.cidadeNome}</td>
      <td class="align-middle"><img class="iconList" src="../../assets/images/lapisicon.png" onclick=" preencherAlterar(this, vetorIdsLabelAeroporto); lockInput('codigoAlterar'); exibeCodigo('${aeroporto.codigo}', 'pcodAlter'); alternarDivs('divCadastrar', 'divAlterar')" ></td>
      <td class="align-middle"><img class="iconList" src="../../assets/images/lixeiraicon.png" onclick="alternarDivs('divAlterar', 'divCadastrar');  exibeCodigo('${aeroporto.codigo}', 'pcodDelete'); popUpDeletar('${aeroporto.codigo}')"></td>
    `;


    linha = linha + 1;
    tblBody.appendChild(row);
  });
}

function exibirAeroporto() {
  limparTabela();
  console.log('Entrou no exibir...');
  RequisiçãoGETaeroportoTable()
    .then(customResponse => {
      if (customResponse.status === "SUCCESS") {
        console.log("Deu certo a busca de dados");
        console.log('Payload:' + JSON.stringify(customResponse.payload));
        preencherAeroportos(customResponse.payload); 
      } else {
        console.log(customResponse.message);
      }
    })
    .catch((e) => {
      console.log("Não foi possível exibir." + e);
    });
}


//DELETAR0
function deletarAeroporto(codigo) {
  const requestOptions = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ codigo: codigo })
  };

  fetch('http://localhost:3000/excluirAeroporto', requestOptions)
      .then(response => response.json())
      .then(customResponse => {
          if (customResponse.status === "SUCCESS") {
              showStatusMessage("Aeroporto deletada com sucesso.", false, "statusDelete");
              exibirAeroporto();
          } else {
            if (customResponse.message.includes('ORA-02292')) {
              showStatusMessage("Você não pode excluir este aeroporto, pois atualmente ele está vinculado à outro(s) registro(s). Verifique e tente novamente.", true, "statusDelete");
            } else {
              showStatusMessage("Erro ao deletar aeroporto: " + customResponse.message, true, "statusDelete");
              console.log(customResponse.message);
            }
          }
      })
      .catch((e) => {
          showStatusMessage("Erro técnico ao deletar... Contate o suporte.", true, "statusDelete");
          console.log("Falha grave ao deletar." + e);
      });
}

//SELECT0

function RequisiçãoGETcidade() {
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  };
  return fetch('http://localhost:3000/listarCidades', requestOptions)
    .then(T => T.json());
}



function exibirCidades() {
  console.log('Entrou no exibir...');
  RequisiçãoGETcidade()
    .then(customResponse => {
      if (customResponse.status === "SUCCESS") {
        console.log("Deu certo a busca de dados");
        console.log('Payload:' + JSON.stringify(customResponse.payload));
        preencherSelect(customResponse.payload, vetorDropdownAeroporto, 'nome');
      } else {
        console.log(customResponse.message);
      }
    })
    .catch((e) => {
      console.log("Não foi possível exibir." + e);
    });
}