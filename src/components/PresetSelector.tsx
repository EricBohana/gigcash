/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BUDGET_PRESETS, BudgetPreset } from "../types";
import { Beer, Briefcase, Truck, Music, Sparkles } from "lucide-react";

interface PresetSelectorProps {
  activePresetId: string | null;
  onSelectPreset: (preset: BudgetPreset) => void;
}

export default function PresetSelector({ activePresetId, onSelectPreset }: PresetSelectorProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Beer":
        return <Beer className="w-5 h-5" />;
      case "Briefcase":
        return <Briefcase className="w-5 h-5" />;
      case "Truck":
        return <Truck className="w-5 h-5" />;
      case "Music":
        return <Music className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col mb-4">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-pink-500" />
          Modelos de Orçamento Rápidos
        </h2>
        <p className="text-xs text-slate-400">
          Selecione um modelo pré-configurado abaixo para carregar custos e simular um cenário instantaneamente.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {BUDGET_PRESETS.map((preset) => {
          const isActive = activePresetId === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset)}
              className={`group relative text-left p-4 rounded-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer ${
                isActive
                  ? "bg-gradient-to-br from-violet-950/40 via-pink-950/20 to-orange-950/10 border-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.15)]"
                  : "bg-slate-900/50 hover:bg-slate-900 border-slate-800 hover:border-slate-700"
              } border`}
              id={`preset-btn-${preset.id}`}
            >
              {/* Background gradient on active or hover */}
              <div 
                className={`absolute inset-0 bg-gradient-to-br from-violet-600/10 via-pink-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                  isActive ? "opacity-100" : ""
                }`} 
              />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-xl ${
                    isActive ? "bg-gradient-to-r from-violet-600 to-pink-500 text-white" : "bg-slate-800 text-slate-300 group-hover:text-pink-400"
                  } transition-colors duration-300`}>
                    {getIcon(preset.icon)}
                  </div>
                  {isActive && (
                    <span className="text-[10px] font-bold tracking-wider uppercase bg-pink-500/20 text-pink-400 px-2 py-0.5 rounded-full border border-pink-500/30">
                      Ativo
                    </span>
                  )}
                </div>
                
                <h3 className="text-sm font-bold text-slate-100 group-hover:text-white mb-1">
                  {preset.name}
                </h3>
                
                <p className="text-xs text-slate-400 leading-relaxed">
                  {preset.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
