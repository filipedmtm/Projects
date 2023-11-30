/***
 * Versão melhorada do backend. 
 * 
 * 1 - externalização da constante oraConnAttribs (pois é usada em todos os serviços);
 * O processo de externalizar é tirar aquela constante de dentro de cada serviço e colocá-la na área "global"
 * 
 * 2 - criação de um tipo estruturado chamado aeronave.
 * 
 * 3 - criação de uma função para validar se os dados da aeronave existem.
 * 
 * 4 - retorno correto do array em JSON para representar as AERONAVES cadastradas. 
 * 
 */
// recursos/modulos necessarios.
import express from "express";
import oracledb from "oracledb";
import cors from "cors";

// aqui vamos importar nossos tipos para organizar melhor (estao em arquivos .ts separados)
import { CustomResponse } from "./CustomResponse";
import { Aeronave, Dados, Passagem } from "./Campos";
import { Trecho } from "./Campos";
import { Cidade } from "./Campos";
import { Aeroporto } from "./Campos";
import { Voo } from "./Campos";
import { Assento } from "./Campos";


// criamos um arquivo para conter só a constante de conexão do oracle. com isso deixamos o código mais limpo por aqui
import { oraConnAttribs } from "./OracleConnAtribs";

// conversores para facilitar o trabalho de conversão dos resultados Oracle para vetores de tipos nossos.
import { rowsToAeronaves, rowsToAeroportos, rowsToAssentos, rowsToCidades, rowsToDados, rowsToTrechos, rowsToPassagens } from "./Conversores";

// validadores para facilitar o trabalho de validação.
import { aeronaveValida, aeroportoValida, trechoValida, vooValida, cidadeValida } from "./Validadores";


// preparar o servidor web de backend na porta 3000
const app = express();
const port = 3000;
// preparar o servidor para dialogar no padrao JSON 
app.use(express.json());
app.use(cors());

// Acertando a saída dos registros oracle em array puro javascript.
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

// Listar Trechos
app.get("/listarTrechos", async(req,res)=>{

  let cr: CustomResponse = {status: "ERROR", message: "", payload: undefined,};
  let connection;
  try{
    connection = await oracledb.getConnection(oraConnAttribs);

    // atenção: mudamos a saída para que o oracle entregue um objeto puro em JS no rows.
    // não mais um array dentro de array.
    let resultadoConsulta = await connection.execute(`SELECT TRECHOS.CODIGO, TRECHOS.NOME, TRECHOS.ORIGEM, TRECHOS.DESTINO, ORIGEM.NOME AS ORIGEM_NOME, DESTINO.NOME AS DESTINO_NOME, AERONAVES.REFERENCIA AS AERO_NOME, AERONAVES.CODIGO AS AERONAVE
    FROM TRECHOS 
    INNER JOIN AEROPORTOS ORIGEM ON TRECHOS.ORIGEM = ORIGEM.CODIGO
    INNER JOIN AEROPORTOS DESTINO ON TRECHOS.DESTINO = DESTINO.CODIGO
    INNER JOIN AERONAVES ON TRECHOS.AERONAVE = AERONAVES.CODIGO
    ORDER BY LOWER (TRECHOS.NOME) ASC`);
  
    // 099 - OBS: TRECHOS.ORIGEM teve que ser adicionado ao select acima /\ mesmo que nao apareça na tabela para poder preencher o formulário

    cr.status = "SUCCESS"; 
    cr.message = "Dados obtidos";

    cr.payload = (rowsToTrechos(resultadoConsulta.rows));


  }catch(e){
    if(e instanceof Error){
      cr.message = e.message;
      console.log(e.message);
    }else{
      cr.message = "Erro ao conectar ao oracle. Sem detalhes";
    }
  } finally {
    if(connection !== undefined){
      await connection.close();
    }
    res.send(cr);  
  }
});

app.post("/listarBuscaVoos", async(req,res)=>{
  const dado = req.body as Dados;
  let cr: CustomResponse = {status: "ERROR", message: "", payload: undefined,};
  let connection;
  try{
    const cmdSelectDados = `SELECT VOOS.CODIGO, TO_CHAR(VOOS.DATA_VOO, 'dd/mm/yyyy') AS DATA_VOO, TRECHOS.NOME, TO_CHAR(VOOS.HR_SAIDA, 'HH24:MI') AS HR_SAIDA, TO_CHAR(VOOS.HR_CHEGADA, 'HH24:MI') AS HR_CHEGADA, ORIGEM.NOME AS ORIGEM, DESTINO.NOME AS DESTINO, VOOS.VALOR
    FROM VOOS 
    INNER JOIN TRECHOS ON VOOS.TRECHO = TRECHOS.CODIGO 
    INNER JOIN AEROPORTOS ORIGEM ON TRECHOS.ORIGEM = ORIGEM.CODIGO
    INNER JOIN AEROPORTOS DESTINO ON TRECHOS.DESTINO = DESTINO.CODIGO
    WHERE TO_CHAR(DATA_VOO, 'dd/mm/yyyy') = :1 AND ORIGEM.NOME = :2 AND DESTINO.NOME = :3`
    const dados = [dado.data, dado.origem, dado.destino];

    connection = await oracledb.getConnection(oraConnAttribs);
    let resSelect = await connection.execute(cmdSelectDados, dados);
    cr.status = "SUCCESS"; 
    cr.message = "Dados obtidos";

    cr.payload = (rowsToDados(resSelect.rows));


  }catch(e){
    if(e instanceof Error){
      cr.message = e.message;
      console.log(e.message);
    }else{
      cr.message = "Erro ao conectar ao oracle. Sem detalhes";
    }
  } finally {
    if(connection !== undefined){
      await connection.close();
    }
    res.send(cr);  
  }
});

