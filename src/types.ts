/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface BudgetState {
  id?: string;
  name: string; // Nome do Orçamento ou Data do Evento
  clientName: string; // Nome do Contratante / Evento
  eventDate: string;
  location: string;
  eventTime?: string;
  showDuration?: string;
  
  // Custos e se são do Contratante
  logistica: number;
  isContratanteLogistica: boolean;

  hospedagem: number;
  isContratanteHospedagem: boolean;

  alimentacao: number;
  isContratanteAlimentacao: boolean;

  camarim: number;
  isContratanteCamarim: boolean;

  producao: number;
  isContratanteProducao: boolean;

  midia: number;
  isContratanteMidia: boolean;

  seguranca: number;
  isContratanteSeguranca: boolean;

  bandaCompleta: number;
  isContratanteBandaCompleta: boolean;

  equipSom: number;
  isContratanteEquipSom: boolean;

  equipLuz: number;
  isContratanteEquipLuz: boolean;

  palco: number;
  isContratantePalco: boolean;

  gerador: number;
  isContratanteGerador: boolean;

  paymentTerms: string;
  validity: string;

  // Quantidade de cada músico
  musicianCantor: number;
  musicianBackingVocal: number;
  musicianGuitarrista: number;
  musicianBaixista: number;
  musicianTecladista: number;
  musicianPercussionista: number;
  musicianBaterista: number;
  musicianViolao: number;
  musicianRoadie: number;
  musicianOutroCount: number;
  musicianOutroDesc: string;
}

export interface BandIdentity {
  name: string;
  subTitle: string;
  email: string;
  phone: string;
  instagram: string;
  pixKey: string;
  terms?: string;
  observation?: string;
  logoUrl?: string; // Base64 da logo da banda/cantor
}

export interface BudgetPreset {
  id: string;
  name: string;
  description: string;
  icon: string;
  data: Partial<BudgetState>;
}

export const DEFAULT_BAND_IDENTITY: BandIdentity = {
  name: "Banda Rock Horizon",
  subTitle: "Show de Pop Rock Nacional & Internacional",
  email: "contato@rockhorizon.com.br",
  phone: "(11) 99999-8888",
  instagram: "@rockhorizon_oficial",
  pixKey: "contato@rockhorizon.com.br (CNPJ: 12.345.678/0001-90)",
  terms: "1. Reserva de data mediante sinal de 50%.\n2. Alimentação e camarim por conta do contratante, caso não inclusos neste orçamento.\n3. O contratante deve providenciar energia elétrica trifásica aterrada de acordo com o rider técnico.\n4. Validade da proposta: 60 dias.",
  observation: ""
};

