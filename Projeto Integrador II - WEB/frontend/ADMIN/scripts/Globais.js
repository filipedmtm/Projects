// VETORES DE ID DOS LABELS

const vetorIdsLabelAeronave = ["codigoAlterar", "comboFabricantesAlterar", "modeloAlterar", "anoFabAlterar", "totalAssentosAlterar", "referenciaAlterar"];
const vetorIdsLabelCidade = ["codigoCidade", "nomeCidade", "ufCidade", "paisCidade"];
const vetorIdsLabelAeroporto = ["codigoAlterar", "nomeAlterar", "siglaAlterar", "cidadeAlterar"];
const vetorIdsLabelTrecho = ["codAlt", "nomeAlt", "selectOrigemAeroportoAlt", "selectDestinoAeroportoAlt", "selectAeronaveAlt"]
const vetorIdsLabelVoo = ["codigoAlterar", "dataAlterar", "hrSaidaAlterar", "hrChegadaAlterar", "valorAlterar", "trechoAlterar"];

// VETORES DE ID DOS LABELS QUE POSSUEM SELECT 

const vetorDropdownAeroporto = ["cidadeCadastrar", "cidadeAlterar"];
const vetorDropdownAeronave = ["selectAeronaveCad", "selectAeronaveAlt" ];
const vetorDropdownOrigem = ["selectOrigemAeroportoCad","selectOrigemAeroportoAlt"];
const vetorDropdownDestino = ["selectDestinoAeroportoCad", "selectDestinoAeroportoAlt"];
const vetorDropdownTrecho = ["trechoCadastrar", "trechoAlterar"];

/////////////////////////////////////////////////////////////

function limparTabela() {
  const tblBody = document.querySelector("tbody");
  tblBody.innerHTML = ''; // Remove todo o conteúdo da tabela
}


function alternarDivs(divVisivel, divOculta) {
    let divOne = document.getElementById(divVisivel);
    let divTwo = document.getElementById(divOculta);
  
    if (divOne.style.display != 'none') {
      divOne.style.display = 'none';
      divTwo.style.display = 'block';
    }
    limparStatus('statusCadastrar');
    limparStatus('statusAlterar');
    defineAlturaTabela();
  }
  
  function limparStatus(statusToClean) {
    var statusClean = document.getElementById(statusToClean);
    statusClean.textContent = '';
    defineAlturaTabela();
  }
    
  let codigoToUse = null;
  
  function popUpDeletar(codigoCapturado) {
    codigoToUse = codigoCapturado;
    const popup = document.getElementById('popUpDelete');
    popup.showModal();
  }
  
  function fechaPopUpDeletar() {
    const popup = document.getElementById('popUpDelete');
    popup.close();
  }
  
  function exibeCodigo(codigoCapturado, idP) {
    codigoToUse=codigoCapturado;
      var pCodigo = document.getElementById(idP);
      pCodigo.textContent = `${codigoToUse}`;
  }
  
  function preencherAlterar(elemento, vetor) {
    const tdImagem = elemento.parentNode;
    const linha = tdImagem.parentNode;
    const tamanhoLinha = vetor.length;
    console.log(tamanhoLinha);
    const elementosLinha = linha.querySelectorAll('td')
    let elementoPreencher = null;
    for(i=0;i<tamanhoLinha;i++) {
        elementoPreencher = document.getElementById(vetor[i]);
        if(elementosLinha[i].getAttribute('valorRaiz')!=null) { // uma condição para ver se o elemento(exemplo: codigo, nome, cidade) possui o atributo valorRaiz
          // POR QUE O ATRIBUTO É NECESSARIO? EXEMPLO:
          // NA TABELA AEROPORTOS, no campo cidade é exibido o nome da cidade. porém, a atual função de preencher
          // precisa do código da cidade para realizar o alter, e não do nome. então, adicionamos ao nome
          // da cidade um atributo que contém seu respectivo código. Assim, na tabela será exibido o nome da cidade,
          // e o preenchimento do dropdown poderá ser feito com o código (que vem do atributo) para funcionar.
          console.log(elementosLinha[i].getAttribute('valorRaiz')); // caso tenha, mostrar o valor no console (apenas para testes)
          elementoPreencher.value = elementosLinha[i].getAttribute('valorRaiz'); // caso tenha, preencher o respectivo input com o valor do atributo
        }
        else { // caso o elemento não possua o atributo, 
        console.log(elementosLinha[i].textContent);
        elementoPreencher.value = elementosLinha[i].textContent;
        }
    }

  }

  function showStatusMessage(msg, error, idStatus){
    var pStatus = document.getElementById(idStatus);
    if (error === true){
      pStatus.className = "statusError";
    } else {
      pStatus.className = "statusSuccess";
    }
    pStatus.textContent = msg;
    defineAlturaTabela();
  }

  function defineAlturaTabela() {
    var divOne = document.getElementById('divCadastrar');
    let alturaTitulo = 0;
    let alturaForm = 0;

    if (divOne.style.display !== 'none') {
      var titulo = document.getElementById('titleCadastrar');
      alturaTitulo = titulo.offsetHeight;
      var formulario = document.getElementById('formCadastrar');
      alturaForm = formulario.offsetHeight;
    } else {
      var titulo = document.getElementById('titleAlterar');
      alturaTitulo = titulo.offsetHeight;
      var formulario = document.getElementById('formAlterar');
      alturaForm = formulario.offsetHeight;
    }
    const tabela = document.getElementById('cadastros');
    tabela.style.maxHeight = alturaTitulo + alturaForm + 'px';
  }
  
  function preencherSelect(options, vetor, casca) {
    for(i=0;i<vetor.length;i++) {
      const selectDrop = document.getElementById(vetor[i]);
  
      const defaultOption = document.createElement('option');
      defaultOption.value = ''; 
      defaultOption.text = 'Selecione uma opção';
      selectDrop.appendChild(defaultOption);
    
      
      options.forEach(optionValue => {
        console.log("Código Cidade: " + JSON.stringify(optionValue));
        const option = document.createElement('option');
        option.value = optionValue.codigo; 
        option.innerHTML = optionValue[casca]; 
        selectDrop.appendChild(option);
      });
    }
  }

  function lockInput(nomeId) {
    const campo = document.getElementById(nomeId);
    campo.setAttribute('readonly', 'true');
  }
 