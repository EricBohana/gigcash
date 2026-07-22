/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { BudgetState, CustomMusician, parseCustomMusicians } from "../types";
import { 
  Calendar, MapPin, User, FileText, Compass, BedDouble, 
  Utensils, Sparkles, UserCheck, Megaphone, ShieldCheck, 
  Users, Volume2, Lightbulb, Grid, Zap, Settings, Clock, Hourglass,
  Trash2, ChevronDown
} from "lucide-react";

const EVENT_TIME_PRESETS = [
  "12:00h",
  "13:00h",
  "14:00h",
  "15:00h",
  "16:00h",
  "17:00h",
  "18:00h",
  "19:00h",
  "19:30h",
  "20:00h",
  "20:30h",
  "21:00h",
  "21:30h",
  "22:00h",
  "22:30h",
  "23:00h",
  "23:30h",
  "00:00h",
  "01:00h",
  "02:00h",
  "03:00h",
  "A partir das 20:00h",
  "A partir das 21:00h",
  "A partir das 22:00h",
  "A definir",
];

const EVENT_TIME_QUICK = [
  "19:00h",
  "20:00h",
  "21:00h",
  "22:00h",
  "23:00h",
  "00:00h",
  "A definir",
];

const SHOW_DURATION_PRESETS = [
  "1h (60 min)",
  "1h15 (75 min)",
  "1h30 (90 min)",
  "1h45 (105 min)",
  "2h (120 min)",
  "2h30 (150 min)",
  "3h (180 min)",
  "3h30 (210 min)",
  "4h (240 min)",
  "A definir",
];

const SHOW_DURATION_QUICK = [
  "1h (60 min)",
  "1h30 (90 min)",
  "2h (120 min)",
  "2h30 (150 min)",
  "3h (180 min)",
];

interface BudgetFormProps {
  budget: BudgetState;
  onChangeBudget: (budget: BudgetState) => void;
}

interface CostFieldProps {
  label: string;
  value: number;
  isContratante: boolean;
  onValueChange: (val: number) => void;
  onContratanteChange: (checked: boolean) => void;
  placeholder?: string;
  icon: React.ReactNode;
  themeColor?: "violet" | "pink" | "orange";
}

