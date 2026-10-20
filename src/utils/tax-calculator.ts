import { TAX_CONSTANTS } from '../constants/tax-tables';
import type {
  BolsistaCalculationResult,
  BreakevenResult,
  CltCalculationResult,
  PjCalculationResult,
  SimulatorInput,
  WaterfallStep,
} from '../types';

/**
 * Calcula o desconto progressivo de INSS para CLT conforme as faixas vigentes.
 */
export function calculateInssClt(grossSalary: number): { inssTotal: number; effectiveRate: number } {
  if (grossSalary <= 0) return { inssTotal: 0, effectiveRate: 0 };

  let inssTotal = 0;
  const salary = Math.min(grossSalary, TAX_CONSTANTS.INSS_CEILING);

  for (const bracket of TAX_CONSTANTS.INSS_BRACKETS) {
    if (salary > bracket.min) {
      const taxableInBracket = Math.min(salary, bracket.max) - bracket.min;
      inssTotal += taxableInBracket * bracket.rate;
    }
  }

  const effectiveRate = grossSalary > 0 ? inssTotal / grossSalary : 0;
  return { inssTotal, effectiveRate };
}

/**
 * Calcula o IRPF oficial comparando a dedução legal (INSS + dependentes)
 * contra o desconto simplificado da Receita Federal.
 */
export function calculateIrpf(
  grossAmount: number,
  inssDeduction: number,
  dependentsCount: number
): { irpfTotal: number; effectiveRate: number; usedSimplified: boolean } {
  if (grossAmount <= 0) return { irpfTotal: 0, effectiveRate: 0, usedSimplified: false };

  const legalDeductions = inssDeduction + dependentsCount * TAX_CONSTANTS.IRPF_DEPENDENT_DEDUCTION;
  const simplifiedDeduction = TAX_CONSTANTS.IRPF_SIMPLIFIED_DISCOUNT;

  const usedSimplified = simplifiedDeduction > legalDeductions;
  const deductionChosen = usedSimplified ? simplifiedDeduction : legalDeductions;

  const calculationBase = Math.max(0, grossAmount - deductionChosen);

  let irpfTotal = 0;

  for (const bracket of TAX_CONSTANTS.IRPF_BRACKETS) {
    if (calculationBase <= bracket.limit) {
      irpfTotal = Math.max(0, calculationBase * bracket.rate - bracket.deduction);
      break;
    }
  }

  const effectiveRate = grossAmount > 0 ? irpfTotal / grossAmount : 0;
  return { irpfTotal, effectiveRate, usedSimplified };
}

/**
 * Calcula a alíquota efetiva e o DAS do Simples Nacional com base no faturamento acumulado de 12 meses.
 */
export function calculateSimplesDas(
  monthlyRevenue: number,
  table: Array<{ maxRevenue: number; rate: number; deduction: number }>
): { dasAmount: number; effectiveRate: number } {
  if (monthlyRevenue <= 0) return { dasAmount: 0, effectiveRate: 0 };

  const rbt12 = monthlyRevenue * 12; // Receita bruta acumulada em 12 meses

  let bracket = table[0];
  for (const b of table) {
    bracket = b;
    if (rbt12 <= b.maxRevenue) break;
  }

  // Fórmula oficial da alíquota efetiva do Simples Nacional:
  // Alíquota Efetiva = (RBT12 * Alíquota Nominal - Parcela a Deduzir) / RBT12
  const effectiveRate = Math.max(0.045, (rbt12 * bracket.rate - bracket.deduction) / rbt12);
  const dasAmount = monthlyRevenue * effectiveRate;

  return { dasAmount, effectiveRate };
}

/**
 * Motor de Cálculo CLT:
 * - Holerite mensal (INSS, IRPF, benefícios e descontos)
 * - Acréscimos patrimoniais anualizados (13º líquido, 1/3 férias líquido, FGTS 8%)
 */
