const express = require("express");
const {
  listarContas,
  criarConta,
  atualizarConta,
  deletarConta,
} = require("./controladores/contaBancaria");
///////
const {
  depositar,
  sacar,
  tranferir,
  saldo,
  extrato,
} = require("./controladores/operacoesbancarias");
//////////
//const validarSenhas = require("./intermediarios");
////////
const rotas = express();

rotas.get("/contas", listarContas);
rotas.post("/contas", criarConta);
rotas.put("/contas/:numeroConta/usuario", atualizarConta);
rotas.delete("/contas/:numeroConta", deletarConta);

////////////
rotas.post("/transacoes/depositar", depositar);
rotas.post("/transacoes/sacar", sacar);
rotas.post("/transacoes/transferir", tranferir);
////
rotas.get("/contas/saldo", saldo);
rotas.get("/contas/extrato", extrato);
module.exports = rotas;
