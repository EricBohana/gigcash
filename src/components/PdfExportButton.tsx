/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { jsPDF } from "jspdf";
import { BudgetState, BandIdentity, calculateTotalBudget, getMusiciansList } from "../types";
import { FileDown, Eye, CheckCircle, Info, X, Sparkles } from "lucide-react";

interface PdfExportButtonProps {
  budget: BudgetState;
  bandSettings: BandIdentity;
}

export default function PdfExportButton({ budget, bandSettings }: PdfExportButtonProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const finalPrice = calculateTotalBudget(budget);

  // Group items for list
  const tableData = [
    { label: "01. Logística / Van / Ônibus / Avião", value: budget.logistica, isContratante: budget.isContratanteLogistica },
    { label: "02. Hospedagem", value: budget.hospedagem, isContratante: budget.isContratanteHospedagem },
    { label: "03. Alimentação", value: budget.alimentacao, isContratante: budget.isContratanteAlimentacao },
    { label: "04. Camarim", value: budget.camarim, isContratante: budget.isContratanteCamarim },
    { label: "05. Banda Completa", value: budget.bandaCompleta, isContratante: budget.isContratanteBandaCompleta },
    { label: "06. Produção / Executivo", value: budget.producao, isContratante: budget.isContratanteProducao },
    { label: "07. Mídia & Divulgação", value: budget.midia, isContratante: budget.isContratanteMidia },
    { label: "08. Segurança", value: budget.seguranca, isContratante: budget.isContratanteSeguranca },
    { label: "09. Equipamento de Som", value: budget.equipSom, isContratante: budget.isContratanteEquipSom },
    { label: "10. Equipamento de Luz", value: budget.equipLuz, isContratante: budget.isContratanteEquipLuz },
    { label: "11. Palco / Praticável", value: budget.palco, isContratante: budget.isContratantePalco },
    { label: "12. Gerador", value: budget.gerador, isContratante: budget.isContratanteGerador },
  ].filter(item => item.isContratante || item.value > 0);

  const generatePDF = (shouldDownload = true) => {
    setIsGenerating(true);
    
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      // Paleta de Cores do PDF
      const cPrimary = [11, 15, 25];    // Deep Navy #0B0F19
      const cAccent = [236, 72, 153];   // Pink #EC4899
      const cTextDark = [15, 23, 42];   // Slate 900
      const cTextLight = [255, 255, 255]; // White
      const cMuted = [100, 116, 139];   // Slate 500
      const cLightBg = [248, 250, 252]; // Slate 50

      // Margens
      const mLeft = 20;
      let y = 15;

      // 1. Cabeçalho com fundo Azul Marinho Escuro
      doc.setFillColor(cPrimary[0], cPrimary[1], cPrimary[2]);
      doc.rect(0, 0, 210, 60, "F");

      doc.setFillColor(cAccent[0], cAccent[1], cAccent[2]);
      doc.rect(0, 60, 210, 2.5, "F");

      let textX = mLeft;
      if (bandSettings.logoUrl) {
        try {
          doc.addImage(bandSettings.logoUrl, "PNG", mLeft, 12, 36, 36);
          textX = mLeft + 42;
        } catch (e) {
          console.error("Erro ao desenhar imagem no PDF:", e);
        }
      }

      doc.setTextColor(cTextLight[0], cTextLight[1], cTextLight[2]);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.text(bandSettings.name.toUpperCase(), textX, 29);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(220, 220, 225);
      doc.text(bandSettings.subTitle, textX, 37);

      doc.setTextColor(cTextLight[0], cTextLight[1], cTextLight[2]);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.text("PROPOSTA DE SHOW", 190, 24, { align: "right" });
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.text(`Criado em: ${new Date().toLocaleDateString("pt-BR")}`, 190, 30, { align: "right" });
      doc.text("Validade da proposta: 60 dias", 190, 35, { align: "right" });
      if (budget.eventDate) {
        doc.text(`Data do Show: ${new Date(budget.eventDate + "T00:00:00").toLocaleDateString("pt-BR")}`, 190, 40, { align: "right" });
      }

      y = 70;

      // 2. Detalhes do Evento / Contratante
      doc.setFillColor(cLightBg[0], cLightBg[1], cLightBg[2]);
      doc.rect(mLeft, y, 170, 42, "F");
      doc.setDrawColor(226, 232, 240);
      doc.rect(mLeft, y, 170, 42, "S");

      doc.setTextColor(124, 58, 237);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.text("DETALHES DA CONTRATAÇÃO", mLeft + 6, y + 6);

      doc.setTextColor(cTextDark[0], cTextDark[1], cTextDark[2]);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      
      doc.text(`Contratante / Evento:`, mLeft + 6, y + 13);
      doc.setFont("helvetica", "bold");
      doc.text(`${budget.clientName || "Não especificado"}`, mLeft + 42, y + 13);
      
      doc.setFont("helvetica", "normal");
      doc.text(`Local da Apresentação:`, mLeft + 6, y + 19);
      doc.setFont("helvetica", "bold");
      doc.text(`${budget.location || "Não especificado"}`, mLeft + 42, y + 19);

      doc.setFont("helvetica", "normal");
      doc.text(`Identificação:`, mLeft + 6, y + 25);
      doc.setFont("helvetica", "bold");
      doc.text(`${budget.name || "Orçamento Base"}`, mLeft + 42, y + 25);

      doc.setFont("helvetica", "normal");
      doc.text(`Horário do Show:`, mLeft + 6, y + 31);
      doc.setFont("helvetica", "bold");
      doc.text(`${budget.eventTime || "Não especificado"}`, mLeft + 42, y + 31);

      doc.setFont("helvetica", "normal");
      doc.text(`Duração do Show:`, mLeft + 6, y + 37);
      doc.setFont("helvetica", "bold");
      doc.text(`${budget.showDuration || "Não especificada"}`, mLeft + 42, y + 37);

      y += 50;

      // 3. Tabela de Custos Alocados
      doc.setTextColor(cPrimary[0], cPrimary[1], cPrimary[2]);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("COMPOSIÇÃO DE VALORES E RESPONSABILIDADES", mLeft, y);
      
      y += 4;
      doc.setDrawColor(226, 232, 240);
      doc.line(mLeft, y, 190, y);
      
      y += 5;

      doc.setFontSize(9);
      tableData.forEach((item, index) => {
        if (index % 2 === 0) {
          doc.setFillColor(252, 253, 254);
          doc.rect(mLeft, y - 4, 170, 6, "F");
        }
        
        doc.setFont("helvetica", "normal");
        doc.setTextColor(cTextDark[0], cTextDark[1], cTextDark[2]);
        doc.text(item.label, mLeft + 2, y);
        
        if (item.isContratante) {
          doc.setFont("helvetica", "bold");
          doc.setTextColor(34, 197, 94);
          doc.text("CONTRATANTE", 188, y, { align: "right" });
        } else {
          doc.setFont("helvetica", "bold");
          doc.setTextColor(cTextDark[0], cTextDark[1], cTextDark[2]);
          doc.text(`R$ ${item.value.toLocaleString("pt-BR")}`, 188, y, { align: "right" });
        }
        y += 6;
      });

      y += 4;

      // 4. Totais e Resumo em Box Destacada
      doc.setFillColor(cPrimary[0], cPrimary[1], cPrimary[2]);
      doc.rect(110, y, 80, 24, "F");
      
      doc.setFillColor(cAccent[0], cAccent[1], cAccent[2]);
      doc.rect(110, y, 1.5, 24, "F");

      doc.setTextColor(cMuted[0], cMuted[1], cMuted[2]);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      
      doc.text("Resumo Comercial:", mLeft, y + 5);
      doc.text(`Categorias sob custódia da banda: ${tableData.filter(i => !i.isContratante).length}`, mLeft, y + 11);
      doc.text(`Categorias providas pelo contratante: ${tableData.filter(i => i.isContratante).length}`, mLeft, y + 17);

      doc.setTextColor(200, 200, 210);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.text("VALOR TOTAL PROPOSTO", 115, y + 8);
      
      doc.setTextColor(cTextLight[0], cTextLight[1], cTextLight[2]);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text(`R$ ${finalPrice.toLocaleString("pt-BR")}`, 115, y + 17);

      y += 32;

      // 4.5 Lineup / Escalação da Equipe do Show
      const musiciansList = getMusiciansList(budget);

      if (musiciansList.length > 0) {
        doc.setTextColor(cPrimary[0], cPrimary[1], cPrimary[2]);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.text("LINEUP & PROFISSIONAIS ESCALADOS", mLeft, y);
        
        y += 4;
        doc.setDrawColor(226, 232, 240);
        doc.line(mLeft, y, 190, y);
        
        y += 6;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(cTextDark[0], cTextDark[1], cTextDark[2]);
        
        const musicianStrings = musiciansList.map(m => `${m.name}: ${m.count}x`);
        const columns: string[] = [];
        let tempLine = "";
        musicianStrings.forEach((str, sIdx) => {
          if (sIdx > 0 && sIdx % 4 === 0) {
            columns.push(tempLine);
            tempLine = str;
          } else {
            tempLine += (tempLine ? "   |   " : "") + str;
          }
        });
        if (tempLine) columns.push(tempLine);

        columns.forEach(lineStr => {
          doc.text(lineStr, mLeft + 2, y);
          y += 5;
        });

        y += 6;
      }

      // Observações se preenchidas
      if (bandSettings.observation && bandSettings.observation.trim()) {
        doc.setTextColor(cPrimary[0], cPrimary[1], cPrimary[2]);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text("OBSERVAÇÕES", mLeft, y);
        y += 4;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(cTextDark[0], cTextDark[1], cTextDark[2]);
        const wrappedObs = doc.splitTextToSize(bandSettings.observation.trim(), 170);
        doc.text(wrappedObs, mLeft, y);
        y += wrappedObs.length * 4 + 4;
      }

      doc.setFillColor(cPrimary[0], cPrimary[1], cPrimary[2]);
      doc.rect(0, 290, 210, 7, "F");

      if (shouldDownload) {
        doc.save(`Orcamento_${budget.clientName.replace(/\s+/g, "_") || "Show"}.pdf`);
      } else {
        return doc.output("datauristring");
      }
    } catch (err) {
      console.error("Erro ao gerar PDF:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleOpenPreview = () => {
    setIsPreviewOpen(true);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <button
          onClick={handleOpenPreview}
          className="flex-1 flex items-center justify-center gap-2 border border-white/25 hover:border-white/50 bg-slate-900/80 hover:bg-slate-900 text-white font-semibold py-3 px-4 rounded-xl transition-all cursor-pointer shadow-lg"
          id="btn-preview-pdf"
        >
          <Eye className="w-5 h-5 text-pink-400" />
          Pré-visualizar PDF
        </button>

        <button
          onClick={() => generatePDF(true)}
          disabled={isGenerating}
          className="flex-1 flex items-center justify-center gap-2 gradient-btn text-white font-bold py-3 px-4 rounded-xl transition-all cursor-pointer shadow-lg hover:shadow-[0_0_20px_rgba(236,72,153,0.4)]"
          id="btn-download-pdf"
        >
          <FileDown className="w-5 h-5" />
          {isGenerating ? "Gerando..." : "Exportar Orçamento em PDF"}
        </button>
      </div>

      {/* PDF PREVIEW MODAL */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in no-print-backdrop">
          <div className="bg-[#151c30] border border-white/10 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl print-modal-container">
            {/* Modal Header */}
            <div className="p-5 border-b border-white/5 flex items-center justify-between bg-slate-900/40">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-pink-500 animate-pulse" />
                <div>
                  <h3 className="font-bold text-white text-base">Identidade Visual do PDF</h3>
                  <p className="text-xs text-slate-400">Verifique os dados da {bandSettings.name} formatados.</p>
                </div>
              </div>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Preview layout */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 bg-[#0a1122] text-slate-100 font-sans">
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex gap-3 text-xs text-amber-300">
                <Info className="w-5 h-5 flex-shrink-0" />
                <div>
                  <span className="font-bold">Dica de Layout do PDF:</span> O PDF gerado aplica a identidade visual da banda em azul marinho escuro profissional, com tabelas organizadas e detalhamento financeiro que garante credibilidade profissional frente a contratantes exigentes.
                </div>
              </div>

              {/* On-screen visual facsimile of the printed PDF */}
              <div className="bg-white text-slate-900 rounded-2xl p-6 md:p-10 shadow-inner max-w-2xl mx-auto border border-slate-300 space-y-6 printable-pdf-card">
                
                {/* Facsimile Header */}
                <div className="bg-[#0b0f19] -mx-6 -mt-6 p-8 rounded-t-2xl border-b-[3px] border-pink-500 text-white flex justify-between items-center print-stack print-avoid-break">
                  <div className="flex items-center space-x-5">
                    {bandSettings.logoUrl && (
                      <img
                        src={bandSettings.logoUrl}
                        alt="Logo"
                        className="w-20 h-20 object-contain rounded-xl border border-white/10 bg-slate-950 p-1.5"
                        referrerPolicy="no-referrer"
                      />
                    )}
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold uppercase tracking-tight text-white">{bandSettings.name || "NOME DA BANDA"}</h2>
                      <p className="text-xs md:text-sm text-slate-300 mt-1">{bandSettings.subTitle || "Gênero Musical"}</p>
                    </div>
                  </div>
                  <div className="text-right print-text-left">
                    <span className="text-xs font-bold block text-pink-400">PROPOSTA COMERCIAL</span>
                    <span className="text-[10px] text-slate-400 block mt-1">Data: {new Date().toLocaleDateString("pt-BR")}</span>
                    <span className="text-[10px] text-pink-400 font-bold block mt-1">Validade: 60 dias</span>
                  </div>
                </div>

                 {/* Facsimile Metadata */}
                 <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 grid grid-cols-2 md:grid-cols-3 gap-4 text-xs print-stack print-avoid-break">
                   <div>
                     <span className="text-slate-400 block font-semibold uppercase tracking-wider text-[10px]">CONTRATANTE / EVENTO</span>
                     <span className="font-bold text-slate-800 text-sm mt-0.5 block">{budget.clientName || "Contratante Exemplo"}</span>
                   </div>
                   <div>
                     <span className="text-slate-400 block font-semibold uppercase tracking-wider text-[10px]">LOCAL E CIDADE</span>
                     <span className="font-bold text-slate-800 text-sm mt-0.5 block">{budget.location || "São Paulo - SP"}</span>
                   </div>
                   <div>
                     <span className="text-slate-400 block font-semibold uppercase tracking-wider text-[10px]">DATA DO EVENTO</span>
                     <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                       {budget.eventDate ? new Date(budget.eventDate + "T00:00:00").toLocaleDateString("pt-BR") : "A definir"}
                     </span>
                   </div>
                   <div>
                     <span className="text-slate-400 block font-semibold uppercase tracking-wider text-[10px]">HORÁRIO DO EVENTO</span>
                     <span className="font-bold text-slate-800 text-sm mt-0.5 block">{budget.eventTime || "Não informado"}</span>
                   </div>
                   <div>
                     <span className="text-slate-400 block font-semibold uppercase tracking-wider text-[10px]">DURAÇÃO DO SHOW</span>
                     <span className="font-bold text-slate-800 text-sm mt-0.5 block">{budget.showDuration || "Não informada"}</span>
                   </div>
                   <div>
                     <span className="text-slate-400 block font-semibold uppercase tracking-wider text-[10px]">IDENTIFICAÇÃO</span>
                     <span className="font-bold text-slate-800 text-sm mt-0.5 block">{budget.name || "Orçamento Base"}</span>
                   </div>
                 </div>

                {/* Facsimile Table */}
                <div className="space-y-2 print-avoid-break">
                  <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Custo de Operação e Logística</h4>
                  <div className="border-t border-slate-200 pt-2 space-y-1 text-xs">
                    {tableData.map((item, idx) => (
                      <div key={idx} className="flex justify-between py-1.5 border-b border-slate-100 last:border-0 items-center">
                        <span className="text-slate-600">{item.label}</span>
                        {item.isContratante ? (
                          <span className="font-bold text-emerald-600 uppercase tracking-wider text-[10px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            Contratante
                          </span>
                        ) : (
                          <span className="font-bold text-slate-800">R$ {item.value.toLocaleString("pt-BR")}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Facsimile Lineup */}
                {(() => {
                  const mList = [
                    { name: "Cantor", count: budget.musicianCantor || 0 },
                    { name: "Backing Vocal", count: budget.musicianBackingVocal || 0 },
                    { name: "Guitarrista", count: budget.musicianGuitarrista || 0 },
                    { name: "Violão", count: budget.musicianViolao || 0 },
                    { name: "Baixista", count: budget.musicianBaixista || 0 },
                    { name: "Tecladista", count: budget.musicianTecladista || 0 },
                    { name: "Percussionista", count: budget.musicianPercussionista || 0 },
                    { name: "Baterista", count: budget.musicianBaterista || 0 },
                    { name: "Roadie", count: budget.musicianRoadie || 0 },
                    { name: budget.musicianOutroDesc || "Outro", count: budget.musicianOutroCount || 0 },
                  ].filter(m => m.count > 0);

                  if (mList.length === 0) return null;

                  return (
                    <div className="space-y-2 print-avoid-break">
                      <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Lineup & Integrantes Escalados</h4>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {mList.map((m, idx) => (
                          <span key={idx} className="bg-slate-50 text-slate-700 text-xs font-medium px-3 py-1 rounded-full border border-slate-200">
                            {m.name}: <strong className="text-pink-600 font-bold">{m.count}x</strong>
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {/* Facsimile Totals */}
                <div className="flex justify-between items-center bg-slate-900 text-white rounded-xl p-4 print-stack print-avoid-break">
                  <div>
                    <span className="text-[10px] text-slate-300 uppercase block font-medium">Preço Total Proposto</span>
                    <span className="text-slate-400 text-xs">Valor comercial final líquido</span>
                  </div>
                  <div className="text-right print-text-left">
                    <span className="text-2xl font-extrabold text-pink-400">R$ {finalPrice.toLocaleString("pt-BR")}</span>
                  </div>
                </div>

                {/* Facsimile Observação */}
                {bandSettings.observation && bandSettings.observation.trim() && (
                  <div className="space-y-1 text-xs print-avoid-break border-t border-slate-200 pt-3 text-left">
                    <strong className="font-bold text-slate-800 block text-[11px] uppercase tracking-wider">Observação:</strong>
                    <p className="text-slate-600 leading-relaxed font-sans mt-0.5 whitespace-pre-line text-xs">
                      {bandSettings.observation.trim()}
                    </p>
                  </div>
                )}

              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-white/5 bg-slate-900/40 flex justify-end space-x-3">
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Fechar Visualização
              </button>
              <button
                onClick={() => {
                  generatePDF(true);
                  setIsPreviewOpen(false);
                }}
                className="gradient-btn px-6 py-2 rounded-xl text-white font-bold text-sm transition-all cursor-pointer shadow-lg"
              >
                Baixar PDF Agora
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}