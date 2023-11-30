 // Função para criar o mapa de assentos
 function createSeatMap(assentos) {
     // Número de linhas e colunas
     const rows = 20;
     const cols = 6;
     // Seleciona a Div onde virá o mapa
     const seatMap = document.getElementById('seatMap');
     // Cria o numero de assentos dependendo da quantidade de linhas inseridas a cima
     for (let row = 1; row <= rows; row++) {
         const seatRow = document.createElement('div');
         seatRow.classList.add('my-row');
         seatMap.appendChild(seatRow);
         for (let col = 1; col <= cols; col++) {
             // Cria o espaço entre os assentos 
             if (col === 4) {
                 const space = document.createElement('div');
                 space.classList.add('space');
                 seatRow.appendChild(space);
             }

             const seat = document.createElement('div');
             seat.classList.add('my-seat');
             const assentoIndex = (row - 1) * cols + col - 1;

             if(assentos && assentos[assentoIndex]) {
             seat.innerHTML = `<img id="${assentos[assentoIndex].codigo}" class="my-img" src="../../assets/images/assento-cinza.png">`;
             console.log(`Assento gerado com ID: ${assentos[assentoIndex].codigo}`);
             
             // Adicionar informações do assento como atributos do banco
             seat.setAttribute('data-codigo', assentos[assentoIndex].codigo);
             seat.setAttribute('data-numero', assentos[assentoIndex].numero);
             seat.setAttribute('data-ocupado', assentos[assentoIndex].ocupado);
             // Verifica se o assento está ocupado
             if (assentos[assentoIndex].ocupado === '1') {
                seat.classList.add('occupied');
                const seatImage = seat.querySelector('img');
                seatImage.src = "../../assets/images/assento-vermelho.png";
             }
             seat.addEventListener('click', () => toggleSeatSelection(seat));
             seatRow.appendChild(seat);
            } else {
                seat.innerHTML = `<img class="my-img" src="../../assets/images/assento-cinza.png">`;
            }
         }
     }
}
 // Função para alternar a seleção de assento
function toggleSeatSelection(seat){
     if (!seat.classList.contains('space')) {
         seat.classList.toggle('selected');
         const seatImage = seat.querySelector('img');
         if (seat.classList.contains('selected')) {
             seatImage.src = "../../assets/images/assento-amarelo.png"; // Altere o caminho para a imagem selecionada
         } else {
             seatImage.src = "../../assets/images/assento-cinza.png"; // Altere o caminho para a imagem desselecionada
         }
         updateSelectedSeats();
         obterAssentosSelecionados();
     }
}
// Função para atualizar o assento selecionado na página
function updateSelectedSeats() {
    const selectedSeats = document.querySelectorAll('.my-seat.selected');
    const selectedSeat = document.getElementById('selectedSeat');
    
    // Mapeia os assentos selecionados para seus números
    const selectedSeatNumbers = Array.from(selectedSeats).map(seat => {
        const numeroAssento = seat.getAttribute('data-numero');
        return numeroAssento;
    });

    // Atualiza o conteúdo da página com os números dos assentos selecionados
    selectedSeat.textContent = selectedSeatNumbers.join(', ');
    return selectedSeatNumbers;
}
 
 function obterParametroDaURL(parametro) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(parametro);
}

function obterAssentosSelecionados() {
  const assentosSelecionadosIds = document.querySelectorAll('.my-seat.selected');
  const idsSelecionados = Array.from(assentosSelecionadosIds).map(seat => seat.querySelector('img').id);

  // Adiciona um console.log para exibir os IDs no console
  console.log('IDs dos assentos selecionados:', idsSelecionados);

  return idsSelecionados;
}

// Obter o valor do parâmetro 'nome' da URL
const codigo = obterParametroDaURL('codigo');
const valor = decodeURIComponent(obterParametroDaURL('valor'));
console.log('Codigo:', codigo);
console.log('Valor do voo:', valor);

function RequisiçãoPOSTAssentos(body) {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    };
    return fetch('http://localhost:3000/listarAssentos', requestOptions)
      .then(response => response.json());
  }

  async function selecionarAssentos() {
    const codigo = obterParametroDaURL('codigo');
    
    await RequisiçãoPOSTAssentos({
      voo: codigo,
    })
    .then(customResponse => {
      if (customResponse.status === "SUCCESS") {
        exibirAssentos(customResponse.payload);
      } else {
        console.log(customResponse.message);
      }
    })
    .catch((e) => {
      console.log("Não foi possível buscar." + e);
    });
  }

  function exibirAssentos(assentos) {
    console.log('Entrou no exibir...');
    createSeatMap(assentos);
  }

document.getElementById('voltar').addEventListener('click', function() {
    // Redirecionar para a página BuscaVoo.html
    window.location.href = '../screens/BuscaVoo.html';
});

document.getElementById('buy').addEventListener('click', function() {
    // Obter os valores necessários
    const codigoVoo = obterParametroDaURL('codigo'); 
    const valorVoo = obterParametroDaURL('valor'); 
    const assentosSelecionados = updateSelectedSeats();
    const assentosIds = obterAssentosSelecionados();

    const urlPagamento = `../screens/pagamento.html?codigoVoo=${codigoVoo}&valorVoo=${valorVoo}&assentos=${assentosSelecionados}&assentosIds=${assentosIds}`;

    window.location.href = urlPagamento;
});

