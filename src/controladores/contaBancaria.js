let { contas, identificadorBancario, banco } = require("../bancodedados");

const listarContas = (req, res) => {
  const { senha_banco } = req.query;
  try {
    if (!senha_banco) {
      return res.status(404).json({ mensagem: "Informe a senha." });
    }
    if (senha_banco !== banco.senha) {
      return res.status(404).json({ mensagem: "A senha esta incorreta!" });
    }
    return res.status(200).json(contas);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const criarConta = (req, res) => {
  const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
  try {
    if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
      return res
        .status(404)
        .json({ mensagem: "Todos os campos são obrigatorios" });
    }
    const consultaCpf = contas.find((item) => {
      return item.usuario.cpf === cpf;
    });
    const consultaEmail = contas.find((item) => {
      return item.usuario.email === email;
    });
    if (consultaCpf || consultaEmail) {
      return res.status(404).json("o cpf ou email ja existem");
    }
    const cadastroUsuario = {
      numero: identificadorBancario++,
      saldo: 0,
      usuario: {
        nome,
        cpf,
        data_nascimento,
        telefone,
        email,
        senha,
      },
    };
    contas.push(cadastroUsuario);
    return res.status(201).json();
  } catch (error) {
    res.status(500).json(error);
  }
};

const atualizarConta = (req, res) => {
  const { numeroConta } = req.params;
  const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
  try {
    if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
      return res.status(404).json("campos obrigatorios");
    }
    const encontrarConta = contas.find((item) => {
      return item.numero === Number(numeroConta);
    });

    if (!encontrarConta) {
      return res.status(404).json({ mensagem: "conta não encontrada" });
    }
    if (numeroConta <= 0 || numeroConta >= identificadorBancario) {
      return res.status(404).json({ mensagem: "numero da conta invalido" });
    }
    const consultaCpf = contas.find((item) => {
      return item.usuario.cpf === cpf;
    });

    if (consultaCpf) {
      return res
        .status(404)
        .json({ mensagem: "Ja existe cadastro com cpf informado" });
    }

    const consultaEmail = contas.find((item) => {
      return item.usuario.email === email;
    });
    if (consultaEmail) {
      return res
        .status(404)
        .json({ mensagem: "Ja existe cadastro com email informado" });
    }

    encontrarConta.usuario.nome = nome;
    encontrarConta.usuario.cpf = cpf;
    encontrarConta.usuario.data_nascimento = data_nascimento;
    encontrarConta.usuario.telefone = telefone;
    encontrarConta.usuario.email = email;
    encontrarConta.usuario.senha = senha;
    return res.status(204).json();
  } catch (error) {
    res.status(500).json(error);
  }
};

const deletarConta = (req, res) => {
  const { numeroConta } = req.params;
  try {
    if (numeroConta <= 0 || numeroConta >= identificadorBancario) {
      return res.status(404).json({ mensagem: "conta inválida" });
    }
    const encontrarConta = contas.find((item) => {
      return item.numero === Number(numeroConta);
    });
    if (!encontrarConta) {
      return res.status(404).json({ mensagem: "conta nao encontrada" });
    }
    if (encontrarConta.saldo !== 0) {
      return res.status(404).json({
        mensagem:
          "voce possui saldo com o banco não sendo possivel deletar conta",
      });
    }
    contas = contas.filter((item) => {
      return item.numero !== Number(numeroConta);
    });
    return res.status(204).json();
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  listarContas,
  criarConta,
  atualizarConta,
  deletarConta,
};