app.post("/listarAssentos", async(req,res)=>{
  const assento = req.body as Assento;
  let cr: CustomResponse = {status: "ERROR", message: "", payload: undefined,};
  let connection;
  try{
    const cmdSelectDados = `SELECT CODIGO, NUMERO, OCUPADO, VOO FROM ASSENTOS WHERE VOO = :1`;
    const assentos = [assento.voo];

    connection = await oracledb.getConnection(oraConnAttribs);
    let resSelect = await connection.execute(cmdSelectDados, assentos);
    cr.status = "SUCCESS";
    cr.message = "Dados obtidos";

    cr.payload = (rowsToAssentos(resSelect.rows));
  }catch(e){
    if(e instanceof Error){
      cr.message = e.message;
      console.log(e.message);
    }else{
      cr.message = "Erro ao conectar ao oracle. Sem detalhes";
    }
  } finally {
    if(connection !== undefined){
      await connection.close();
    }
    res.send(cr);  
  }
});
// Listar Cidades
app.get("/listarCidades", async(req,res)=>{

  let cr: CustomResponse = {status: "ERROR", message: "", payload: undefined,};
  let connection;
  try{
    connection = await oracledb.getConnection(oraConnAttribs);

    // atenção: mudamos a saída para que o oracle entregue um objeto puro em JS no rows.
    // não mais um array dentro de array.
    let resultadoConsulta = await connection.execute(`
    SELECT CODIGO, NOME, UF, PAIS FROM CIDADES
    ORDER BY LOWER (NOME) ASC`);
  
    cr.status = "SUCCESS"; 
    cr.message = "Dados obtidos";

    cr.payload = (rowsToCidades(resultadoConsulta.rows));


  }catch(e){
    if(e instanceof Error){
      cr.message = e.message;
      console.log(e.message);
    }else{
      cr.message = "Erro ao conectar ao oracle. Sem detalhes";
    }
  } finally {
    if(connection !== undefined){
      await connection.close();
    }
    res.send(cr);  
  }
});


// Listar Aeronaves
app.get("/listarAeronaves", async(req,res)=>{

  let cr: CustomResponse = {status: "ERROR", message: "", payload: undefined,};
  let connection;
  try{
    connection = await oracledb.getConnection(oraConnAttribs);

    // atenção: mudamos a saída para que o oracle entregue um objeto puro em JS no rows.
    // não mais um array dentro de array.
    let resultadoConsulta = await connection.execute(`
    SELECT CODIGO, FABRICANTE, MODELO, ANO_FABRICACAO, TOTAL_ASSENTOS, REFERENCIA FROM AERONAVES
    ORDER BY LOWER (REFERENCIA) ASC`);
  
    cr.status = "SUCCESS"; 
    cr.message = "Dados obtidos";

    cr.payload = (rowsToAeronaves(resultadoConsulta.rows));


  }catch(e){
    if(e instanceof Error){
      cr.message = e.message;
      console.log(e.message);
    }else{
      cr.message = "Erro ao conectar ao oracle. Sem detalhes";
    }
  } finally {
    if(connection !== undefined){
      await connection.close();
    }
    res.send(cr);  
  }
});

app.get("/listarAeroportos", async(req,res)=>{

  let cr: CustomResponse = {status: "ERROR", message: "", payload: undefined,};
  let connection;
  try{
    connection = await oracledb.getConnection(oraConnAttribs);

    // atenção: mudamos a saída para que o oracle entregue um objeto puro em JS no rows.
    // não mais um array dentro de array.
    let resultadoConsulta = await connection.execute(`
    SELECT AEROPORTOS.CODIGO, AEROPORTOS.NOME, AEROPORTOS.SIGLA, AEROPORTOS.CIDADE, CIDADES.NOME AS CIDADE_NOME
    FROM AEROPORTOS
    INNER JOIN CIDADES ON AEROPORTOS.CIDADE = CIDADES.CODIGO
    ORDER BY LOWER (AEROPORTOS.NOME) ASC`);

    // 099 - OBS: AEROPORTOS.CIDADE teve que ser adicionado ao select acima /\ mesmo que nao apareça na tabela 

    // let resultadoConsulta = await connection.execute(`
    // SELECT CODIGO, NOME, SIGLA, CIDADE FROM AEROPORTOS`);
  
  
    cr.status = "SUCCESS"; 
    cr.message = "Dados obtidos";

    cr.payload = (rowsToAeroportos(resultadoConsulta.rows));

  }catch(e){
    if(e instanceof Error){
      cr.message = e.message;
      console.log(e.message);
    }else{
      cr.message = "Erro ao conectar ao oracle. Sem detalhes";
    }
  } finally {
    if(connection !== undefined){
      await connection.close();
    }
    res.send(cr);  
  }
});


