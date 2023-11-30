//CADASTRAR0

  function fetchInserir(body) {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    };

    return fetch('http://localhost:3000/inserirTrecho', requestOptions)
        .then(response => response.json());
    }

  function inserirTrecho(){

    let msg = validaTrecho(vetorTrechoCad);
  
    if(msg!=undefined) {
        showStatusMessage(msg, true, "statusCadastrar");
        return;
  }


    const nome = document.getElementById("nomeCad").value;
    const origem = document.getElementById("selectOrigemAeroportoCad").options[document.getElementById("selectOrigemAeroportoCad").selectedIndex].value;
    const destino = document.getElementById("selectDestinoAeroportoCad").options[document.getElementById("selectDestinoAeroportoCad").selectedIndex].value;
    const aeronave = document.getElementById("selectAeronaveCad").options[document.getElementById("selectAeronaveCad").selectedIndex].value;

    fetchInserir({
        nome: nome, 
        origem: origem,
        destino: destino,
        aeronave: aeronave
    })
    .then(customResponse => {
      if(customResponse.status === "SUCCESS"){
        showStatusMessage("Trecho cadastrado com sucesso.", false, "statusCadastrar");
        exibirTrecho();
      } else {
        showStatusMessage("Erro ao cadastrar trecho: " + customResponse.message, true, "statusCadastrar");
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

  return fetch('http://localhost:3000/alterarTrecho', requestOptions)
      .then(response => response.json());
  }


function alterarTrecho(){

  let msg = validaTrecho(vetorTrechoAlt);
  
  if(msg!=undefined) {
      showStatusMessage(msg, true, "statusAlterar");
      return;
}

  const nome = document.getElementById("nomeAlt").value;
  const origem = document.getElementById("selectOrigemAeroportoAlt").options[document.getElementById("selectOrigemAeroportoAlt").selectedIndex].value;
  const destino = document.getElementById("selectDestinoAeroportoAlt").options[document.getElementById("selectDestinoAeroportoAlt").selectedIndex].value;
  const aeronave = document.getElementById("selectAeronaveAlt").options[document.getElementById("selectAeronaveAlt").selectedIndex].value;
  const codigo = document.getElementById("codAlt").value;


  fetchAlterar({
      nome: nome, 
      origem: origem,
      destino: destino,
      aeronave: aeronave,
      codigo: codigo
  })
  .then(customResponse => {
    if(customResponse.status === "SUCCESS"){
      showStatusMessage("Trecho alterado com sucesso.", false, "statusAlterar");
      exibirTrecho();
    } else {
      showStatusMessage("Erro ao alterar trecho: " + customResponse.message, true, "statusAlterar");
      console.log(customResponse.message);
    }
  })
  .catch((e)=>{
    showStatusMessage("Erro técnico ao alterar... Contate o suporte.", true, "statusAlterar");
    console.log("Falha grave ao alterar." + e)
  });

}

//EXIBIR0

function RequisiçãoGETtrecho() {
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  };
  return fetch('http://localhost:3000/listarTrechos', requestOptions)
    .then(T => T.json());
}

function preencherTrechos(trecho) {
  let linha = 1;
  defineAlturaTabela();
  const tblBody = document.querySelector("tbody");
  trecho.forEach((trecho) => {
    const row = document.createElement("tr");
    row.classList.add('tableHover');
    if(linha%2!=0) {
        row.classList.add('zebraOne');
    }
    else {
        row.classList.add('zebraTwo');
    }
      row.innerHTML = `
          <td class="padRow text-center align-middle">${trecho.codigo}</td>
          <td class="text-center align-middle">${trecho.nome}</td>
          <td class="text-center align-middle" valorRaiz="${trecho.origem}">${trecho.origemNome}</td>
          <td class="text-center align-middle" valorRaiz="${trecho.destino}">${trecho.destinoNome}</td>
          <td class="text-center align-middle" valorRaiz="${trecho.aeronave}">${trecho.aeronaveNome}</td>
          <td class="align-middle"><img class="iconList" src="../../assets/images/lapisicon.png" onclick=" preencherAlterar(this, vetorIdsLabelTrecho); lockInput('codAlt'); exibeCodigo('${trecho.codigo}', 'pcodAlter'); alternarDivs('divCadastrar', 'divAlterar')" ></td>
          <td class="align-middle"><img class="iconList" src="../../assets/images/lixeiraicon.png" onclick="alternarDivs('divAlterar', 'divCadastrar');  exibeCodigo('${trecho.codigo}', 'pcodDelete'); popUpDeletar('${trecho.codigo}')"></td>  
      `;

      linha = linha + 1;
      tblBody.appendChild(row);
      
  });
}

function exibirTrecho() {
  limparTabela();
  console.log('Entrou no exibir TRECHOS...');
  RequisiçãoGETtrecho()
    .then(customResponse => {
      if (customResponse.status === "SUCCESS") {
        console.log("Deu certo a busca de dados");
        console.log('Payload:' + JSON.stringify(customResponse.payload));
        preencherTrechos(customResponse.payload); 
      } else {
        console.log(customResponse.message);
      }
    })
    .catch((e) => {
      console.log("Não foi possível exibir." + e);
    });
}


//DELETAR0
function deletartrecho(codigo) {
  const requestOptions = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ codigo: codigo })
  };

  fetch('http://localhost:3000/excluirTrecho', requestOptions)
      .then(response => response.json())
      .then(customResponse => {
          if (customResponse.status === "SUCCESS") {
              showStatusMessage("Trecho deletado com sucesso.", false, "statusDelete");
              exibirTrecho();
          } else {
            if (customResponse.message.includes('ORA-02292')) {
              showStatusMessage("Você não pode excluir este trecho, pois atualmente ele está vinculado à outro(s) registro(s). Verifique e tente novamente.", true, "statusDelete");
            } else {
              showStatusMessage("Erro ao deletar trecho: " + customResponse.message, true, "statusDelete");
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

function RequisiçãoGETaeronave() {
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  };
  return fetch('http://localhost:3000/listarAeronaves', requestOptions)
    .then(T => T.json());
}

function exibirAeronave() {
  console.log('Entrou no exibir AERONAVE...');
  RequisiçãoGETaeronave()
    .then(customResponse => {
      if (customResponse.status === "SUCCESS") {
        console.log("Deu certo a busca de dados");
        console.log('Payload:' + JSON.stringify(customResponse.payload));
        preencherSelect(customResponse.payload, vetorDropdownAeronave, 'modelo');
      } else {
        console.log(customResponse.message);
      }
    })
    .catch((e) => {
      console.log("Não foi possível exibir." + e);
    });
} 



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





