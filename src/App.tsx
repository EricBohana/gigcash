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
import LicenseManager from "./components/LicenseManager";
import { 
  Music, Sparkles, TrendingUp, HelpCircle, 
  Laptop, Compass, ShieldAlert, BadgeInfo, LogOut
} from "lucide-react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "./lib/firebase";
import Login from "./components/Login";

export default function App() {
  const [budget, setBudget] = useState<BudgetState>(INITIAL_BUDGET_STATE);
  const [bandSettings, setBandSettings] = useState<BandIdentity>(DEFAULT_BAND_IDENTITY);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);

  // Firebase auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);
  
  // Licensing and Activation State (Gigcash ownership checks)
  const [isActivated, setIsActivated] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem("gigcash_activated");
      return stored === null ? true : stored === "true";
    } catch {
      return true;
    }
  });

  const [licenseKey, setLicenseKey] = useState<string>(() => {
    try {
      const stored = localStorage.getItem("gigcash_license_key");
      return stored || "GIGCASH-PLAY-PREMIUM";
    } catch {
      return "GIGCASH-PLAY-PREMIUM";
    }
  });

  const [inputKeyTemp, setInputKeyTemp] = useState("");
  const [lockMessage, setLockMessage] = useState("");

  const handleActivationChange = (status: boolean) => {
    setIsActivated(status);
    try {
      localStorage.setItem("gigcash_activated", String(status));
    } catch (e) {
      console.error(e);
    }
  };

  const handleLicenseKeyChange = (key: string) => {
    setLicenseKey(key);
    try {
      localStorage.setItem("gigcash_license_key", key);
    } catch (e) {
      console.error(e);
    }
  };

  const handleUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = inputKeyTemp.trim().toUpperCase();
    if (cleanKey === "GIGCASH-PLAY-PREMIUM" || cleanKey.startsWith("GIG-") && cleanKey.length >= 12) {
      handleLicenseKeyChange(cleanKey);
      handleActivationChange(true);
      setLockMessage("");
    } else {
      setLockMessage("Chave inválida. Use a chave de demonstração: GIGCASH-PLAY-PREMIUM");
    }
  };

  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPresetName, setLoadingPresetName] = useState("");
  const [activePresetId, setActivePresetId] = useState<string | null>(null);

  // Load custom band settings on startup
  useEffect(() => {
    try {
      const storedSettings = localStorage.getItem("band_budget_identity");
      if (storedSettings) {
        const parsed = JSON.parse(storedSettings);
        // If they still have the old terms or if terms don't have the new observations, update them
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

  // Early returns for SaaS authentication flow
  if (isAuthLoading) {
    return (
      <div className="min-h-screen gradient-bg text-slate-100 flex items-center justify-center font-sans">
        <div className="text-center space-y-4">
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-pink-500 to-orange-500 rounded-2xl blur-md opacity-70 animate-pulse" />
            <div className="relative w-16 h-16 rounded-2xl bg-[#0a1122] border border-white/10 flex items-center justify-center font-sans overflow-hidden select-none">
              <span className="text-2xl font-black bg-gradient-to-r from-[#3B82F6] to-[#F97316] bg-clip-text text-transparent tracking-tighter pl-0.5">
                GC
              </span>
              <span className="absolute bottom-1 right-1.5 text-xs animate-bounce" style={{ animationDuration: '3s' }}>
                ⭐
              </span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-slate-400 font-medium">
            <svg className="animate-spin h-4 w-4 text-pink-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Carregando painel de acesso...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  // Update band settings in localStorage
  const handleSettingsChange = (newSettings: BandIdentity) => {
    setBandSettings(newSettings);
    try {
      localStorage.setItem("band_budget_identity", JSON.stringify(newSettings));
    } catch (e) {
      console.error(e);
    }
  };

  // Trigger simulated loader when a Preset Template is chosen
  const handleSelectPreset = (preset: BudgetPreset) => {
    setLoadingPresetName(preset.name);
    setIsLoading(true);
    
    // Simulate loading data
    setTimeout(() => {
      const mergedBudget: BudgetState = {
        ...INITIAL_BUDGET_STATE,
        ...preset.data,
        id: "preset-" + preset.id,
        name: preset.name,
      };
      setBudget(mergedBudget);
      setActivePresetId(preset.id);
      setIsLoading(false);
    }, 1200);
  };

  // Save budget to history
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

  // Load budget from history (trigger simulated loader)
  const handleLoadBudget = (loadedBudget: BudgetState) => {
    setLoadingPresetName(loadedBudget.name);
    setIsLoading(true);
    
    setTimeout(() => {
      setBudget(loadedBudget);
      setActivePresetId(null);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen gradient-bg text-slate-100 flex flex-col font-sans selection:bg-pink-500 selection:text-white pb-12 relative overflow-hidden">
      
      {/* BACKGROUND GRAPHICS & LIGHT SPOTS */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-violet-600/10 via-pink-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-pink-500/5 via-orange-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* LOADER */}
      <LoadingIndicator isLoading={isLoading} presetName={loadingPresetName} />

      {/* HEADER DE MARCA */}
      <header className="border-b border-white/5 bg-[#0b0f19]/60 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Logo Vibe Show Noturno */}
          <div className="flex items-center space-x-3.5">
            <div className="relative">
              {/* Pulse Glowing Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-pink-500 to-orange-500 rounded-2xl blur-md opacity-70 animate-pulse" />
              <div className="relative w-11 h-11 rounded-2xl bg-[#0a1122] border border-white/10 flex items-center justify-center font-sans overflow-hidden select-none">
                <span className="text-lg font-black bg-gradient-to-r from-[#3B82F6] to-[#F97316] bg-clip-text text-transparent tracking-tighter">
                  GC
                </span>
                <span className="absolute bottom-0.5 right-1 text-[8px] animate-bounce" style={{ animationDuration: '3s' }}>
                  ⭐
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

          <div className="flex items-center gap-4">
            {/* Quick Stats Summary Header */}
            <div className="hidden lg:flex items-center space-x-6 text-xs bg-slate-900/30 p-2 px-4 rounded-xl border border-white/5">
              <div className="text-center">
                <span className="text-slate-500 uppercase font-semibold text-[9px] block tracking-wider">Identidade ativa</span>
                <span className="text-pink-400 font-bold">{bandSettings.name}</span>
              </div>
              <div className="w-px h-6 bg-slate-800" />
              <div className="text-center">
                <span className="text-slate-500 uppercase font-semibold text-[9px] block tracking-wider">Moeda</span>
                <span className="text-slate-300 font-mono font-bold">BRL (R$)</span>
              </div>
            </div>

            {/* Licenciamento / Ativação */}
            <LicenseManager 
              isActivated={isActivated}
              onActivationChange={handleActivationChange}
              licenseKey={licenseKey}
              onLicenseKeyChange={handleLicenseKeyChange}
            />

            {/* Logout SaaS Button */}
            <button
              onClick={() => auth.signOut()}
              className="px-3.5 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
              title="Sair do aplicativo"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sair</span>
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
        {/* SECTION 2: GRID COM FORMULÁRIOS E TOTAIS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LADO ESQUERDO: FORMULÁRIOS DE CUSTO E CONFIGURAÇÃO (60%) */}
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

          {/* LADO DIREITO: CARDS DE VALORES TOTAIS E EXPORTAÇÃO (40%) */}
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

            {/* EXPORTAR ORÇAMENTO EM PDF */}
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
        <p className="text-[10px] text-slate-600">Desenvolvido em conformidade técnica com cálculos de margem de serviço e retenção de impostos.</p>
      </footer>

      {/* LOCK OVERLAY IF NOT ACTIVATED */}
      {!isActivated && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/95 backdrop-blur-xl p-4 text-center">
          <div className="max-w-md w-full bg-[#151c30] border border-white/10 rounded-3xl p-8 space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute -top-12 -left-12 w-40 h-40 bg-pink-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-violet-500/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="mx-auto w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center animate-pulse">
              <ShieldAlert className="w-8 h-8 text-red-400" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white tracking-tight">Aplicativo GIGCASH Bloqueado</h2>
              <p className="text-sm text-slate-300">
                Esta cópia do GIGCASH requer uma licença ativa para ser utilizada neste dispositivo.
              </p>
            </div>

            <div className="p-4 bg-slate-950/50 rounded-2xl border border-white/5 space-y-3 text-left">
              <div className="flex items-center gap-2 text-xs font-bold text-pink-400 uppercase tracking-wider">
                <Sparkles className="w-4.5 h-4.5 text-pink-500 animate-pulse" />
                Propriedade do Aplicativo
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Insira sua chave de licença para validar a propriedade deste dispositivo. Se você realizou o pagamento na Play Store, utilize a sua chave de ativação.
              </p>
            </div>

            <form onSubmit={handleUnlockSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Insira sua chave (Ex: GIGCASH-PLAY-PREMIUM)"
                className="w-full px-4 py-3 bg-slate-950 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-pink-500 text-white font-mono placeholder:text-slate-500 text-center uppercase"
                value={inputKeyTemp}
                onChange={(e) => setInputKeyTemp(e.target.value)}
              />
              
              {lockMessage && (
                <p className="text-[11px] text-red-400 font-medium">{lockMessage}</p>
              )}

              <button
                type="submit"
                className="w-full gradient-btn py-3 px-4 rounded-xl text-white font-bold text-sm transition-all cursor-pointer shadow-lg hover:shadow-[0_0_20px_rgba(236,72,153,0.3)]"
              >
                Validar e Desbloquear
              </button>
            </form>

            <div className="pt-4 border-t border-white/5 flex flex-col gap-2">
              <p className="text-[10px] text-slate-400">
                Como integrar com Google Play Console / Compra Direct? Abra as instruções detalhadas na aba correspondente do gerenciador.
              </p>
              <span className="text-[9px] text-slate-600 font-mono">
                Chave demonstrativa para testes: <strong className="text-pink-400 font-bold">GIGCASH-PLAY-PREMIUM</strong>
              </span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
