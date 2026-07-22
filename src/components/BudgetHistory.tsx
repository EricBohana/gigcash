/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { BudgetState, calculateTotalBudget } from "../types";
import { Save, FolderOpen, Trash2, Calendar, MapPin, CheckCircle, Plus } from "lucide-react";

interface BudgetHistoryProps {
  currentBudget: BudgetState;
  onLoadBudget: (budget: BudgetState) => void;
  onSaveCurrent: (name: string) => void;
}

export default function BudgetHistory({ currentBudget, onLoadBudget, onSaveCurrent }: BudgetHistoryProps) {
  const [savedBudgets, setSavedBudgets] = useState<BudgetState[]>([]);
  const [newSaveName, setNewSaveName] = useState("");
  const [isSavedAlert, setIsSavedAlert] = useState(false);

  useEffect(() => {
    loadSavedFromStorage();
  }, []);

  const loadSavedFromStorage = () => {
    try {
      const stored = localStorage.getItem("band_budgets_history");
      if (stored) {
        setSavedBudgets(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Erro ao ler localStorage:", e);
    }
  };

  const handleSave = () => {
    const nameToUse = newSaveName.trim() || currentBudget.name || `Orçamento ${new Date().toLocaleDateString("pt-BR")}`;
    onSaveCurrent(nameToUse);
    
    // Refresh list
    setTimeout(() => {
      loadSavedFromStorage();
      setNewSaveName("");
      setIsSavedAlert(true);
      setTimeout(() => setIsSavedAlert(false), 3000);
    }, 50);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const stored = localStorage.getItem("band_budgets_history");
      if (stored) {
        const list: BudgetState[] = JSON.parse(stored);
        const filtered = list.filter((b) => b.id !== id);
        localStorage.setItem("band_budgets_history", JSON.stringify(filtered));
        setSavedBudgets(filtered);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="card-blur p-6 rounded-2xl border border-white/10 space-y-6">
      <div className="flex items-center space-x-3 pb-4 border-b border-white/5">
        <div className="w-9 h-9 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center">
          <FolderOpen className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-white text-base">Meus Orçamentos Salvos</h3>
          <p className="text-xs text-slate-400">Guarde e acesse rascunhos para comparação de preços rápida.</p>
        </div>
      </div>

      {/* Salvar Orçamento Atual */}
      <div className="space-y-3">
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Salvar Orçamento Atual como:
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={newSaveName}
            onChange={(e) => setNewSaveName(e.target.value)}
            placeholder={`Ex: Show ${currentBudget.clientName || "Contratante Exemplo"}`}
            className="flex-1 bg-[#0a1122] border border-slate-800 focus:border-violet-500 rounded-xl py-2 px-3 text-xs text-white focus:outline-none placeholder-slate-600"
            id="input-save-history-name"
          />
          <button
            onClick={handleSave}
            className="gradient-btn px-4 py-2 rounded-xl text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
            id="btn-save-current-budget"
          >
            <Save className="w-3.5 h-3.5" />
            Salvar
          </button>
        </div>
        
        {isSavedAlert && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
            <CheckCircle className="w-4 h-4" />
            <span>Orçamento salvo com sucesso na memória local!</span>
          </div>
        )}
      </div>

      {/* Lista de salvos */}
      <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
        {savedBudgets.length === 0 ? (
          <div className="text-center py-6 text-slate-500 text-xs border border-dashed border-white/5 rounded-xl bg-[#0a1122]/40">
            Nenhum orçamento salvo no navegador. Digite um nome acima para salvar!
          </div>
        ) : (
          savedBudgets.map((item) => {
            const isCurrent = currentBudget.id === item.id;
            return (
              <div
                key={item.id}
                onClick={() => onLoadBudget(item)}
                className={`p-3 rounded-xl flex items-center justify-between text-left cursor-pointer transition-all border ${
                  isCurrent
                    ? "bg-violet-950/20 border-violet-500/50"
                    : "bg-[#0a1122] hover:bg-slate-900 border-slate-800"
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-200 block">{item.name}</span>
                    {isCurrent && (
                      <span className="text-[9px] bg-violet-500/20 text-violet-400 px-1.5 py-0.2 rounded-full border border-violet-500/30">
                        Editando
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-3 text-[10px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {item.eventDate ? new Date(item.eventDate + "T00:00:00").toLocaleDateString("pt-BR") : "Sem data"}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {item.location || "S/L"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono font-bold text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded border border-pink-500/20">
                    R$ {calculateTotalBudget(item).toLocaleString("pt-BR")}
                  </span>
                  <button
                    onClick={(e) => handleDelete(item.id!, e)}
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-red-500/20 hover:text-red-400 text-slate-500 transition-colors cursor-pointer"
                    title="Excluir"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
