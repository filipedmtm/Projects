// vamos definir um tipo chamado Aeronave. 
// vai representar para nós a estrutura de dados do que é uma aeronave.
// para usarmos esse tipo em qualquer outro código devemos exportá-lo usando a palavra
// export, veja: 

export type Passagem = {
  codigo? : number,
  nome? : string,
  email? : string,
  voo? : number,
  assento? : number,
}

export type Aeronave = {
    codigo?: number, 
    fabricante?: string, 
    modelo?: string,
    anoFabricacao?: number, 
    totalAssentos?: number,
    referencia?: string
  }

export type Aeroporto = {
    codigo?: number, 
    nome?: string, 
    sigla?: string,
    cidade?: string,
    // cidadeNome?: string, // 099 - teve que ser adicionado um novom campo para pegar o nome da cidade referente ao codigo da tabela aeroporto
  }

export type Cidade = {
    codigo?: number,
    nome?: string,
    uf?: string,
    pais?: string,
}

export type Trecho = {
  codigo?: number,
  nome?: string,
  origem?: string,
  destino?: string,
  aeronave?: string,
}

export type Voo =  {
  codigo?: number,
  dataVoo?: string,
  hrChegada?: string,
  hrSaida?: string,
  valor?: number,
  trecho: number,
}

export type Assento = {
  codigo?: number,
  numero?: number,
  ocupado?: string,
  voo?: number,
}

export type Dados = {
  codigo?: number,
  data?: string,
  trecho?: string,
  hrSaida?: string,
  hrChegada?: string,
  origem?: string,
  destino?: string,
  valor?: number,
}