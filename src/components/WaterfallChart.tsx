import React from 'react';
import type { WaterfallStep } from '../types';
import { formatCurrency } from '../utils/formatters';
import { ArrowDownRight, ArrowUpRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface WaterfallChartProps {
  steps: WaterfallStep[];
  title?: string;
}

export const WaterfallChart: React.FC<WaterfallChartProps> = ({ steps, title }) => {
  const baseStep = steps.find((s) => s.type === 'base');
  const baseValue = baseStep ? baseStep.value : 1;

  return (
    <div className="space-y-2 mt-4 pt-4 border-t border-[#E5E5EA]">
      {title && (
        <h4 className="text-[11px] font-semibold text-[#86868B] uppercase tracking-wider mb-2">
          {title}
        </h4>
      )}

      <div className="space-y-1.5">
        {steps.map((step, idx) => {
          const isDeduction = step.value < 0;
          const isAddition = step.value > 0 && step.type === 'addition';
          const isFinal = step.type === 'final';
          const isBase = step.type === 'base';
          const isProvision = step.type === 'provision';

          // Percent relative to base
          const percentOfBase = baseValue > 0 ? (Math.abs(step.value) / baseValue) * 100 : 0;

          return (
            <div
              key={idx}
              className={`p-2.5 rounded-xl text-xs flex items-center justify-between transition-all ${
                isFinal
                  ? 'bg-[#E8F2FE] border border-[#0071E3]/30 text-[#0071E3] font-semibold shadow-xs'
                  : isBase
                  ? 'bg-[#F5F5F7] border border-[#E5E5EA] text-[#1D1D1F] font-semibold'
                  : 'bg-[#F5F5F7]/80 hover:bg-[#F5F5F7] text-[#1D1D1F]'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0 pr-2">
                {isBase && <span className="w-1.5 h-1.5 rounded-full bg-[#86868B]" />}
                {isDeduction && !isProvision && (
                  <ArrowDownRight className="w-3.5 h-3.5 text-[#FF3B30] shrink-0" />
                )}
                {isAddition && (
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#34C759] shrink-0" />
                )}
                {isProvision && (
                  <ShieldCheck className="w-3.5 h-3.5 text-[#FF9500] shrink-0" />
                )}
                {isFinal && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0071E3] shrink-0" />
                )}

                <div className="truncate">
                  <div className="truncate font-medium">{step.name}</div>
                  {step.description && (
                    <div className="text-[10px] text-[#86868B] truncate">
                      {step.description}
                    </div>
                  )}
                </div>
              </div>

              <div className="text-right shrink-0 font-mono">
                <span
                  className={
                    isFinal
                      ? 'text-[#0071E3] text-sm font-bold'
                      : isDeduction
                      ? 'text-[#FF3B30] font-semibold'
                      : isAddition
                      ? 'text-[#34C759] font-semibold'
                      : 'text-[#1D1D1F]'
                  }
                >
                  {isDeduction ? '-' : isAddition ? '+' : ''}
                  {formatCurrency(Math.abs(step.value))}
                </span>
                {!isFinal && !isBase && percentOfBase > 0 && (
                  <div className="text-[10px] text-[#86868B]">
                    {percentOfBase.toFixed(1)}% do bruto
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