// servicos de backend
app.get("/listarDados", async(req,res)=>{

  let cr: CustomResponse = {status: "ERROR", message: "", payload: undefined,};
  let connection;
  try{
    connection = await oracledb.getConnection(oraConnAttribs);

    // atenção: mudamos a saída para que o oracle entregue um objeto puro em JS no rows.
    // não mais um array dentro de array.
    let resultadoConsulta = await connection.execute(`
    SELECT VOOS.CODIGO, TO_CHAR(VOOS.DATA_VOO, 'dd/mm/yyyy') AS DATA_VOO, TRECHOS.CODIGO AS TRECHOS_NOME, TRECHOS.NOME, TO_CHAR(VOOS.HR_SAIDA, 'HH24:MI:SS') AS HR_SAIDA, TO_CHAR(VOOS.HR_CHEGADA, 'HH24:MI:SS') AS HR_CHEGADA, ORIGEM.NOME AS ORIGEM, DESTINO.NOME AS DESTINO, VOOS.VALOR
    FROM VOOS 
    INNER JOIN TRECHOS ON VOOS.TRECHO = TRECHOS.CODIGO 
    INNER JOIN AEROPORTOS ORIGEM ON TRECHOS.ORIGEM = ORIGEM.CODIGO
    INNER JOIN AEROPORTOS DESTINO ON TRECHOS.DESTINO = DESTINO.CODIGO`);
    

    cr.status = "SUCCESS"; 
    cr.message = "Dados obtidos";
    // agora sempre vamos converter as linhas do oracle em resultados do nosso TIPO.
    //cr.payload = (rowsToAeronaves(resultadoConsulta.rows));
    cr.payload = (rowsToDados(resultadoConsulta.rows));


  }catch(e){
    if(e instanceof Error){
      cr.message = e.message;
      console.log(e.message);
    }else{
      cr.message = "Erro ao conectar ao oracle. Sem detalhes";
    }
  } finally {
    if(connection !== undefined){
      await connection.close();
    }
    res.send(cr);  
  }
});

app.put("/inserirAeronave", async(req,res)=>{
  
  // definindo um objeto de resposta.
  let cr: CustomResponse = {
    status: "ERROR",
    message: "",
    payload: undefined,
  };

  // UAU! Agora com um tipo definido podemos simplesmente converter tudo que 
  // chega na requisição para um tipo nosso!
  const aero: Aeronave = req.body as Aeronave;
  console.log(aero);

  // antes de prosseguir, vamos validar a aeronave!
  // se não for válida já descartamos.
  let [valida, mensagem] = aeronaveValida(aero);
  if(!valida) {
    // já devolvemos a resposta com o erro e terminamos o serviço.
    cr.message = mensagem;
    res.send(cr);
  } else {
    // continuamos o processo porque passou na validação.
    let connection;
    try{
      const cmdInsertAero = `INSERT INTO AERONAVES 
      (CODIGO, FABRICANTE, MODELO, ANO_FABRICACAO, TOTAL_ASSENTOS, REFERENCIA)
      VALUES
      (SEQ_AERONAVES.NEXTVAL, :1, :2, :3, :4, :5)`
      const dados = [aero.fabricante, aero.modelo, aero.anoFabricacao, aero.totalAssentos, aero.referencia];
  
      connection = await oracledb.getConnection(oraConnAttribs);
      let resInsert = await connection.execute(cmdInsertAero, dados);
      
      // importante: efetuar o commit para gravar no Oracle.
      await connection.commit();
    
      // obter a informação de quantas linhas foram inseridas. 
      // neste caso precisa ser exatamente 1
      const rowsInserted = resInsert.rowsAffected
      if(rowsInserted !== undefined &&  rowsInserted === 1) {
        cr.status = "SUCCESS"; 
        cr.message = "Aeronave inserida.";
      }
  
    }catch(e){
      if(e instanceof Error){
        cr.message = e.message;
        console.log(e.message);
      }else{
        cr.message = "Erro ao conectar ao oracle. Sem detalhes";
      }
    } finally {
      //fechar a conexao.
      if(connection!== undefined){
        await connection.close();
      }
      res.send(cr);  
    }  
  }
});

