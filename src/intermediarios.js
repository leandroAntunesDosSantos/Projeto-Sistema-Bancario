const validarSenhas = (req, res, next) => {
  const { senha_banco } = req.query;

  if (!senha_banco || senha_banco !== "_middleware_password") {
    return res
      .status(400)
      .json({ mensagem: "A senha do banco informada é inválida!" });
  }
  next();
};

module.exports = validarSenhas;
