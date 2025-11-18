import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs"; // Importa a biblioteca de hashing

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

/* ========= Helpers de validação CPF/CNPJ (MANTIDOS) ========= */

function somenteDigitos(v) {
  return (v || "").replace(/\D/g, "");
}

function todosIguais(str) {
  return str.split("").every((c) => c === str[0]);
}

function validarCPF(cpf) {
  const digits = somenteDigitos(cpf);
  if (digits.length !== 11) return false;
  if (todosIguais(digits)) return false;

  const nums = digits.split("").map((d) => parseInt(d, 10));

  // 1º dígito
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += nums[i] * (10 - i);
  }
  let resto = soma % 11;
  let dv1 = resto < 2 ? 0 : 11 - resto;
  if (dv1 !== nums[9]) return false;

  // 2º dígito
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += nums[i] * (11 - i);
  }
  resto = soma % 11;
  let dv2 = resto < 2 ? 0 : 11 - resto;
  if (dv2 !== nums[10]) return false;

  return true;
}

function validarCNPJ(cnpj) {
  const digits = somenteDigitos(cnpj);
  if (digits.length !== 14) return false;
  if (todosIguais(digits)) return false;

  const nums = digits.split("").map((d) => parseInt(d, 10));

  // 1º dígito
  let pesos1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let soma = 0;
  for (let i = 0; i < 12; i++) {
    soma += nums[i] * pesos1[i];
  }
  let resto = soma % 11;
  let dv1 = resto < 2 ? 0 : 11 - resto;
  if (dv1 !== nums[12]) return false;

  // 2º dígito
  let pesos2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  soma = 0;
  for (let i = 0; i < 13; i++) {
    soma += nums[i] * pesos2[i];
  }
  resto = soma % 11;
  let dv2 = resto < 2 ? 0 : 11 - resto;
  if (dv2 !== nums[13]) return false;

  return true;
}

/* ========= Rotas ========= */

// Rota teste
app.get("/", (req, res) => {
  res.json({ message: "API rodando 🚀" });
});

// CADASTRO
app.post("/usuarios", async (req, res) => {
  try {
    const {
      nome,
      email,
      senha,
      instituicao,
      profissao,
      cargoAreaAtuacao,
      organizacaoNome,
      cep,
      logradouro,
      numero,
      bairro,
      cidade,
      uf,
      complemento,
      tipoPessoa,
      cpf,
      cnpj,
    } = req.body;

    if (!nome || !email || !senha || !cargoAreaAtuacao || !organizacaoNome) {
      return res.status(400).json({
        success: false,
        message:
          "Nome, e-mail, senha, cargo/área de atuação e nome da organização são obrigatórios!",
      });
    }

    // Validação de tipoPessoa + CPF/CNPJ
    if (tipoPessoa === "fisica") {
      if (!cpf || !validarCPF(cpf)) {
        return res
          .status(400)
          .json({ success: false, message: "CPF inválido." });
      }
    } else if (tipoPessoa === "juridica") {
      if (!cnpj || !validarCNPJ(cnpj)) {
        return res
          .status(400)
          .json({ success: false, message: "CNPJ inválido." });
      }
    }

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return res
        .status(409)
        .json({ success: false, message: "E-mail já cadastrado!" });
    }
    
    // --- MUDANÇA DE SEGURANÇA: HASH DE SENHA ---
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);
    // ------------------------------------------

    const user = await prisma.user.create({
      data: {
        nome,
        email,
        senhaHash: senhaHash, // Salva o hash da senha
        instituicao,
        profissao,
        cargoAreaAtuacao,
        organizacaoNome,
        cep,
        logradouro,
        numero,
        bairro,
        cidade,
        uf,
        complemento,
        tipoPessoa: tipoPessoa || null,
        cpf: tipoPessoa === "fisica" ? somenteDigitos(cpf) : null,
        cnpj: tipoPessoa === "juridica" ? somenteDigitos(cnpj) : null,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Usuário criado com sucesso!",
      user,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Erro no servidor" });
  }
});

// LISTAGEM
app.get("/usuarios", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    // Recomenda-se não retornar o campo 'senhaHash'
    const safeUsers = users.map(({ senhaHash, ...user }) => user);
    return res.status(200).json({ success: true, users: safeUsers });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Erro ao buscar usuários" });
  }
});

// LOGIN
app.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res
        .status(400)
        .json({ success: false, message: "E-mail e senha são obrigatórios." });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Credenciais inválidas." });
    }
    
    // --- MUDANÇA DE SEGURANÇA: COMPARAÇÃO DE HASH ---
    const senhaValida = await bcrypt.compare(senha, user.senhaHash);

    if (!senhaValida) {
      return res
        .status(401)
        .json({ success: false, message: "Credenciais inválidas." });
    }
    // ------------------------------------------------

    return res.json({
      success: true,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        tipoPessoa: user.tipoPessoa,
        cpf: user.cpf,
        cnpj: user.cnpj,
      },
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Erro ao tentar login." });
  }
});

// START (PORTA AJUSTADA PARA PRODUÇÃO)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em: http://localhost:${PORT}`);
});