app.put("/inserirAeroporto", async(req,res)=>{
  
    // definindo um objeto de resposta.
    let cr: CustomResponse = {
      status: "ERROR",
      message: "",
      payload: undefined,
    };
  
    // UAU! Agora com um tipo definido podemos simplesmente converter tudo que 
    // chega na requisição para um tipo nosso!
    const aero: Aeroporto = req.body as Aeroporto;
    console.log(aero);
      let connection;
      try{
        const cmdInsertAero = `INSERT INTO AEROPORTOS 
        (CODIGO, NOME, SIGLA, CIDADE)
        VALUES
        (SEQ_AEROPORTOS.NEXTVAL, :1, :2, :3)`
        const dados = [aero.nome, aero.sigla, aero.cidade];
    
        connection = await oracledb.getConnection(oraConnAttribs);
        let resInsert = await connection.execute(cmdInsertAero, dados);
        
        // importante: efetuar o commit para gravar no Oracle.
        await connection.commit();
      
        // obter a informação de quantas linhas foram inseridas. 
        // neste caso precisa ser exatamente 1
        const rowsInserted = resInsert.rowsAffected
        if(rowsInserted !== undefined &&  rowsInserted === 1) {
          cr.status = "SUCCESS"; 
          cr.message = "Aeroporto inserido.";
        }
    
      }catch(e){
        if(e instanceof Error){
          cr.message = e.message;
          console.log(e.message);
        }else{
          cr.message = "Erro ao conectar ao oracle. Sem detalhes";
        }
      } finally {
        //fechar a conexao.
        if(connection!== undefined){
          await connection.close();
        }
        res.send(cr);  
      }  
  });

  app.put("/inserirPassagem", async(req,res)=>{
  
    // definindo um objeto de resposta.
    let cr: CustomResponse = {
      status: "ERROR",
      message: "",
      payload: undefined,
    };
  
    // UAU! Agora com um tipo definido podemos simplesmente converter tudo que 
    // chega na requisição para um tipo nosso!
    const ticket: Passagem = req.body as Passagem;
    console.log(ticket);
      let connection;
      try{
        const cmdInsertTicket = `INSERT INTO PASSAGENS (CODIGO, NOME, EMAIL, VOO, ASSENTO)
        VALUES (SEQ_PASSAGENS.NEXTVAL, :1, :2, :3, :4)`
        const dados = [ticket.nome, ticket.email, ticket.voo, ticket.assento];
    
        connection = await oracledb.getConnection(oraConnAttribs);
        let resInsert = await connection.execute(cmdInsertTicket, dados);
        
        // importante: efetuar o commit para gravar no Oracle.
        await connection.commit();
      
        // obter a informação de quantas linhas foram inseridas. 
        // neste caso precisa ser exatamente 1
        const rowsInserted = resInsert.rowsAffected
        if(rowsInserted !== undefined &&  rowsInserted === 1) {
          cr.status = "SUCCESS"; 
          cr.message = "Passagem inserida.";
        }
    
      }catch(e){
        if(e instanceof Error){
          cr.message = e.message;
          console.log(e.message);
        }else{
          cr.message = "Erro ao conectar ao oracle. Sem detalhes";
        }
      } finally {
        //fechar a conexao.
        if(connection!== undefined){
          await connection.close();
        }
        res.send(cr);  
      }  
  });

  app.put("/inserirTrecho", async(req,res)=>{
  
    // definindo um objeto de resposta.
    let cr: CustomResponse = {
      status: "ERROR",
      message: "",
      payload: undefined,
    };
  
    // UAU! Agora com um tipo definido podemos simplesmente converter tudo que 
    // chega na requisição para um tipo nosso!
    const trecho: Trecho = req.body as Trecho;
    console.log(trecho);
  
      let connection;
      try{
        const cmdInsertAero = `INSERT INTO TRECHOS 
        (CODIGO, NOME, ORIGEM, DESTINO, AERONAVE)
        VALUES
        (SEQ_TRECHOS.NEXTVAL, :1, :2, :3, :4)`
        const dados = [trecho.nome, trecho.origem, trecho.destino, trecho.aeronave];
    
        connection = await oracledb.getConnection(oraConnAttribs);
        let resInsert = await connection.execute(cmdInsertAero, dados);
        
        // importante: efetuar o commit para gravar no Oracle.
        await connection.commit();
      
        // obter a informação de quantas linhas foram inseridas. 
        // neste caso precisa ser exatamente 1
        const rowsInserted = resInsert.rowsAffected
        if(rowsInserted !== undefined &&  rowsInserted === 1) {
          cr.status = "SUCCESS"; 
          cr.message = "Trecho inserido.";
        }
    
      }catch(e){
        if(e instanceof Error){
          cr.message = e.message;
          console.log(e.message);
        }else{
          cr.message = "Erro ao conectar ao oracle. Sem detalhes";
        }
      } finally {
        //fechar a conexao.
        if(connection!== undefined){
          await connection.close();
        }
        res.send(cr);  
      }  
  });

  app.put("/inserirVoo", async(req,res)=>{
  
    // definindo um objeto de resposta.
    let cr: CustomResponse = {
      status: "ERROR",
      message: "",
      payload: undefined,
    };
  
    // UAU! Agora com um tipo definido podemos simplesmente converter tudo que 
    // chega na requisição para um tipo nosso!
    const voo: Voo = req.body as Voo;
    console.log(voo);
  
      let connection;
      try{
        const cmdInsertAero = `INSERT INTO VOOS
        (CODIGO, DATA_VOO, HR_CHEGADA, HR_SAIDA, VALOR, TRECHO)
        VALUES
        (:1, TO_DATE(:2, 'dd/mm/yyyy'), TO_DATE(:3, 'hh24:mi:ss'),  
        TO_DATE(:4, 'hh24:mi:ss'), :5, :6)`
        const dados = [voo.codigo, voo.dataVoo, voo.hrChegada, voo.hrSaida, voo.valor, voo.trecho];
    
        connection = await oracledb.getConnection(oraConnAttribs);
        let resInsert = await connection.execute(cmdInsertAero, dados);
        
        // importante: efetuar o commit para gravar no Oracle.
        await connection.commit();
      
        // obter a informação de quantas linhas foram inseridas. 
        // neste caso precisa ser exatamente 1
        const rowsInserted = resInsert.rowsAffected
        if(rowsInserted !== undefined &&  rowsInserted === 1) {
          cr.status = "SUCCESS"; 
          cr.message = "Voo inserido.";
        }
    
      }catch(e){
        if(e instanceof Error){
          cr.message = e.message;
          console.log(e.message);
        }else{
          cr.message = "Erro ao conectar ao oracle. Sem detalhes";
        }
      } finally {
        //fechar a conexao.
        if(connection!== undefined){
          await connection.close();
        }
        res.send(cr);  
      }  
  });

  app.put("/inserirCidade", async(req,res)=>{
  
    // definindo um objeto de resposta.
    let cr: CustomResponse = {
      status: "ERROR",
      message: "",
      payload: undefined,
    };
  
    // UAU! Agora com um tipo definido podemos simplesmente converter tudo que 
    // chega na requisição para um tipo nosso!
    const cidade: Cidade = req.body as Cidade;
    console.log();
  
      // continuamos o processo porque passou na validação.
      let connection;
      try{
        const cmdInsertAero = `INSERT INTO CIDADES
        (CODIGO, NOME, UF, PAIS)
        VALUES
        (SEQ_CIDADES.NEXTVAL, :1, :2, :3)`
        const dados = [cidade.nome, cidade.uf, cidade.pais];
    
        connection = await oracledb.getConnection(oraConnAttribs);
        let resInsert = await connection.execute(cmdInsertAero, dados);
        
        // importante: efetuar o commit para gravar no Oracle.
        await connection.commit();
      
        // obter a informação de quantas linhas foram inseridas. 
        // neste caso precisa ser exatamente 1
        const rowsInserted = resInsert.rowsAffected
        if(rowsInserted !== undefined &&  rowsInserted === 1) {
          cr.status = "SUCCESS"; 
          cr.message = "Cidade inserida.";
        }
    
      }catch(e){
        if(e instanceof Error){
          cr.message = e.message;
          console.log(e.message);
        }else{
          cr.message = "Erro ao conectar ao oracle. Sem detalhes";
        }
      } finally {
        //fechar a conexao.
        if(connection!== undefined){
          await connection.close();
        }
        res.send(cr);  
      }  
  });

  app.delete("/excluirVoo", async(req,res)=>{
  // excluindo o voo pelo código dele:
  const codigo = req.body.codigo as number;
 
  console.log('Codigo recebido: ' + codigo);

  // definindo um objeto de resposta.
  let cr: CustomResponse = {
    status: "ERROR",
    message: "",
    payload: undefined,
  };

  // conectando 
  let connection;
  try{
    connection = await oracledb.getConnection(oraConnAttribs);
    const cmdDeleteAero = `DELETE VOOS WHERE codigo = :1`
    const dados = [codigo];

    let resDelete = await connection.execute(cmdDeleteAero, dados);
    
    // importante: efetuar o commit para gravar no Oracle.
    await connection.commit();
    
    // obter a informação de quantas linhas foram inseridas. 
    // neste caso precisa ser exatamente 1
    const rowsDeleted = resDelete.rowsAffected
    if(rowsDeleted !== undefined &&  rowsDeleted === 1) {
      cr.status = "SUCCESS"; 
      cr.message = "Voo excluído.";
    }else{
      cr.message = "Voo não excluído. Verifique se o código informado está correto.";
    }

  }catch(e){
    if(e instanceof Error){
      cr.message = e.message;
      console.log(e.message);
    }else{
      cr.message = "Erro ao conectar ao oracle. Sem detalhes";
    }
  } finally {
    // fechando a conexao
    if(connection!==undefined)
      await connection.close();

    // devolvendo a resposta da requisição.
    res.send(cr);  
  }
});


