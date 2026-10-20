import React from 'react';
import type { RegimeType } from '../types';
import { Briefcase, Building2, GraduationCap, Sparkles } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

interface RemunerationInputProps {
  salary: number;
  referenceRegime: RegimeType;
  onSalaryChange: (newSalary: number) => void;
  onRegimeChange: (newRegime: RegimeType) => void;
}

const PRESETS = [
  { label: 'R$ 2.5k (Mestrado/Jr)', value: 2500 },
  { label: 'R$ 3.5k (Doutorado)', value: 3500 },
  { label: 'R$ 5k (Pleno)', value: 5000 },
  { label: 'R$ 8k (Sênior/Pós-Doc)', value: 8000 },
  { label: 'R$ 12k (Especialista)', value: 12000 },
  { label: 'R$ 18k (Tech Lead)', value: 18000 },
  { label: 'R$ 25k (Executivo)', value: 25000 },
];

export const RemunerationInput: React.FC<RemunerationInputProps> = ({
  salary,
  referenceRegime,
  onSalaryChange,
  onRegimeChange,
}) => {
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSalaryChange(Number(e.target.value));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    const num = Number(rawValue) / 100;
    onSalaryChange(isNaN(num) ? 0 : num);
  };

  return (
    <section className="relative overflow-hidden rounded-3xl bg-white border border-[#E5E5EA] p-6 sm:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.04)] mb-8 transition-all">
      <div className="max-w-3xl mx-auto text-center relative z-10">
        
        {/* Apple Pill Label */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F5F5F7] border border-[#E5E5EA] text-xs font-medium text-[#86868B] mb-4">
          <Sparkles className="w-3.5 h-3.5 text-[#0071E3]" />
          <span>Qual é a sua remuneração mensal base ou bolsa atual?</span>
        </div>

        {/* Big Monetary Input */}
        <div className="flex items-center justify-center my-3">
          <div className="relative group inline-flex items-baseline">
            <span className="text-3xl sm:text-5xl font-semibold text-[#86868B] mr-2 select-none tracking-tight">
              R$
            </span>
            <input
              type="text"
              value={salary.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              onChange={handleInputChange}
              className="text-4xl sm:text-6xl font-bold tracking-tight text-[#1D1D1F] bg-transparent border-b-2 border-[#E5E5EA] hover:border-[#0071E3] focus:border-[#0071E3] focus:outline-none transition-colors text-center w-64 sm:w-88 py-1 font-mono"
            />
          </div>
        </div>

        {/* Helper text */}
        <p className="text-xs sm:text-sm text-[#86868B] mt-2 mb-6">
          Equivalente a <strong className="text-[#1D1D1F] font-semibold">{formatCurrency(salary * 12)}</strong> brutos ao ano.
        </p>

        {/* Range Slider */}
        <div className="px-2 sm:px-12 mb-6">
          <input
            type="range"
            min="1500"
            max="40000"
            step="100"
            value={salary}
            onChange={handleSliderChange}
            className="w-full h-2 bg-[#E5E5EA] rounded-full appearance-none cursor-pointer accent-[#0071E3] hover:brightness-105 transition-all"
          />
          <div className="flex justify-between text-[11px] text-[#86868B] font-mono mt-2 px-1">
            <span>R$ 1.500 (Mínimo)</span>
            <span>R$ 15.000</span>
            <span>R$ 40.000+</span>
          </div>
        </div>

        {/* Quick Presets in Apple Pill Style */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {PRESETS.map((p) => {
            const isSelected = Math.abs(salary - p.value) < 50;
            return (
              <button
                key={p.value}
                onClick={() => onSalaryChange(p.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-[#0071E3] text-white shadow-xs font-semibold'
                    : 'bg-[#F5F5F7] text-[#1D1D1F] hover:bg-[#E5E5EA] border border-[#E5E5EA]'
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        {/* Apple Segmented Control for Reference Regime */}
        <div className="bg-[#F5F5F7] p-1.5 sm:p-2 rounded-2xl border border-[#E5E5EA] inline-flex flex-col sm:flex-row items-center gap-2.5 max-w-full">
          <span className="text-xs text-[#86868B] font-medium px-2">
            Este valor é a sua base em:
          </span>
          <div className="grid grid-cols-3 gap-1.5 w-full sm:w-auto bg-[#E5E5EA]/70 p-1 rounded-full">
            <button
              onClick={() => onRegimeChange('clt')}
              className={`flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                referenceRegime === 'clt'
                  ? 'bg-white text-[#1D1D1F] shadow-xs'
                  : 'text-[#86868B] hover:text-[#1D1D1F]'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5 text-[#0071E3]" />
              <span>CLT</span>
            </button>

            <button
              onClick={() => onRegimeChange('pj')}
              className={`flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                referenceRegime === 'pj'
                  ? 'bg-white text-[#1D1D1F] shadow-xs'
                  : 'text-[#86868B] hover:text-[#1D1D1F]'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-[#34C759]" />
              <span>PJ</span>
            </button>

            <button
              onClick={() => onRegimeChange('bolsista')}
              className={`flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                referenceRegime === 'bolsista'
                  ? 'bg-white text-[#1D1D1F] shadow-xs'
                  : 'text-[#86868B] hover:text-[#1D1D1F]'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-[#FF9500]" />
              <span>Bolsista</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
