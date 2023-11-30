//CADASTRAR0

  function fetchInserir(body) {
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    };

    return fetch('http://localhost:3000/inserirAeronave', requestOptions)
    .then(response => response.json())
    
  }

  function inserirAeronave(){

    let msg = validaAeronave(vetorAeronaveCad);
    if(msg!=undefined) {
        showStatusMessage(msg, true, "statusCadastrar");
        return;
  }

    const fabricante = document.getElementById("comboFabricantesCadastrar").options[document.getElementById("comboFabricantesCadastrar").selectedIndex].value;
    const modelo = document.getElementById("modeloCadastrar").value;
    const anoFab = document.getElementById("anoFabCadastrar").value;
    const referencia = document.getElementById("referenciaCadastrar").value;
    const totalAssentos = document.getElementById("totalAssentosCadastrar").value;

    fetchInserir({
        fabricante: fabricante, 
        modelo: modelo, 
        totalAssentos: totalAssentos,
        anoFabricacao: anoFab,
        referencia: referencia
    })
    .then(customResponse => {
      if(customResponse.status === "SUCCESS"){
        showStatusMessage("Aeronave cadastrada com sucesso! ", false, "statusCadastrar");
        exibirAeronave();
      } else {
        showStatusMessage("Erro ao cadastrar aeronave...: " + customResponse.message, true, "statusCadastrar");
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

    return fetch('http://localhost:3000/alterarAeronave', requestOptions)
    .then(response => response.json())
  }

  function alterarAeronave(){

    let msg = validaAeronave(vetorAeronaveAlt);
    if(msg!=undefined) {
        showStatusMessage(msg, true, "statusAlterar");
        return;
  }


    const fabricante = document.getElementById("comboFabricantesAlterar").options[document.getElementById("comboFabricantesAlterar").selectedIndex].value;
    const modelo = document.getElementById("modeloAlterar").value;
    const anoFab = document.getElementById("anoFabAlterar").value;
    const referencia = document.getElementById("referenciaAlterar").value;
    const totalAssentos = document.getElementById("totalAssentosAlterar").value;
    const codigo = document.getElementById("codigoAlterar").value; 

    fetchAlterar({
        fabricante: fabricante, 
        modelo: modelo, 
        totalAssentos: totalAssentos,
        anoFabricacao: anoFab,
        referencia: referencia,
        codigo: codigo
    })
    .then(customResponse => {
      if(customResponse.status === "SUCCESS"){
        showStatusMessage("Aeronave alterada... ", false, "statusAlterar");
        exibirAeronave();
      } else {
        showStatusMessage("Erro ao alterar aeronave...: " + customResponse.message, true, "statusAlterar");
        console.log(customResponse.message);
      }
    })
    .catch((e)=>{
      showStatusMessage("Erro técnico ao cadastrar... Contate o suporte.", true, "statusAlterar");
      console.log("Falha grave ao cadastrar." + e)
    });
  }

//EXIBIR0

  function RequisiçãoGETaeronave() {
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    };
    return fetch('http://localhost:3000/listarAeronaves', requestOptions)
      .then(T => T.json());
  }
  
  function preencherAeronaves(aeronave) {
    let linha = 1;
    defineAlturaTabela();
    const tblBody = document.querySelector("tbody");
    aeronave.forEach((aeronave) => {
        const row = document.createElement("tr");
        row.classList.add('tableHover');
        if(linha%2!=0) {
            row.classList.add('zebraOne');
        }
        else {
            row.classList.add('zebraTwo');
        }
        row.innerHTML = `
            <td class="padRow text-center align-middle">${aeronave.codigo}</td>
            <td class="text-center align-middle">${aeronave.fabricante}</td>
            <td class="text-center align-middle">${aeronave.modelo}</td>
            <td class="text-center align-middle">${aeronave.anoFabricacao}</td>
            <td class="text-center align-middle">${aeronave.totalAssentos}</td>
            <td class="align-middle">${aeronave.referencia}</td>
            <td class="align-middle"><img class="iconList" src="../../assets/images/lapisicon.png" onclick=" preencherAlterar(this, vetorIdsLabelAeronave); lockInput('codigoAlterar'); exibeCodigo('${aeronave.codigo}', 'pcodAlter'); alternarDivs('divCadastrar', 'divAlterar')" ></td>
            <td class="align-middle"><img class="iconList" src="../../assets/images/lixeiraicon.png" onclick=" alternarDivs('divAlterar', 'divCadastrar'); exibeCodigo('${aeronave.codigo}', 'pcodDelete'); popUpDeletar('${aeronave.codigo}')"></td>
            
        `;
        linha = linha +1;
        tblBody.appendChild(row);
    });
  }
  
  function exibirAeronave() {
    limparTabela();
    console.log('Entrou no exibir...');
    RequisiçãoGETaeronave()
      .then(customResponse => {
        if (customResponse.status === "SUCCESS") {
          console.log("Deu certo a busca de dados");
          console.log('Payload:' + JSON.stringify(customResponse.payload));
          preencherAeronaves(customResponse.payload); 
        } else {
          console.log(customResponse.message);
        }
      })
      .catch((e) => {
        console.log("Não foi possível exibir." + e);
      });
  }


//DELETAR0

function deletarAeronave(codigo) {
  const requestOptions = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ codigo: codigo })
  };

  fetch('http://localhost:3000/excluirAeronave', requestOptions)
      .then(response => response.json())
      .then(customResponse => {
          if (customResponse.status === "SUCCESS") {
              showStatusMessage("Aeronave deletada com sucesso.", false, "statusDelete");
              exibirAeronave();
          } 
          else {
            if (customResponse.message.includes('ORA-02292')) {
              showStatusMessage("Você não pode excluir esta aeronave, pois atualmente ela está vinculada à outro(s) registro(s). Verifique e tente novamente.", true, "statusDelete");
            } else {
              showStatusMessage("Erro ao deletar aeronave: " + customResponse.message, true, "statusDelete");
              console.log(customResponse.message);
            }
          }
      })
      .catch((e) => {
          showStatusMessage("Erro técnico ao deletar... Contate o suporte.", true, "statusDelete");
          console.log("Falha grave ao deletar." + e);
      });
}