app.delete("/excluirAeronave", async(req,res)=>{
  // excluindo a aeronave pelo código dela:
  const codigo = req.body.codigo as number;
 
  console.log('Codigo recebido: ' + codigo);

  // definindo um objeto de resposta.
  let cr: CustomResponse = {
    status: "ERROR",
    message: "",
    payload: undefined,
  };

  // conectando 
  let connection;
  try{
    connection = await oracledb.getConnection(oraConnAttribs);
    const cmdDeleteAero = `DELETE AERONAVES WHERE codigo = :1`
    const dados = [codigo];

    let resDelete = await connection.execute(cmdDeleteAero, dados);
    
    // importante: efetuar o commit para gravar no Oracle.
    await connection.commit();
    
    // obter a informação de quantas linhas foram inseridas. 
    // neste caso precisa ser exatamente 1
    const rowsDeleted = resDelete.rowsAffected
    if(rowsDeleted !== undefined &&  rowsDeleted === 1) {
      cr.status = "SUCCESS"; 
      cr.message = "Aeronave excluída.";
    }else{
      cr.message = "Aeronave não excluído. Verifique se o código informado está correto.";
    }

  }catch(e){
    if(e instanceof Error){
      cr.message = e.message;
      console.log(e.message);
    }else{
      cr.message = "Erro ao conectar ao oracle. Sem detalhes";
    }
  } finally {
    // fechando a conexao
    if(connection!==undefined)
      await connection.close();

    // devolvendo a resposta da requisição.
    res.send(cr);  
  }
});


