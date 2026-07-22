/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { BandIdentity } from "../types";
import { Music, Mail, Phone, Instagram, Key, FileText, ChevronDown, ChevronUp, Upload, X, Image as ImageIcon } from "lucide-react";

interface BandSettingsProps {
  settings: BandIdentity;
  onChangeSettings: (settings: BandIdentity) => void;
}

export default function BandSettings({ settings, onChangeSettings }: BandSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFieldChange = (key: keyof BandIdentity, value: string) => {
    onChangeSettings({
      ...settings,
      [key]: value
    });
  };

  const handleLogoUpload = (file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      onChangeSettings({
        ...settings,
        logoUrl: reader.result as string
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleLogoUpload(e.dataTransfer.files[0]);
    }
  };

  const removeLogo = () => {
    const updated = { ...settings };
    delete updated.logoUrl;
    onChangeSettings(updated);
  };

  return (
    <div className="card-blur rounded-2xl border border-white/10 overflow-hidden transition-all duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left cursor-pointer hover:bg-slate-900/30 transition-colors"
        id="band-settings-toggle"
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 via-pink-500 to-orange-500 flex items-center justify-center text-white">
            <Music className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base">Identidade Visual da Banda</h3>
            <p className="text-xs text-slate-400">Personalize o logotipo, contatos e os termos do PDF gerado.</p>
          </div>
        </div>
        <div>
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          )}
        </div>
      </button>

      {isOpen && (
        <div className="p-6 border-t border-white/5 space-y-6 bg-slate-900/20">
          
          {/* Espaço para Upload da Logo */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Logotipo da Banda ou Cantor
            </label>
            
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center transition-all duration-300 ${
                isDragging
                  ? "border-pink-500 bg-pink-500/10"
                  : settings.logoUrl
                  ? "border-emerald-500/30 bg-emerald-500/5"
                  : "border-white/10 hover:border-white/20 bg-slate-900/30"
              }`}
            >
              {settings.logoUrl ? (
                <div className="relative flex flex-col items-center space-y-3">
                  <div className="relative">
                    <img
                      src={settings.logoUrl}
                      alt="Logo da Banda"
                      className="max-h-24 max-w-[200px] object-contain rounded-xl border border-white/10 bg-slate-950 p-2"
                      referrerPolicy="no-referrer"
                    />
                    <button
                      onClick={removeLogo}
                      type="button"
                      className="absolute -top-2 -right-2 bg-rose-500 hover:bg-rose-600 text-white rounded-full p-1 shadow-lg transition-transform hover:scale-110 cursor-pointer"
                      title="Remover Logo"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-emerald-400 font-medium">Logotipo carregado com sucesso!</p>
                </div>
              ) : (
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400">
                    <Upload className="w-6 h-6 text-pink-500" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-white">Arrastar e soltar arquivo</p>
                    <p className="text-xs text-slate-400">Ou clique para navegar e selecionar a imagem</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleLogoUpload(e.target.files[0]);
                      }
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Nome da Banda / Artista
              </label>
              <div className="relative">
                <Music className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={settings.name}
                  onChange={(e) => handleFieldChange("name", e.target.value)}
                  placeholder="Ex: Banda Rock Horizon"
                  className="w-full bg-[#070a13] border border-slate-800 focus:border-pink-500 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none transition-colors"
                  id="setting-band-name"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Slogan / Estilo Musical
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={settings.subTitle}
                  onChange={(e) => handleFieldChange("subTitle", e.target.value)}
                  placeholder="Ex: Pop Rock, Sertanejo, etc."
                  className="w-full bg-[#070a13] border border-slate-800 focus:border-pink-500 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none transition-colors"
                  id="setting-band-subtitle"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                E-mail de Contato
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => handleFieldChange("email", e.target.value)}
                  placeholder="Ex: contato@banda.com"
                  className="w-full bg-[#070a13] border border-slate-800 focus:border-pink-500 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none transition-colors"
                  id="setting-band-email"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Telefone / WhatsApp
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={settings.phone}
                  onChange={(e) => handleFieldChange("phone", e.target.value)}
                  placeholder="Ex: (11) 99999-9999"
                  className="w-full bg-[#070a13] border border-slate-800 focus:border-pink-500 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none transition-colors"
                  id="setting-band-phone"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Instagram
              </label>
              <div className="relative">
                <Instagram className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={settings.instagram}
                  onChange={(e) => handleFieldChange("instagram", e.target.value)}
                  placeholder="Ex: @minhabanda"
                  className="w-full bg-[#070a13] border border-slate-800 focus:border-pink-500 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none transition-colors"
                  id="setting-band-instagram"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Chave PIX para Depósito de Sinal
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={settings.pixKey}
                  onChange={(e) => handleFieldChange("pixKey", e.target.value)}
                  placeholder="Ex: CNPJ, Celular ou Email"
                  className="w-full bg-[#070a13] border border-slate-800 focus:border-pink-500 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none transition-colors"
                  id="setting-band-pix"
                />
              </div>
            </div>
          </div>

          {/* Seção de Observação */}
          <div className="pt-3 border-t border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Observação
              </label>
              <span className="text-[10px] text-slate-500 font-medium">Máximo de 2 linhas</span>
            </div>
            <textarea
              rows={2}
              maxLength={250}
              value={settings.observation || ""}
              onChange={(e) => handleFieldChange("observation", e.target.value)}
              placeholder="Escreva observações gerais ou detalhes livres aqui..."
              className="w-full bg-[#070a13] border border-slate-800 focus:border-pink-500 rounded-xl p-3 text-sm text-white placeholder-slate-600 focus:outline-none transition-colors resize-none font-sans leading-snug"
              id="setting-band-observation"
            />
          </div>


        </div>
      )}
    </div>
  );
}