function CostField({
  label,
  value,
  isContratante,
  onValueChange,
  onContratanteChange,
  placeholder,
  icon,
  themeColor = "pink",
}: CostFieldProps) {
  const colorMap = {
    violet: {
      bg: "bg-violet-500/10",
      text: "text-violet-400",
      border: "border-violet-500/10",
      hoverBorder: "hover:border-violet-500/20",
      pillActive: "bg-gradient-to-r from-violet-500 to-violet-600 text-white shadow-sm font-extrabold",
      pillDotActive: "bg-white",
      pillDotInactive: "bg-violet-500/50",
    },
    pink: {
      bg: "bg-pink-500/10",
      text: "text-pink-400",
      border: "border-pink-500/10",
      hoverBorder: "hover:border-pink-500/20",
      pillActive: "bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-sm font-extrabold",
      pillDotActive: "bg-white",
      pillDotInactive: "bg-pink-500/50",
    },
    orange: {
      bg: "bg-orange-500/10",
      text: "text-orange-400",
      border: "border-orange-500/10",
      hoverBorder: "hover:border-orange-500/20",
      pillActive: "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-sm font-extrabold",
      pillDotActive: "bg-white",
      pillDotInactive: "bg-orange-500/50",
    },
  };

  const colors = colorMap[themeColor];

  return (
    <div className={`bg-slate-900/35 p-4 rounded-xl border border-white/5 ${colors.hoverBorder} transition-all duration-200 space-y-3.5`}>
      {/* 1. Linha Superior: Nome do Campo e Ícone (Sempre visíveis e com espaço garantido) */}
      <div className="flex items-center space-x-2.5 text-slate-200 min-w-0">
        <div className={`p-1.5 rounded-lg shrink-0 ${colors.bg} ${colors.text} border ${colors.border}`}>
          {icon}
        </div>
        <span className="text-xs font-bold uppercase tracking-wider truncate" title={label}>
          {label}
        </span>
      </div>

      {/* 2. Seletores e Valores organizados verticalmente para evitar qualquer sobreposição ou aperto */}
      <div className="space-y-2.5">
        {/* Seletor Segmentado (Banda vs Contratante) - 100% de largura para excelente legibilidade */}
        <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-white/10 h-8.5 shadow-inner w-full">
          <button
            type="button"
            onClick={() => onContratanteChange(false)}
            className={`flex-1 py-1 px-3 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 h-full ${
              !isContratante
                ? colors.pillActive
                : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
            }`}
          >
            <span className={`w-1 h-1 rounded-full ${!isContratante ? colors.pillDotActive : colors.pillDotInactive}`} />
            Banda
          </button>
          <button
            type="button"
            onClick={() => onContratanteChange(true)}
            className={`flex-1 py-1 px-3 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 h-full ${
              isContratante
                ? "bg-gradient-to-r from-violet-500 to-violet-600 text-white shadow-sm font-extrabold"
                : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
            }`}
          >
            <span className={`w-1 h-1 rounded-full ${isContratante ? "bg-white" : "bg-violet-500/50"}`} />
            Contratante
          </button>
        </div>

        {/* Campo de Entrada de Valor ou Aviso de Custo Zero */}
        <div className="w-full h-9 relative">
          {!isContratante ? (
            <div className="relative w-full h-full">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-semibold font-mono z-10">R$</div>
              <input
                type="number"
                value={value === 0 ? "" : value}
                onChange={(e) => onValueChange(Math.max(0, Number(e.target.value)))}
                placeholder={placeholder || "0"}
                className="w-full h-full bg-[#0a1122] border border-white/10 focus:border-pink-500 rounded-lg pl-9 pr-3 text-sm text-white focus:outline-none transition-colors font-mono shadow-inner py-1.5"
              />
            </div>
          ) : (
            <div className="w-full h-full bg-emerald-950/20 border border-emerald-500/15 rounded-lg px-3 flex items-center justify-between text-[11px] text-emerald-400 font-bold shadow-inner">
              <span className="truncate">Providenciado pelo Contratante</span>
              <span className="bg-emerald-500/15 text-[9px] text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/20 font-mono tracking-wider">CUSTO ZERO</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function BudgetForm({ budget, onChangeBudget }: BudgetFormProps) {
  const [customTimeActive, setCustomTimeActive] = React.useState(false);
  const [customDurationActive, setCustomDurationActive] = React.useState(false);
  
  const handleFieldChange = (field: keyof BudgetState, value: any) => {
    onChangeBudget({
      ...budget,
      [field]: value
    });
  };

  const handleCostChange = (costField: keyof BudgetState, isContratanteField: keyof BudgetState, value: number, isContratante: boolean) => {
    onChangeBudget({
      ...budget,
      [costField]: value,
      [isContratanteField]: isContratante
    });
  };

  // Obter a lista de outros profissionais customizados
  const customMusicians = parseCustomMusicians(budget.musicianOutroDesc || "", budget.musicianOutroCount || 0);
  
  // Garantir que sempre exista exatamente um campo vazio no final para que novos apareçam ao digitar
  if (customMusicians.length === 0 || customMusicians[customMusicians.length - 1].name.trim() !== "") {
    customMusicians.push({ name: "", count: 1 });
  }

  const handleCustomMusicianChange = (index: number, field: keyof CustomMusician, value: any) => {
    const newList = [...customMusicians];
    newList[index] = {
      ...newList[index],
      [field]: value
    };

    // Filtrar vazios ao persistir no estado pai
    const filledList = newList.filter(m => m.name.trim() !== "");
    const totalCount = filledList.reduce((sum, m) => sum + m.count, 0);

    onChangeBudget({
      ...budget,
      musicianOutroDesc: filledList.length > 0 ? JSON.stringify(filledList) : "",
      musicianOutroCount: totalCount
    });
  };

  const handleCustomMusicianDelete = (index: number) => {
    const newList = customMusicians.filter((_, idx) => idx !== index);
    const filledList = newList.filter(m => m.name.trim() !== "");
    const totalCount = filledList.reduce((sum, m) => sum + m.count, 0);

    onChangeBudget({
      ...budget,
      musicianOutroDesc: filledList.length > 0 ? JSON.stringify(filledList) : "",
      musicianOutroCount: totalCount
    });
  };

  const handleTopLevelOutroDecrement = () => {
    if (budget.musicianOutroCount <= 0) return;
    
    const filledList = customMusicians.filter(m => m.name.trim() !== "");
    if (filledList.length > 0) {
      const lastIndex = filledList.length - 1;
      const lastItem = filledList[lastIndex];
      if (lastItem.count > 1) {
        filledList[lastIndex] = { ...lastItem, count: lastItem.count - 1 };
      } else {
        filledList.splice(lastIndex, 1);
      }
      const totalCount = filledList.reduce((sum, m) => sum + m.count, 0);
      onChangeBudget({
        ...budget,
        musicianOutroDesc: filledList.length > 0 ? JSON.stringify(filledList) : "",
        musicianOutroCount: totalCount
      });
    } else {
      handleFieldChange("musicianOutroCount", 0);
    }
  };

  const handleTopLevelOutroIncrement = () => {
    const filledList = customMusicians.filter(m => m.name.trim() !== "");
    if (filledList.length > 0) {
      const lastIndex = filledList.length - 1;
      filledList[lastIndex] = { ...filledList[lastIndex], count: filledList[lastIndex].count + 1 };
      const totalCount = filledList.reduce((sum, m) => sum + m.count, 0);
      onChangeBudget({
        ...budget,
        musicianOutroDesc: JSON.stringify(filledList),
        musicianOutroCount: totalCount
      });
    } else {
      onChangeBudget({
        ...budget,
        musicianOutroCount: 1,
        musicianOutroDesc: ""
      });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* SEÇÃO 1: INFORMAÇÕES GERAIS */}
      <div className="card-blur p-6 rounded-2xl border border-white/10 space-y-4">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
          <Settings className="w-4 h-4 text-violet-500" />
          Informações Gerais do Evento
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Identificação do Orçamento
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={budget.name}
                onChange={(e) => handleFieldChange("name", e.target.value)}
                placeholder="Ex: Show Aniversário da Cidade"
                className="w-full bg-[#0a1122] border border-slate-800 focus:border-violet-500 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none transition-colors"
                id="input-budget-name"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Nome do Contratante / Evento
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={budget.clientName}
                onChange={(e) => handleFieldChange("clientName", e.target.value)}
                placeholder="Ex: Prefeitura Municipal de Santos"
                className="w-full bg-[#0a1122] border border-slate-800 focus:border-violet-500 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none transition-colors"
                id="input-client-name"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Local do Evento / Cidade
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={budget.location}
                onChange={(e) => handleFieldChange("location", e.target.value)}
                placeholder="Ex: Santos - SP"
                className="w-full bg-[#0a1122] border border-slate-800 focus:border-violet-500 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none transition-colors"
                id="input-event-location"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Data do Evento
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
              <input
                type="date"
                value={budget.eventDate}
                onChange={(e) => handleFieldChange("eventDate", e.target.value)}
                className="w-full bg-[#0a1122] border border-slate-800 focus:border-violet-500 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none transition-colors"
                id="input-event-date"
              />
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-pink-400 font-medium bg-pink-500/5 px-2.5 py-1.5 rounded-xl border border-pink-500/10">
              <Clock className="w-3.5 h-3.5 text-pink-500" />
              <span>Validade da proposta: 60 dias (Fixo)</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Horário do Evento
              </label>
              <span className="text-[10px] text-violet-400 font-medium">Seleção Inteligente</span>
            </div>
            <div className="space-y-2">
              <div className="relative">
                <Clock className="absolute left-3 top-3 w-4 h-4 text-violet-400 pointer-events-none z-10" />
                <select
                  value={
                    EVENT_TIME_PRESETS.includes(budget.eventTime || "")
                      ? budget.eventTime
                      : customTimeActive || (budget.eventTime && !EVENT_TIME_PRESETS.includes(budget.eventTime))
                      ? "__custom__"
                      : ""
                  }
                  onChange={(e) => {
                    if (e.target.value === "__custom__") {
                      setCustomTimeActive(true);
                    } else {
                      setCustomTimeActive(false);
                      handleFieldChange("eventTime", e.target.value);
                    }
                  }}
                  className="w-full bg-[#0a1122] border border-slate-800 focus:border-violet-500 rounded-xl py-2.5 pl-10 pr-8 text-sm text-white focus:outline-none transition-colors appearance-none cursor-pointer"
                  id="select-event-time"
                >
                  <option value="" disabled className="bg-[#0a1122] text-slate-500">
                    -- Escolha o Horário --
                  </option>
                  {EVENT_TIME_PRESETS.map((time) => (
                    <option key={time} value={time} className="bg-[#0a1122] text-white py-1">
                      {time}
                    </option>
                  ))}
                  <option value="__custom__" className="bg-[#0a1122] text-pink-400 font-bold">
                    ✍️ Outro / Digitar livremente...
                  </option>
                </select>
                <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-slate-500 pointer-events-none" />
              </div>

              {(customTimeActive || (budget.eventTime && !EVENT_TIME_PRESETS.includes(budget.eventTime))) && (
                <input
                  type="text"
                  value={budget.eventTime || ""}
                  onChange={(e) => handleFieldChange("eventTime", e.target.value)}
                  placeholder="Digite o horário personalizado..."
                  className="w-full bg-[#070d1a] border border-violet-500/50 rounded-xl py-2 px-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-400"
                  id="input-event-time"
                  autoFocus
                />
              )}

              {/* Quick Chips */}
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {EVENT_TIME_QUICK.map((time) => {
                  const isSelected = budget.eventTime === time;
                  return (
                    <button
                      key={time}
                      type="button"
                      onClick={() => {
                        setCustomTimeActive(false);
                        handleFieldChange("eventTime", time);
                      }}
                      className={`text-xs px-2 py-0.5 rounded-lg border transition-all cursor-pointer font-medium ${
                        isSelected
                          ? "bg-violet-600 border-violet-500 text-white font-bold shadow-sm shadow-violet-500/20"
                          : "bg-[#0a1122] border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white"
                      }`}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Duração do Show
              </label>
              <span className="text-[10px] text-pink-400 font-medium">Seleção Inteligente</span>
            </div>
            <div className="space-y-2">
              <div className="relative">
                <Hourglass className="absolute left-3 top-3 w-4 h-4 text-pink-400 pointer-events-none z-10" />
                <select
                  value={
                    SHOW_DURATION_PRESETS.includes(budget.showDuration || "")
                      ? budget.showDuration
                      : customDurationActive || (budget.showDuration && !SHOW_DURATION_PRESETS.includes(budget.showDuration))
                      ? "__custom__"
                      : ""
                  }
                  onChange={(e) => {
                    if (e.target.value === "__custom__") {
                      setCustomDurationActive(true);
                    } else {
                      setCustomDurationActive(false);
                      handleFieldChange("showDuration", e.target.value);
                    }
                  }}
                  className="w-full bg-[#0a1122] border border-slate-800 focus:border-pink-500 rounded-xl py-2.5 pl-10 pr-8 text-sm text-white focus:outline-none transition-colors appearance-none cursor-pointer"
                  id="select-show-duration"
                >
                  <option value="" disabled className="bg-[#0a1122] text-slate-500">
                    -- Escolha a Duração --
                  </option>
                  {SHOW_DURATION_PRESETS.map((duration) => (
                    <option key={duration} value={duration} className="bg-[#0a1122] text-white py-1">
                      {duration}
                    </option>
                  ))}
                  <option value="__custom__" className="bg-[#0a1122] text-pink-400 font-bold">
                    ✍️ Outra / Digitar livremente...
                  </option>
                </select>
                <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-slate-500 pointer-events-none" />
              </div>

              {(customDurationActive || (budget.showDuration && !SHOW_DURATION_PRESETS.includes(budget.showDuration))) && (
                <input
                  type="text"
                  value={budget.showDuration || ""}
                  onChange={(e) => handleFieldChange("showDuration", e.target.value)}
                  placeholder="Digite a duração personalizada..."
                  className="w-full bg-[#070d1a] border border-pink-500/50 rounded-xl py-2 px-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-pink-400"
                  id="input-show-duration"
                  autoFocus
                />
              )}

              {/* Quick Chips */}
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {SHOW_DURATION_QUICK.map((duration) => {
                  const isSelected = budget.showDuration === duration;
                  return (
                    <button
                      key={duration}
                      type="button"
                      onClick={() => {
                        setCustomDurationActive(false);
                        handleFieldChange("showDuration", duration);
                      }}
                      className={`text-xs px-2 py-0.5 rounded-lg border transition-all cursor-pointer font-medium ${
                        isSelected
                          ? "bg-pink-600 border-pink-500 text-white font-bold shadow-sm shadow-pink-500/20"
                          : "bg-[#0a1122] border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white"
                      }`}
                    >
                      {duration}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SEÇÃO 2: DETALHAMENTO DE VALORES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COLUNA A: LOGÍSTICA & ESTADIA */}
        <div className="card-blur p-5 rounded-2xl border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 border-b border-white/10 pb-2">
            <Compass className="w-4 h-4 text-violet-500" />
            1. Logística & Hospedagem
          </h3>
          <p className="text-[11px] text-slate-400 font-medium italic -mt-1">
            * Selecione BANDA (entra no orçamento) ou CONTRATANTE (custo zero).
          </p>

          <div className="space-y-4">
            <CostField
              label="Logística / Van / Ônibus / Avião"
              value={budget.logistica}
              isContratante={budget.isContratanteLogistica}
              onValueChange={(val) => handleFieldChange("logistica", val)}
              onContratanteChange={(checked) => handleCostChange("logistica", "isContratanteLogistica", checked ? 0 : budget.logistica, checked)}
              placeholder="Transporte aéreo ou terrestre..."
              icon={<Compass className="w-4 h-4" />}
              themeColor="violet"
            />

            <CostField
              label="Hospedagem"
              value={budget.hospedagem}
              isContratante={budget.isContratanteHospedagem}
              onValueChange={(val) => handleFieldChange("hospedagem", val)}
              onContratanteChange={(checked) => handleCostChange("hospedagem", "isContratanteHospedagem", checked ? 0 : budget.hospedagem, checked)}
              placeholder="Hotéis, diárias de pousada..."
              icon={<BedDouble className="w-4 h-4" />}
              themeColor="violet"
            />

            <CostField
              label="Alimentação"
              value={budget.alimentacao}
              isContratante={budget.isContratanteAlimentacao}
              onValueChange={(val) => handleFieldChange("alimentacao", val)}
              onContratanteChange={(checked) => handleCostChange("alimentacao", "isContratanteAlimentacao", checked ? 0 : budget.alimentacao, checked)}
              placeholder="Refeições do staff e banda..."
              icon={<Utensils className="w-4 h-4" />}
              themeColor="violet"
            />

            <CostField
              label="Camarim"
              value={budget.camarim}
              isContratante={budget.isContratanteCamarim}
              onValueChange={(val) => handleFieldChange("camarim", val)}
              onContratanteChange={(checked) => handleCostChange("camarim", "isContratanteCamarim", checked ? 0 : budget.camarim, checked)}
              placeholder="Frutas, bebidas, buffet do camarim..."
              icon={<Sparkles className="w-4 h-4" />}
              themeColor="violet"
            />
          </div>
        </div>

        {/* COLUNA B: ARTISTAS & PRODUÇÃO */}
        <div className="card-blur p-5 rounded-2xl border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 border-b border-white/10 pb-2">
            <Users className="w-4 h-4 text-pink-500" />
            2. Artistas & Produção
          </h3>
          <p className="text-[11px] text-slate-400 font-medium italic -mt-1">
            * Selecione BANDA (cache/produção) ou CONTRATANTE (custo zero).
          </p>

          <div className="space-y-4">
            <CostField
              label="Banda Completa"
              value={budget.bandaCompleta}
              isContratante={budget.isContratanteBandaCompleta}
              onValueChange={(val) => handleFieldChange("bandaCompleta", val)}
              onContratanteChange={(checked) => handleCostChange("bandaCompleta", "isContratanteBandaCompleta", checked ? 0 : budget.bandaCompleta, checked)}
              placeholder="Cachê total dos músicos..."
              icon={<Users className="w-4 h-4" />}
              themeColor="pink"
            />

            <CostField
              label="Produção / Executivo"
              value={budget.producao}
              isContratante={budget.isContratanteProducao}
              onValueChange={(val) => handleFieldChange("producao", val)}
              onContratanteChange={(checked) => handleCostChange("producao", "isContratanteProducao", checked ? 0 : budget.producao, checked)}
              placeholder="Produtor de campo, stage manager..."
              icon={<UserCheck className="w-4 h-4" />}
              themeColor="pink"
            />

            <CostField
              label="Mídia & Divulgação"
              value={budget.midia}
              isContratante={budget.isContratanteMidia}
              onValueChange={(val) => handleFieldChange("midia", val)}
              onContratanteChange={(checked) => handleCostChange("midia", "isContratanteMidia", checked ? 0 : budget.midia, checked)}
              placeholder="Marketing, fotos, vídeo de show..."
              icon={<Megaphone className="w-4 h-4" />}
              themeColor="pink"
            />

            <CostField
              label="Segurança"
              value={budget.seguranca}
              isContratante={budget.isContratanteSeguranca}
              onValueChange={(val) => handleFieldChange("seguranca", val)}
              onContratanteChange={(checked) => handleCostChange("seguranca", "isContratanteSeguranca", checked ? 0 : budget.seguranca, checked)}
              placeholder="Seguranças contratados de apoio..."
              icon={<ShieldCheck className="w-4 h-4" />}
              themeColor="pink"
            />
          </div>
        </div>

        {/* COLUNA C: EQUIPAMENTO & ESTRUTURA */}
        <div className="card-blur p-5 rounded-2xl border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 border-b border-white/10 pb-2">
            <Volume2 className="w-4 h-4 text-orange-500" />
            3. Estrutura & Equipamento
          </h3>
          <p className="text-[11px] text-slate-400 font-medium italic -mt-1">
            * Selecione BANDA (se incluso) ou CONTRATANTE (se ele providenciar).
          </p>

          <div className="space-y-4">
            <CostField
              label="Equipamento de Som"
              value={budget.equipSom}
              isContratante={budget.isContratanteEquipSom}
              onValueChange={(val) => handleFieldChange("equipSom", val)}
              onContratanteChange={(checked) => handleCostChange("equipSom", "isContratanteEquipSom", checked ? 0 : budget.equipSom, checked)}
              placeholder="Som de P.A, monitores, mesa de som..."
              icon={<Volume2 className="w-4 h-4" />}
              themeColor="orange"
            />

            <CostField
              label="Equipamento de Luz"
              value={budget.equipLuz}
              isContratante={budget.isContratanteEquipLuz}
              onValueChange={(val) => handleFieldChange("equipLuz", val)}
              onContratanteChange={(checked) => handleCostChange("equipLuz", "isContratanteEquipLuz", checked ? 0 : budget.equipLuz, checked)}
              placeholder="Moving lights, refletores, luz de palco..."
              icon={<Lightbulb className="w-4 h-4" />}
              themeColor="orange"
            />

            <CostField
              label="Palco / Praticável"
              value={budget.palco}
              isContratante={budget.isContratantePalco}
              onValueChange={(val) => handleFieldChange("palco", val)}
              onContratanteChange={(checked) => handleCostChange("palco", "isContratantePalco", checked ? 0 : budget.palco, checked)}
              placeholder="Estrutura de palco, grid truss, praticáveis..."
              icon={<Grid className="w-4 h-4" />}
              themeColor="orange"
            />

            <CostField
              label="Gerador"
              value={budget.gerador}
              isContratante={budget.isContratanteGerador}
              onValueChange={(val) => handleFieldChange("gerador", val)}
              onContratanteChange={(checked) => handleCostChange("gerador", "isContratanteGerador", checked ? 0 : budget.gerador, checked)}
              placeholder="Gerador de energia trifásica dedicada..."
              icon={<Zap className="w-4 h-4" />}
              themeColor="orange"
            />
          </div>
        </div>

      </div>

      {/* SEÇÃO 3: INTEGRANTES DA BANDA / MÚSICOS DO SHOW */}
      <div className="card-blur p-6 rounded-2xl border border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
            <Users className="w-5 h-5 text-pink-500" />
            Integrantes & Equipe do Show (Relação de Músicos)
          </h3>
          <span className="self-start text-[10px] bg-pink-500/10 text-pink-400 border border-pink-500/20 px-2 py-0.5 rounded-full font-bold uppercase">
            Escalação do Lineup
          </span>
        </div>
        <p className="text-xs text-slate-400">
          Especifique a quantidade de cada músico profissional e equipe de apoio escalados para este show. Se houver outros profissionais (ex: Produtor Técnico), adicione no campo "Outros".
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-10 gap-3">
          {/* Cantor */}
          <div className="bg-slate-900/40 p-3 rounded-xl border border-white/5 space-y-2 text-center">
            <span className="text-xs font-semibold text-slate-300 block">Cantor</span>
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => handleFieldChange("musicianCantor", Math.max(0, budget.musicianCantor - 1))}
                className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-sm hover:bg-slate-700 cursor-pointer"
              >
                -
              </button>
              <span className="text-sm font-mono font-bold text-white w-6">{budget.musicianCantor}</span>
              <button
                type="button"
                onClick={() => handleFieldChange("musicianCantor", budget.musicianCantor + 1)}
                className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-sm hover:bg-slate-700 cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          {/* Backing Vocal */}
          <div className="bg-slate-900/40 p-3 rounded-xl border border-white/5 space-y-2 text-center">
            <span className="text-xs font-semibold text-slate-300 block">Backing Vocal</span>
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => handleFieldChange("musicianBackingVocal", Math.max(0, budget.musicianBackingVocal - 1))}
                className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-sm hover:bg-slate-700 cursor-pointer"
              >
                -
              </button>
              <span className="text-sm font-mono font-bold text-white w-6">{budget.musicianBackingVocal}</span>
              <button
                type="button"
                onClick={() => handleFieldChange("musicianBackingVocal", budget.musicianBackingVocal + 1)}
                className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-sm hover:bg-slate-700 cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          {/* Guitarrista */}
          <div className="bg-slate-900/40 p-3 rounded-xl border border-white/5 space-y-2 text-center">
            <span className="text-xs font-semibold text-slate-300 block">Guitarrista</span>
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => handleFieldChange("musicianGuitarrista", Math.max(0, budget.musicianGuitarrista - 1))}
                className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-sm hover:bg-slate-700 cursor-pointer"
              >
                -
              </button>
              <span className="text-sm font-mono font-bold text-white w-6">{budget.musicianGuitarrista}</span>
              <button
                type="button"
                onClick={() => handleFieldChange("musicianGuitarrista", budget.musicianGuitarrista + 1)}
                className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-sm hover:bg-slate-700 cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          {/* Violão */}
          <div className="bg-slate-900/40 p-3 rounded-xl border border-white/5 space-y-2 text-center">
            <span className="text-xs font-semibold text-slate-300 block">Violão</span>
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => handleFieldChange("musicianViolao", Math.max(0, budget.musicianViolao - 1))}
                className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-sm hover:bg-slate-700 cursor-pointer"
              >
                -
              </button>
              <span className="text-sm font-mono font-bold text-white w-6">{budget.musicianViolao}</span>
              <button
                type="button"
                onClick={() => handleFieldChange("musicianViolao", budget.musicianViolao + 1)}
                className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-sm hover:bg-slate-700 cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          {/* Baixista */}
          <div className="bg-slate-900/40 p-3 rounded-xl border border-white/5 space-y-2 text-center">
            <span className="text-xs font-semibold text-slate-300 block">Baixista</span>
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => handleFieldChange("musicianBaixista", Math.max(0, budget.musicianBaixista - 1))}
                className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-sm hover:bg-slate-700 cursor-pointer"
              >
                -
              </button>
              <span className="text-sm font-mono font-bold text-white w-6">{budget.musicianBaixista}</span>
              <button
                type="button"
                onClick={() => handleFieldChange("musicianBaixista", budget.musicianBaixista + 1)}
                className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-sm hover:bg-slate-700 cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          {/* Tecladista */}
          <div className="bg-slate-900/40 p-3 rounded-xl border border-white/5 space-y-2 text-center">
            <span className="text-xs font-semibold text-slate-300 block">Tecladista</span>
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => handleFieldChange("musicianTecladista", Math.max(0, budget.musicianTecladista - 1))}
                className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-sm hover:bg-slate-700 cursor-pointer"
              >
                -
              </button>
              <span className="text-sm font-mono font-bold text-white w-6">{budget.musicianTecladista}</span>
              <button
                type="button"
                onClick={() => handleFieldChange("musicianTecladista", budget.musicianTecladista + 1)}
                className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-sm hover:bg-slate-700 cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          {/* Percussionista */}
          <div className="bg-slate-900/40 p-3 rounded-xl border border-white/5 space-y-2 text-center">
            <span className="text-xs font-semibold text-slate-300 block">Percussionista</span>
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => handleFieldChange("musicianPercussionista", Math.max(0, budget.musicianPercussionista - 1))}
                className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-sm hover:bg-slate-700 cursor-pointer"
              >
                -
              </button>
              <span className="text-sm font-mono font-bold text-white w-6">{budget.musicianPercussionista}</span>
              <button
                type="button"
                onClick={() => handleFieldChange("musicianPercussionista", budget.musicianPercussionista + 1)}
                className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-sm hover:bg-slate-700 cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          {/* Baterista */}
          <div className="bg-slate-900/40 p-3 rounded-xl border border-white/5 space-y-2 text-center">
            <span className="text-xs font-semibold text-slate-300 block">Baterista</span>
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => handleFieldChange("musicianBaterista", Math.max(0, budget.musicianBaterista - 1))}
                className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-sm hover:bg-slate-700 cursor-pointer"
              >
                -
              </button>
              <span className="text-sm font-mono font-bold text-white w-6">{budget.musicianBaterista}</span>
              <button
                type="button"
                onClick={() => handleFieldChange("musicianBaterista", budget.musicianBaterista + 1)}
                className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-sm hover:bg-slate-700 cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          {/* Roadie */}
          <div className="bg-slate-900/40 p-3 rounded-xl border border-white/5 space-y-2 text-center">
            <span className="text-xs font-semibold text-slate-300 block">Roadie</span>
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => handleFieldChange("musicianRoadie", Math.max(0, budget.musicianRoadie - 1))}
                className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-sm hover:bg-slate-700 cursor-pointer"
              >
                -
              </button>
              <span className="text-sm font-mono font-bold text-white w-6">{budget.musicianRoadie}</span>
              <button
                type="button"
                onClick={() => handleFieldChange("musicianRoadie", budget.musicianRoadie + 1)}
                className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-sm hover:bg-slate-700 cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          {/* Outro */}
          <div className="bg-slate-900/40 p-3 rounded-xl border border-white/5 space-y-2 text-center">
            <span className="text-xs font-semibold text-slate-300 block">Outros</span>
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={handleTopLevelOutroDecrement}
                className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-sm hover:bg-slate-700 cursor-pointer"
              >
                -
              </button>
              <span className="text-sm font-mono font-bold text-white w-6">{budget.musicianOutroCount}</span>
              <button
                type="button"
                onClick={handleTopLevelOutroIncrement}
                className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-sm hover:bg-slate-700 cursor-pointer"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {budget.musicianOutroCount > 0 && (
          <div className="bg-[#0a1122] p-4 rounded-xl border border-slate-800 space-y-3">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
              Profissionais Adicionais / Equipe de Apoio
            </label>
            <div className="space-y-3">
              {customMusicians.map((m, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row items-center gap-3 bg-[#070a13] p-3 rounded-xl border border-slate-800/80">
                  <div className="flex-1 w-full">
                    <input
                      type="text"
                      value={m.name}
                      onChange={(e) => handleCustomMusicianChange(idx, "name", e.target.value)}
                      placeholder={idx === customMusicians.length - 1 ? "Adicionar outro profissional (ex: Roadie, Técnico)..." : "Profissional (ex: Roadie, Técnico)"}
                      className="w-full bg-[#0a1122] border border-slate-800 focus:border-pink-500 rounded-xl py-2 px-3 text-sm text-white focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">Qtd:</span>
                      <button
                        type="button"
                        onClick={() => handleCustomMusicianChange(idx, "count", Math.max(1, m.count - 1))}
                        className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-sm hover:bg-slate-700 cursor-pointer disabled:opacity-50"
                        disabled={!m.name}
                      >
                        -
                      </button>
                      <span className="text-sm font-mono font-bold text-white w-6 text-center">{m.count}</span>
                      <button
                        type="button"
                        onClick={() => handleCustomMusicianChange(idx, "count", m.count + 1)}
                        className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-sm hover:bg-slate-700 cursor-pointer disabled:opacity-50"
                        disabled={!m.name}
                      >
                        +
                      </button>
                    </div>
                    {idx < customMusicians.length - 1 && (
                      <button
                        type="button"
                        onClick={() => handleCustomMusicianDelete(idx)}
                        className="p-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 cursor-pointer"
                        title="Remover"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