app.delete("/excluirAeroporto", async(req,res)=>{
  // excluindo o aeroporto pelo código dele:
  const codigo = req.body.codigo as number;
 
  console.log('Codigo recebido: ' + codigo);

  // definindo um objeto de resposta.
  let cr: CustomResponse = {
    status: "ERROR",
    message: "",
    payload: undefined,
  };

  // conectando 
  let connection;
  try{
    connection = await oracledb.getConnection(oraConnAttribs);
    const cmdDeleteAeroporto = `DELETE AEROPORTOS WHERE codigo = :1`
    const dados = [codigo];

    let resDelete = await connection.execute(cmdDeleteAeroporto, dados);
    
    // importante: efetuar o commit para gravar no Oracle.
    await connection.commit();
    
    // obter a informação de quantas linhas foram inseridas. 
    // neste caso precisa ser exatamente 1
    const rowsDeleted = resDelete.rowsAffected
    if(rowsDeleted !== undefined &&  rowsDeleted === 1) {
      cr.status = "SUCCESS"; 
      cr.message = "Aeroporto excluído.";
    }else{
      cr.message = "Aeroporto não excluído. Verifique se o código informado está correto.";
    }

  }catch(e){
    if(e instanceof Error){
      cr.message = e.message;
      console.log(e.message);
    }else{
      cr.message = "Erro ao conectar ao oracle. Sem detalhes";
    }
  } finally {
    // fechando a conexao
    if(connection!==undefined)
      await connection.close();

    // devolvendo a resposta da requisição.
    res.send(cr);  
  }
});


app.delete("/excluirTrecho", async(req,res)=>{
  // excluindo o trecho pelo código dele:
  const codigo = req.body.codigo as number;
 
  console.log('Codigo recebido: ' + codigo);

  // definindo um objeto de resposta.
  let cr: CustomResponse = {
    status: "ERROR",
    message: "",
    payload: undefined,
  };

  // conectando 
  let connection;
  try{
    connection = await oracledb.getConnection(oraConnAttribs);
    const cmdDeleteTrecho = `DELETE TRECHOS WHERE codigo = :1`
    const dados = [codigo];

    let resDelete = await connection.execute(cmdDeleteTrecho, dados);
    
    // importante: efetuar o commit para gravar no Oracle.
    await connection.commit();
    
    // obter a informação de quantas linhas foram inseridas. 
    // neste caso precisa ser exatamente 1
    const rowsDeleted = resDelete.rowsAffected
    if(rowsDeleted !== undefined &&  rowsDeleted === 1) {
      cr.status = "SUCCESS"; 
      cr.message = "Trecho excluído.";
    }else{
      cr.message = "Trecho não excluído. Verifique se o código informado está correto.";
    }

  }catch(e){
    if(e instanceof Error){
      cr.message = e.message;
      console.log(e.message);
    }else{
      cr.message = "Erro ao conectar ao oracle. Sem detalhes";
    }
  } finally {
    // fechando a conexao
    if(connection!==undefined)
      await connection.close();

    // devolvendo a resposta da requisição.
    res.send(cr);  
  }
});

app.delete("/excluirCidade", async(req,res)=>{
  // excluindo a cidade pelo código dela:
  const codigo = req.body.codigo as number;
 
  console.log('Codigo recebido: ' + codigo);

  // definindo um objeto de resposta.
  let cr: CustomResponse = {
    status: "ERROR",
    message: "",
    payload: undefined,
  };

  // conectando 
  let connection;
  try{
    connection = await oracledb.getConnection(oraConnAttribs);
    const cmdDeleteCid = `DELETE CIDADES WHERE codigo = :1`
    const dados = [codigo];

    let resDelete = await connection.execute(cmdDeleteCid, dados);
    
    // importante: efetuar o commit para gravar no Oracle.
    await connection.commit();
    
    // obter a informação de quantas linhas foram inseridas. 
    // neste caso precisa ser exatamente 1
    const rowsDeleted = resDelete.rowsAffected
    if(rowsDeleted !== undefined &&  rowsDeleted === 1) {
      cr.status = "SUCCESS"; 
      cr.message = "Cidade excluída.";
    }else{
      cr.message = "Cidade não excluída. Verifique se o código informado está correto.";
    }

  }catch(e){
    if(e instanceof Error){
      cr.message = e.message;
      console.log(e.message);
    }else{
      cr.message = "Erro ao conectar ao oracle. Sem detalhes";
    }
  } finally {
    // fechando a conexao
    if(connection!==undefined)
      await connection.close();

    // devolvendo a resposta da requisição.
    res.send(cr);  
  }
});


