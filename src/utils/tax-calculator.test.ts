import { describe, it, expect } from 'vitest';
import {
  calculateInssClt,
  calculateIrpf,
  calculateClt,
  calculatePj,
  calculateBolsista,
  calculateBreakeven,
} from './tax-calculator';
import { TAX_CONSTANTS } from '../constants/tax-tables';
import { DEFAULT_INPUT } from './url-state';

describe('Motor de Cálculo Fiscal - INSS & IRPF', () => {
  it('deve calcular o INSS corretamente na 1ª faixa (salário mínimo)', () => {
    const { inssTotal, effectiveRate } = calculateInssClt(1518.00);
    // 1518 * 0.075 = 113.85
    expect(inssTotal).toBeCloseTo(113.85, 2);
    expect(effectiveRate).toBeCloseTo(0.075, 3);
  });

  it('deve respeitar o teto do INSS para salários acima do teto', () => {
    const inssAtCeiling = calculateInssClt(TAX_CONSTANTS.INSS_CEILING);
    const inssAboveCeiling = calculateInssClt(25000);
    expect(inssAboveCeiling.inssTotal).toBeCloseTo(inssAtCeiling.inssTotal, 2);
    expect(inssAboveCeiling.inssTotal).toBeGreaterThan(900);
  });

  it('deve aplicar isenção de IRPF para valores abaixo do limite de isenção', () => {
    const { irpfTotal } = calculateIrpf(2200, 165, 0);
    expect(irpfTotal).toBe(0);
  });

  it('deve usar o desconto simplificado do IRPF quando for mais vantajoso que deduções legais', () => {
    // Salário R$ 3.000: INSS ~ R$ 253, sem dependentes.
    // Deduções legais: R$ 253 < Desconto Simplificado R$ 564,80
    const inssCalc = calculateInssClt(3000);
    const irpfCalc = calculateIrpf(3000, inssCalc.inssTotal, 0);
    expect(irpfCalc.usedSimplified).toBe(true);
  });
});

describe('Módulo CLT', () => {
  it('deve calcular corretamente o pacote anual com 13º, férias + 1/3 e FGTS', () => {
    const result = calculateClt({
      ...DEFAULT_INPUT,
      baseSalary: 7000,
    });

    expect(result.grossSalary).toBe(7000);
    expect(result.inssDiscount).toBeGreaterThan(0);
    expect(result.irpfDiscount).toBeGreaterThan(0);
    expect(result.netSalaryMonthly).toBeLessThan(7000);

    // 13º mensalizado deve ser positivo
    expect(result.thirteenthSalaryMonthlyEquivalent).toBeGreaterThan(0);
    // Férias 1/3 mensalizado deve ser positivo
    expect(result.vacationBonusMonthlyEquivalent).toBeGreaterThan(0);
    // FGTS 8% mensalizado
    expect(result.fgtsMonthly).toBeGreaterThan(500);

    // O rendimento líquido real anual deve ser superior a 12x o holerite líquido simples
    expect(result.realLiquidAnnualTotal).toBeGreaterThan(result.netSalaryMonthly * 12);
  });
});

describe('Módulo PJ', () => {
  it('deve calcular MEI com DAS fixo e sem pró-labore obrigatório', () => {
    const result = calculatePj({
      ...DEFAULT_INPUT,
      baseSalary: 5000,
      pjSubtype: 'mei',
      pjAccountingMonthlyCost: 0,
      pjOtherExpensesMonthly: 100,
    });

    expect(result.dasTax).toBe(TAX_CONSTANTS.MEI_DAS_FIXED);
    expect(result.proLaboreInss).toBe(0);
  });

  it('deve deduzir provisões de férias e 13º para igualar à CLT', () => {
    const withProvision = calculatePj({
      ...DEFAULT_INPUT,
      baseSalary: 10000,
      pjProvisaoFerias13: true,
    });

    const withoutProvision = calculatePj({
      ...DEFAULT_INPUT,
      baseSalary: 10000,
      pjProvisaoFerias13: false,
    });

    expect(withProvision.realLiquidMonthlyTotal).toBeLessThan(withoutProvision.realLiquidMonthlyTotal);
    expect(withProvision.provision13thMonthly).toBeGreaterThan(0);
    expect(withProvision.provisionVacationMonthly).toBeGreaterThan(0);
  });
});

describe('Módulo Bolsista', () => {
  it('deve manter IRPF em R$ 0,00 por isenção legal', () => {
    const result = calculateBolsista({
      ...DEFAULT_INPUT,
      baseSalary: 4000,
    });

    expect(result.irpfDiscount).toBe(0);
  });

  it('deve descontar previdência facultativa quando toggle ativado', () => {
    const withInss = calculateBolsista({
      ...DEFAULT_INPUT,
      baseSalary: 4000,
      bolsaEquipararSeguranca: true,
      bolsaInssFacultativo: 'simplificado_11',
    });

    expect(withInss.inssFacultativoCost).toBeCloseTo(TAX_CONSTANTS.SALARIO_MINIMO * 0.11, 2);
    expect(withInss.realLiquidMonthlyTotal).toBeLessThan(4000);
  });
});

describe('Ponto de Equilíbrio (Breakeven)', () => {
  it('deve encontrar remunerações que entregam o mesmo rendimento anual real', () => {
    const breakeven = calculateBreakeven({
      ...DEFAULT_INPUT,
      baseSalary: 7000,
      referenceRegime: 'clt',
    });

    expect(breakeven.cltTargetGross).toBe(7000);
    // Para igualar um CLT de R$ 7.000 (com 13º, férias e FGTS), a PJ precisa cobrar significativamente mais
    expect(breakeven.pjTargetGross).toBeGreaterThan(7000);

    // O rendimento gerado pelo breakeven na PJ deve aproximar o rendimento da CLT
    const cltRes = calculateClt({ ...DEFAULT_INPUT, baseSalary: 7000 });
    const pjAtBreakeven = calculatePj({ ...DEFAULT_INPUT, baseSalary: breakeven.pjTargetGross });

    expect(pjAtBreakeven.realLiquidAnnualTotal).toBeCloseTo(cltRes.realLiquidAnnualTotal, -2);
  });
});
