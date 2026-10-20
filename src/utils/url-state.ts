import type { SimulatorInput } from '../types';

export const DEFAULT_INPUT: SimulatorInput = {
  baseSalary: 7000,
  referenceRegime: 'clt',
  
  // CLT
  cltDependents: 0,
  cltMealVoucherMonthly: 800,
  cltMealVoucherDiscount: 0.05,
  cltHealthInsuranceBenefit: 350,
  cltOtherBenefits: 0,
  
  // PJ
  pjSubtype: 'simples_anexo_iii',
  pjAccountingMonthlyCost: 199,
  pjOtherExpensesMonthly: 150,
  pjApplyFatorR: true,
  pjProvisaoFerias13: true,
  pjProvisaoFgts: false,
  
  // Bolsista
  bolsaInssFacultativo: 'simplificado_11',
  bolsaInssBaseCustom: 1518,
  bolsaEquipararSeguranca: true,
  bolsaProvisaoTransicao: true,
};

const STORAGE_KEY = 'simulador_regimes_state_v1';

/**
 * Carrega o estado inicial combinando:
 * 1. URL search params (prioridade máxima se existirem parâmetros na URL)
 * 2. localStorage (se o usuário já visitou antes)
 * 3. DEFAULT_INPUT (fallback padrão)
 */
export function loadInitialState(): SimulatorInput {
  if (typeof window === 'undefined') return DEFAULT_INPUT;

  const urlParams = new URLSearchParams(window.location.search);
  const hasUrlParams = urlParams.has('bruto') || urlParams.has('regime');

  let baseState = { ...DEFAULT_INPUT };

  // Tentar carregar do localStorage
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      baseState = { ...baseState, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.error('Falha ao ler localStorage:', e);
  }

  // Se houver parâmetros na URL, sobrepõe
  if (hasUrlParams) {
    if (urlParams.has('bruto')) baseState.baseSalary = Number(urlParams.get('bruto')) || baseState.baseSalary;
    if (urlParams.has('regime')) baseState.referenceRegime = (urlParams.get('regime') as any) || baseState.referenceRegime;
    if (urlParams.has('dep')) baseState.cltDependents = Number(urlParams.get('dep')) ?? baseState.cltDependents;
    if (urlParams.has('vr')) baseState.cltMealVoucherMonthly = Number(urlParams.get('vr')) ?? baseState.cltMealVoucherMonthly;
    if (urlParams.has('saude')) baseState.cltHealthInsuranceBenefit = Number(urlParams.get('saude')) ?? baseState.cltHealthInsuranceBenefit;
    if (urlParams.has('pjsub')) baseState.pjSubtype = (urlParams.get('pjsub') as any) || baseState.pjSubtype;
    if (urlParams.has('contab')) baseState.pjAccountingMonthlyCost = Number(urlParams.get('contab')) ?? baseState.pjAccountingMonthlyCost;
    if (urlParams.has('pjprov')) baseState.pjProvisaoFerias13 = urlParams.get('pjprov') === '1';
    if (urlParams.has('inssb')) baseState.bolsaEquipararSeguranca = urlParams.get('inssb') === '1';
    if (urlParams.has('bprov')) baseState.bolsaProvisaoTransicao = urlParams.get('bprov') === '1';
  }

  return baseState;
}

/**
 * Salva no localStorage e atualiza a query string da URL sem recarregar a página (history.replaceState).
 */
export function persistState(state: SimulatorInput) {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Falha ao salvar no localStorage:', e);
  }

  try {
    const params = new URLSearchParams();
    params.set('bruto', Math.round(state.baseSalary).toString());
    params.set('regime', state.referenceRegime);
    params.set('dep', state.cltDependents.toString());
    params.set('vr', Math.round(state.cltMealVoucherMonthly).toString());
    params.set('saude', Math.round(state.cltHealthInsuranceBenefit).toString());
    params.set('pjsub', state.pjSubtype);
    params.set('contab', Math.round(state.pjAccountingMonthlyCost).toString());
    params.set('pjprov', state.pjProvisaoFerias13 ? '1' : '0');
    params.set('inssb', state.bolsaEquipararSeguranca ? '1' : '0');
    params.set('bprov', state.bolsaProvisaoTransicao ? '1' : '0');

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, '', newUrl);
  } catch (e) {
    console.error('Falha ao atualizar URL state:', e);
  }
}