export const BUDGET_PRESETS: BudgetPreset[] = [
  {
    id: "pub_local",
    name: "Pub / Evento Pequeno (Local)",
    description: "Cálculo simplificado para barzinhos locais ou pequenas festas na própria cidade da banda.",
    icon: "Beer",
    data: {
      logistica: 150,
      isContratanteLogistica: false,
      hospedagem: 0,
      isContratanteHospedagem: true, // contratante providencia se necessário, ou não tem
      alimentacao: 150,
      isContratanteAlimentacao: false,
      camarim: 0,
      isContratanteCamarim: true,
      producao: 0,
      isContratanteProducao: false,
      midia: 0,
      isContratanteMidia: false,
      seguranca: 0,
      isContratanteSeguranca: true,
      bandaCompleta: 1500,
      isContratanteBandaCompleta: false,
      equipSom: 400,
      isContratanteEquipSom: false,
      equipLuz: 200,
      isContratanteEquipLuz: false,
      palco: 0,
      isContratantePalco: true,
      gerador: 0,
      isContratanteGerador: true,
      paymentTerms: "50% no ato da contratação e 50% até um dia antes do evento, vide contrato."
    }
  },
  {
    id: "show_corporativo",
    name: "Show Corporativo / Casamento",
    description: "Estrutura premium para casamentos ou confraternizações. Alimentação e camarim providenciados pelo contratante.",
    icon: "Briefcase",
    data: {
      logistica: 400,
      isContratanteLogistica: false,
      hospedagem: 0,
      isContratanteHospedagem: true,
      alimentacao: 0,
      isContratanteAlimentacao: true,
      camarim: 200,
      isContratanteCamarim: false,
      producao: 600,
      isContratanteProducao: false,
      midia: 0,
      isContratanteMidia: false,
      seguranca: 0,
      isContratanteSeguranca: true,
      bandaCompleta: 5000,
      isContratanteBandaCompleta: false,
      equipSom: 1800,
      isContratanteEquipSom: false,
      equipLuz: 1200,
      isContratanteEquipLuz: false,
      palco: 0,
      isContratantePalco: true,
      gerador: 0,
      isContratanteGerador: true,
      paymentTerms: "50% no ato da contratação e 50% até um dia antes do evento, vide contrato."
    }
  },
  {
    id: "show_regional",
    name: "Show Regional (Viagem)",
    description: "Orçamento de viagem intermunicipal englobando custos maiores de logística e hospedagem.",
    icon: "Truck",
    data: {
      logistica: 1200,
      isContratanteLogistica: false,
      hospedagem: 1000,
      isContratanteHospedagem: false,
      alimentacao: 500,
      isContratanteAlimentacao: false,
      camarim: 300,
      isContratanteCamarim: false,
      producao: 600,
      isContratanteProducao: false,
      midia: 150,
      isContratanteMidia: false,
      seguranca: 0,
      isContratanteSeguranca: true,
      bandaCompleta: 4000,
      isContratanteBandaCompleta: false,
      equipSom: 1200,
      isContratanteEquipSom: false,
      equipLuz: 800,
      isContratanteEquipLuz: false,
      palco: 0,
      isContratantePalco: true,
      gerador: 0,
      isContratanteGerador: true,
      paymentTerms: "50% no ato da contratação e 50% até um dia antes do evento, vide contrato."
    }
  },
  {
    id: "show_festival",
    name: "Festival / Show de Grande Porte",
    description: "Para shows de grande porte com rider completo contratado, palco, gerador e logística pesada.",
    icon: "Music",
    data: {
      logistica: 2000,
      isContratanteLogistica: false,
      hospedagem: 0,
      isContratanteHospedagem: true,
      alimentacao: 0,
      isContratanteAlimentacao: true,
      camarim: 400,
      isContratanteCamarim: false,
      producao: 1200,
      isContratanteProducao: false,
      midia: 500,
      isContratanteMidia: false,
      seguranca: 800,
      isContratanteSeguranca: false,
      bandaCompleta: 10000,
      isContratanteBandaCompleta: false,
      equipSom: 5000,
      isContratanteEquipSom: false,
      equipLuz: 4000,
      isContratanteEquipLuz: false,
      palco: 3000,
      isContratantePalco: false,
      gerador: 1500,
      isContratanteGerador: false,
      paymentTerms: "50% no ato da contratação e 50% até um dia antes do evento, vide contrato."
    }
  }
];

