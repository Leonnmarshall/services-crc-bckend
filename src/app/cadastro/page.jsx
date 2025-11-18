"use client";
import React, { useState } from "react";

// Definição da URL base da API
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
// URL da API ViaCEP para busca de endereço
const VIACEP_API_URL = "https://viacep.com.br/ws/";

/* =================== HELPERS DE VALIDAÇÃO =================== */

/** Remove todos os caracteres não-dígitos */
function somenteDigitos(v) {
  return (v || "").replace(/\D/g, "");
}

/** Verifica se todos os dígitos de uma string são iguais */
function todosIguais(str) {
  return str.split("").every((c) => c === str[0]);
}

/** Valida um CPF */
function validarCPF(cpf) {
  const digits = somenteDigitos(cpf);
  if (digits.length !== 11 || todosIguais(digits)) return false;

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

/** Valida um CNPJ */
function validarCNPJ(cnpj) {
  const digits = somenteDigitos(cnpj);
  if (digits.length !== 14 || todosIguais(digits)) return false;

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

/* =================== COMPONENTE PRINCIPAL =================== */

function UserRegisterPage() {
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
  const [generalError, setGeneralError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const isFisica = form.tipoPessoa === "fisica";

  /* ------------------- HANDLERS ------------------- */

  function handleChange(e) {
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

  // Lógica de busca de CEP usando a API ViaCEP (substituindo cep-promise)
  async function handleCepBlur() {
    const cep = somenteDigitos(form.cep);
    if (cep.length !== 8) return;

    setGeneralError("");
    try {
      setLoadingCep(true);

      const response = await fetch(`${VIACEP_API_URL}${cep}/json/`);
      const data = await response.json();

      if (data.erro) {
        setGeneralError(
          "Não foi possível buscar o CEP. Verifique se está correto."
        );
        setForm((prev) => ({
          ...prev,
          logradouro: "",
          bairro: "",
          cidade: "",
          uf: "",
        }));
        return;
      }

      // Mapeia os campos da ViaCEP (logradouro, localidade, uf) para o estado do formulário
      setForm((prev) => ({
        ...prev,
        logradouro: data.logradouro || "",
        bairro: data.bairro || "",
        cidade: data.localidade || "", // ViaCEP usa 'localidade' para cidade
        uf: data.uf || "",
      }));
    } catch (error) {
      console.error("Erro na comunicação com a API de CEP:", error);
      setGeneralError(
        "Erro na comunicação com a API de CEP. Verifique a sua ligação."
      );
    } finally {
      setLoadingCep(false);
    }
  }

  function handleCpfBlur() {
    if (form.tipoPessoa === "fisica") {
      if (!form.cpf) setCpfError("Informe o CPF.");
      else if (!validarCPF(form.cpf)) setCpfError("CPF inválido.");
      else setCpfError("");
    }
  }

  function handleCnpjBlur() {
    if (form.tipoPessoa === "juridica") {
      if (!form.cnpj) setCnpjError("Informe o CNPJ.");
      else if (!validarCNPJ(form.cnpj)) setCnpjError("CNPJ inválido.");
      else setCnpjError("");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setCpfError("");
    setCnpjError("");
    setGeneralError("");
    setSuccessMessage("");

    if (form.senha !== form.confirmarSenha) {
      setGeneralError("As senhas não coincidem.");
      return;
    }

    if (isFisica) {
      if (!form.cpf || !validarCPF(form.cpf)) {
        setCpfError("CPF inválido.");
        setGeneralError("Por favor, corrija o campo CPF.");
        return;
      }
    } else {
      if (!form.cnpj || !validarCNPJ(form.cnpj)) {
        setCnpjError("CNPJ inválido.");
        setGeneralError("Por favor, corrija o campo CNPJ.");
        return;
      }
    }

    // Validação de campos obrigatórios simples
    if (
      !form.nome ||
      !form.email ||
      !form.cargoAreaAtuacao ||
      !form.organizacaoNome
    ) {
      setGeneralError("Preencha todos os campos obrigatórios (*).");
      return;
    }

    try {
      setRegisterLoading(true);

      const payload = {
        ...form,
        cpf: somenteDigitos(form.cpf),
        cnpj: somenteDigitos(form.cnpj),
        // Adiciona um timestamp de criação, por exemplo
        createdAt: new Date().toISOString(),
      };

      // Simulação de chamada de API
      const resp = await fetch(`${API_BASE}/usuarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await resp.json();

      if (!resp.ok || data.success === false) {
        console.error(data);
        setGeneralError(
          data.message ||
            data.error ||
            "Erro ao cadastrar utilizador. Tente novamente."
        );
        return;
      }

      setSuccessMessage(
        "Utilizador cadastrado com sucesso! Já pode fazer login."
      );
      // Opcional: Limpar formulário após sucesso
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
    } catch (err) {
      console.error("Erro no servidor ou rede:", err);
      setGeneralError("Erro no servidor. Verifique a sua ligação à internet.");
    } finally {
      setRegisterLoading(false);
    }
  }

  /* =================== JSX DE RENDERIZAÇÃO =================== */

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start py-10 px-4 font-sans w-full">
      <div className="w-full bg-white rounded-2xl shadow-xl px-6 py-6 md:px-10 md:py-8 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Crie a sua conta
        </h1>
        <p className="text-base text-gray-500 mb-6">
          Preencha os campos abaixo para criar o seu acesso ao sistema.
        </p>

        {/* Mensagem de Erro/Sucesso (Alerta embutido) */}
        {generalError && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4"
            role="alert"
          >
            <span className="block sm:inline">{generalError}</span>
          </div>
        )}
        {successMessage && (
          <div
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative mb-4"
            role="alert"
          >
            <span className="block sm:inline">{successMessage}</span>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Tipo de pessoa */}
          <div className="flex gap-6 pt-2 pb-4 border-b border-gray-100">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <input
                type="radio"
                name="tipoPessoa"
                value="fisica"
                checked={isFisica}
                onChange={handleTipoPessoaChange}
                className="h-4 w-4 text-amber-600 border-gray-300 focus:ring-amber-500"
              />
              Pessoa Física
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <input
                type="radio"
                name="tipoPessoa"
                value="juridica"
                checked={!isFisica}
                onChange={handleTipoPessoaChange}
                className="h-4 w-4 text-amber-600 border-gray-300 focus:ring-amber-500"
              />
              Pessoa Jurídica
            </label>
          </div>

          {/* === 1. IDENTIFICAÇÃO E CONTATO === */}
          <section className="space-y-4 pt-2">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">
              1. Identificação
            </h2>

            {/* Nome + Profissão */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-700">
                  Nome completo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nome"
                  placeholder="O seu nome"
                  value={form.nome}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-700">Profissão</label>
                <input
                  type="text"
                  name="profissao"
                  placeholder="A sua profissão"
                  value={form.profissao}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
            </div>

            {/* CPF/CNPJ + Email */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-700">
                  {isFisica ? "CPF" : "CNPJ"}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name={isFisica ? "cpf" : "cnpj"}
                  placeholder={
                    isFisica ? "000.000.000-00" : "00.000.000/0000-00"
                  }
                  value={isFisica ? form.cpf : form.cnpj}
                  onChange={handleChange}
                  onBlur={isFisica ? handleCpfBlur : handleCnpjBlur}
                  required
                  // CORREÇÃO: Adicionada a classe 'border' aos estilos base.
                  className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
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
                <label className="text-sm text-gray-700">
                  E-mail <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="O seu melhor e-mail"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
            </div>
          </section>

          {/* === 2. CREDENCIAIS DE ACESSO === */}
          <section className="space-y-4 pt-4">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">
              2. Credenciais de Acesso
            </h2>

            {/* Senhas */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-700">
                  Senha <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="senha"
                  placeholder="Crie uma senha"
                  value={form.senha}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-700">
                  Confirmar senha <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="confirmarSenha"
                  placeholder="Repita a sua senha"
                  value={form.confirmarSenha}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
            </div>
          </section>

          {/* === 3. INFORMAÇÕES DE ATUAÇÃO === */}
          <section className="space-y-4 pt-4">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">
              3. Informações de Atuação
            </h2>

            {/* Cargo + Organização */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-700">
                  Cargo/Área de Atuação <span className="text-red-500">*</span>
                </label>
                <select
                  name="cargoAreaAtuacao"
                  value={form.cargoAreaAtuacao}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                >
                  <option value="">Selecione</option>
                  <option value="Pesquisador/Acadêmico">
                    Pesquisador/Académico
                  </option>
                  <option value="Profissional de Organização da Sociedade Civil">
                    Profissional de OSC
                  </option>
                  <option value="Gestor Público">Gestor Público</option>
                  <option value="Estudante">Estudante</option>
                  <option value="Jornalista">Jornalista</option>
                  <option value="Profissional do Sistema de Justiça">
                    Profissional do Sistema de Justiça
                  </option>
                  <option value="Educador/Professor">Educador/Professor</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-700">
                  Nome da Organização/Empresa{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="organizacaoNome"
                  placeholder="Onde atua"
                  value={form.organizacaoNome}
                  onChange={handleChange}
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
                placeholder="Instituição de vínculo (se aplicável)"
                value={form.instituicao}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </section>

          {/* === 4. ENDEREÇO (OPCIONAL) === */}
          <section className="space-y-4 pt-4">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">
              4. Endereço
            </h2>

            {/* CEP + Número */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-700">CEP</label>
                <input
                  type="text"
                  name="cep"
                  placeholder="00000-000"
                  value={form.cep}
                  onChange={handleChange}
                  onBlur={handleCepBlur}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                {loadingCep && (
                  <span className="text-xs text-gray-500">
                    A procurar endereço...
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
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </section>

          {/* Botão de Cadastro */}
          <button
            type="submit"
            disabled={registerLoading}
            className="w-full mt-6 rounded-full bg-gradient-to-r from-amber-400 to-amber-300 text-white font-semibold text-base py-3 shadow-md hover:brightness-95 disabled:opacity-70 transition duration-150"
          >
            {registerLoading ? "A registar..." : "Registar"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UserRegisterPage;
