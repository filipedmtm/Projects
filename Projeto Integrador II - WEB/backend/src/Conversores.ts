// Neste arquivo conversores, vamos sempre converter uma 
// resposta de consulta do Oracle para um tipo que desejarmos
// portanto o intuito desse arquivo typescript é reunir funções
// que convertam de "linha do oracle" para um array javascript onde
// cada elemento represente um elemento de um tipo. 

import { Aeronave } from "./Campos";
import { Aeroporto } from "./Campos";
import { Trecho } from "./Campos";
import { Voo } from "./Campos";
import { Dados } from "./Campos";
import { Cidade } from "./Campos"
import { Assento } from "./Campos";
import { Passagem } from "./Campos";

export function rowsToPassagens(oracleRows: unknown[] | undefined) : Array<Passagem> {
  let passagens: Array<Passagem> = [];
  let passagem;
  if (oracleRows !== undefined){
    oracleRows.forEach((registro: any) => {
      passagem = {
        codigo: registro.CODIGO,
        nome: registro.NOME,
        email: registro.EMAIL,
        voo: registro.VOO,
        assento: registro.ASSENTO,
      } as Passagem;

      // inserindo o novo Array convertido.
      passagens.push(passagem);
    })
  }
  return passagens;
}

export function rowsToAssentos(oracleRows: unknown[] | undefined) : Array<Assento> {
  let assentos: Array<Assento> = [];
  let assento;
  if (oracleRows !== undefined){
    oracleRows.forEach((registro: any) => {
      assento = {
        codigo: registro.CODIGO,
        numero: registro.NUMERO,
        ocupado: registro.OCUPADO,
        voo: registro.VOO,
      } as Assento;

      // inserindo o novo Array convertido.
      assentos.push(assento);
    })
  }
  return assentos;
}


export function rowsToTrechos(oracleRows: unknown[] | undefined) : Array<Trecho> {
  // vamos converter um array any (resultados do oracle)
  // em um array de Aeronave
  let trechos: Array<Trecho> = [];
  let trecho;
  if (oracleRows !== undefined){
    oracleRows.forEach((registro: any) => {
      trecho = {
        codigo: registro.CODIGO,
        nome: registro.NOME,
        origem: registro.ORIGEM,
        destino: registro.DESTINO,
        aeronave: registro.AERONAVE,
        origemNome: registro.ORIGEM_NOME, // 099 - o novo campo que é o nome do registro
        destinoNome: registro.DESTINO_NOME,
        aeronaveNome: registro.AERO_NOME,
      } as Trecho;

      // inserindo o novo Array convertido.
      trechos.push(trecho);
    })
  }
  return trechos;
}


export function rowsToCidades(oracleRows: unknown[] | undefined) : Array<Cidade> {
  // vamos converter um array any (resultados do oracle)
  // em um array de Aeronave
  let cidades: Array<Cidade> = [];
  let cidade;
  if (oracleRows !== undefined){
    oracleRows.forEach((registro: any) => {
      cidade = {
        codigo: registro.CODIGO,
        nome: registro.NOME,
        uf: registro.UF,
        pais: registro.PAIS,

      } as Cidade;

      // inserindo o novo Array convertido.
      cidades.push(cidade);
    })
  }
  return cidades;
}


export function rowsToAeroportos(oracleRows: unknown[] | undefined) : Array<Aeroporto> {
  // vamos converter um array any (resultados do oracle)
  // em um array de Aeroportos
  let aeroportos: Array<Aeroporto> = [];
  let aeroporto;
  if (oracleRows !== undefined){
    oracleRows.forEach((registro: any) => {
      aeroporto = {
        codigo: registro.CODIGO,
        nome: registro.NOME,
        sigla: registro.SIGLA,
        cidade: registro.CIDADE,
        cidadeNome: registro.CIDADE_NOME, // 099 - o novo campo que é o nome da cidade 
      } as Aeroporto;

      // inserindo o novo Array convertido.
      aeroportos.push(aeroporto);
    })
  }
  return aeroportos;
}

export function rowsToAeronaves(oracleRows: unknown[] | undefined) : Array<Aeronave> {
  // vamos converter um array any (resultados do oracle)
  // em um array de Aeronave
  let aeronaves: Array<Aeronave> = [];
  let aeronave;
  if (oracleRows !== undefined){
    oracleRows.forEach((registro: any) => {
      aeronave = {
        codigo: registro.CODIGO,
        fabricante: registro.FABRICANTE,
        modelo: registro.MODELO,
        anoFabricacao: registro.ANO_FABRICACAO,
        totalAssentos: registro.TOTAL_ASSENTOS,
        referencia: registro.REFERENCIA,
      } as Aeronave;

      // inserindo o novo Array convertido.
      aeronaves.push(aeronave);
    })
  }
  return aeronaves;
}

export function rowsToDados(oracleRows: unknown[] | undefined) : Array<Dados>{
  // vamos converter um array any (resultados do oracle)
  // em um array de Aeronave
  let dados: Array<Dados> = [];
  let dado;
  if (oracleRows !== undefined){
    oracleRows.forEach((registro: any) => {
      dado = {
        codigo: registro.CODIGO,
        data: registro.DATA_VOO,
        trecho: registro.NOME,
        hrSaida: registro.HR_SAIDA,
        hrChegada: registro.HR_CHEGADA,
        origem: registro.ORIGEM,
        destino: registro.DESTINO,
        valor: registro.VALOR,
        trechoNome: registro.TRECHOS_NOME,
      } as Dados;

      // inserindo o novo Array convertido.
      dados.push(dado);
    })
  }
  return dados;
}