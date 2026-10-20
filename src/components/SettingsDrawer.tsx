import React from 'react';
import type { PjSubtype, SimulatorInput } from '../types';
import { X, Sliders, Briefcase, Building2, GraduationCap, ShieldCheck } from 'lucide-react';

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  input: SimulatorInput;
  onChange: (updated: Partial<SimulatorInput>) => void;
}

export const SettingsDrawer: React.FC<SettingsDrawerProps> = ({
  isOpen,
  onClose,
  input,
  onChange,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-md bg-white border-l border-[#E5E5EA] h-full overflow-y-auto shadow-2xl p-6 sm:p-8 flex flex-col z-10 text-[#1D1D1F]">
        
        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E5E5EA] mb-6">
          <div className="flex items-center gap-2.5">
            <Sliders className="w-5 h-5 text-[#0071E3]" />
            <h3 className="text-lg font-bold text-[#1D1D1F] m-0">Ajustes Finos da Simulação</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#86868B] hover:text-[#1D1D1F] hover:bg-[#F5F5F7] transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Tabs / Sections */}
        <div className="space-y-8 flex-1 pb-8">
          
          {/* ================= SECTION CLT ================= */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[#0071E3] font-bold text-xs uppercase tracking-wider">
              <Briefcase className="w-4 h-4" />
              <span>Configurações CLT</span>
            </div>

            {/* Dependentes */}
            <div>
              <label className="block text-xs font-medium text-[#1D1D1F] mb-1.5">
                Dependentes para dedução do IRPF (R$ 189,59/mês cada)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={input.cltDependents}
                  onChange={(e) => onChange({ cltDependents: Math.max(0, Number(e.target.value)) })}
                  className="w-24 px-3 py-1.5 bg-[#F5F5F7] border border-[#E5E5EA] rounded-xl text-sm font-mono text-[#1D1D1F] focus:outline-none focus:border-[#0071E3]"
                />
                <span className="text-xs text-[#86868B]">dependentes</span>
              </div>
            </div>

            {/* VR/VA Mensal */}
            <div>
              <label className="block text-xs font-medium text-[#1D1D1F] mb-1.5">
                Valor do Vale Refeição / Alimentação (VR/VA) recebido
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs text-[#86868B]">R$</span>
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={input.cltMealVoucherMonthly}
                  onChange={(e) => onChange({ cltMealVoucherMonthly: Math.max(0, Number(e.target.value)) })}
                  className="w-full pl-8 pr-3 py-1.5 bg-[#F5F5F7] border border-[#E5E5EA] rounded-xl text-sm font-mono text-[#1D1D1F] focus:outline-none focus:border-[#0071E3]"
                />
              </div>
            </div>

            {/* Desconto em folha VR */}
            <div>
              <label className="block text-xs font-medium text-[#1D1D1F] mb-1.5">
                Desconto em folha do VR/VA: {(input.cltMealVoucherDiscount * 100).toFixed(0)}%
              </label>
              <input
                type="range"
                min="0"
                max="0.20"
                step="0.01"
                value={input.cltMealVoucherDiscount}
                onChange={(e) => onChange({ cltMealVoucherDiscount: Number(e.target.value) })}
                className="w-full h-1.5 bg-[#E5E5EA] rounded-lg appearance-none cursor-pointer accent-[#0071E3]"
              />
              <div className="flex justify-between text-[10px] text-[#86868B] font-mono mt-1">
                <span>0% (Sem desconto)</span>
                <span>20% (Teto CLT)</span>
              </div>
            </div>

            {/* Plano de Saúde */}
            <div>
              <label className="block text-xs font-medium text-[#1D1D1F] mb-1.5">
                Valor estimado do Plano de Saúde pago pela empresa
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs text-[#86868B]">R$</span>
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={input.cltHealthInsuranceBenefit}
                  onChange={(e) => onChange({ cltHealthInsuranceBenefit: Math.max(0, Number(e.target.value)) })}
                  className="w-full pl-8 pr-3 py-1.5 bg-[#F5F5F7] border border-[#E5E5EA] rounded-xl text-sm font-mono text-[#1D1D1F] focus:outline-none focus:border-[#0071E3]"
                />
              </div>
              <p className="text-[10px] text-[#86868B] mt-1">
                Benefício patrimonial que você não precisa tirar do próprio bolso.
              </p>
            </div>
          </div>

          {/* ================= SECTION PJ ================= */}
          <div className="space-y-4 pt-4 border-t border-[#E5E5EA]">
            <div className="flex items-center gap-2 text-[#34C759] font-bold text-xs uppercase tracking-wider">
              <Building2 className="w-4 h-4" />
              <span>Configurações PJ</span>
            </div>

            {/* Subtipo de PJ */}
            <div>
              <label className="block text-xs font-medium text-[#1D1D1F] mb-1.5">
                Modalidade de Empresa PJ
              </label>
              <select
                value={input.pjSubtype}
                onChange={(e) => onChange({ pjSubtype: e.target.value as PjSubtype })}
                className="w-full px-3 py-2 bg-[#F5F5F7] border border-[#E5E5EA] rounded-xl text-sm text-[#1D1D1F] focus:outline-none focus:border-[#34C759]"
              >
                <option value="simples_anexo_iii">Simples Nacional (Anexo III - Fator R 28%)</option>
                <option value="simples_anexo_v">Simples Nacional (Anexo V - Sem Fator R 15,5%)</option>
                <option value="mei">MEI (Até R$ 81k/ano - DAS Fixo R$ 80,90)</option>
              </select>
            </div>

            {/* Honorários de Contabilidade */}
            <div>
              <label className="block text-xs font-medium text-[#1D1D1F] mb-1.5">
                Honorários Mensais de Contabilidade
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs text-[#86868B]">R$</span>
                <input
                  type="number"
                  min="0"
                  step="10"
                  value={input.pjAccountingMonthlyCost}
                  onChange={(e) => onChange({ pjAccountingMonthlyCost: Math.max(0, Number(e.target.value)) })}
                  className="w-full pl-8 pr-3 py-1.5 bg-[#F5F5F7] border border-[#E5E5EA] rounded-xl text-sm font-mono text-[#1D1D1F] focus:outline-none focus:border-[#34C759]"
                />
              </div>
            </div>

            {/* Despesas de Operação */}
            <div>
              <label className="block text-xs font-medium text-[#1D1D1F] mb-1.5">
                Despesas de Trabalho (Internet, celular, softwares, conta PJ)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs text-[#86868B]">R$</span>
                <input
                  type="number"
                  min="0"
                  step="25"
                  value={input.pjOtherExpensesMonthly}
                  onChange={(e) => onChange({ pjOtherExpensesMonthly: Math.max(0, Number(e.target.value)) })}
                  className="w-full pl-8 pr-3 py-1.5 bg-[#F5F5F7] border border-[#E5E5EA] rounded-xl text-sm font-mono text-[#1D1D1F] focus:outline-none focus:border-[#34C759]"
                />
              </div>
            </div>

            {/* Toggle Provisão Férias + 13º */}
            <div className="p-3.5 rounded-2xl bg-[#F5F5F7] border border-[#E5E5EA] flex items-start gap-3">
              <input
                type="checkbox"
                id="pjProvisaoFerias13"
                checked={input.pjProvisaoFerias13}
                onChange={(e) => onChange({ pjProvisaoFerias13: e.target.checked })}
                className="mt-1 w-4 h-4 rounded text-[#0071E3] accent-[#0071E3] cursor-pointer"
              />
              <label htmlFor="pjProvisaoFerias13" className="text-xs cursor-pointer select-none">
                <span className="font-semibold text-[#1D1D1F] block">
                  Deduzir Provisão de Férias e 13º na PJ (Equalização CLT)
                </span>
                <span className="text-[#86868B] block mt-0.5">
                  Reserva mensal de 1/12 para o 13º e 11,1% para descansar 30 dias com 1/3 remunerado.
                </span>
              </label>
            </div>

            {/* Toggle Provisão FGTS */}
            <div className="p-3.5 rounded-2xl bg-[#F5F5F7] border border-[#E5E5EA] flex items-start gap-3">
              <input
                type="checkbox"
                id="pjProvisaoFgts"
                checked={input.pjProvisaoFgts}
                onChange={(e) => onChange({ pjProvisaoFgts: e.target.checked })}
                className="mt-1 w-4 h-4 rounded text-[#0071E3] accent-[#0071E3] cursor-pointer"
              />
              <label htmlFor="pjProvisaoFgts" className="text-xs cursor-pointer select-none">
                <span className="font-semibold text-[#1D1D1F] block">
                  Reserva Equivalente ao FGTS (8%)
                </span>
                <span className="text-[#86868B] block mt-0.5">
                  Guarda mensalmente 8% para criar seu próprio fundo de emergência/rescisão.
                </span>
              </label>
            </div>
          </div>

          {/* ================= SECTION BOLSISTA ================= */}
          <div className="space-y-4 pt-4 border-t border-[#E5E5EA]">
            <div className="flex items-center gap-2 text-[#FF9500] font-bold text-xs uppercase tracking-wider">
              <GraduationCap className="w-4 h-4" />
              <span>Configurações Bolsista</span>
            </div>

            {/* Toggle Equiparação Previdenciária */}
            <div className="p-3.5 rounded-2xl bg-[#F5F5F7] border border-[#E5E5EA] flex items-start gap-3">
              <input
                type="checkbox"
                id="bolsaEquipararSeguranca"
                checked={input.bolsaEquipararSeguranca}
                onChange={(e) => onChange({ bolsaEquipararSeguranca: e.target.checked })}
                className="mt-1 w-4 h-4 rounded text-[#0071E3] accent-[#0071E3] cursor-pointer"
              />
              <label htmlFor="bolsaEquipararSeguranca" className="text-xs cursor-pointer select-none">
                <span className="font-semibold text-[#1D1D1F] block flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#FF9500]" />
                  Equiparar Segurança Previdenciária (INSS)
                </span>
                <span className="text-[#86868B] block mt-0.5">
                  Deduz o recolhimento voluntário do INSS como Contribuinte Facultativo para ter direito à aposentadoria e auxílio-doença.
                </span>
              </label>
            </div>

            {/* Plano de INSS Facultativo */}
            {input.bolsaEquipararSeguranca && (
              <div className="pl-4 border-l-2 border-[#FF9500]/40 space-y-3">
                <label className="block text-xs font-medium text-[#1D1D1F]">
                  Modalidade do INSS Facultativo
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs text-[#1D1D1F] cursor-pointer">
                    <input
                      type="radio"
                      name="inssFacultativo"
                      value="simplificado_11"
                      checked={input.bolsaInssFacultativo === 'simplificado_11'}
                      onChange={() => onChange({ bolsaInssFacultativo: 'simplificado_11' })}
                      className="accent-[#0071E3]"
                    />
                    <span>
                      <strong>Plano Simplificado (11% do SM)</strong> - R$ 166,98/mês
                    </span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-[#1D1D1F] cursor-pointer">
                    <input
                      type="radio"
                      name="inssFacultativo"
                      value="normal_20"
                      checked={input.bolsaInssFacultativo === 'normal_20'}
                      onChange={() => onChange({ bolsaInssFacultativo: 'normal_20' })}
                      className="accent-[#0071E3]"
                    />
                    <span>
                      <strong>Plano Normal (20% sobre Bolsa/SM)</strong> - Aposentadoria por tempo
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Toggle Provisão Transição / 13º / Férias */}
            <div className="p-3.5 rounded-2xl bg-[#F5F5F7] border border-[#E5E5EA] flex items-start gap-3">
              <input
                type="checkbox"
                id="bolsaProvisaoTransicao"
                checked={input.bolsaProvisaoTransicao}
                onChange={(e) => onChange({ bolsaProvisaoTransicao: e.target.checked })}
                className="mt-1 w-4 h-4 rounded text-[#0071E3] accent-[#0071E3] cursor-pointer"
              />
              <label htmlFor="bolsaProvisaoTransicao" className="text-xs cursor-pointer select-none">
                <span className="font-semibold text-[#1D1D1F] block">
                  Reserva para Transição e Ausência de 13º / Férias
                </span>
                <span className="text-[#86868B] block mt-0.5">
                  Como bolsistas não possuem férias remuneradas ou 13º salário, deduz uma reserva mensal para equalizar com o mercado de trabalho.
                </span>
              </label>
            </div>

          </div>

        </div>

        {/* Drawer Footer */}
        <div className="pt-4 border-t border-[#E5E5EA]">
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-full bg-[#0071E3] hover:bg-[#0077ED] text-white font-semibold text-xs transition-all shadow-xs"
          >
            Aplicar e Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
