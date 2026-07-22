/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { Loader2, Sparkles, Music, MapPin, DollarSign, Shield } from "lucide-react";

interface LoadingIndicatorProps {
  isLoading: boolean;
  onFinished?: () => void;
  presetName?: string;
}

const STEPS = [
  { text: "Buscando tarifas de pedágio e combustível atualizadas...", icon: MapPin },
  { text: "Verificando diárias médias de hotéis na região...", icon: DollarSign },
  { text: "Consultando tabela de cachês de músicos e convidados...", icon: Music },
  { text: "Configurando taxas de impostos, NF-e e taxas de produção...", icon: Sparkles },
  { text: "Sincronizando orçamentos com a identidade visual da banda...", icon: Shield }
];

export default function LoadingIndicator({ isLoading, onFinished, presetName }: LoadingIndicatorProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [visible, setVisible] = useState(isLoading);

  useEffect(() => {
    if (isLoading) {
      setVisible(true);
      setCurrentStep(0);
      const interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < STEPS.length - 1) {
            return prev + 1;
          }
          return prev;
        });
      }, 500);

      const timeout = setTimeout(() => {
        if (onFinished) onFinished();
      }, 2500);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    } else {
      // Fade out effect
      const timeout = setTimeout(() => {
        setVisible(false);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [isLoading, onFinished]);

  if (!visible) return null;

  const ActiveIcon = STEPS[currentStep].icon;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a1122]/90 backdrop-blur-md transition-opacity duration-300">
      <div className="relative flex flex-col items-center max-w-md p-8 text-center bg-[#151c30] rounded-3xl border border-white/10 shadow-2xl">
        {/* Glow Effects */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-violet-600/20 rounded-full blur-2xl animate-pulse" />
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-pink-500/20 rounded-full blur-2xl animate-pulse" />

        {/* Animated Spinners */}
        <div className="relative mb-6">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-600 via-pink-500 to-orange-500 blur-md animate-spin duration-3000 opacity-75" />
          <div className="relative flex items-center justify-center w-20 h-20 bg-[#0a1122] rounded-full border border-white/10">
            <Loader2 className="w-10 h-10 text-pink-500 animate-spin" />
          </div>
          <div className="absolute -bottom-1 -right-1 flex items-center justify-center w-7 h-7 bg-pink-500 rounded-full text-white">
            <ActiveIcon className="w-4 h-4 animate-bounce" />
          </div>
        </div>

        <h3 className="text-xl font-bold text-white mb-2">
          {presetName ? `Carregando ${presetName}` : "Processando Cálculos"}
        </h3>
        <p className="text-sm text-slate-400 mb-6">
          Aguarde um instante enquanto estruturamos os valores.
        </p>

        {/* List of stages */}
        <div className="w-full space-y-3 text-left">
          {STEPS.map((step, idx) => {
            const isCompleted = idx < currentStep;
            const isActive = idx === currentStep;
            const isPending = idx > currentStep;
            
            return (
              <div 
                key={idx} 
                className={`flex items-center space-x-3 text-xs transition-all duration-300 ${
                  isActive ? "text-pink-400 font-medium scale-102" : 
                  isCompleted ? "text-violet-400 opacity-60" : "text-slate-600"
                }`}
              >
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  isActive ? "bg-pink-500 animate-ping" : 
                  isCompleted ? "bg-violet-500" : "bg-slate-800"
                }`} />
                <span>{step.text}</span>
              </div>
            );
          })}
        </div>

        {/* Simple Progress Bar */}
        <div className="w-full h-1.5 bg-slate-800 rounded-full mt-6 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-violet-600 via-pink-500 to-orange-500 transition-all duration-300 rounded-full"
            style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
