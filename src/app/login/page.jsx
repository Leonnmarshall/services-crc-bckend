"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation"; // CORRIGIDO: Usando o hook do Next.js
import cepPromise from "cep-promise";

// CORRIGIDO: Usando process.env para variáveis de ambiente do Next.js
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

/* ========= Helpers de validação CPF/CNPJ ========= */

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

  let soma = 0;
  for (let i = 0; i < 9; i++) soma += nums[i] * (10 - i);
  let resto = soma % 11;
  let dv1 = resto < 2 ? 0 : 11 - resto;
  if (dv1 !== nums[9]) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) soma += nums[i] * (11 - i);
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

  let pesos1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let soma = 0;
  for (let i = 0; i < 12; i++) soma += nums[i] * pesos1[i];
  let resto = soma % 11;
  let dv1 = resto < 2 ? 0 : 11 - resto;
  if (dv1 !== nums[12]) return false;

  let pesos2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  soma = 0;
  for (let i = 0; i < 13; i++) soma += nums[i] * pesos2[i];
  resto = soma % 11;
  let dv2 = resto < 2 ? 0 : 11 - resto;
  if (dv2 !== nums[13]) return false;

  return true;
}

/* ================== Componente principal ================== */

function AuthPage() {
  const searchParams = useSearchParams(); // O uso permanece o mesmo
  const initialMode = searchParams.get("mode") || "login";
  const [mode, setMode] = useState(initialMode); // "login" | "register"

  // ---- LOGIN ----
  const [loginForm, setLoginForm] = useState({
    email: "",
    senha: "",
  });
  const [loginLoading, setLoginLoading] = useState(false);

  // ---- CADASTRO ----
  const [form, setForm] = useState({
    tipoPessoa: "fisica",
    cpf: "",
    cnpj: "",
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    instituicao: "",
    profissao: "",
    cargoAreaAtuacao: "",
    organizacaoNome: "",
    cep: "",
    logradouro: "",
    numero: "",
    bairro: "",
    cidade: "",
    uf: "",
    complemento: "",
  });

  const [loadingCep, setLoadingCep] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [cpfError, setCpfError] = useState("");
  const [cnpjError, setCnpjError] = useState("");

  /* ---------- HANDLERS LOGIN ---------- */

  function handleLoginChange(e) {
    const { name, value } = e.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleLoginSubmit(e) {
    e.preventDefault();

    // Substituindo alert por uma mensagem de erro na tela (melhor prática em apps)
    // Se o uso de alert for necessário, mantenha, mas em produção é desaconselhável.
    // Por enquanto, mantenho alert() conforme o código original
    if (!loginForm.email || !loginForm.senha) {
      alert("Informe e-mail e senha.");
      return;
    }

    try {
      setLoginLoading(true);

      const resp = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      });

      const data = await resp.json();

      if (!resp.ok || data.success === false) {
        alert(data.message || "E-mail ou senha inválidos.");
        return;
      }

      alert(`Bem-vindo(a), ${data.user?.nome || "usuário"}!`);
    } catch (err) {
      console.error(err);
      alert("Erro ao conectar com o servidor.");
    } finally {
      setLoginLoading(false);
    }
  }

  /* ---------- HANDLERS CADASTRO ---------- */

  function handleRegisterChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleTipoPessoaChange(e) {
    const value = e.target.value;
    setForm((prev) => ({
      ...prev,
      tipoPessoa: value,
      cpf: value === "fisica" ? prev.cpf : "",
      cnpj: value === "juridica" ? prev.cnpj : "",
    }));
    setCpfError("");
    setCnpjError("");
  }

  async function handleCepBlur() {
    const cep = somenteDigitos(form.cep);
    if (cep.length !== 8) return;

    try {
      setLoadingCep(true);
      const data = await cepPromise(cep);
      setForm((prev) => ({
        ...prev,
        logradouro: data.street || "",
        bairro: data.neighborhood || "",
        cidade: data.city || "",
        uf: data.state || "",
      }));
    } catch (error) {
      console.error(error);
      alert("Não foi possível buscar o CEP. Verifique se está correto.");
    } finally {
      setLoadingCep(false);
    }
  }

  function handleCpfBlur() {
    if (form.tipoPessoa === "fisica") {
      if (!form.cpf) {
        setCpfError("Informe o CPF.");
      } else if (!validarCPF(form.cpf)) {
        setCpfError("CPF inválido.");
      } else {
        setCpfError("");
      }
    }
  }

  function handleCnpjBlur() {
    if (form.tipoPessoa === "juridica") {
      if (!form.cnpj) {
        setCnpjError("Informe o CNPJ.");
      } else if (!validarCNPJ(form.cnpj)) {
        setCnpjError("CNPJ inválido.");
      } else {
        setCnpjError("");
      }
    }
  }

  async function handleRegisterSubmit(e) {
    e.preventDefault();

    setCpfError("");
    setCnpjError("");

    if (form.senha !== form.confirmarSenha) {
      alert("As senhas não coincidem.");
      return;
    }

    if (form.tipoPessoa === "fisica") {
      if (!form.cpf || !validarCPF(form.cpf)) {
        setCpfError("CPF inválido.");
        return;
      }
    }

    if (form.tipoPessoa === "juridica") {
      if (!form.cnpj || !validarCNPJ(form.cnpj)) {
        setCnpjError("CNPJ inválido.");
        return;
      }
    }

    if (
      !form.nome ||
      !form.email ||
      !form.cargoAreaAtuacao ||
      !form.organizacaoNome
    ) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      setRegisterLoading(true);

      const payload = {
        nome: form.nome,
        email: form.email,
        senha: form.senha,
        instituicao: form.instituicao,
        profissao: form.profissao,
        cargoAreaAtuacao: form.cargoAreaAtuacao,
        organizacaoNome: form.organizacaoNome,
        cep: form.cep,
        logradouro: form.logradouro,
        numero: form.numero,
        bairro: form.bairro,
        cidade: form.cidade,
        uf: form.uf,
        complemento: form.complemento,
        tipoPessoa: form.tipoPessoa,
        cpf: somenteDigitos(form.cpf),
        cnpj: somenteDigitos(form.cnpj),
      };

      const resp = await fetch(`${API_BASE}/usuarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await resp.json();

      if (!resp.ok || data.success === false) {
        console.error(data);
        alert(data.message || data.error || "Erro ao cadastrar usuário.");
        return;
      }

      alert("Usuário cadastrado com sucesso!");

      setForm({
        tipoPessoa: "fisica",
        cpf: "",
        cnpj: "",
        nome: "",
        email: "",
        senha: "",
        confirmarSenha: "",
        instituicao: "",
        profissao: "",
        cargoAreaAtuacao: "",
        organizacaoNome: "",
        cep: "",
        logradouro: "",
        numero: "",
        bairro: "",
        cidade: "",
        uf: "",
        complemento: "",
      });

      setMode("login");
      setLoginForm({ email: form.email, senha: "" });
    } catch (err) {
      console.error(err);
      alert("Erro ao se comunicar com o servidor.");
    } finally {
      setRegisterLoading(false);
    }
  }

  const isFisica = form.tipoPessoa === "fisica";

  /* ================== JSX ================== */

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start py-10 px-4 font-sans">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl px-6 py-6 md:px-10 md:py-8">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-5">
          <button
            type="button"
            className={`flex-1 pb-3 text-sm font-semibold border-b-2 ${
              mode === "login"
                ? "border-amber-400 text-gray-900"
                : "border-transparent text-gray-500"
            }`}
            onClick={() => setMode("login")}
          >
            Entrar
          </button>
          <button
            type="button"
            className={`flex-1 pb-3 text-sm font-semibold border-b-2 ${
              mode === "register"
                ? "border-amber-400 text-gray-900"
                : "border-transparent text-gray-500"
            }`}
            onClick={() => setMode("register")}
          >
            Criar conta
          </button>
        </div>

        {mode === "login" && (
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Bem-vindo(a) de volta
            </h1>
            <p className="text-sm text-gray-500 mb-5">
              Acesse sua conta para visualizar e interagir com o repositório.
            </p>

            <form className="space-y-3" onSubmit={handleLoginSubmit}>
              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-700">E-mail</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Seu e-mail"
                  value={loginForm.email}
                  onChange={handleLoginChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-700">Senha</label>
                <input
                  type="password"
                  name="senha"
                  placeholder="Sua senha"
                  value={loginForm.senha}
                  onChange={handleLoginChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full mt-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-300 text-white font-semibold text-sm py-2.5 shadow-sm hover:brightness-95 disabled:opacity-70"
              >
                {loginLoading ? "Entrando..." : "Entrar"}
              </button>
            </form>
          </div>
        )}

        {mode === "register" && (
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Olá, Seja bem vindo(a)!
            </h1>
            <p className="text-sm text-gray-500 mb-4">
              Para finalizar seu cadastro precisamos de algumas informações.
            </p>

            {/* Tipo de pessoa */}
            <div className="flex gap-6 mb-4">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <input
                  type="radio"
                  name="tipoPessoa"
                  value="fisica"
                  checked={form.tipoPessoa === "fisica"}
                  onChange={handleTipoPessoaChange}
                  className="h-4 w-4"
                />
                Pessoa Física
              </label>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <input
                  type="radio"
                  name="tipoPessoa"
                  value="juridica"
                  checked={form.tipoPessoa === "juridica"}
                  onChange={handleTipoPessoaChange}
                  className="h-4 w-4"
                />
                Pessoa Jurídica
              </label>
            </div>

            <form className="space-y-4" onSubmit={handleRegisterSubmit}>
              {/* Nome + Profissão */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-gray-700">Nome completo</label>
                  <input
                    type="text"
                    name="nome"
                    placeholder="Escreva seu nome"
                    value={form.nome}
                    onChange={handleRegisterChange}
                    required
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm text-gray-700">Profissão</label>
                  <input
                    type="text"
                    name="profissao"
                    placeholder="Sua profissão"
                    value={form.profissao}
                    onChange={handleRegisterChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
              </div>

              {/* CPF/CNPJ + Email */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-gray-700">
                    {isFisica ? "CPF" : "CNPJ"}
                  </label>
                  <input
                    type="text"
                    name={isFisica ? "cpf" : "cnpj"}
                    placeholder={
                      isFisica ? "Digite seu CPF" : "Digite seu CNPJ"
                    }
                    value={isFisica ? form.cpf : form.cnpj}
                    onChange={handleRegisterChange}
                    onBlur={isFisica ? handleCpfBlur : handleCnpjBlur}
                    required
                    className={`w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                      (isFisica && cpfError) || (!isFisica && cnpjError)
                        ? "border-red-500 bg-red-50 focus:ring-red-400"
                        : "border-gray-300 focus:ring-amber-400"
                    }`}
                  />
                  {isFisica && cpfError && (
                    <span className="text-xs text-red-600">{cpfError}</span>
                  )}
                  {!isFisica && cnpjError && (
                    <span className="text-xs text-red-600">{cnpjError}</span>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm text-gray-700">E-mail</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Seu melhor e-mail"
                    value={form.email}
                    onChange={handleRegisterChange}
                    required
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
              </div>

              {/* Senhas */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-gray-700">Senha</label>
                  <input
                    type="password"
                    name="senha"
                    placeholder="Crie uma senha"
                    value={form.senha}
                    onChange={handleRegisterChange}
                    required
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-gray-700">
                    Confirmar senha
                  </label>
                  <input
                    type="password"
                    name="confirmarSenha"
                    placeholder="Repita sua senha"
                    value={form.confirmarSenha}
                    onChange={handleRegisterChange}
                    required
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
              </div>

              {/* Cargo + Organização */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-gray-700">
                    Cargo/Área de Atuação
                  </label>
                  <select
                    name="cargoAreaAtuacao"
                    value={form.cargoAreaAtuacao}
                    onChange={handleRegisterChange}
                    required
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  >
                    <option value="">Selecione</option>
                    <option value="Pesquisador/Acadêmico">
                      Pesquisador/Acadêmico
                    </option>
                    <option value="Profissional de Organização da Sociedade Civil">
                      Profissional de Organização da Sociedade Civil
                    </option>
                    <option value="Gestor Público">Gestor Público</option>
                    <option value="Estudante">Estudante</option>
                    <option value="Jornalista">Jornalista</option>
                    <option value="Profissional do Sistema de Justiça">
                      Profissional do Sistema de Justiça
                    </option>
                    <option value="Educador/Professor">
                      Educador/Professor
                    </option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm text-gray-700">
                    Nome da Organização/Empresa
                  </label>
                  <input
                    type="text"
                    name="organizacaoNome"
                    placeholder="Onde você atua"
                    value={form.organizacaoNome}
                    onChange={handleRegisterChange}
                    required
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
              </div>

              {/* Instituição */}
              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-700">Instituição</label>
                <input
                  type="text"
                  name="instituicao"
                  placeholder="Instituição de vínculo (se houver)"
                  value={form.instituicao}
                  onChange={handleRegisterChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              {/* CEP + Número */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-gray-700">CEP</label>
                  <input
                    type="text"
                    name="cep"
                    placeholder="00000-000"
                    value={form.cep}
                    onChange={handleRegisterChange}
                    onBlur={handleCepBlur}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                  {loadingCep && (
                    <span className="text-xs text-gray-500">
                      Buscando endereço...
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-gray-700">Número</label>
                  <input
                    type="text"
                    name="numero"
                    placeholder="Número"
                    value={form.numero}
                    onChange={handleRegisterChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
              </div>

              {/* Logradouro + Bairro */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-gray-700">Logradouro</label>
                  <input
                    type="text"
                    name="logradouro"
                    placeholder="Rua / Avenida"
                    value={form.logradouro}
                    onChange={handleRegisterChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-gray-700">Bairro</label>
                  <input
                    type="text"
                    name="bairro"
                    placeholder="Bairro"
                    value={form.bairro}
                    onChange={handleRegisterChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
              </div>

              {/* Cidade + UF */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-gray-700">Cidade</label>
                  <input
                    type="text"
                    name="cidade"
                    placeholder="Cidade"
                    value={form.cidade}
                    onChange={handleRegisterChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-gray-700">UF</label>
                  <input
                    type="text"
                    name="uf"
                    placeholder="UF"
                    maxLength={2}
                    value={form.uf}
                    onChange={handleRegisterChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm uppercase focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
              </div>

              {/* Complemento */}
              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-700">Complemento</label>
                <input
                  type="text"
                  name="complemento"
                  placeholder="Apartamento, bloco, referência..."
                  value={form.complemento}
                  onChange={handleRegisterChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <button
                type="submit"
                disabled={registerLoading}
                className="w-full mt-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-300 text-white font-semibold text-sm py-2.5 shadow-sm hover:brightness-95 disabled:opacity-70"
              >
                {registerLoading ? "Cadastrando..." : "Cadastrar"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default AuthPage;
