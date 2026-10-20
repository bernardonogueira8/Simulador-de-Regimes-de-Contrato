import React, { useState } from 'react';
import type {
  BolsistaCalculationResult,
  CltCalculationResult,
  PjCalculationResult,
} from '../types';
import { formatCurrency } from '../utils/formatters';
import { Table, Calendar, Check, X, Shield } from 'lucide-react';

interface DetailedTableProps {
  cltResult: CltCalculationResult;
  pjResult: PjCalculationResult;
  bolsaResult: BolsistaCalculationResult;
}

export const DetailedTable: React.FC<DetailedTableProps> = ({
  cltResult,
  pjResult,
  bolsaResult,
}) => {
  const [viewMode, setViewMode] = useState<'monthly' | 'annual'>('monthly');
  const multiplier = viewMode === 'monthly' ? 1 : 12;

  return (
    <section className="mb-12 rounded-3xl bg-white border border-[#E5E5EA] p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#F5F5F7] text-[#1D1D1F] flex items-center justify-center border border-[#E5E5EA]">
            <Table className="w-5 h-5 text-[#0071E3]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#1D1D1F] m-0">
              Matriz Comparativa Detalhada
            </h3>
            <p className="text-xs text-[#86868B] m-0">
              Discriminação item a item das entradas, saídas e direitos patrimoniais.
            </p>
          </div>
        </div>

        {/* Apple Segmented Control: Monthly vs Annual */}
        <div className="inline-flex p-1 rounded-full bg-[#E5E5EA]/70 self-start sm:self-auto">
          <button
            onClick={() => setViewMode('monthly')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              viewMode === 'monthly'
                ? 'bg-white text-[#1D1D1F] shadow-xs'
                : 'text-[#86868B] hover:text-[#1D1D1F]'
            }`}
          >
            Visão Mensalizada
          </button>
          <button
            onClick={() => setViewMode('annual')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === 'annual'
                ? 'bg-white text-[#1D1D1F] shadow-xs'
                : 'text-[#86868B] hover:text-[#1D1D1F]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-[#0071E3]" />
            <span>Visão Anual (12m)</span>
          </button>
        </div>
      </div>

      {/* Responsive Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-[#1D1D1F] border-collapse">
          <thead>
            <tr className="border-b border-[#E5E5EA] text-[#86868B] font-semibold uppercase tracking-wider text-[11px]">
              <th className="py-3.5 px-4 min-w-[220px]">Item de Comparação</th>
              <th className="py-3.5 px-4 text-[#0071E3] font-bold min-w-[160px]">CLT</th>
              <th className="py-3.5 px-4 text-[#34C759] font-bold min-w-[160px]">PJ (Simples/MEI)</th>
              <th className="py-3.5 px-4 text-[#FF9500] font-bold min-w-[160px]">Bolsista</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E5EA] font-mono">
            {/* Bruto */}
            <tr className="hover:bg-[#F5F5F7]/80">
              <td className="py-3.5 px-4 font-sans font-semibold text-[#1D1D1F]">
                Remuneração / Faturamento Bruto
              </td>
              <td className="py-3.5 px-4 text-[#1D1D1F] font-bold">
                {formatCurrency(cltResult.grossSalary * multiplier)}
              </td>
              <td className="py-3.5 px-4 text-[#1D1D1F] font-bold">
                {formatCurrency(pjResult.grossRevenue * multiplier)}
              </td>
              <td className="py-3.5 px-4 text-[#1D1D1F] font-bold">
                {formatCurrency(bolsaResult.grossBolsa * multiplier)}
              </td>
            </tr>

            {/* INSS */}
            <tr className="hover:bg-[#F5F5F7]/80">
              <td className="py-3.5 px-4 font-sans text-[#86868B]">
                Previdência Social (INSS Oficial)
              </td>
              <td className="py-3.5 px-4 text-[#FF3B30] font-semibold">
                -{formatCurrency(cltResult.inssDiscount * multiplier)}
              </td>
              <td className="py-3.5 px-4 text-[#FF3B30] font-semibold">
                -{formatCurrency(pjResult.proLaboreInss * multiplier)}
              </td>
              <td className="py-3.5 px-4 text-[#FF3B30]">
                {bolsaResult.inssFacultativoCost > 0
                  ? `-${formatCurrency(bolsaResult.inssFacultativoCost * multiplier)} (Facultativo)`
                  : 'R$ 0,00'}
              </td>
            </tr>

            {/* IRPF */}
            <tr className="hover:bg-[#F5F5F7]/80">
              <td className="py-3.5 px-4 font-sans text-[#86868B]">
                Imposto de Renda (IRPF / DAS)
              </td>
              <td className="py-3.5 px-4 text-[#FF3B30] font-semibold">
                -{formatCurrency(cltResult.irpfDiscount * multiplier)}
              </td>
              <td className="py-3.5 px-4 text-[#FF3B30] font-semibold">
                -{formatCurrency((pjResult.dasTax + pjResult.proLaboreIrpf) * multiplier)}
              </td>
              <td className="py-3.5 px-4 text-[#34C759] font-sans font-medium">
                Isento por Lei (R$ 0,00)
              </td>
            </tr>

            {/* Custos Operacionais */}
            <tr className="hover:bg-[#F5F5F7]/80">
              <td className="py-3.5 px-4 font-sans text-[#86868B]">
                Custos Operacionais & Contabilidade
              </td>
              <td className="py-3.5 px-4 text-[#86868B] font-sans">Não se aplica</td>
              <td className="py-3.5 px-4 text-[#FF3B30] font-semibold">
                -{formatCurrency((pjResult.accountingCost + pjResult.otherExpenses) * multiplier)}
              </td>
              <td className="py-3.5 px-4 text-[#86868B] font-sans">Não se aplica</td>
            </tr>

            {/* Líquido Nominal do Mês */}
            <tr className="bg-[#F5F5F7] font-semibold">
              <td className="py-3.5 px-4 font-sans text-[#1D1D1F]">
                = Líquido em Conta no Mês (Holerite / Caixa)
              </td>
              <td className="py-3.5 px-4 text-[#1D1D1F] font-bold">
                {formatCurrency(cltResult.netSalaryMonthly * multiplier)}
              </td>
              <td className="py-3.5 px-4 text-[#1D1D1F] font-bold">
                {formatCurrency(pjResult.netCashFlowCompany * multiplier)}
              </td>
              <td className="py-3.5 px-4 text-[#1D1D1F] font-bold">
                {formatCurrency((bolsaResult.grossBolsa - bolsaResult.inssFacultativoCost) * multiplier)}
              </td>
            </tr>

            {/* Benefícios */}
            <tr className="hover:bg-[#F5F5F7]/80">
              <td className="py-3.5 px-4 font-sans text-[#86868B]">
                Benefícios Corporativos (VR/VA + Saúde)
              </td>
              <td className="py-3.5 px-4 text-[#34C759] font-semibold">
                +{formatCurrency(cltResult.benefitsMonthlyTotal * multiplier)}
              </td>
              <td className="py-3.5 px-4 text-[#86868B] font-sans">Sem benefícios</td>
              <td className="py-3.5 px-4 text-[#86868B] font-sans">Sem benefícios</td>
            </tr>

            {/* 13º Salário */}
            <tr className="hover:bg-[#F5F5F7]/80">
              <td className="py-3.5 px-4 font-sans text-[#86868B]">
                13º Salário Líquido (Mensalizado)
              </td>
              <td className="py-3.5 px-4 text-[#0071E3] font-semibold">
                +{formatCurrency(cltResult.thirteenthSalaryMonthlyEquivalent * multiplier)}
              </td>
              <td className="py-3.5 px-4 text-[#FF9500]">
                {pjResult.provision13thMonthly > 0
                  ? `-${formatCurrency(pjResult.provision13thMonthly * multiplier)} (Provisão)`
                  : 'R$ 0,00'}
              </td>
              <td className="py-3.5 px-4 text-[#FF9500]">
                {bolsaResult.provisionVacationAnd13th > 0
                  ? `-${formatCurrency((bolsaResult.provisionVacationAnd13th * 0.43) * multiplier)} (Reserva)`
                  : 'R$ 0,00'}
              </td>
            </tr>

            {/* 1/3 de Férias */}
            <tr className="hover:bg-[#F5F5F7]/80">
              <td className="py-3.5 px-4 font-sans text-[#86868B]">
                Férias + 1/3 Constitucional (Mensalizado)
              </td>
              <td className="py-3.5 px-4 text-[#0071E3] font-semibold">
                +{formatCurrency(cltResult.vacationBonusMonthlyEquivalent * multiplier)}
              </td>
              <td className="py-3.5 px-4 text-[#FF9500]">
                {pjResult.provisionVacationMonthly > 0
                  ? `-${formatCurrency(pjResult.provisionVacationMonthly * multiplier)} (Provisão)`
                  : 'R$ 0,00'}
              </td>
              <td className="py-3.5 px-4 text-[#FF9500]">
                {bolsaResult.provisionVacationAnd13th > 0
                  ? `-${formatCurrency((bolsaResult.provisionVacationAnd13th * 0.57) * multiplier)} (Reserva)`
                  : 'R$ 0,00'}
              </td>
            </tr>

            {/* FGTS */}
            <tr className="hover:bg-[#F5F5F7]/80">
              <td className="py-3.5 px-4 font-sans text-[#86868B]">
                FGTS (8% pago pela empresa)
              </td>
              <td className="py-3.5 px-4 text-[#34C759] font-semibold">
                +{formatCurrency(cltResult.fgtsMonthly * multiplier)}
              </td>
              <td className="py-3.5 px-4 text-[#86868B] font-sans">
                {pjResult.provisionFgtsMonthly > 0
                  ? `-${formatCurrency(pjResult.provisionFgtsMonthly * multiplier)} (Reserva)`
                  : 'Sem FGTS'}
              </td>
              <td className="py-3.5 px-4 text-[#86868B] font-sans">Sem FGTS</td>
            </tr>

            {/* Linha Final: Líquido Real */}
            <tr className="bg-[#EAF7ED] font-bold text-sm">
              <td className="py-4 px-4 font-sans text-[#1D1D1F]">
                Rendimento Líquido Real Equalizado
              </td>
              <td className="py-4 px-4 text-[#28CD41] font-mono text-base">
                {formatCurrency(cltResult.realLiquidMonthlyTotal * multiplier)}
              </td>
              <td className="py-4 px-4 text-[#28CD41] font-mono text-base">
                {formatCurrency(pjResult.realLiquidMonthlyTotal * multiplier)}
              </td>
              <td className="py-4 px-4 text-[#28CD41] font-mono text-base">
                {formatCurrency(bolsaResult.realLiquidMonthlyTotal * multiplier)}
              </td>
            </tr>

            {/* ================= DIREITOS E SEGURANÇA TRABALHISTA (CORRIGIDO) ================= */}
            {/* Seguro Desemprego */}
            <tr className="hover:bg-[#F5F5F7]/80 font-sans text-xs">
              <td className="py-3.5 px-4 font-medium text-[#1D1D1F]">
                <div>Seguro-Desemprego</div>
                <div className="text-[10px] text-[#86868B] font-normal">
                  Benefício do governo (FAT) em caso de demissão involuntária
                </div>
              </td>
              <td className="py-3.5 px-4">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EAF7ED] text-[#28CD41] font-semibold text-[11px]">
                  <Check className="w-3.5 h-3.5" />
                  <span>3 a 5 parcelas</span>
                </div>
              </td>
              <td className="py-3.5 px-4">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F5F5F7] text-[#86868B] text-[11px]">
                  <X className="w-3.5 h-3.5 text-[#FF3B30]" />
                  <span>Não possui direito</span>
                </div>
              </td>
              <td className="py-3.5 px-4">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F5F5F7] text-[#86868B] text-[11px]">
                  <X className="w-3.5 h-3.5 text-[#FF3B30]" />
                  <span>Não possui direito</span>
                </div>
              </td>
            </tr>

            {/* Aviso Prévio e Multa Rescisória de 40% do FGTS */}
            <tr className="hover:bg-[#F5F5F7]/80 font-sans text-xs">
              <td className="py-3.5 px-4 font-medium text-[#1D1D1F]">
                <div>Aviso Prévio & Multa Rescisória (40% FGTS)</div>
                <div className="text-[10px] text-[#86868B] font-normal">
                  Compensação financeira e carência na rescisão imotivada
                </div>
              </td>
              <td className="py-3.5 px-4">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EAF7ED] text-[#28CD41] font-semibold text-[11px]">
                  <Shield className="w-3.5 h-3.5" />
                  <span>30-90 dias + 40% FGTS</span>
                </div>
              </td>
              <td className="py-3.5 px-4">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F5F5F7] text-[#86868B] text-[11px]">
                  <X className="w-3.5 h-3.5 text-[#FF3B30]" />
                  <span>Apenas cláusula contratual</span>
                </div>
              </td>
              <td className="py-3.5 px-4">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F5F5F7] text-[#86868B] text-[11px]">
                  <X className="w-3.5 h-3.5 text-[#FF3B30]" />
                  <span>Sem carência ou rescisão</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
};
