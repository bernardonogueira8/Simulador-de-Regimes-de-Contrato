// Constantes e Tabelas Oficiais de Tributos Brasileiros (INSS, IRPF, Simples Nacional, MEI)

export const TAX_CONSTANTS = {
  SALARIO_MINIMO: 1518.00, // Salário Mínimo vigente (2025)
  SALARIO_MINIMO_2024: 1412.00,
  
  // Tabela Progressiva INSS 2025
  INSS_BRACKETS: [
    { min: 0, max: 1518.00, rate: 0.075 },
    { min: 1518.00, max: 2793.88, rate: 0.09 },
    { min: 2793.88, max: 4190.83, rate: 0.12 },
    { min: 4190.83, max: 8157.41, rate: 0.14 },
  ],
  INSS_CEILING: 8157.41, // Teto Máximo do Salário de Contribuição
  
  // Tabela Progressiva IRPF
  IRPF_BRACKETS: [
    { limit: 2259.20, rate: 0, deduction: 0 },
    { limit: 2826.65, rate: 0.075, deduction: 169.44 },
    { limit: 3751.05, rate: 0.15, deduction: 381.44 },
    { limit: 4664.68, rate: 0.225, deduction: 662.77 },
    { limit: Infinity, rate: 0.275, deduction: 896.00 },
  ],
  IRPF_DEPENDENT_DEDUCTION: 189.59, // Dedução mensal por dependente legal
  IRPF_SIMPLIFIED_DISCOUNT: 564.80, // Desconto simplificado alternativo na base de cálculo
  
  // FGTS
  FGTS_RATE: 0.08, // 8% depositado pelo empregador
  
  // MEI (Microempreendedor Individual)
  MEI_ANNUAL_LIMIT: 81000.00, // Limite anual
  MEI_MONTHLY_LIMIT: 6750.00, // Limite mensal médio
  MEI_DAS_FIXED: 80.90, // INSS 5% SM (R$ 75,90) + ISS R$ 5,00
  
  // Simples Nacional - Anexo III (Serviços com Fator R >= 28%)
  SIMPLES_ANEXO_III: [
    { maxRevenue: 180000, rate: 0.06, deduction: 0 },
    { maxRevenue: 360000, rate: 0.112, deduction: 9360 },
    { maxRevenue: 720000, rate: 0.135, deduction: 17640 },
    { maxRevenue: 1800000, rate: 0.16, deduction: 35640 },
    { maxRevenue: 3600000, rate: 0.21, deduction: 125640 },
    { maxRevenue: 4800000, rate: 0.33, deduction: 648000 },
  ],
  
  // Simples Nacional - Anexo V (Serviços sem Fator R < 28%)
  SIMPLES_ANEXO_V: [
    { maxRevenue: 180000, rate: 0.155, deduction: 0 },
    { maxRevenue: 360000, rate: 0.18, deduction: 4500 },
    { maxRevenue: 720000, rate: 0.195, deduction: 9900 },
    { maxRevenue: 1800000, rate: 0.205, deduction: 17100 },
    { maxRevenue: 3600000, rate: 0.23, deduction: 62100 },
    { maxRevenue: 4800000, rate: 0.305, deduction: 540000 },
  ],
  
  // Fator R
  FATOR_R_MIN_RATIO: 0.28, // 28% de folha/pró-labore sobre faturamento
  
  // INSS Contribuinte Individual (Pró-labore sócio ME / MEI complementar)
  INSS_PRO_LABORE_RATE: 0.11, // 11% retido sobre o pró-labore até o teto
  
  // INSS Bolsista Facultativo
  INSS_FACULTATIVO_SIMPLIFICADO_RATE: 0.11, // 11% do Salário Mínimo (R$ 166,98)
  INSS_FACULTATIVO_NORMAL_RATE: 0.20, // 20% do Salário Mínimo ou da Bolsa (até o teto)
  
  // Custos Operacionais Típicos PJ
  DEFAULT_PJ_ACCOUNTING_MONTHLY: 199.00,
  DEFAULT_PJ_OTHER_EXPENSES_MONTHLY: 150.00,
  
  // Benefícios Padrão CLT
  DEFAULT_CLT_MEAL_MONTHLY: 800.00,
  DEFAULT_CLT_MEAL_DISCOUNT_PERCENT: 0.05, // 5% de desconto comum em folha
  DEFAULT_CLT_HEALTH_BENEFIT: 350.00,
};
