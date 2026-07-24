/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  INITIAL_BUDGET_STATE, 
  DEFAULT_BAND_IDENTITY, 
  BudgetState, 
  BandIdentity, 
  BudgetPreset,
  calculateTotalBudget
} from "./types";
import BudgetForm from "./components/BudgetForm";
import BudgetSummary from "./components/BudgetSummary";
import BandSettings from "./components/BandSettings";
import BudgetHistory from "./components/BudgetHistory";
import PdfExportButton from "./components/PdfExportButton";
import LoadingIndicator from "./components/LoadingIndicator";
import { Sparkles, TrendingUp, Lock, Mail, Key, UserPlus, LogIn, LogOut, CheckCircle2, AlertCircle } from "lucide-react";

// Chave padrão exigida no cadastro para validar a compra da Kiwify
const VALID_LICENSE_KEY = "GIG-2026-PRO";

export default function App() {
  const [budget, setBudget] = useState<BudgetState>(INITIAL_BUDGET_STATE);
  const [bandSettings, setBandSettings] = useState<BandIdentity>(DEFAULT_BAND_IDENTITY);
  
  // ESTADOS DE AUTENTICAÇÃO E CADASTRO
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login"); 
  
  // Form de Login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Form de Cadastro (Primeiro Acesso)
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regPasswordConfirm, setRegPasswordConfirm] = useState("");
  const [regKey, setRegKey] = useState("");

  // Mensagens de erro / sucesso
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);

  // User ativo
  const [currentUserEmail, setCurrentUserEmail] = useState<string>("");

  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPresetName, setLoadingPresetName] = useState("");

  // 1. Verificar se já existe sessão ativa no navegador
  useEffect(() => {
    const activeSession = localStorage.getItem("gigcash_active_session");
    if (activeSession) {
      setCurrentUserEmail(activeSession);
      setIsLoggedIn(true);
    }
  }, []);

  // CARREGAR CADASTROS EXISTENTES
  const getRegisteredUsers = (): Record<string, string> => {
    try {
      const users = localStorage.getItem("gigcash_registered_users");
      return users ? JSON.parse(users) : {};
    } catch {
      return {};
    }
  };

  // AÇÃO: REALIZAR CADASTRO (PRIMEIRO ACESSO)
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);

    const emailClean = regEmail.trim().toLowerCase();
    const keyClean = regKey.trim().toUpperCase();

    if (!emailClean || !regPassword) {
      setAuthError("Por favor, preencha todos os campos.");
      return;
    }

    if (regPassword !== regPasswordConfirm) {
      setAuthError("As senhas informadas não coincidem.");
      return;
    }

    if (regPassword.length < 6) {
      setAuthError("A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    // Validar Chave de Compra
    if (keyClean !== VALID_LICENSE_KEY && !keyClean.startsWith("GIG-")) {
      setAuthError("Código de Compra inválido. Verifique a chave recebida no seu e-mail da Kiwify.");
      return;
    }

    const users = getRegisteredUsers();

    if (users[emailClean]) {
      setAuthError("Este e-mail já possui uma conta cadastrada. Faça login na aba 'Entrar'.");
      return;
    }

    // Salva a nova conta (E-mail -> Senha)
    users[emailClean] = regPassword;
    localStorage.setItem("gigcash_registered_users", JSON.stringify(users));

    // Salva a sessão ativa
    localStorage.setItem("gigcash_active_session", emailClean);
    setCurrentUserEmail(emailClean);

    setAuthSuccess("Conta criada com sucesso! Acessando o painel...");
    setTimeout(() => {
      setIsLoggedIn(true);
      setAuthSuccess(null);
    }, 1000);
  };

  // AÇÃO: REALIZAR LOGIN
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);

    const emailClean = loginEmail.trim().toLowerCase();
    const users = getRegisteredUsers();

    if (!users[emailClean]) {
      setAuthError("E-mail não cadastrado. Vá na aba 'Primeiro Acesso' para criar sua conta.");
      return;
    }

    if (users[emailClean] !== loginPassword) {
      setAuthError("E-mail ou senha incorretos.");
      return;
    }

    // Login efetuado com sucesso
    localStorage.setItem("gigcash_active_session", emailClean);
    setCurrentUserEmail(emailClean);
    setIsLoggedIn(true);
  };

  // AÇÃO: SAIR / LOGOUT
  const handleLogout = () => {
    if (window.confirm("Deseja realmente sair da sua conta?")) {
      localStorage.removeItem("gigcash_active_session");
      setIsLoggedIn(false);
      setCurrentUserEmail("");
    }
  };

  // Carregar configurações da banda ao iniciar
  useEffect(() => {
    try {
      const storedSettings = localStorage.getItem("band_budget_identity");
      if (storedSettings) {
        const parsed = JSON.parse(storedSettings);
        if (
          !parsed.terms || 
          parsed.terms === "50% no ato da contratação e 50% até um dia antes do evento, vide contrato." ||
          !parsed.terms.includes("Reserva de data mediante sinal")
        ) {
          parsed.terms = "1. Reserva de data mediante sinal de 50%.\n2. Alimentação e camarim por conta do contratante, caso não inclusos neste orçamento.\n3. O contratante deve providenciar energia elétrica trifásica aterrada de acordo com o rider técnico.\n4. Validade da proposta: 60 dias.";
          localStorage.setItem("band_budget_identity", JSON.stringify(parsed));
        }
        setBandSettings(parsed);
      }
    } catch (e) {
      console.error("Erro ao carregar configurações de identidade:", e);
    }
  }, []);

  const handleSettingsChange = (newSettings: BandIdentity) => {
    setBandSettings(newSettings);
    try {
      localStorage.setItem("band_budget_identity", JSON.stringify(newSettings));
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveCurrent = (name: string) => {
    const updatedBudget: BudgetState = {
      ...budget,
      name,
      id: budget.id && !budget.id.startsWith("preset-") ? budget.id : "budget-" + Date.now()
    };
    setBudget(updatedBudget);

    try {
      const stored = localStorage.getItem("band_budgets_history");
      let list: BudgetState[] = stored ? JSON.parse(stored) : [];
      list = list.filter((b) => b.id !== updatedBudget.id);
      list.unshift(updatedBudget);
      localStorage.setItem("band_budgets_history", JSON.stringify(list));
    } catch (e) {
      console.error(e);
    }
  };

  const handleLoadBudget = (loadedBudget: BudgetState) => {
    setLoadingPresetName(loadedBudget.name);
    setIsLoading(true);
    
    setTimeout(() => {
      setBudget(loadedBudget);
      setIsLoading(false);
    }, 1000);
  };

  // ==========================================
  // TELA DE AUTENTICAÇÃO (LOGIN / CADASTRO)
  // ==========================================
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen gradient-bg text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-y-auto font-sans py-12">
        <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gradient-to-br from-violet-600/20 via-pink-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-md w-full relative z-10">
          <div className="card-blur rounded-3xl p-8 border border-white/10 shadow-2xl space-y-6">
            
            {/* Logo */}
            <div className="flex flex-col items-center justify-center space-y-2 text-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-pink-500 to-orange-500 rounded-2xl blur-md opacity-70 animate-pulse" />
                <div className="relative w-14 h-14 rounded-2xl bg-[#0a1122] border border-white/10 flex items-center justify-center font-sans overflow-hidden">
                  <span className="text-2xl font-black bg-gradient-to-r from-[#3B82F6] to-[#F97316] bg-clip-text text-transparent">
                    GC
                  </span>
                </div>
              </div>

              <div>
                <h1 className="text-2xl font-black text-white tracking-tight">
                  GIG<span className="gradient-text">CASH</span> <span className="text-xs font-bold text-pink-400 bg-pink-500/20 px-2 py-0.5 rounded-full">PRO</span>
                </h1>
                <p className="text-xs text-slate-400 mt-1">Plataforma Exclusiva de Orçamentos</p>
              </div>
            </div>

            {/* Alternador de Abas (Entrar vs Primeiro Acesso) */}
            <div className="flex bg-slate-950/70 p-1 rounded-xl border border-white/5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => { setAuthMode("login"); setAuthError(null); setAuthSuccess(null); }}
                className={`flex-1 py-2.5 rounded-lg transition flex items-center justify-center gap-1.5 ${
                  authMode === "login" 
                    ? "bg-gradient-to-r from-violet-600 to-pink-500 text-white shadow-md" 
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                Entrar
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode("register"); setAuthError(null); setAuthSuccess(null); }}
                className={`flex-1 py-2.5 rounded-lg transition flex items-center justify-center gap-1.5 ${
                  authMode === "register" 
                    ? "bg-gradient-to-r from-violet-600 to-pink-500 text-white shadow-md" 
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                Primeiro Acesso
              </button>
            </div>

            {/* FORMULÁRIO DE LOGIN */}
            {authMode === "login" && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-pink-400" />
                    Seu E-mail
                  </label>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="seuemail@exemplo.com"
                    className="w-full bg-slate-950/70 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-pink-400" />
                    Sua Senha
                  </label>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950/70 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-violet-600 via-pink-500 to-orange-500 hover:opacity-95 text-white font-bold rounded-xl text-sm transition shadow-lg shadow-pink-500/20 flex items-center justify-center gap-2 mt-2"
                >
                  <LogIn className="w-4 h-4" />
                  Entrar no Painel
                </button>
              </form>
            )}

            {/* FORMULÁRIO DE CADASTRO (PRIMEIRO ACESSO) */}
            {authMode === "register" && (
              <form onSubmit={handleRegister} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-pink-400" />
                    E-mail de Assinante
                  </label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="O mesmo e-mail da compra Kiwify"
                    className="w-full bg-slate-950/70 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Crie uma Senha</label>
                    <input
                      type="password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Mínimo 6 dígitos"
                      className="w-full bg-slate-950/70 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Confirme a Senha</label>
                    <input
                      type="password"
                      value={regPasswordConfirm}
                      onChange={(e) => setRegPasswordConfirm(e.target.value)}
                      placeholder="Repita a senha"
                      className="w-full bg-slate-950/70 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-pink-400" />
                    Código de Compra (Kiwify)
                  </label>
                  <input
                    type="text"
                    value={regKey}
                    onChange={(e) => setRegKey(e.target.value)}
                    placeholder="Ex: GIG-XXXX-XXXX"
                    className="w-full bg-slate-950/70 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white font-mono placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition uppercase"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-violet-600 via-pink-500 to-orange-500 hover:opacity-95 text-white font-bold rounded-xl text-sm transition shadow-lg shadow-pink-500/20 flex items-center justify-center gap-2 mt-2"
                >
                  <UserPlus className="w-4 h-4" />
                  Cadastrar e Acessar
                </button>
              </form>
            )}

            {/* MENSAGENS DE ALERTA */}
            {authError && (
              <div className="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 p-3 rounded-xl border border-red-500/20">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            {authSuccess && (
              <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{authSuccess}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // PAINEL PRINCIPAL (SISTEMA LIBERADO)
  // ==========================================
  return (
    <div className="min-h-screen gradient-bg text-slate-100 flex flex-col font-sans selection:bg-pink-500 selection:text-white pb-12 relative overflow-hidden">
      
      {/* BACKGROUND GRAPHICS */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-violet-600/10 via-pink-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-pink-500/5 via-orange-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* LOADER */}
      <LoadingIndicator isLoading={isLoading} presetName={loadingPresetName} />

      {/* HEADER DE MARCA */}
      <header className="border-b border-white/5 bg-[#0b0f19]/60 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Logo */}
          <div className="flex items-center space-x-3.5">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-pink-500 to-orange-500 rounded-2xl blur-md opacity-70 animate-pulse" />
              <div className="relative w-11 h-11 rounded-2xl bg-[#0a1122] border border-white/10 flex items-center justify-center font-sans overflow-hidden select-none">
                <span className="text-lg font-black bg-gradient-to-r from-[#3B82F6] to-[#F97316] bg-clip-text text-transparent tracking-tighter">
                  GC
                </span>
              </div>
            </div>
            
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-white tracking-tight">
                  GIG<span className="gradient-text">CASH</span>
                </h1>
                <span className="text-[9px] font-bold bg-pink-500/20 text-pink-400 px-2 py-0.5 rounded-full border border-pink-500/30">
                  PRO
                </span>
              </div>
              <p className="text-xs text-slate-400">Orçamentos de shows rápidos, automáticos e profissionais</p>
            </div>
          </div>

          {/* Usuário Conectado & Botão de Sair */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-[10px] text-slate-500 font-semibold uppercase">Conectado como</span>
              <span className="text-xs text-pink-400 font-medium font-mono">{currentUserEmail}</span>
            </div>

            <button
              onClick={handleLogout}
              title="Sair da Conta"
              className="flex items-center gap-2 px-3 py-2 bg-slate-900/60 hover:bg-slate-800 border border-white/10 rounded-xl text-xs text-slate-300 hover:text-white transition"
            >
              <LogOut className="w-3.5 h-3.5 text-slate-400" />
              <span>Sair</span>
            </button>
          </div>

        </div>
      </header>

      {/* CORE WRAPPER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1 w-full">
        
        {/* BANNER INFORMATIVO */}
        <div className="relative rounded-3xl p-6 overflow-hidden border border-white/10 bg-gradient-to-r from-[#151c30] via-slate-900/40 to-[#0a1122]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-violet-600/10 via-pink-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-pink-400 font-semibold text-xs uppercase tracking-widest">
                <Sparkles className="w-4 h-4 text-violet-500 animate-bounce" />
                Custos de Show Flexíveis
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">
                Calcule custos de shows e eventos em segundos
              </h2>
              <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
                Insira as despesas de logística, hospedagem, equipe e estrutura de palco. Defina se cada item é de responsabilidade da banda ou providenciado diretamente pelo contratante para emitir propostas em PDF personalizadas.
              </p>
            </div>
            <div className="flex-shrink-0 bg-slate-950/50 p-4 rounded-2xl border border-white/5 flex flex-col justify-center text-center">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Valor Estimado</span>
              <span className="text-2xl font-extrabold text-pink-400 mt-1 font-mono">R$ {calculateTotalBudget(budget).toLocaleString("pt-BR")}</span>
              <span className="text-[9px] text-violet-400 font-semibold mt-1">Cálculo Comercial Ativo</span>
            </div>
          </div>
        </div>

        {/* GRID COM FORMULÁRIOS E TOTAIS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LADO ESQUERDO: FORMULÁRIOS (60%) */}
          <div className="lg:col-span-7 space-y-8">
            <section id="budget-form-section">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-violet-400" />
                  Preenchimento de Custos
                </h2>
                <span className="text-[10px] text-slate-500">Insira valores brutos ou use calculadoras automáticas</span>
              </div>
              
              <BudgetForm 
                budget={budget}
                onChangeBudget={setBudget}
              />
            </section>

            {/* IDENTIDADE DA BANDA */}
            <section id="band-settings-section">
              <BandSettings 
                settings={bandSettings}
                onChangeSettings={handleSettingsChange}
              />
            </section>

            {/* MEUS ORÇAMENTOS (HISTÓRICO LOCAL) */}
            <section id="budget-history-section">
              <BudgetHistory 
                currentBudget={budget}
                onLoadBudget={handleLoadBudget}
                onSaveCurrent={handleSaveCurrent}
              />
            </section>
          </div>

          {/* LADO DIREITO: VALORES TOTAIS E PDF (40%) */}
          <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-24">
            
            <section id="budget-summary-section">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Valores Totais & Rateio
                </h2>
                <span className="text-[10px] text-slate-500">Cálculo em tempo real</span>
              </div>
              
              <BudgetSummary 
                budget={budget}
              />
            </section>

            {/* EXPORTAR PDF */}
            <section id="export-pdf-section" className="card-blur p-5 rounded-2xl border border-white/10 space-y-4 shadow-xl">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white">Finalizar Proposta Comercial</h3>
                <p className="text-xs text-slate-400">Gere um documento profissional em PDF com a identidade visual da banda.</p>
              </div>
              
              <PdfExportButton 
                budget={budget}
                bandSettings={bandSettings}
              />
            </section>

          </div>

        </div>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/5 mt-16 pt-8 text-center text-xs text-slate-500 space-y-2">
        <p>GIGCASH Pro © 2026 • Projetado com foco em alta conversão e controle operacional para músicos.</p>
      </footer>

    </div>
  );
}
