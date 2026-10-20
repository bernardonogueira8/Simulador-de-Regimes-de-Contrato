import { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { RemunerationInput } from './components/RemunerationInput';
import { ComparisonCards } from './components/ComparisonCards';
import { BreakevenCard } from './components/BreakevenCard';
import { DetailedTable } from './components/DetailedTable';
import { SettingsDrawer } from './components/SettingsDrawer';
import { Footer } from './components/Footer';
import type { SimulatorInput, RegimeType } from './types';
import { DEFAULT_INPUT, loadInitialState, persistState } from './utils/url-state';
import {
  calculateBolsista,
  calculateBreakeven,
  calculateClt,
  calculatePj,
} from './utils/tax-calculator';

export function App() {
  const [input, setInput] = useState<SimulatorInput>(() => loadInitialState());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Sincronizar com localStorage e URL deep linking sempre que o input mudar
  useEffect(() => {
    persistState(input);
  }, [input]);

  // Cálculos reativos dos 3 regimes
  const cltResult = useMemo(() => calculateClt(input), [input]);
  const pjResult = useMemo(() => calculatePj(input), [input]);
  const bolsaResult = useMemo(() => calculateBolsista(input), [input]);
  const breakeven = useMemo(() => calculateBreakeven(input), [input]);

  // Handlers
  const handleSalaryChange = (newSalary: number) => {
    setInput((prev) => ({ ...prev, baseSalary: newSalary }));
  };

  const handleRegimeChange = (newRegime: RegimeType) => {
    setInput((prev) => ({ ...prev, referenceRegime: newRegime }));
  };

  const handleApplyBreakeven = (newSalary: number, regime: RegimeType) => {
    setInput((prev) => ({
      ...prev,
      baseSalary: Math.round(newSalary),
      referenceRegime: regime,
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateInput = (updated: Partial<SimulatorInput>) => {
    setInput((prev) => ({ ...prev, ...updated }));
  };

  const handleReset = () => {
    setInput(DEFAULT_INPUT);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F7] text-[#1D1D1F] font-sans selection:bg-[#0071E3]/20 selection:text-[#0071E3]">
      {/* Top Navigation & Actions */}
      <Header
        onOpenSettings={() => setIsSettingsOpen(true)}
        onReset={handleReset}
      />

      {/* Main Content Dashboard */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        
        {/* 1. Header Interativo e Campo Central de Remuneração */}
        <RemunerationInput
          salary={input.baseSalary}
          referenceRegime={input.referenceRegime}
          onSalaryChange={handleSalaryChange}
          onRegimeChange={handleRegimeChange}
        />

        {/* 2. Cards Comparativos Lado a Lado (CLT vs PJ vs Bolsista) com Gráficos em Cascata */}
        <ComparisonCards
          cltResult={cltResult}
          pjResult={pjResult}
          bolsaResult={bolsaResult}
          referenceRegime={input.referenceRegime}
        />

        {/* 3. Ponto de Equilíbrio (Equivalência Real de Propostas) */}
        <BreakevenCard
          breakeven={breakeven}
          baseSalary={input.baseSalary}
          onApplySalary={handleApplyBreakeven}
        />

        {/* 4. Tabela / Matriz Detalhada Item a Item */}
        <DetailedTable
          cltResult={cltResult}
          pjResult={pjResult}
          bolsaResult={bolsaResult}
        />

      </main>

      {/* Painel de Configurações Laterais (Filtros e Ajustes Finos) */}
      <SettingsDrawer
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        input={input}
        onChange={handleUpdateInput}
      />

      {/* Rodapé e Referências Oficiais */}
      <Footer />
    </div>
  );
}

export default App;
