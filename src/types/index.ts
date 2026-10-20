export type RegimeType = 'clt' | 'pj' | 'bolsista';

export type PjSubtype = 'mei' | 'simples_anexo_iii' | 'simples_anexo_v';

export type InssFacultativoType = 'none' | 'simplificado_11' | 'normal_20';

export interface SimulatorInput {
  baseSalary: number; // Remuneração bruta ou valor da bolsa de referência
  referenceRegime: RegimeType; // Regime de partida para cálculo do Breakeven
  
  // Parâmetros CLT
  cltDependents: number;
  cltMealVoucherMonthly: number; // VR/VA recebido
  cltMealVoucherDiscount: number; // Desconto em folha de VR/VA (até 20%)
  cltHealthInsuranceBenefit: number; // Valor benefício plano de saúde pago pela empresa
  cltOtherBenefits: number; // Outros auxílios (creche, combustível, etc.)
  
  // Parâmetros PJ
  pjSubtype: PjSubtype;
  pjAccountingMonthlyCost: number; // Custo mensal de contabilidade
  pjOtherExpensesMonthly: number; // Internet, celular, aluguel, software
  pjApplyFatorR: boolean; // Aplicar pró-labore de 28% para Anexo III
  pjProvisaoFerias13: boolean; // Ativar equalização de férias + 13º
  pjProvisaoFgts: boolean; // Ativar reserva equivalente a FGTS (8%)
  
  // Parâmetros Bolsista
  bolsaInssFacultativo: InssFacultativoType; // 11% ou 20%
  bolsaInssBaseCustom: number; // Base de cálculo do INSS (Salário Mínimo ou customizado)
  bolsaEquipararSeguranca: boolean; // Toggle geral de equiparação previdenciária
  bolsaProvisaoTransicao: boolean; // Reserva para término de bolsa / férias / 13º
}

export interface CltCalculationResult {
  grossSalary: number;
  inssDiscount: number;
  inssEffectiveRate: number;
  irpfDiscount: number;
  irpfEffectiveRate: number;
  irpfUsedSimplified: boolean;
  
  // Deduções extras
  mealVoucherDiscount: number;
  otherDeductions: number;
  totalDiscounts: number;
  
  // Líquido do Holerite (o que cai na conta mensal)
  netSalaryMonthly: number;
  
  // Acréscimos & Benefícios patrimoniais (mensalizados / anuais)
  thirteenthSalaryMonthlyEquivalent: number; // 1/12 líquido
  vacationBonusMonthlyEquivalent: number; // 1/12 de férias + 1/3 constitucional líquido
  fgtsMonthly: number; // 8% do bruto depositado na conta vinculada
  benefitsMonthlyTotal: number; // VR/VA líquido + Saúde + outros
  
  // Rendimento Líquido Real Global (Holerite + Benefícios + FGTS + 13º + Férias proporcional)
  realLiquidMonthlyTotal: number;
  realLiquidAnnualTotal: number;
  
  // Breakdown para o gráfico em cascata
  waterfallSteps: WaterfallStep[];
}

export interface PjCalculationResult {
  grossRevenue: number;
  subtype: PjSubtype;
  dasTax: number;
  dasEffectiveRate: number;
  
  // Pró-labore
  proLaboreValue: number;
  proLaboreInss: number;
  proLaboreIrpf: number;
  
  // Custos fixos
  accountingCost: number;
  otherExpenses: number;
  totalExpensesAndTaxes: number;
  
  // Líquido nominal da empresa (antes de guardar reservas)
  netCashFlowCompany: number;
  
  // Provisões de Equalização (o trabalhador guardando para si)
  provision13thMonthly: number;
  provisionVacationMonthly: number;
  provisionFgtsMonthly: number;
  totalProvisions: number;
  
  // Líquido Seguro no Bolso (após garantir férias, 13º e despesas)
  realLiquidMonthlyTotal: number;
  realLiquidAnnualTotal: number;
  
  waterfallSteps: WaterfallStep[];
}

export interface BolsistaCalculationResult {
  grossBolsa: number;
  irpfDiscount: number; // Sempre 0
  
  // Equalização previdenciária
  inssFacultativoCost: number;
  inssFacultativoDescription: string;
  
  // Provisões para ausência de 13º e férias ou término de bolsa
  provisionVacationAnd13th: number;
  
  totalEqualizationDeductions: number;
  
  // Rendimento Líquido Real
  realLiquidMonthlyTotal: number;
  realLiquidAnnualTotal: number;
  
  waterfallSteps: WaterfallStep[];
}

export interface WaterfallStep {
  name: string;
  value: number; // Positivo para adições, negativo para deduções
  subtotal: number;
  type: 'base' | 'deduction' | 'addition' | 'provision' | 'final';
  description?: string;
}

export interface BreakevenResult {
  referenceRegime: RegimeType;
  referenceRealLiquidAnnual: number;
  
  // Quanto precisaria faturar em cada regime para igualar o rendimento líquido real anual de referência
  cltTargetGross: number;
  pjTargetGross: number;
  bolsaTargetGross: number;
}