export const INITIAL_BUDGET_STATE: BudgetState = {
  name: "Orçamento Base #1",
  clientName: "Contratante Exemplo",
  eventDate: "",
  location: "São Paulo - SP",
  eventTime: "",
  showDuration: "",
  logistica: 0,
  isContratanteLogistica: false,
  hospedagem: 0,
  isContratanteHospedagem: false,
  alimentacao: 0,
  isContratanteAlimentacao: false,
  camarim: 0,
  isContratanteCamarim: false,
  producao: 0,
  isContratanteProducao: false,
  midia: 0,
  isContratanteMidia: false,
  seguranca: 0,
  isContratanteSeguranca: false,
  bandaCompleta: 0,
  isContratanteBandaCompleta: false,
  equipSom: 0,
  isContratanteEquipSom: false,
  equipLuz: 0,
  isContratanteEquipLuz: false,
  palco: 0,
  isContratantePalco: false,
  gerador: 0,
  isContratanteGerador: false,
  paymentTerms: "50% no ato da contratação e 50% até um dia antes do evento, vide contrato.",
  validity: "Validade da proposta: 60 dias",
  
  // Quantidade de cada músico inicial
  musicianCantor: 0,
  musicianBackingVocal: 0,
  musicianGuitarrista: 0,
  musicianBaixista: 0,
  musicianTecladista: 0,
  musicianPercussionista: 0,
  musicianBaterista: 0,
  musicianViolao: 0,
  musicianRoadie: 0,
  musicianOutroCount: 0,
  musicianOutroDesc: ""
};

export function calculateTotalBudget(budget: BudgetState): number {
  let total = 0;
  if (!budget.isContratanteLogistica) total += budget.logistica || 0;
  if (!budget.isContratanteHospedagem) total += budget.hospedagem || 0;
  if (!budget.isContratanteAlimentacao) total += budget.alimentacao || 0;
  if (!budget.isContratanteCamarim) total += budget.camarim || 0;
  if (!budget.isContratanteProducao) total += budget.producao || 0;
  if (!budget.isContratanteMidia) total += budget.midia || 0;
  if (!budget.isContratanteSeguranca) total += budget.seguranca || 0;
  if (!budget.isContratanteBandaCompleta) total += budget.bandaCompleta || 0;
  if (!budget.isContratanteEquipSom) total += budget.equipSom || 0;
  if (!budget.isContratanteEquipLuz) total += budget.equipLuz || 0;
  if (!budget.isContratantePalco) total += budget.palco || 0;
  if (!budget.isContratanteGerador) total += budget.gerador || 0;
  return total;
}

export interface CustomMusician {
  name: string;
  count: number;
}

export interface MusicianDisplayItem {
  name: string;
  count: number;
}

export function parseCustomMusicians(desc: string, totalCount: number): CustomMusician[] {
  if (!desc) {
    return [];
  }
  try {
    const parsed = JSON.parse(desc);
    if (Array.isArray(parsed) && parsed.every(item => typeof item === "object" && item !== null && "name" in item && "count" in item)) {
      return parsed;
    }
  } catch (e) {
    // Se não for JSON, trata a string inteira como um único registro
    return desc.trim() ? [{ name: desc, count: totalCount || 1 }] : [];
  }
  return [];
}

export function getMusiciansList(budget: BudgetState): MusicianDisplayItem[] {
  const list: MusicianDisplayItem[] = [
    { name: "Cantor", count: budget.musicianCantor || 0 },
    { name: "Backing Vocal", count: budget.musicianBackingVocal || 0 },
    { name: "Guitarrista", count: budget.musicianGuitarrista || 0 },
    { name: "Violão", count: budget.musicianViolao || 0 },
    { name: "Baixista", count: budget.musicianBaixista || 0 },
    { name: "Tecladista", count: budget.musicianTecladista || 0 },
    { name: "Percussionista", count: budget.musicianPercussionista || 0 },
    { name: "Baterista", count: budget.musicianBaterista || 0 },
    { name: "Roadie", count: budget.musicianRoadie || 0 },
  ];

  const custom = parseCustomMusicians(budget.musicianOutroDesc || "", budget.musicianOutroCount || 0);
  if (custom.length > 0) {
    custom.forEach(item => {
      if (item.name.trim()) {
        list.push({ name: item.name, count: item.count });
      }
    });
  } else if (budget.musicianOutroCount > 0 && budget.musicianOutroDesc) {
    list.push({ name: budget.musicianOutroDesc, count: budget.musicianOutroCount });
  }

  return list.filter(m => m.count > 0);
}

