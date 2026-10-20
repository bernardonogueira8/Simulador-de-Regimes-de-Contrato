import React from 'react';
import type { BreakevenResult, RegimeType } from '../types';
import { formatCurrency } from '../utils/formatters';
import { ArrowRight, Sparkles, Scale, Info, Check } from 'lucide-react';

interface BreakevenCardProps {
  breakeven: BreakevenResult;
  baseSalary: number;
  onApplySalary: (salary: number, regime: RegimeType) => void;
}

export const BreakevenCard: React.FC<BreakevenCardProps> = ({
  breakeven,
  baseSalary,
  onApplySalary,
}) => {
  const currentRegime = breakeven.referenceRegime;

  const getMultiplier = (target: number, base: number) => {
    if (base <= 0) return '0%';
    const ratio = (target - base) / base;
    const sign = ratio >= 0 ? '+' : '';
    return `${sign}${(ratio * 100).toFixed(0)}%`;
  };

  return (
    <section className="mb-12 rounded-3xl bg-white border border-[#E5E5EA] p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.04)] relative overflow-hidden">
      <div className="relative z-10">
        
        {/* Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E8F2FE] text-[#0071E3] flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-[#1D1D1F] m-0 flex items-center gap-2">
                Ponto de Equilíbrio (Equivalência Real de Propostas)
              </h3>
              <p className="text-xs text-[#86868B] m-0">
                Quanto cada regime precisa pagar para entregar exatamente o mesmo rendimento anual real.
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#F5F5F7] text-xs text-[#1D1D1F] border border-[#E5E5EA] self-start sm:self-auto font-medium">
            <Sparkles className="w-3.5 h-3.5 text-[#FF9500]" />
            <span>Padrão Anual: <strong className="text-[#1D1D1F] font-mono font-semibold">{formatCurrency(breakeven.referenceRealLiquidAnnual)}</strong></span>
          </div>
        </div>

        {/* Highlighted equivalency question in Apple Info style */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#E8F2FE] border border-[#0071E3]/20 mb-6 text-xs sm:text-sm text-[#1D1D1F] flex items-start gap-3">
          <Info className="w-5 h-5 text-[#0071E3] shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            {currentRegime === 'clt' && (
              <p className="m-0">
                Se você recebe <strong>{formatCurrency(baseSalary)} na CLT</strong>, para mudar para <strong>PJ</strong> e manter rigorosamente o mesmo rendimento anual (com seu próprio 13º, férias e custos operacionais cobertos), você deve exigir uma proposta de pelo menos <strong className="text-[#0071E3] font-mono font-bold">{formatCurrency(breakeven.pjTargetGross)}/mês</strong> ({getMultiplier(breakeven.pjTargetGross, baseSalary)}).
              </p>
            )}
            {currentRegime === 'pj' && (
              <p className="m-0">
                Se o seu contrato <strong>PJ é de {formatCurrency(baseSalary)}/mês</strong>, uma proposta de <strong>CLT de {formatCurrency(breakeven.cltTargetGross)}/mês</strong> já entrega exatamente o mesmo patrimônio real anual, graças a 13º, férias + 1/3 e FGTS.
              </p>
            )}
            {currentRegime === 'bolsista' && (
              <p className="m-0">
                Sua bolsa de <strong>{formatCurrency(baseSalary)}/mês</strong> equivale a uma remuneração de mercado de <strong className="text-[#0071E3] font-mono font-bold">{formatCurrency(breakeven.cltTargetGross)} na CLT</strong> ou <strong className="text-[#0071E3] font-mono font-bold">{formatCurrency(breakeven.pjTargetGross)} na PJ</strong> (considerando recolhimento previdenciário e ausência de 13º).
              </p>
            )}
          </div>
        </div>

        {/* Breakeven Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* CLT Column */}
          <div
            className={`p-5 rounded-2xl border transition-all ${
              currentRegime === 'clt'
                ? 'bg-[#E8F2FE]/50 border-[#0071E3]/30 ring-2 ring-[#0071E3]/10'
                : 'bg-[#F5F5F7] border-[#E5E5EA] hover:border-[#D2D2D7]'
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0071E3]">
                Alvo CLT
              </span>
              {currentRegime === 'clt' ? (
                <span className="text-[10px] font-semibold text-[#34C759] bg-[#EAF7ED] px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-[#34C759]/20">
                  <Check className="w-3 h-3" /> Sua Base
                </span>
              ) : (
                <span className="text-[10px] font-mono font-bold text-[#86868B]">
                  {getMultiplier(breakeven.cltTargetGross, baseSalary)}
                </span>
              )}
            </div>

            <div className="text-2xl font-bold text-[#1D1D1F] font-mono mb-1">
              {formatCurrency(breakeven.cltTargetGross)}
            </div>
            <p className="text-[11px] text-[#86868B] mb-4">
              Salário bruto em carteira assinado
            </p>

            {currentRegime !== 'clt' && (
              <button
                onClick={() => onApplySalary(breakeven.cltTargetGross, 'clt')}
                className="w-full py-2 px-3 rounded-full text-xs font-semibold text-[#0071E3] hover:text-white bg-white hover:bg-[#0071E3] border border-[#0071E3] flex items-center justify-center gap-1.5 transition-all shadow-xs"
              >
                <span>Simular como CLT</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* PJ Column */}
          <div
            className={`p-5 rounded-2xl border transition-all ${
              currentRegime === 'pj'
                ? 'bg-[#EAF7ED]/50 border-[#34C759]/30 ring-2 ring-[#34C759]/10'
                : 'bg-[#F5F5F7] border-[#E5E5EA] hover:border-[#D2D2D7]'
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#34C759]">
                Alvo PJ (Faturamento)
              </span>
              {currentRegime === 'pj' ? (
                <span className="text-[10px] font-semibold text-[#34C759] bg-[#EAF7ED] px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-[#34C759]/20">
                  <Check className="w-3 h-3" /> Sua Base
                </span>
              ) : (
                <span className="text-[10px] font-mono font-bold text-[#34C759]">
                  {getMultiplier(breakeven.pjTargetGross, baseSalary)}
                </span>
              )}
            </div>

            <div className="text-2xl font-bold text-[#1D1D1F] font-mono mb-1">
              {formatCurrency(breakeven.pjTargetGross)}
            </div>
            <p className="text-[11px] text-[#86868B] mb-4">
              Valor da Nota Fiscal a emitir
            </p>

            {currentRegime !== 'pj' && (
              <button
                onClick={() => onApplySalary(breakeven.pjTargetGross, 'pj')}
                className="w-full py-2 px-3 rounded-full text-xs font-semibold text-[#34C759] hover:text-white bg-white hover:bg-[#34C759] border border-[#34C759] flex items-center justify-center gap-1.5 transition-all shadow-xs"
              >
                <span>Simular como PJ</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Bolsista Column */}
          <div
            className={`p-5 rounded-2xl border transition-all ${
              currentRegime === 'bolsista'
                ? 'bg-[#FFF8E6]/50 border-[#FF9500]/30 ring-2 ring-[#FF9500]/10'
                : 'bg-[#F5F5F7] border-[#E5E5EA] hover:border-[#D2D2D7]'
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF9500]">
                Alvo Bolsa
              </span>
              {currentRegime === 'bolsista' ? (
                <span className="text-[10px] font-semibold text-[#34C759] bg-[#EAF7ED] px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-[#34C759]/20">
                  <Check className="w-3 h-3" /> Sua Base
                </span>
              ) : (
                <span className="text-[10px] font-mono font-bold text-[#FF9500]">
                  {getMultiplier(breakeven.bolsaTargetGross, baseSalary)}
                </span>
              )}
            </div>

            <div className="text-2xl font-bold text-[#1D1D1F] font-mono mb-1">
              {formatCurrency(breakeven.bolsaTargetGross)}
            </div>
            <p className="text-[11px] text-[#86868B] mb-4">
              Bolsa de pesquisa (isenta de IR)
            </p>

            {currentRegime !== 'bolsista' && (
              <button
                onClick={() => onApplySalary(breakeven.bolsaTargetGross, 'bolsista')}
                className="w-full py-2 px-3 rounded-full text-xs font-semibold text-[#FF9500] hover:text-white bg-white hover:bg-[#FF9500] border border-[#FF9500] flex items-center justify-center gap-1.5 transition-all shadow-xs"
              >
                <span>Simular como Bolsista</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