export function calculateClt(input: SimulatorInput): CltCalculationResult {
  const gross = Math.max(0, input.baseSalary);

  // 1. Descontos em folha mensal
  const inss = calculateInssClt(gross);
  const irpf = calculateIrpf(gross, inss.inssTotal, input.cltDependents);

  // Desconto de VR/VA (máximo legal de 20% do valor do benefício ou percentual configurado)
  const mealDiscount = Math.min(
    input.cltMealVoucherMonthly,
    input.cltMealVoucherMonthly * Math.max(0, Math.min(0.20, input.cltMealVoucherDiscount))
  );

  const totalDiscounts = inss.inssTotal + irpf.irpfTotal + mealDiscount;
  const netSalaryMonthly = Math.max(0, gross - totalDiscounts);

  // 2. Benefícios recebidos
  const netMealBenefit = Math.max(0, input.cltMealVoucherMonthly - mealDiscount);
  const totalMonthlyBenefits = netMealBenefit + input.cltHealthInsuranceBenefit + input.cltOtherBenefits;

  // 3. 13º Salário (Líquido de INSS e IRPF de tributação exclusiva na fonte)
  const inss13th = calculateInssClt(gross);
  const irpf13th = calculateIrpf(gross, inss13th.inssTotal, input.cltDependents);
  const net13thAnnual = Math.max(0, gross - inss13th.inssTotal - irpf13th.irpfTotal);
  const thirteenthMonthlyEquivalent = net13thAnnual / 12;

  // 4. 1/3 Constitucional de Férias adicional líquido
  // (Durante as férias recebe o salário normal que já está contado nos 12 meses, mais 1/3 extra)
  const thirdVacationGross = gross / 3;
  const inssVacationThird = calculateInssClt(thirdVacationGross);
  const irpfVacationThird = calculateIrpf(thirdVacationGross, inssVacationThird.inssTotal, input.cltDependents);
  const netVacationThirdAnnual = Math.max(0, thirdVacationGross - inssVacationThird.inssTotal - irpfVacationThird.irpfTotal);
  const vacationBonusMonthlyEquivalent = netVacationThirdAnnual / 12;

  // 5. FGTS (8% depositado pelo empregador sobre os 12 salários + 13º)
  const fgtsMonthly = gross * TAX_CONSTANTS.FGTS_RATE;
  const fgtsAnnualTotal = fgtsMonthly * 13; // 12 meses + 13º
  const fgtsMonthlyEquivalent = fgtsAnnualTotal / 12;

  // 6. Rendimento Líquido Real Total (mensal e anual)
  const realLiquidMonthlyTotal =
    netSalaryMonthly +
    totalMonthlyBenefits +
    thirteenthMonthlyEquivalent +
    vacationBonusMonthlyEquivalent +
    fgtsMonthlyEquivalent;

  const realLiquidAnnualTotal = realLiquidMonthlyTotal * 12;

  // Waterfall Steps
  let runningTotal = gross;
  const steps: WaterfallStep[] = [
    {
      name: 'Salário Bruto',
      value: gross,
      subtotal: runningTotal,
      type: 'base',
      description: 'Remuneração base contratual em carteira (CTPS)',
    },
    {
      name: 'Desconto INSS',
      value: -inss.inssTotal,
      subtotal: (runningTotal -= inss.inssTotal),
      type: 'deduction',
      description: `Alíquota efetiva de ${(inss.effectiveRate * 100).toFixed(1)}%`,
    },
    {
      name: 'Desconto IRPF',
      value: -irpf.irpfTotal,
      subtotal: (runningTotal -= irpf.irpfTotal),
      type: 'deduction',
      description: irpf.usedSimplified ? 'Optado pelo Desconto Simplificado' : 'Deduções Legais (INSS + dependentes)',
    },
  ];

  if (mealDiscount > 0) {
    steps.push({
      name: 'Co-participação VR/VA',
      value: -mealDiscount,
      subtotal: (runningTotal -= mealDiscount),
      type: 'deduction',
      description: 'Desconto em folha sobre vale alimentação/refeição',
    });
  }

  // Acréscimos
  if (totalMonthlyBenefits > 0) {
    steps.push({
      name: 'Benefícios Líquidos (VR/Saúde)',
      value: totalMonthlyBenefits,
      subtotal: (runningTotal += totalMonthlyBenefits),
      type: 'addition',
      description: 'VR/VA líquido + assistência médica/outros',
    });
  }

  steps.push(
    {
      name: '13º Salário (1/12 Líquido)',
      value: thirteenthMonthlyEquivalent,
      subtotal: (runningTotal += thirteenthMonthlyEquivalent),
      type: 'addition',
      description: 'Parcela mensal proporcional do 13º líquido',
    },
    {
      name: '1/3 Férias (1/12 Líquido)',
      value: vacationBonusMonthlyEquivalent,
      subtotal: (runningTotal += vacationBonusMonthlyEquivalent),
      type: 'addition',
      description: 'Parcela mensal proporcional do terço constitucional de férias',
    },
    {
      name: 'FGTS (8% + 13º)',
      value: fgtsMonthlyEquivalent,
      subtotal: (runningTotal += fgtsMonthlyEquivalent),
      type: 'addition',
      description: 'Depósito compulsório na Caixa Econômica',
    },
    {
      name: 'Líquido Real no Bolso',
      value: runningTotal,
      subtotal: runningTotal,
      type: 'final',
      description: 'Poder de compra real mensalizado da remuneração CLT',
    }
  );

  return {
    grossSalary: gross,
    inssDiscount: inss.inssTotal,
    inssEffectiveRate: inss.effectiveRate,
    irpfDiscount: irpf.irpfTotal,
    irpfEffectiveRate: irpf.effectiveRate,
    irpfUsedSimplified: irpf.usedSimplified,
    mealVoucherDiscount: mealDiscount,
    otherDeductions: 0,
    totalDiscounts,
    netSalaryMonthly,
    thirteenthSalaryMonthlyEquivalent: thirteenthMonthlyEquivalent,
    vacationBonusMonthlyEquivalent,
    fgtsMonthly: fgtsMonthlyEquivalent,
    benefitsMonthlyTotal: totalMonthlyBenefits,
    realLiquidMonthlyTotal,
    realLiquidAnnualTotal,
    waterfallSteps: steps,
  };
}

