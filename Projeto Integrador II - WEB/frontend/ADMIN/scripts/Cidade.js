//CADASTRAR0

function fetchInserir(body) {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    };

    return fetch('http://localhost:3000/inserirCidade', requestOptions)
        .then(response => response.json());
}

function inserirCidade() {

    let msg = validaCidade(vetorCidadeCad);
    if(msg!=undefined) {
        showStatusMessage(msg, true, "statusCadastrar");
        return;
  }

    const nome = document.getElementById("nome").value;
    const uf = document.getElementById("uf").options[document.getElementById("uf").selectedIndex].value;
    const pais = document.getElementById("pais").value;

    fetchInserir({
        nome: nome,
        uf: uf,
        pais: pais,
    })
    .then(customResponse => {
        if (customResponse.status === "SUCCESS") {
            showStatusMessage("Cidade cadastrada com sucesso.", false, "statusCadastrar");
            exibirCidades();
        } else {
            showStatusMessage("Erro ao cadastrar cidade: " + customResponse.message, true, "statusCadastrar");
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

  return fetch('http://localhost:3000/alterarCidade', requestOptions)
      .then(response => response.json());
}

function alterarCidade() {

    let msg = validaCidade(vetorCidadeAlt);
    if(msg!=undefined) {
        showStatusMessage(msg, true, "statusAlterar");
        return;
  }

  const nome = document.getElementById("nomeCidade").value;
  const uf = document.getElementById("ufCidade").options[document.getElementById("ufCidade").selectedIndex].value;
  const pais = document.getElementById("paisCidade").value;
  const codigo = document.getElementById("codigoCidade").value;

  fetchAlterar({
      nome: nome,
      uf: uf,
      pais: pais,
      codigo: codigo
  })
  .then(customResponse => {
      if (customResponse.status === "SUCCESS") {
          showStatusMessage("Cidade alterada com sucesso.", false, "statusAlterar");
          exibirCidades();
      } else {
          showStatusMessage("Erro ao alterar cidade: " + customResponse.message, true, "statusAlterar");
          console.log(customResponse.message);
      }
  })
  .catch((e) => {
      showStatusMessage("Erro técnico ao alterar... Contate o suporte.", true, "statusAlterar");
      console.log("Falha grave ao cadastrar." + e);
  });

}


//EXIBIR0
function RequisiçãoGETcidade() {
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    };
    return fetch('http://localhost:3000/listarCidades', requestOptions)
      .then(T => T.json());
  }
  
  function preencherCidade(Cidade) {
    let linha = 1;
    defineAlturaTabela();
    const tblBody = document.querySelector("tbody");
    Cidade.forEach((Cidade) => {
        const row = document.createElement("tr");
        row.classList.add('tableHover');
        if(linha%2!=0) {
            row.classList.add('zebraOne');
        }
        else {
            row.classList.add('zebraTwo');
        }
        row.innerHTML = `
            <td class=" padRow text-center align-middle">${Cidade.codigo}</td>
            <td class="text-center align-middle">${Cidade.nome}</td>
            <td class="text-center align-middle">${Cidade.uf}</td>
            <td class="text-center align-middle">${Cidade.pais}</td>
            <td class="align-middle"><img class="iconList" src="../../assets/images/lapisicon.png" onclick=" preencherAlterar(this, vetorIdsLabelCidade); lockInput('codigoCidade'); exibeCodigo('${Cidade.codigo}', 'pcodAlter'); alternarDivs('divCadastrar', 'divAlterar');" ></td>
            <td class="align-middle"><img class="iconList" src="../../assets/images/lixeiraicon.png" onclick="alternarDivs('divAlterar', 'divCadastrar'); exibeCodigo('${Cidade.codigo}', 'pcodDelete'); popUpDeletar('${Cidade.codigo}')"></td>
        `;
        linha = linha +1;
        tblBody.appendChild(row);
    });
  }
  

function exibirCidades() {
    limparTabela();
    console.log('Entrou no exibir...');
    RequisiçãoGETcidade()
      .then(customResponse => {
        if (customResponse.status === "SUCCESS") {
          console.log("Deu certo a busca de dados");
          console.log('Payload:' + JSON.stringify(customResponse.payload));
          preencherCidade(customResponse.payload); 
        } else {
          console.log(customResponse.message);
        }
      })
      .catch((e) => {
        console.log("Não foi possível exibir." + e);
      });
  }

  
//DELETAR0
  function deletarCidade(codigo) {
    const requestOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigo: codigo })
    };
  
    fetch('http://localhost:3000/excluirCidade', requestOptions)
        .then(response => response.json())
        .then(customResponse => {
            if (customResponse.status === "SUCCESS") {
                showStatusMessage("Cidade deletada com sucesso.", false, "statusDelete");
                exibirCidades();
            } 
            else {
                if (customResponse.message.includes('ORA-02292')) {
                  showStatusMessage("Você não pode excluir esta cidade, pois atualmente ela está vinculada à outro(s) registro(s). Verifique e tente novamente.", true, "statusDelete");
                } else {
                  showStatusMessage("Erro ao deletar cidade: " + customResponse.message, true, "statusDelete");
                  console.log(customResponse.message);
                }
              }
        })
        .catch((e) => {
            showStatusMessage("Erro técnico ao deletar... Contate o suporte.", true, "statusDelete");
            console.log("Falha grave ao deletar." + e);
        });
  }

  
