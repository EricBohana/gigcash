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
import { Sparkles, TrendingUp } from "lucide-react";

export default function App() {
  const [budget, setBudget] = useState<BudgetState>(INITIAL_BUDGET_STATE);
  const [bandSettings, setBandSettings] = useState<BandIdentity>(DEFAULT_BAND_IDENTITY);
  
  // Licenciamento liberado diretamente
  const [isActivated, setIsActivated] = useState<boolean>(true);
  const [licenseKey, setLicenseKey] = useState<string>("GIGCASH-PLAY-PREMIUM");

  const handleActivationChange = (status: boolean) => {
    setIsActivated(status);
  };

  const handleLicenseKeyChange = (key: string) => {
    setLicenseKey(key);
  };

  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPresetName, setLoadingPresetName] = useState("");
  const [activePresetId, setActivePresetId] = useState<string | null>(null);

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

  // Atualizar identidade da banda no localStorage
  const handleSettingsChange = (newSettings: BandIdentity) => {
    setBandSettings(newSettings);
    try {
      localStorage.setItem("band_budget_identity", JSON.stringify(newSettings));
    } catch (e) {
      console.error(e);
    }
  };

  // Carregar Presets
  const handleSelectPreset = (preset: BudgetPreset) => {
    setLoadingPresetName(preset.name);
    setIsLoading(true);
    
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

  // Salvar no histórico local
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

  // Carregar orçamento do histórico
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
          
          {/* Logo */}
          <div className="flex items-center space-x-3.5">
            <div className="relative">
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

            <LicenseManager 
              isActivated={isActivated}
              onActivationChange={handleActivationChange}
              licenseKey={licenseKey}
              onLicenseKeyChange={handleLicenseKeyChange}
            />
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
        <p className="text-[10px] text-slate-600">Desenvolvido em conformidade técnica com cálculos de margem de serviço e retenção de impostos.</p>
      </footer>

    </div>
  );
}