/**
 * Motor de Cálculo PJ:
 * - DAS (MEI fixo ou Simples Nacional Anexo III/V)
 * - Pró-labore e retenções (INSS 11% e IRPF)
 * - Despesas fixas (contabilidade, operação)
 * - Provisão inversa de equalização (13º, férias e FGTS)
 */
export function calculatePj(input: SimulatorInput): PjCalculationResult {
  const revenue = Math.max(0, input.baseSalary);
  const subtype = input.pjSubtype;

  let dasTax = 0;
  let dasEffectiveRate = 0;
  let proLaboreValue = 0;
  let proLaboreInss = 0;
  let proLaboreIrpf = 0;
  let accountingCost = input.pjAccountingMonthlyCost;

  if (subtype === 'mei') {
    // MEI não tem obrigatoriedade de contador e paga DAS fixo
    dasTax = revenue > 0 ? TAX_CONSTANTS.MEI_DAS_FIXED : 0;
    dasEffectiveRate = revenue > 0 ? dasTax / revenue : 0;
    // O MEI não precisa retirar pró-labore formal além do DAS com INSS 5%
    proLaboreValue = 0;
    proLaboreInss = 0;
    proLaboreIrpf = 0;
  } else if (subtype === 'simples_anexo_iii') {
    // Com Fator R (>= 28% de folha para ficar no Anexo III de 6%)
    const simples = calculateSimplesDas(revenue, TAX_CONSTANTS.SIMPLES_ANEXO_III);
    dasTax = simples.dasAmount;
    dasEffectiveRate = simples.effectiveRate;

    // Pró-labore de 28% do faturamento (mínimo de 1 salário mínimo)
    proLaboreValue = Math.max(TAX_CONSTANTS.SALARIO_MINIMO, revenue * TAX_CONSTANTS.FATOR_R_MIN_RATIO);
    proLaboreInss = Math.min(proLaboreValue, TAX_CONSTANTS.INSS_CEILING) * TAX_CONSTANTS.INSS_PRO_LABORE_RATE;

    const irpfCalc = calculateIrpf(proLaboreValue, proLaboreInss, input.cltDependents);
    proLaboreIrpf = irpfCalc.irpfTotal;
  } else {
    // Anexo V (sem Fator R, pró-labore mínimo de 1 salário mínimo)
    const simples = calculateSimplesDas(revenue, TAX_CONSTANTS.SIMPLES_ANEXO_V);
    dasTax = simples.dasAmount;
    dasEffectiveRate = simples.effectiveRate;

    proLaboreValue = TAX_CONSTANTS.SALARIO_MINIMO;
    proLaboreInss = proLaboreValue * TAX_CONSTANTS.INSS_PRO_LABORE_RATE;
    const irpfCalc = calculateIrpf(proLaboreValue, proLaboreInss, input.cltDependents);
    proLaboreIrpf = irpfCalc.irpfTotal;
  }

  const otherExpenses = input.pjOtherExpensesMonthly;
  const totalExpensesAndTaxes = dasTax + proLaboreInss + proLaboreIrpf + accountingCost + otherExpenses;
  const netCashFlowCompany = Math.max(0, revenue - totalExpensesAndTaxes);

  // Provisões de Equalização com a CLT
  // Para que o PJ descanse 30 dias por ano e receba o 13º igual um CLT:
  let provision13thMonthly = 0;
  let provisionVacationMonthly = 0;
  let provisionFgtsMonthly = 0;

  if (input.pjProvisaoFerias13 && netCashFlowCompany > 0) {
    // Reserva de 1/12 para o 13º
    provision13thMonthly = netCashFlowCompany / 12;
    // Reserva de 1 mês de férias + 1/3 constitucional: (1 + 1/3) / 12 = 1.3333 / 12 = 11.11%
    provisionVacationMonthly = (netCashFlowCompany * (4 / 3)) / 12;
  }

  if (input.pjProvisaoFgts && netCashFlowCompany > 0) {
    // Reserva equivalente ao FGTS de 8%
    provisionFgtsMonthly = netCashFlowCompany * 0.08;
  }

  const totalProvisions = provision13thMonthly + provisionVacationMonthly + provisionFgtsMonthly;
  const realLiquidMonthlyTotal = Math.max(0, netCashFlowCompany - totalProvisions);
  const realLiquidAnnualTotal = realLiquidMonthlyTotal * 12;

  // Waterfall Steps
  let runningTotal = revenue;
  const steps: WaterfallStep[] = [
    {
      name: 'Faturamento Bruto',
      value: revenue,
      subtotal: runningTotal,
      type: 'base',
      description: 'Nota fiscal emitida no mês',
    },
    {
      name: subtype === 'mei' ? 'Guia DAS MEI' : 'DAS Simples Nacional',
      value: -dasTax,
      subtotal: (runningTotal -= dasTax),
      type: 'deduction',
      description: `Alíquota efetiva de ${(dasEffectiveRate * 100).toFixed(1)}%`,
    },
  ];

  if (proLaboreInss > 0) {
    steps.push({
      name: 'INSS Pró-labore (11%)',
      value: -proLaboreInss,
      subtotal: (runningTotal -= proLaboreInss),
      type: 'deduction',
      description: `Previdência oficial do sócio (Pró-labore: R$ ${proLaboreValue.toFixed(2)})`,
    });
  }

  if (proLaboreIrpf > 0) {
    steps.push({
      name: 'IRPF Pró-labore',
      value: -proLaboreIrpf,
      subtotal: (runningTotal -= proLaboreIrpf),
      type: 'deduction',
      description: 'Imposto de renda retido na fonte sobre o pró-labore',
    });
  }

  if (accountingCost > 0) {
    steps.push({
      name: 'Honorários Contábeis',
      value: -accountingCost,
      subtotal: (runningTotal -= accountingCost),
      type: 'deduction',
      description: 'Mensalidade da contabilidade',
    });
  }

  if (otherExpenses > 0) {
    steps.push({
      name: 'Despesas Operacionais',
      value: -otherExpenses,
      subtotal: (runningTotal -= otherExpenses),
      type: 'deduction',
      description: 'Custos de home office, softwares e alvarás',
    });
  }

  if (provision13thMonthly > 0) {
    steps.push({
      name: 'Provisão Própria 13º',
      value: -provision13thMonthly,
      subtotal: (runningTotal -= provision13thMonthly),
      type: 'provision',
      description: 'Reserva matemática de 1/12 para o fim de ano',
    });
  }

  if (provisionVacationMonthly > 0) {
    steps.push({
      name: 'Provisão Férias + 1/3',
      value: -provisionVacationMonthly,
      subtotal: (runningTotal -= provisionVacationMonthly),
      type: 'provision',
      description: 'Reserva para 30 dias de descanso remunerado + 1/3',
    });
  }

  if (provisionFgtsMonthly > 0) {
    steps.push({
      name: 'Reserva Equivalente ao FGTS (8%)',
      value: -provisionFgtsMonthly,
      subtotal: (runningTotal -= provisionFgtsMonthly),
      type: 'provision',
      description: 'Fundo de segurança e rescisão emergencial',
    });
  }

  steps.push({
    name: 'Líquido Livre para Saque',
    value: runningTotal,
    subtotal: runningTotal,
    type: 'final',
    description: 'Valor disponível no bolso com provisões garantidas',
  });

  return {
    grossRevenue: revenue,
    subtype,
    dasTax,
    dasEffectiveRate,
    proLaboreValue,
    proLaboreInss,
    proLaboreIrpf,
    accountingCost,
    otherExpenses,
    totalExpensesAndTaxes,
    netCashFlowCompany,
    provision13thMonthly,
    provisionVacationMonthly,
    provisionFgtsMonthly,
    totalProvisions,
    realLiquidMonthlyTotal,
    realLiquidAnnualTotal,
    waterfallSteps: steps,
  };
}

