/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BudgetState, calculateTotalBudget, getMusiciansList } from "../types";
import { DollarSign, Info, Shield, CheckCircle2, AlertCircle, Users, Clock, Calendar, MapPin, User, Hourglass } from "lucide-react";

interface BudgetSummaryProps {
  budget: BudgetState;
}

export default function BudgetSummary({ budget }: BudgetSummaryProps) {
  
  const finalPrice = calculateTotalBudget(budget);

  // Group items into Direct costs (paid by band) and Contratante costs (provided by contractor)
  const items = [
    { name: "Logística / Van / Ônibus / Avião", value: budget.logistica, isContratante: budget.isContratanteLogistica, category: "Logística" },
    { name: "Hospedagem", value: budget.hospedagem, isContratante: budget.isContratanteHospedagem, category: "Logística" },
    { name: "Alimentação", value: budget.alimentacao, isContratante: budget.isContratanteAlimentacao, category: "Logística" },
    { name: "Camarim", value: budget.camarim, isContratante: budget.isContratanteCamarim, category: "Logística" },
    { name: "Banda Completa", value: budget.bandaCompleta, isContratante: budget.isContratanteBandaCompleta, category: "Artistas" },
    { name: "Produção / Executivo", value: budget.producao, isContratante: budget.isContratanteProducao, category: "Artistas" },
    { name: "Mídia & Divulgação", value: budget.midia, isContratante: budget.isContratanteMidia, category: "Artistas" },
    { name: "Segurança", value: budget.seguranca, isContratante: budget.isContratanteSeguranca, category: "Artistas" },
    { name: "Equipamento de Som", value: budget.equipSom, isContratante: budget.isContratanteEquipSom, category: "Estrutura" },
    { name: "Equipamento de Luz", value: budget.equipLuz, isContratante: budget.isContratanteEquipLuz, category: "Estrutura" },
    { name: "Palco / Praticável", value: budget.palco, isContratante: budget.isContratantePalco, category: "Estrutura" },
    { name: "Gerador", value: budget.gerador, isContratante: budget.isContratanteGerador, category: "Estrutura" },
  ];

  const directItems = items.filter(i => !i.isContratante && i.value > 0);
  const contractorItems = items.filter(i => i.isContratante);

  return (
    <div className="space-y-6">
      
      {/* CARD PRINCIPAL COM VALOR DE VENDA FINAL */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 p-6 bg-gradient-to-br from-violet-950/40 via-[#151c30] to-[#0a1122] shadow-2xl">
        {/* Glow de fundo */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-violet-600/20 via-pink-500/20 to-orange-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
          <div>
            <span className="text-[10px] font-bold tracking-widest uppercase bg-gradient-to-r from-violet-500 via-pink-500 to-orange-500 text-white px-3 py-1 rounded-full border border-pink-500/20">
              Valor Comercial da Proposta
            </span>
            <div className="mt-4">
              <span className="text-xs text-slate-400 font-medium block">Preço Final do Show</span>
              <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tight mt-1 flex items-baseline">
                <span className="text-xl font-bold bg-gradient-to-r from-violet-400 to-pink-500 bg-clip-text text-transparent mr-1">R$</span>
                {finalPrice.toLocaleString("pt-BR")}
              </h1>
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Condições de Pagamento:</span>
              <p className="text-xs text-slate-200 bg-white/5 p-3 rounded-xl border border-white/5 leading-relaxed min-h-[50px] flex items-center">
                {budget.paymentTerms || "50% no ato da contratação e 50% até um dia antes do evento, vide contrato."}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Validade da Proposta:</span>
              <p className="text-xs text-pink-400 bg-pink-500/5 p-3 rounded-xl border border-pink-500/10 leading-relaxed min-h-[50px] flex items-center gap-2">
                <Clock className="w-4 h-4 text-pink-500 flex-shrink-0 animate-pulse" />
                <span>Validade da proposta: 60 dias (Fixo)</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* DETALHES DO EVENTO */}
      <div className="card-blur p-6 rounded-2xl border border-white/10 space-y-4">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 border-b border-white/5 pb-2">
          <Info className="w-4 h-4 text-violet-500" />
          Informações do Evento
        </h3>
        
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="space-y-1 bg-white/5 p-3 rounded-xl border border-white/5">
            <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">Contratante / Evento</span>
            <div className="flex items-center gap-1.5 text-slate-200 font-semibold mt-1">
              <User className="w-4 h-4 text-pink-500 flex-shrink-0" />
              <span className="truncate">{budget.clientName || "Não informado"}</span>
            </div>
          </div>

          <div className="space-y-1 bg-white/5 p-3 rounded-xl border border-white/5">
            <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">Local do Evento</span>
            <div className="flex items-center gap-1.5 text-slate-200 font-semibold mt-1">
              <MapPin className="w-4 h-4 text-pink-500 flex-shrink-0" />
              <span className="truncate">{budget.location || "Não informado"}</span>
            </div>
          </div>

          <div className="space-y-1 bg-white/5 p-3 rounded-xl border border-white/5">
            <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">Data do Show</span>
            <div className="flex items-center gap-1.5 text-slate-200 font-semibold mt-1">
              <Calendar className="w-4 h-4 text-pink-500 flex-shrink-0" />
              <span>{budget.eventDate ? new Date(budget.eventDate + "T00:00:00").toLocaleDateString("pt-BR") : "Não informada"}</span>
            </div>
          </div>

          <div className="space-y-1 bg-white/5 p-3 rounded-xl border border-white/5">
            <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">Horário & Duração</span>
            <div className="space-y-1 mt-1 text-slate-200 font-semibold">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-pink-500 flex-shrink-0" />
                <span className="truncate">Início: {budget.eventTime || "Não informado"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Hourglass className="w-3.5 h-3.5 text-pink-500 flex-shrink-0" />
                <span className="truncate">Duração: {budget.showDuration || "Não informada"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* COMPACT DETAILED BREAKDOWN LIST */}
      <div className="card-blur p-6 rounded-2xl border border-white/10 space-y-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-pink-500" />
            Resumo dos Custos Diretos
          </h3>
          <span className="text-xs font-mono text-slate-400 font-bold bg-slate-900 px-2 py-0.5 rounded">
            {directItems.length} itens ativos
          </span>
        </div>

        {directItems.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-4">Nenhum custo direto adicionado.</p>
        ) : (
          <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
            {directItems.map((cat, idx) => {
              const pct = finalPrice > 0 ? (cat.value / finalPrice) * 100 : 0;
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium truncate max-w-[180px]">{cat.name}</span>
                    <span className="text-slate-400 font-mono font-semibold">
                      R$ {cat.value.toLocaleString("pt-BR")} ({Math.round(pct)}%)
                    </span>
                  </div>
                  <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-violet-500 to-pink-500 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* LINEUP & MÚSICOS ESCALADOS */}
      {(() => {
        const musiciansList = getMusiciansList(budget);

        return (
          <div className="card-blur p-6 rounded-2xl border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                <Users className="w-4 h-4 text-pink-500" />
                Lineup & Músicos Escalados
              </h3>
              <span className="text-xs font-mono text-pink-400 font-bold bg-pink-500/10 px-2 py-0.5 rounded border border-pink-500/20">
                {musiciansList.reduce((acc, curr) => acc + curr.count, 0)} integrantes
              </span>
            </div>

            {musiciansList.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-4">Nenhum músico foi escalado para este show.</p>
            ) : (
              <div className="grid grid-cols-2 gap-2 max-h-[160px] overflow-y-auto pr-1">
                {musiciansList.map((m, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-[#0a1122]/60 border border-slate-800 rounded-xl p-2 px-3">
                    <span className="text-xs text-slate-300 font-medium truncate" title={m.name}>
                      {m.name}
                    </span>
                    <span className="text-xs font-mono font-bold text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded-full border border-pink-500/25">
                      {m.count}x
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })()}

      {/* ITEMS PROVIDED BY CONTRACTOR (CONTRATANTE PROVIDENCIA) */}
      <div className="card-blur p-6 rounded-2xl border border-white/10 space-y-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            Providenciado pelo Contratante
          </h3>
          <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            {contractorItems.length} itens
          </span>
        </div>

        {contractorItems.length === 0 ? (
          <div className="text-xs text-slate-500 flex items-start gap-1.5 p-2 bg-slate-950/20 rounded-xl border border-white/5">
            <AlertCircle className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
            <span>Todos os custos estão sendo cobertos por este orçamento. Nenhum item foi terceirizado ao contratante.</span>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-[10px] text-slate-400 leading-relaxed mb-1">
              Os itens abaixo estão sob responsabilidade do Contratante e foram desconsiderados do valor total deste orçamento:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[160px] overflow-y-auto pr-1">
              {contractorItems.map((cat, idx) => (
                <div key={idx} className="flex items-center space-x-2 bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span className="text-xs text-slate-300 font-medium truncate" title={cat.name}>
                    {cat.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
