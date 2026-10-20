import React, { useState } from 'react';
import type {
  BolsistaCalculationResult,
  CltCalculationResult,
  PjCalculationResult,
  RegimeType,
} from '../types';
import { formatCurrency, formatPercent } from '../utils/formatters';
import {
  Briefcase,
  Building2,
  GraduationCap,
  Trophy,
  ChevronDown,
  ChevronUp,
  Info,
  ShieldCheck,
  Percent,
  Receipt,
  HelpCircle,
} from 'lucide-react';
import { WaterfallChart } from './WaterfallChart';

interface ComparisonCardsProps {
  cltResult: CltCalculationResult;
  pjResult: PjCalculationResult;
  bolsaResult: BolsistaCalculationResult;
  referenceRegime: RegimeType;
}

export const ComparisonCards: React.FC<ComparisonCardsProps> = ({
  cltResult,
  pjResult,
  bolsaResult,
  referenceRegime,
}) => {
  const [expandedClt, setExpandedClt] = useState(false);
  const [expandedPj, setExpandedPj] = useState(false);
  const [expandedBolsa, setExpandedBolsa] = useState(false);

  // Determinar vencedor em Rendimento Líquido Real Anual
  const results = [
    { type: 'clt' as RegimeType, annual: cltResult.realLiquidAnnualTotal, monthly: cltResult.realLiquidMonthlyTotal },
    { type: 'pj' as RegimeType, annual: pjResult.realLiquidAnnualTotal, monthly: pjResult.realLiquidMonthlyTotal },
    { type: 'bolsista' as RegimeType, annual: bolsaResult.realLiquidAnnualTotal, monthly: bolsaResult.realLiquidMonthlyTotal },
  ];

  const sortedResults = [...results].sort((a, b) => b.annual - a.annual);
  const winner = sortedResults[0];
  const secondPlace = sortedResults[1];
  const monthlyDifference = winner.monthly - secondPlace.monthly;

  return (
    <section className="mb-12">
      {/* Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
        
        {/* ===================== CLT CARD ===================== */}
        <div
          className={`relative rounded-3xl p-6 sm:p-8 flex flex-col transition-all duration-300 bg-white ${
            winner.type === 'clt'
              ? 'border-2 border-[#34C759] shadow-[0_8px_30px_rgba(52,199,89,0.12)]'
              : 'border border-[#E5E5EA] shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:border-[#D2D2D7]'
          }`}
        >
          {winner.type === 'clt' && (
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 bg-[#34C759] text-white text-[11px] font-bold uppercase tracking-wider rounded-full shadow-md flex items-center gap-1.5 select-none">
              <Trophy className="w-3.5 h-3.5 fill-white" />
              <span>Maior Rendimento Líquido Real</span>
            </div>
          )}

          {/* Card Header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#E8F2FE] border border-[#0071E3]/20 flex items-center justify-center text-[#0071E3]">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-[#1D1D1F] m-0">CLT</h3>
                  {referenceRegime === 'clt' && (
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#E8F2FE] text-[#0071E3] border border-[#0071E3]/20">
                      Sua Base
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#86868B] m-0">Carteira Assinada (CTPS)</p>
              </div>
            </div>
          </div>

          {/* Real Liquid Highlight Tile */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#F5F5F7] border border-[#E5E5EA] mb-5">
            <div className="flex items-center justify-between text-xs text-[#86868B] mb-1">
              <span className="font-medium flex items-center gap-1">
                Líquido Real no Bolso
                <span title="Salário líquido do holerite somado a VR/VA, saúde, FGTS e parcelas mensais de 13º e 1/3 de férias.">
                  <Info className="w-3.5 h-3.5 text-[#86868B] inline cursor-pointer" />
                </span>
              </span>
              <span className="text-[11px] text-[#86868B]">mensalizado</span>
            </div>
            <div className="text-3xl sm:text-4xl font-bold text-[#1D1D1F] tracking-tight font-mono">
              {formatCurrency(cltResult.realLiquidMonthlyTotal)}
            </div>
            <div className="text-xs text-[#86868B] mt-1.5 flex justify-between">
              <span>Total real no ano:</span>
              <strong className="text-[#1D1D1F] font-semibold font-mono">
                {formatCurrency(cltResult.realLiquidAnnualTotal)}
              </strong>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="space-y-2.5 text-xs text-[#1D1D1F] mb-6">
            <div className="flex justify-between items-center py-1.5 border-b border-[#E5E5EA]">
              <span className="text-[#86868B] flex items-center gap-1.5">
                <Receipt className="w-3.5 h-3.5 text-[#86868B]" />
                Cai na conta todo mês (Holerite):
              </span>
              <span className="font-semibold font-mono text-[#1D1D1F]">
                {formatCurrency(cltResult.netSalaryMonthly)}
              </span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-[#E5E5EA]">
              <span className="text-[#86868B] flex items-center gap-1.5">
                <Percent className="w-3.5 h-3.5 text-[#FF3B30]" />
                Descontos Tributários (INSS + IR):
              </span>
              <span className="font-semibold text-[#FF3B30] font-mono">
                -{formatCurrency(cltResult.inssDiscount + cltResult.irpfDiscount)}
              </span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-[#E5E5EA]">
              <span className="text-[#86868B] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#0071E3]" />
                13º + 1/3 Férias (Mensalizados):
              </span>
              <span className="font-semibold text-[#0071E3] font-mono">
                +{formatCurrency(cltResult.thirteenthSalaryMonthlyEquivalent + cltResult.vacationBonusMonthlyEquivalent)}
              </span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-[#E5E5EA]">
              <span className="text-[#86868B]">FGTS (8% pago pela empresa):</span>
              <span className="font-semibold text-[#34C759] font-mono">
                +{formatCurrency(cltResult.fgtsMonthly)}/mês
              </span>
            </div>

            <div className="flex justify-between items-center py-1.5">
              <span className="text-[#86868B]">Benefícios Líquidos (VR + Saúde):</span>
              <span className="font-semibold text-[#34C759] font-mono">
                +{formatCurrency(cltResult.benefitsMonthlyTotal)}/mês
              </span>
            </div>
          </div>

          {/* Cascade Toggle Button */}
          <button
            onClick={() => setExpandedClt(!expandedClt)}
            className="w-full mt-auto py-2.5 px-3 rounded-full bg-[#F5F5F7] hover:bg-[#E5E5EA] text-xs font-semibold text-[#1D1D1F] flex items-center justify-center gap-1.5 transition-all border border-[#E5E5EA]"
          >
            <span>{expandedClt ? 'Ocultar Cascata' : 'Ver Cascata Financeira'}</span>
            {expandedClt ? <ChevronUp className="w-3.5 h-3.5 text-[#86868B]" /> : <ChevronDown className="w-3.5 h-3.5 text-[#86868B]" />}
          </button>

          {expandedClt && (
            <WaterfallChart steps={cltResult.waterfallSteps} title="Fluxo em Cascata CLT" />
          )}
        </div>

        {/* ===================== PJ CARD ===================== */}
        <div
          className={`relative rounded-3xl p-6 sm:p-8 flex flex-col transition-all duration-300 bg-white ${
            winner.type === 'pj'
              ? 'border-2 border-[#34C759] shadow-[0_8px_30px_rgba(52,199,89,0.12)]'
              : 'border border-[#E5E5EA] shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:border-[#D2D2D7]'
          }`}
        >
          {winner.type === 'pj' && (
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 bg-[#34C759] text-white text-[11px] font-bold uppercase tracking-wider rounded-full shadow-md flex items-center gap-1.5 select-none">
              <Trophy className="w-3.5 h-3.5 fill-white" />
              <span>Maior Rendimento Líquido Real</span>
            </div>
          )}

          {/* Card Header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#EAF7ED] border border-[#34C759]/20 flex items-center justify-center text-[#34C759]">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-[#1D1D1F] m-0">PJ</h3>
                  {referenceRegime === 'pj' && (
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#EAF7ED] text-[#34C759] border border-[#34C759]/20">
                      Sua Base
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#86868B] m-0">
                  {pjResult.subtype === 'mei'
                    ? 'MEI (DAS Fixo)'
                    : pjResult.subtype === 'simples_anexo_iii'
                    ? 'Simples Nacional (Anexo III - Fator R)'
                    : 'Simples Nacional (Anexo V)'}
                </p>
              </div>
            </div>
          </div>

          {/* Real Liquid Highlight Tile */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#F5F5F7] border border-[#E5E5EA] mb-5">
            <div className="flex items-center justify-between text-xs text-[#86868B] mb-1">
              <span className="font-medium flex items-center gap-1">
                Líquido Seguro para Saque
                <span title="Valor que você pode gastar no mês após pagar tributos, contabilidade e GUARDAR sua própria provisão de 13º e férias.">
                  <Info className="w-3.5 h-3.5 text-[#86868B] inline cursor-pointer" />
                </span>
              </span>
              <span className="text-[11px] text-[#86868B]">após provisões</span>
            </div>
            <div className="text-3xl sm:text-4xl font-bold text-[#1D1D1F] tracking-tight font-mono">
              {formatCurrency(pjResult.realLiquidMonthlyTotal)}
            </div>
            <div className="text-xs text-[#86868B] mt-1.5 flex justify-between">
              <span>Total real no ano:</span>
              <strong className="text-[#1D1D1F] font-semibold font-mono">
                {formatCurrency(pjResult.realLiquidAnnualTotal)}
              </strong>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="space-y-2.5 text-xs text-[#1D1D1F] mb-6">
            <div className="flex justify-between items-center py-1.5 border-b border-[#E5E5EA]">
              <span className="text-[#86868B] flex items-center gap-1.5">
                <Receipt className="w-3.5 h-3.5 text-[#86868B]" />
                Caixa da Empresa (antes de guardar):
              </span>
              <span className="font-semibold font-mono text-[#1D1D1F]">
                {formatCurrency(pjResult.netCashFlowCompany)}
              </span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-[#E5E5EA]">
              <span className="text-[#86868B] flex items-center gap-1.5">
                <Percent className="w-3.5 h-3.5 text-[#FF3B30]" />
                Impostos Totais (DAS + INSS/IR):
              </span>
              <span className="font-semibold text-[#FF3B30] font-mono">
                -{formatCurrency(pjResult.dasTax + pjResult.proLaboreInss + pjResult.proLaboreIrpf)}
              </span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-[#E5E5EA]">
              <span className="text-[#86868B]">Custos Fixos (Contador + Operação):</span>
              <span className="font-semibold text-[#FF3B30] font-mono">
                -{formatCurrency(pjResult.accountingCost + pjResult.otherExpenses)}
              </span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-[#E5E5EA]">
              <span className="text-[#86868B] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#FF9500]" />
                Provisão Própria (13º + Férias):
              </span>
              <span className="font-semibold text-[#FF9500] font-mono">
                -{formatCurrency(pjResult.provision13thMonthly + pjResult.provisionVacationMonthly)}
              </span>
            </div>

            <div className="flex justify-between items-center py-1.5">
              <span className="text-[#86868B]">Alíquota Efetiva de Impostos:</span>
              <span className="font-semibold text-[#1D1D1F] font-mono">
                {pjResult.grossRevenue > 0
                  ? formatPercent((pjResult.dasTax + pjResult.proLaboreInss + pjResult.proLaboreIrpf) / pjResult.grossRevenue)
                  : '0,0%'}
              </span>
            </div>
          </div>

          {/* Cascade Toggle Button */}
          <button
            onClick={() => setExpandedPj(!expandedPj)}
            className="w-full mt-auto py-2.5 px-3 rounded-full bg-[#F5F5F7] hover:bg-[#E5E5EA] text-xs font-semibold text-[#1D1D1F] flex items-center justify-center gap-1.5 transition-all border border-[#E5E5EA]"
          >
            <span>{expandedPj ? 'Ocultar Cascata' : 'Ver Cascata Financeira'}</span>
            {expandedPj ? <ChevronUp className="w-3.5 h-3.5 text-[#86868B]" /> : <ChevronDown className="w-3.5 h-3.5 text-[#86868B]" />}
          </button>

          {expandedPj && (
            <WaterfallChart steps={pjResult.waterfallSteps} title="Fluxo em Cascata PJ" />
          )}
        </div>

        {/* ===================== BOLSISTA CARD ===================== */}
        <div
          className={`relative rounded-3xl p-6 sm:p-8 flex flex-col transition-all duration-300 bg-white ${
            winner.type === 'bolsista'
              ? 'border-2 border-[#34C759] shadow-[0_8px_30px_rgba(52,199,89,0.12)]'
              : 'border border-[#E5E5EA] shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:border-[#D2D2D7]'
          }`}
        >
          {winner.type === 'bolsista' && (
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 bg-[#34C759] text-white text-[11px] font-bold uppercase tracking-wider rounded-full shadow-md flex items-center gap-1.5 select-none">
              <Trophy className="w-3.5 h-3.5 fill-white" />
              <span>Maior Rendimento Líquido Real</span>
            </div>
          )}

          {/* Card Header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF8E6] border border-[#FF9500]/20 flex items-center justify-center text-[#FF9500]">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-[#1D1D1F] m-0">Bolsista</h3>
                  {referenceRegime === 'bolsista' && (
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#FFF8E6] text-[#FF9500] border border-[#FF9500]/20">
                      Sua Base
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#86868B] m-0">Pesquisa & Extensão (CAPES/CNPq)</p>
              </div>
            </div>
          </div>

          {/* Real Liquid Highlight Tile */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#F5F5F7] border border-[#E5E5EA] mb-5">
            <div className="flex items-center justify-between text-xs text-[#86868B] mb-1">
              <span className="font-medium flex items-center gap-1">
                Líquido Real no Bolso
                <span title="Valor livre disponível após recolher INSS facultativo voluntário e reservar provisão para ausência de 13º e férias ou transição de bolsa.">
                  <Info className="w-3.5 h-3.5 text-[#86868B] inline cursor-pointer" />
                </span>
              </span>
              <span className="text-[11px] text-[#86868B]">equalizado</span>
            </div>
            <div className="text-3xl sm:text-4xl font-bold text-[#1D1D1F] tracking-tight font-mono">
              {formatCurrency(bolsaResult.realLiquidMonthlyTotal)}
            </div>
            <div className="text-xs text-[#86868B] mt-1.5 flex justify-between">
              <span>Total real no ano:</span>
              <strong className="text-[#1D1D1F] font-semibold font-mono">
                {formatCurrency(bolsaResult.realLiquidAnnualTotal)}
              </strong>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="space-y-2.5 text-xs text-[#1D1D1F] mb-6">
            <div className="flex justify-between items-center py-1.5 border-b border-[#E5E5EA]">
              <span className="text-[#86868B] flex items-center gap-1.5">
                <Receipt className="w-3.5 h-3.5 text-[#86868B]" />
                Valor Bruto Depositado:
              </span>
              <span className="font-semibold font-mono text-[#1D1D1F]">
                {formatCurrency(bolsaResult.grossBolsa)}
              </span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-[#E5E5EA]">
              <span className="text-[#86868B] flex items-center gap-1.5">
                <Percent className="w-3.5 h-3.5 text-[#34C759]" />
                Tributação IRPF:
              </span>
              <span className="font-semibold text-[#34C759] font-mono">
                Isento por Lei (R$ 0,00)
              </span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-[#E5E5EA]">
              <span className="text-[#86868B] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#FF3B30]" />
                Previdência (INSS Facultativo):
              </span>
              <span className="font-semibold text-[#FF3B30] font-mono">
                {bolsaResult.inssFacultativoCost > 0
                  ? `-${formatCurrency(bolsaResult.inssFacultativoCost)}`
                  : 'Desativado'}
              </span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-[#E5E5EA]">
              <span className="text-[#86868B]">Provisão Transição / 13º / Férias:</span>
              <span className="font-semibold text-[#FF9500] font-mono">
                {bolsaResult.provisionVacationAnd13th > 0
                  ? `-${formatCurrency(bolsaResult.provisionVacationAnd13th)}`
                  : 'Desativado'}
              </span>
            </div>

            <div className="flex justify-between items-center py-1.5">
              <span className="text-[#86868B]">Segurança Trabalhista CLT:</span>
              <span className="font-semibold text-[#86868B]">
                Não possui FGTS ou Seguro
              </span>
            </div>
          </div>

          {/* Cascade Toggle Button */}
          <button
            onClick={() => setExpandedBolsa(!expandedBolsa)}
            className="w-full mt-auto py-2.5 px-3 rounded-full bg-[#F5F5F7] hover:bg-[#E5E5EA] text-xs font-semibold text-[#1D1D1F] flex items-center justify-center gap-1.5 transition-all border border-[#E5E5EA]"
          >
            <span>{expandedBolsa ? 'Ocultar Cascata' : 'Ver Cascata Financeira'}</span>
            {expandedBolsa ? <ChevronUp className="w-3.5 h-3.5 text-[#86868B]" /> : <ChevronDown className="w-3.5 h-3.5 text-[#86868B]" />}
          </button>

          {expandedBolsa && (
            <WaterfallChart steps={bolsaResult.waterfallSteps} title="Fluxo em Cascata Bolsista" />
          )}
        </div>

      </div>

      {/* Winner Summary Banner in Apple Surface Style */}
      <div className="mt-6 p-5 rounded-2xl bg-white border border-[#E5E5EA] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-full bg-[#EAF7ED] text-[#34C759] flex items-center justify-center shrink-0">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#1D1D1F] m-0">
              Regime mais vantajoso com seus parâmetros: <span className="text-[#34C759] uppercase">{winner.type}</span>
            </h4>
            <p className="text-xs text-[#86868B] m-0">
              O regime <strong className="text-[#1D1D1F] uppercase">{winner.type}</strong> entrega{' '}
              <strong className="text-[#34C759] font-mono">{formatCurrency(monthlyDifference)}/mês</strong> a mais no bolso do que a segunda opção ({secondPlace.type.toUpperCase()}).
            </p>
          </div>
        </div>

        <div className="text-xs text-[#86868B] font-medium shrink-0 flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-[#86868B]" />
          <span>Quer ajustar descontos e custos? Use o botão "Ajustes Finos".</span>
        </div>
      </div>
    </section>
  );
};