/**
 * Motor de Cálculo Bolsista (CNPq, CAPES, FAPESP, Fundações de Apoio/Extensão):
 * - Renda 100% Isenta de IRPF (Leis 9.250/95 e 8.958/94)
 * - Desconto de Equalização Previdenciária (INSS Facultativo)
 * - Provisão para término de vigência / ausência de 13º e férias
 */
export function calculateBolsista(input: SimulatorInput): BolsistaCalculationResult {
  const gross = Math.max(0, input.baseSalary);
  const irpfDiscount = 0; // Cravado por lei

  // Equalização da Previdência Social
  let inssFacultativoCost = 0;
  let inssDescription = 'Sem recolhimento previdenciário';

  if (input.bolsaEquipararSeguranca) {
    if (input.bolsaInssFacultativo === 'simplificado_11') {
      // 11% sobre o salário mínimo (Plano Simplificado de Previdência)
      inssFacultativoCost = TAX_CONSTANTS.SALARIO_MINIMO * TAX_CONSTANTS.INSS_FACULTATIVO_SIMPLIFICADO_RATE;
      inssDescription = `INSS Facultativo Simplificado (11% do SM: R$ ${inssFacultativoCost.toFixed(2)})`;
    } else if (input.bolsaInssFacultativo === 'normal_20') {
      // 20% sobre o valor da bolsa ou salário mínimo (até o teto do INSS)
      const baseContribution = Math.min(
        TAX_CONSTANTS.INSS_CEILING,
        Math.max(TAX_CONSTANTS.SALARIO_MINIMO, input.bolsaInssBaseCustom || gross)
      );
      inssFacultativoCost = baseContribution * TAX_CONSTANTS.INSS_FACULTATIVO_NORMAL_RATE;
      inssDescription = `INSS Facultativo Normal (20% sobre R$ ${baseContribution.toFixed(2)} = R$ ${inssFacultativoCost.toFixed(2)})`;
    }
  }

  // Equalização de Férias e 13º / Reserva de término de contrato de bolsa
  // Bolsistas de pesquisa não recebem 13º salário e não têm férias com terço constitucional
  let provisionVacationAnd13th = 0;
  if (input.bolsaProvisaoTransicao && gross > 0) {
    // 1/12 (13º) + (1.3333 / 12) (férias + 1/3) = ~19.44%
    provisionVacationAnd13th = (gross / 12) + (gross * (4 / 3) / 12);
  }

  const totalEqualizationDeductions = inssFacultativoCost + provisionVacationAnd13th;
  const realLiquidMonthlyTotal = Math.max(0, gross - totalEqualizationDeductions);
  const realLiquidAnnualTotal = realLiquidMonthlyTotal * 12;

  // Waterfall Steps
  let runningTotal = gross;
  const steps: WaterfallStep[] = [
    {
      name: 'Valor Bruto da Bolsa',
      value: gross,
      subtotal: runningTotal,
      type: 'base',
      description: 'Remuneração acadêmica ou de extensão',
    },
    {
      name: 'IRPF (Isenção Fiscal)',
      value: 0,
      subtotal: runningTotal,
      type: 'addition',
      description: '100% Isento pela Lei 9.250/95 e Lei 8.958/94',
    },
  ];

  if (inssFacultativoCost > 0) {
    steps.push({
      name: 'INSS Facultativo (Equalização)',
      value: -inssFacultativoCost,
      subtotal: (runningTotal -= inssFacultativoCost),
      type: 'provision',
      description: inssDescription,
    });
  }

  if (provisionVacationAnd13th > 0) {
    steps.push({
      name: 'Provisão Férias + 13º / Transição',
      value: -provisionVacationAnd13th,
      subtotal: (runningTotal -= provisionVacationAnd13th),
      type: 'provision',
      description: 'Reserva para compensar falta de 13º e 30 dias de descanso remunerado',
    });
  }

  steps.push({
    name: 'Líquido Real no Bolso',
    value: runningTotal,
    subtotal: runningTotal,
    type: 'final',
    description: 'Rendimento efetivo equalizado às condições do mercado de trabalho',
  });

  return {
    grossBolsa: gross,
    irpfDiscount,
    inssFacultativoCost,
    inssFacultativoDescription: inssDescription,
    provisionVacationAnd13th,
    totalEqualizationDeductions,
    realLiquidMonthlyTotal,
    realLiquidAnnualTotal,
    waterfallSteps: steps,
  };
}

