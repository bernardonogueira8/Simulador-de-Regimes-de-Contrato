import React, { useState } from 'react';
import { Share2, Check, SlidersHorizontal, RotateCcw, Scale } from 'lucide-react';

interface HeaderProps {
  onOpenSettings: () => void;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSettings, onReset }) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <header className="border-b border-[#E5E5EA] bg-white/80 backdrop-blur-xl sticky top-0 z-30 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Brand / Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#0071E3] flex items-center justify-center shadow-sm">
            <Scale className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-semibold tracking-tight text-[#1D1D1F] m-0">
                SimulaContrato
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded-full bg-[#E8F2FE] text-[#0071E3]">
                2025 Oficial
              </span>
            </div>
            <p className="text-[11px] text-[#86868B] m-0">
              Simulador Real: CLT vs. PJ vs. Bolsista
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5 w-full sm:w-auto justify-end">
          <button
            onClick={onReset}
            title="Restaurar parâmetros padrão"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-[#1D1D1F] hover:bg-[#F5F5F7] border border-[#D2D2D7] transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#86868B]" />
            <span className="hidden sm:inline">Padrão</span>
          </button>

          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium text-[#1D1D1F] hover:bg-[#F5F5F7] border border-[#D2D2D7] transition-all shadow-xs"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#0071E3]" />
            <span>Ajustes Finos</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold text-white bg-[#0071E3] hover:bg-[#0077ED] transition-all shadow-xs active:scale-98"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span>Link Copiado!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Compartilhar</span>
              </>
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