app.put("/alterarAeronave", async(req,res)=> { // servico de alterar 

    const aero: Aeronave = req.body as Aeronave;
    console.log(aero);
  
    // correção: verificar se tudo chegou para prosseguir com o cadastro.
    // verificar se chegaram os parametros
    // VALIDAR se estão bons (de acordo com os critérios - exemplo: 
    // não pode qtdeAssentos ser número e ao mesmo tempo o valor ser -5)
  
    // definindo um objeto de resposta.
    let cr: CustomResponse = {
      status: "ERROR",
      message: "",
      payload: undefined,
    };
    
    let [valida, mensagem] = aeronaveValida(aero);
    if(!valida) {
    // já devolvemos a resposta com o erro e terminamos o serviço.
    cr.message = mensagem;
    res.send(cr);
    } else {
        let connection;
        try {
          const cmdUpdateAero = `UPDATE AERONAVES SET FABRICANTE=(:1), MODELO=(:2), ANO_FABRICACAO=(:3), TOTAL_ASSENTOS=(:4), REFERENCIA=(:5) WHERE CODIGO=(:6) `
          const dados = [aero.fabricante, aero.modelo, aero.anoFabricacao, aero.totalAssentos, aero.referencia, aero.codigo];
        
          connection = await oracledb.getConnection(oraConnAttribs);
          let resUpdate = await connection.execute(cmdUpdateAero, dados);
        
          await connection.commit();
        
          const rowsInserted = resUpdate.rowsAffected
          if(rowsInserted !== undefined &&  rowsInserted === 1) {
            cr.status = "SUCCESS"; 
            cr.message = "Aeronave alterada.";
          }
      
        }catch(e){
          if(e instanceof Error){
            cr.message = e.message;
            console.log(e.message);
          }else{
            cr.message = "Erro ao conectar ao oracle. Sem detalhes";
          }
        } finally {
          //fechar a conexao.
          if(connection!== undefined){
            await connection.close();
          }
          res.send(cr);  
        }
    }
  });


  app.put("/alterarAeroporto", async(req,res)=> { // servico de alterar 

    const aeroporto: Aeroporto = req.body as Aeroporto;
    console.log(aeroporto);
  
    // correção: verificar se tudo chegou para prosseguir com o cadastro.
    // verificar se chegaram os parametros
    // VALIDAR se estão bons (de acordo com os critérios - exemplo: 
    // não pode qtdeAssentos ser número e ao mesmo tempo o valor ser -5)
  
    // definindo um objeto de resposta.
    let cr: CustomResponse = {
      status: "ERROR",
      message: "",
      payload: undefined,
    };
    
    let [valida, mensagem] = aeroportoValida(aeroporto);
    if(!valida) {
    // já devolvemos a resposta com o erro e terminamos o serviço.
    cr.message = mensagem;
    res.send(cr);
    } else {
        let connection;
        try {
          const cmdUpdateAero = `UPDATE AEROPORTOS SET NOME=(:1), SIGLA=(:2), CIDADE=(:3) WHERE CODIGO=(:4)`
          const dados = [aeroporto.nome, aeroporto.sigla, aeroporto.cidade, aeroporto.codigo];
        
          connection = await oracledb.getConnection(oraConnAttribs);
          let resUpdate = await connection.execute(cmdUpdateAero, dados);
        
          await connection.commit();
        
          const rowsInserted = resUpdate.rowsAffected
          if(rowsInserted !== undefined &&  rowsInserted === 1) {
            cr.status = "SUCCESS"; 
            cr.message = "Aeroporto alterado.";
          }
      
        }catch(e){
          if(e instanceof Error){
            cr.message = e.message;
            console.log(e.message);
          }else{
            cr.message = "Erro ao conectar ao oracle. Sem detalhes";
          }
        } finally {
          //fechar a conexao.
          if(connection!== undefined){
            await connection.close();
          }
          res.send(cr);  
        }
    }
  });

  app.put("/alterarTrecho", async(req,res)=> { // servico de alterar 

    const trecho: Trecho = req.body as Trecho;
    console.log(trecho);
  
    // correção: verificar se tudo chegou para prosseguir com o cadastro.
    // verificar se chegaram os parametros
    // VALIDAR se estão bons (de acordo com os critérios - exemplo: 
    // não pode qtdeAssentos ser número e ao mesmo tempo o valor ser -5)
  
    // definindo um objeto de resposta.
    let cr: CustomResponse = {
      status: "ERROR",
      message: "",
      payload: undefined,
    };
    
    let [valida, mensagem] = trechoValida(trecho);
    if(!valida) {
    // já devolvemos a resposta com o erro e terminamos o serviço.
    cr.message = mensagem;
    res.send(cr);
    } else {
        let connection;
        try {
          const cmdUpdateTrecho = `UPDATE TRECHOS SET NOME=(:1), ORIGEM=(:2), DESTINO=(:3), AERONAVE=(:4) WHERE CODIGO=(:5) `
          const dados = [trecho.nome, trecho.origem, trecho.destino, trecho.aeronave, trecho.codigo];
        
          connection = await oracledb.getConnection(oraConnAttribs);
          let resUpdate = await connection.execute(cmdUpdateTrecho, dados);
        
          await connection.commit();
        
          const rowsInserted = resUpdate.rowsAffected
          if(rowsInserted !== undefined &&  rowsInserted === 1) {
            cr.status = "SUCCESS"; 
            cr.message = "Trecho alterada.";
          }
      
        }catch(e){
          if(e instanceof Error){
            cr.message = e.message;
            console.log(e.message);
          }else{
            cr.message = "Erro ao conectar ao oracle. Sem detalhes";
          }
        } finally {
          //fechar a conexao.
          if(connection!== undefined){
            await connection.close();
          }
          res.send(cr);  
        }
    }
  });


  app.put("/alterarVoo", async(req,res)=> { // servico de alterar 

    const voo: Voo = req.body as Voo;
    console.log(voo);
  
    // correção: verificar se tudo chegou para prosseguir com o cadastro.
    // verificar se chegaram os parametros
    // VALIDAR se estão bons (de acordo com os critérios - exemplo: 
  
    // definindo um objeto de resposta.
    let cr: CustomResponse = {
      status: "ERROR",
      message: "",
      payload: undefined,
    };
    
    let [valida, mensagem] = vooValida(voo);
    if(!valida) {
    // já devolvemos a resposta com o erro e terminamos o serviço.
    cr.message = mensagem;
    res.send(cr);
    } else {
        let connection;
        try {
          const cmdUpdateVoo = `UPDATE VOOS SET DATA_VOO= TO_DATE((:1), 'dd/mm/yyyy'), HR_CHEGADA= TO_DATE((:2), 'HH24:MI:SS'), HR_SAIDA= TO_DATE((:3), 'HH24:MI:SS'), VALOR=(:4), TRECHO=(:5)  WHERE CODIGO=(:6)`
          const dados = [voo.dataVoo, voo.hrChegada, voo.hrSaida, voo.valor, voo.trecho, voo.codigo];
        
          connection = await oracledb.getConnection(oraConnAttribs);
          let resUpdate = await connection.execute(cmdUpdateVoo, dados);
        
          await connection.commit();
        
          const rowsInserted = resUpdate.rowsAffected
          if(rowsInserted !== undefined &&  rowsInserted === 1) {
            cr.status = "SUCCESS"; 
            cr.message = "Voo alterado.";
          }
      
        }catch(e){
          if(e instanceof Error){
            cr.message = e.message;
            console.log(e.message);
          }else{
            cr.message = "Erro ao conectar ao oracle. Sem detalhes";
          }
        } finally {
          //fechar a conexao.
          if(connection!== undefined){
            await connection.close();
          }
          res.send(cr);  
        }
    }
  });

  app.put("/alterarCidade", async(req,res)=> { // servico de alterar 

    const cidade: Cidade = req.body as Cidade;
    console.log(cidade);
  
    // correção: verificar se tudo chegou para prosseguir com o cadastro.
    // verificar se chegaram os parametros
    // VALIDAR se estão bons (de acordo com os critérios - exemplo: 
    // não pode qtdeAssentos ser número e ao mesmo tempo o valor ser -5)
  
    // definindo um objeto de resposta.
    let cr: CustomResponse = {
      status: "ERROR",
      message: "",
      payload: undefined,
    };
    
    let [valida, mensagem] = cidadeValida(cidade);
    if(!valida) {
    // já devolvemos a resposta com o erro e terminamos o serviço.
    cr.message = mensagem;
    res.send(cr);
    } else {
        let connection;
        try {
          const cmdUpdateCidade = `UPDATE CIDADES SET NOME=(:1), UF=(:2), PAIS =(:3) WHERE CODIGO=(:4) `
          const dados = [cidade.nome, cidade.uf, cidade.pais, cidade.codigo];
        
          connection = await oracledb.getConnection(oraConnAttribs);
          let resUpdate = await connection.execute(cmdUpdateCidade, dados);
        
          await connection.commit();
        
          const rowsInserted = resUpdate.rowsAffected
          if(rowsInserted !== undefined &&  rowsInserted === 1) {
            cr.status = "SUCCESS"; 
            cr.message = "Cidade alterada.";
          }
      
        }catch(e){
          if(e instanceof Error){
            cr.message = e.message;
            console.log(e.message);
          }else{
            cr.message = "Erro ao conectar ao oracle. Sem detalhes";
          }
        } finally {
          //fechar a conexao.
          if(connection!== undefined){
            await connection.close();
          }
          res.send(cr);  
        }
    }
  });

  app.put("/alterarAssento", async(req,res)=> { // servico de alterar 

    const assento: Assento = req.body as Assento;
    console.log(assento);
  
    // correção: verificar se tudo chegou para prosseguir com o cadastro.
    // verificar se chegaram os parametros
    // VALIDAR se estão bons (de acordo com os critérios - exemplo: 
    // não pode qtdeAssentos ser número e ao mesmo tempo o valor ser -5)
  
    // definindo um objeto de resposta.
    let cr: CustomResponse = {
      status: "ERROR",
      message: "",
      payload: undefined,
    };
    
        let connection;
        try {
          const cmdUpdateAssento = `UPDATE ASSENTOS SET OCUPADO = '1' WHERE VOO = :1 AND NUMERO = :2`
          const dados = [assento.voo, assento.numero];
        
          connection = await oracledb.getConnection(oraConnAttribs);
          let resUpdate = await connection.execute(cmdUpdateAssento, dados);
        
          await connection.commit();
        
          const rowsInserted = resUpdate.rowsAffected
          if(rowsInserted !== undefined &&  rowsInserted === 1) {
            cr.status = "SUCCESS"; 
            cr.message = "Assento alterada.";
          }
      
        }catch(e){
          if(e instanceof Error){
            cr.message = e.message;
            console.log(e.message);
          }else{
            cr.message = "Erro ao conectar ao oracle. Sem detalhes";
          }
        } finally {
          //fechar a conexao.
          if(connection!== undefined){
            await connection.close();
          }
          res.send(cr);  
        }
  });

app.listen(port,()=>{
  console.log("Servidor HTTP funcionando...");
});