/**
 * Breakeven Solver:
 * Encontra a remuneração bruta necessária em cada regime para igualar o
 * rendimento líquido real anual do regime de referência.
 */
export function calculateBreakeven(input: SimulatorInput): BreakevenResult {
  let targetAnnualRealLiquid = 0;

  if (input.referenceRegime === 'clt') {
    targetAnnualRealLiquid = calculateClt(input).realLiquidAnnualTotal;
  } else if (input.referenceRegime === 'pj') {
    targetAnnualRealLiquid = calculatePj(input).realLiquidAnnualTotal;
  } else {
    targetAnnualRealLiquid = calculateBolsista(input).realLiquidAnnualTotal;
  }

  const targetMonthlyRealLiquid = targetAnnualRealLiquid / 12;

  // Busca binária para encontrar o bruto necessário
  const solveGross = (
    calcFn: (candidateGross: number) => number,
    targetMonthly: number
  ): number => {
    if (targetMonthly <= 0) return 0;

    let low = 0;
    let high = Math.max(50000, targetMonthly * 4);
    let best = targetMonthly;

    for (let i = 0; i < 40; i++) {
      const mid = (low + high) / 2;
      const result = calcFn(mid);

      if (Math.abs(result - targetMonthly) < 0.5) {
        return mid;
      }

      if (result < targetMonthly) {
        low = mid;
      } else {
        high = mid;
        best = mid;
      }
    }

    return best;
  };

  const cltTargetGross =
    input.referenceRegime === 'clt'
      ? input.baseSalary
      : solveGross((g) => calculateClt({ ...input, baseSalary: g }).realLiquidMonthlyTotal, targetMonthlyRealLiquid);

  const pjTargetGross =
    input.referenceRegime === 'pj'
      ? input.baseSalary
      : solveGross((g) => calculatePj({ ...input, baseSalary: g }).realLiquidMonthlyTotal, targetMonthlyRealLiquid);

  const bolsaTargetGross =
    input.referenceRegime === 'bolsista'
      ? input.baseSalary
      : solveGross((g) => calculateBolsista({ ...input, baseSalary: g }).realLiquidMonthlyTotal, targetMonthlyRealLiquid);

  return {
    referenceRegime: input.referenceRegime,
    referenceRealLiquidAnnual: targetAnnualRealLiquid,
    cltTargetGross,
    pjTargetGross,
    bolsaTargetGross,
  };
}
