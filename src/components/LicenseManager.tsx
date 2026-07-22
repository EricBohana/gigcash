/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { ShieldCheck, ShieldAlert, Key, ShoppingBag, HelpCircle, Copy, Check, Sparkles, Smartphone, Code } from "lucide-react";

interface LicenseManagerProps {
  isActivated: boolean;
  onActivationChange: (status: boolean) => void;
  licenseKey: string;
  onLicenseKeyChange: (key: string) => void;
}

export default function LicenseManager({
  isActivated,
  onActivationChange,
  licenseKey,
  onLicenseKeyChange
}: LicenseManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputKey, setInputKey] = useState(licenseKey);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"key" | "playstore" | "code">("key");
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    setInputKey(licenseKey);
  }, [licenseKey]);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = inputKey.trim().toUpperCase();
    
    // Accept standard keys or simulated valid ones
    if (cleanKey === "GIGCASH-PLAY-PREMIUM" || cleanKey.startsWith("GIG-") && cleanKey.length >= 12) {
      onLicenseKeyChange(cleanKey);
      onActivationChange(true);
      setStatusMessage({
        type: "success",
        text: "Licença GIGCASH Pro validada e ativada com sucesso! O aplicativo está desbloqueado."
      });
    } else if (cleanKey === "") {
      setStatusMessage({
        type: "error",
        text: "Por favor, digite uma chave de licença válida."
      });
    } else {
      setStatusMessage({
        type: "error",
        text: "Chave inválida. Use a chave padrão de demonstração: GIGCASH-PLAY-PREMIUM ou insira uma chave no padrão GIG-XXXX-XXXX."
      });
    }
  };

  const handleDeactivate = () => {
    onLicenseKeyChange("");
    onActivationChange(false);
    setInputKey("");
    setStatusMessage({
      type: "success",
      text: "Aplicativo bloqueado. Insira uma licença ativa para continuar utilizando."
    });
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const codeSnippet = `// Exemplo de integração no Wrapper Android (Capacitor / Play Billing)
import { PlayBilling } from '@capacitor-community/play-billing';

async function checkPlayStoreSubscription() {
  try {
    await PlayBilling.initialize();
    const purchases = await PlayBilling.queryPurchases({
      productType: 'subs' // ou 'inapp' para compra única
    });
    
    const hasActiveSubscription = purchases.some(
      p => p.productId === 'gigcash_pro_license' && p.purchaseState === 1
    );
    
    if (hasActiveSubscription) {
      localStorage.setItem('gigcash_activated', 'true');
      localStorage.setItem('gigcash_license_key', 'GIGCASH-PLAY-PREMIUM');
      return true;
    }
    return false;
  } catch (error) {
    console.error('Erro na Play Store:', error);
    return false;
  }
}`;

  return (
    <>
      {/* Botão de Licenciamento flutuante ou no Header */}
      <button
        onClick={() => setIsOpen(true)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
          isActivated 
            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20" 
            : "bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20 animate-pulse"
        }`}
        id="btn-licenciamento"
      >
        {isActivated ? (
          <>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Licença Ativa (PRO)</span>
          </>
        ) : (
          <>
            <ShieldAlert className="w-4 h-4 text-red-400" />
            <span>Licença Requerida</span>
          </>
        )}
      </button>

      {/* MODAL DE GERENCIAMENTO DE LICENÇA */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-[#151c30] border border-white/10 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="p-5 border-b border-white/5 flex items-center justify-between bg-slate-900/40">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-pink-500/10 flex items-center justify-center border border-pink-500/20">
                  <Key className="w-5 h-5 text-pink-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Segurança & Licenciamento GIGCASH</h3>
                  <p className="text-xs text-slate-400">Configuração de propriedade, proteção e faturamento via Play Store</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white transition-colors text-sm font-medium cursor-pointer"
              >
                Fechar
              </button>
            </div>

            {/* Menu de Abas */}
            <div className="flex border-b border-white/5 bg-slate-950/20 px-4">
              <button
                onClick={() => setActiveTab("key")}
                className={`px-4 py-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
                  activeTab === "key" 
                    ? "border-pink-500 text-pink-400" 
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                Ativar Licença
              </button>
              <button
                onClick={() => setActiveTab("playstore")}
                className={`px-4 py-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
                  activeTab === "playstore" 
                    ? "border-pink-500 text-pink-400" 
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                Como publicar na Play Store
              </button>
              <button
                onClick={() => setActiveTab("code")}
                className={`px-4 py-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
                  activeTab === "code" 
                    ? "border-pink-500 text-pink-400" 
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                Integração Técnica
              </button>
            </div>

            {/* Corpo */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {activeTab === "key" && (
                <div className="space-y-6">
                  {/* Status Banner */}
                  <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
                    isActivated 
                      ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-300" 
                      : "bg-red-500/5 border-red-500/20 text-red-300"
                  }`}>
                    {isActivated ? (
                      <ShieldCheck className="w-5 h-5 flex-shrink-0 text-emerald-400" />
                    ) : (
                      <ShieldAlert className="w-5 h-5 flex-shrink-0 text-red-400" />
                    )}
                    <div className="text-xs space-y-1">
                      <span className="font-bold uppercase tracking-wider block">
                        STATUS: {isActivated ? "PRO ATIVADO (PROPRIEDADE VERIFICADA)" : "SISTEMA BLOQUEADO / NÃO ATIVADO"}
                      </span>
                      <p className="text-slate-300 leading-relaxed">
                        {isActivated 
                          ? `Este aplicativo GIGCASH está licenciado para o proprietário legítimo sob a chave: ${licenseKey}. Todos os recursos profissionais estão liberados para uso.` 
                          : "O acesso total a cálculos, orçamentos, dados e exportações em PDF exige uma licença ativa obtida através da Play Store ou canal de vendas autorizado."}
                      </p>
                    </div>
                  </div>

                  {/* Form de Ativação */}
                  <form onSubmit={handleVerify} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-300 uppercase block">Chave de Licença do Usuário</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={inputKey}
                          onChange={(e) => setInputKey(e.target.value)}
                          placeholder="Ex: GIGCASH-PLAY-PREMIUM"
                          className="flex-1 px-4 py-3 bg-slate-950 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-pink-500 text-white font-mono placeholder:text-slate-500"
                        />
                        <button
                          type="submit"
                          className="gradient-btn px-6 py-3 rounded-xl text-white font-bold text-xs transition-all cursor-pointer shadow-lg hover:shadow-[0_0_15px_rgba(236,72,153,0.3)]"
                        >
                          Verificar Licença
                        </button>
                      </div>
                      <span className="text-[10px] text-slate-400 block italic">
                        * Use a chave demonstrativa para testes: <strong className="text-pink-400 font-mono">GIGCASH-PLAY-PREMIUM</strong>
                      </span>
                    </div>

                    {statusMessage && (
                      <div className={`p-3 rounded-xl text-xs border ${
                        statusMessage.type === "success" 
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                          : "bg-red-500/10 border-red-500/20 text-red-400"
                      }`}>
                        {statusMessage.text}
                      </div>
                    )}
                  </form>

                  {isActivated && (
                    <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                      <div className="text-xs text-slate-400">
                        Deseja bloquear o aplicativo para testar o fluxo de bloqueio?
                      </div>
                      <button
                        onClick={handleDeactivate}
                        className="px-4 py-2 bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/20 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                      >
                        Desativar Licença
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "playstore" && (
                <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
                  <div className="bg-slate-950/40 p-4 rounded-2xl border border-white/5 space-y-3">
                    <h4 className="font-bold text-white flex items-center gap-1.5 text-sm">
                      <Smartphone className="w-4 h-4 text-pink-400" />
                      Como funciona o modelo de compra por App baixado?
                    </h4>
                    <p>
                      Para que o GIGCASH funcione como um app nativo de Android baixado na Google Play Store com verificação de posse, você deve seguir a arquitetura oficial do Google:
                    </p>
                    <ol className="list-decimal pl-5 space-y-2 mt-2">
                      <li>
                        <strong className="text-white">Empacotamento com Capacitor ou Cordova:</strong> Essa base em React/TypeScript é compilada em código nativo de Android, gerando um pacote <code className="bg-slate-950 px-1 py-0.5 rounded text-pink-400 font-mono">.apk</code> ou <code className="bg-slate-950 px-1 py-0.5 rounded text-pink-400 font-mono">.aab</code>.
                      </li>
                      <li>
                        <strong className="text-white">Aplicativo Pago ou Compra In-App:</strong> Você configura seu app no Google Play Console como um aplicativo pago (compra no download) ou integra o módulo Google Play Billing para compras internas (liberação Premium).
                      </li>
                      <li>
                        <strong className="text-white">Faturamento Confiável do Google:</strong> Quando o usuário baixa e compra o app pela Play Store, o Google Play valida a assinatura digital e o token de compra automaticamente no dispositivo do usuário, garantindo proteção contra pirataria.
                      </li>
                    </ol>
                  </div>

                  <div className="p-4 rounded-xl bg-pink-500/5 border border-pink-500/15 flex gap-3 text-pink-300">
                    <ShoppingBag className="w-5 h-5 flex-shrink-0 mt-0.5 text-pink-400" />
                    <div>
                      <span className="font-bold text-white block mb-0.5">Segurança contra cópias não autorizadas</span>
                      O código web do GIGCASH está estruturado para receber o token de faturamento seguro e travar imediatamente o uso caso a licença de download correspondente não seja encontrada no dispositivo de execução.
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "code" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-300 uppercase flex items-center gap-1.5">
                        <Code className="w-4 h-4 text-violet-400" />
                        Código de Validação da Assinatura Google Play
                      </span>
                      <button
                        onClick={() => handleCopyCode(codeSnippet)}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[10px] font-bold transition-all cursor-pointer"
                      >
                        {copied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            Copiado
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            Copiar Código
                          </>
                        )}
                      </button>
                    </div>
                    
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Este é o bloco de código de produção que você ou seu desenvolvedor adicionará no wrapper nativo para conectar a verificação de pagamento do Play Store diretamente ao estado do React do GIGCASH:
                    </p>

                    <pre className="p-4 bg-slate-950 border border-white/5 rounded-2xl text-[10.5px] text-slate-300 font-mono overflow-x-auto max-h-60 leading-relaxed">
                      {codeSnippet}
                    </pre>
                  </div>
                </div>
              )}

            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/5 bg-slate-900/40 flex justify-between items-center">
              <div className="flex items-center space-x-1.5 text-[10px] text-slate-400">
                <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                <span>GIGCASH Licenciamento Seguro</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="gradient-btn px-5 py-2 rounded-xl text-white font-bold text-xs transition-all cursor-pointer shadow-lg"
              >
                Concluído
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
