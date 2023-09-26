let { contas, depositos, saques, transferencias } = require("../bancodedados");

const { format } = require("date-fns");
const data = format(new Date(), "yyyy-MM-dd HH:mm:ss");

const depositar = (req, res) => {
  const { numero_conta, valor } = req.body;
  try {
    if (valor <= 0) {
      return res
        .status(404)
        .json({ mensagem: "Valor de deposito de ser maior que zero." });
    }
    if (!numero_conta || !valor) {
      return res.status(404).json({
        mensagem: "O número da conta e o valor de depósito são obrigatórios.",
      });
    }
    const contaExiste = contas.find((item) => {
      return item.numero === Number(numero_conta);
    });
    if (!contaExiste) {
      return res.status(404).json({ mensagem: "Conta não encontrada" });
    }
    contaExiste.saldo += valor;
    const registroDeposito = {
      data,
      numero_conta: numero_conta,
      valor: valor,
    };
    depositos.push(registroDeposito);
    res.status(204).json();
  } catch (error) {
    res.status(500).json(error);
  }
};

const sacar = (req, res) => {
  const { numero_conta, valor, senha } = req.body;
  try {
    if (!numero_conta || !valor || !senha) {
      return res
        .status(404)
        .json({ mensagem: "Falta informar algum dado obrigatório" });
    }
    const encontrarConta = contas.find((item) => {
      return item.numero === Number(numero_conta);
    });
    if (!encontrarConta) {
      return res.status(404).json({ mensagem: "Conta nao encontrada" });
    }
    if (encontrarConta.usuario.senha !== senha) {
      return res.status(404).json({ mensagem: "Senhas nao confere" });
    }
    if (encontrarConta.saldo <= 0) {
      return res
        .status(404)
        .json({ mensagem: "nao é possivel realizar saque" });
    }
    if (encontrarConta.saldo < valor) {
      return res
        .status(404)
        .json({ mensagem: "valor do saque superior ao disponivel na conta" });
    }
    encontrarConta.saldo -= valor;
    const registroSaque = {
      data,
      numero_conta: numero_conta,
      valor: valor,
    };
    saques.push(registroSaque);
    return res.status(204).json();
  } catch (error) {
    res.status(500).json(error);
  }
};

const tranferir = (req, res) => {
  const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;
  try {
    if (!numero_conta_origem || !numero_conta_destino || !valor || !senha) {
      return res.status(404).json({ mensagem: "Falta incluir algum dado" });
    }
    const origemExiste = contas.find((item) => {
      return item.numero === Number(numero_conta_origem);
    });
    if (!origemExiste) {
      return res.status(404).json({ mensagem: "Conta origem nao existe" });
    }
    const destinoExiste = contas.find((item) => {
      return item.numero === Number(numero_conta_destino);
    });
    if (!destinoExiste) {
      return res.status(404).json({ mensagem: "conta de destino nao existe" });
    }
    if (origemExiste.usuario.senha !== senha) {
      return res.status(404).json({ mensagem: "senhas nao conferem" });
    }
    if (origemExiste.saldo <= 0) {
      return res.status(404).json({ mensagem: "saldo insuficiente" });
    }
    if (valor > origemExiste.saldo) {
      return res
        .status(404)
        .json({ mensagem: "valor de tranferencia maior que o saldo" });
    }
    destinoExiste.saldo += valor;
    origemExiste.saldo -= valor;

    const tranferenciaEfetuada = {
      data: data,
      numero_conta_origem: numero_conta_origem,
      numero_conta_destino: numero_conta_destino,
      valor: valor,
    };
    transferencias.push(tranferenciaEfetuada);
    return res.status(204).json();
  } catch (error) {
    res.status(500).json(error);
  }
};

const saldo = (req, res) => {
  const { numero_conta, senha } = req.query;
  try {
    if (!numero_conta || !senha) {
      return res.status(404).json({ mensagem: "Falta preencher campos" });
    }
    const buscarConta = contas.find((item) => {
      return item.numero === Number(numero_conta);
    });
    if (!buscarConta) {
      return res.status(404).json({ mensagem: "Conta não encontrada" });
    }
    if (buscarConta.usuario.senha !== senha) {
      return res.status(404).json({ mensagem: "Senha incorreta" });
    }
    return res.status(200).json({
      data,
      saldo: buscarConta.saldo,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

const extrato = (req, res) => {
  const { numero_conta, senha } = req.query;
  try {
    if (!numero_conta || !senha) {
      return res.status(404).json({ mensagem: "Falta preencher campos" });
    }
    const buscarConta = contas.find((item) => {
      return item.numero === Number(numero_conta);
    });
    if (!buscarConta) {
      return res.status(404).json({ mensagem: "Conta não encontrada" });
    }
    if (buscarConta.usuario.senha !== senha) {
      return res.status(404).json({ mensagem: "Senha incorreta" });
    }
    const verificarTranferenciasEnviadas = transferencias.filter((item) => {
      return item.numero_conta_origem === numero_conta;
    });
    const verificarTranferenciasRecebidas = transferencias.filter((item) => {
      return item.numero_conta_destino === numero_conta;
    });
    const verificarDepositos = depositos.filter((item) => {
      return item.numero_conta === numero_conta;
    });
    const verificarSaques = saques.filter((item) => {
      return item.numero_conta === numero_conta;
    });
    const mostrarExtrato = {
      data,
      depositos: verificarDepositos,
      saques: verificarSaques,
      transferenciasEnviadas: verificarTranferenciasEnviadas,
      transferenciasRecebidas: verificarTranferenciasRecebidas,
    };
    return res.status(200).json(mostrarExtrato);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  depositar,
  sacar,
  tranferir,
  saldo,
  extrato,
};
