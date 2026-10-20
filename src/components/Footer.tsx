import React from 'react';
import { ShieldCheck, FileText, Scale } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[#E5E5EA] bg-[#F5F5F7] py-12 text-xs text-[#86868B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          {/* Coluna 1: Sobre */}
          <div>
            <div className="flex items-center gap-2 text-[#1D1D1F] font-bold mb-2">
              <Scale className="w-4 h-4 text-[#0071E3]" />
              <span>SimulaContrato</span>
            </div>
            <p className="leading-relaxed">
              Ferramenta open-source para equalização e simulação realista de poder de compra entre CLT, PJ (Simples/MEI) e Bolsas de Pesquisa/Extensão.
            </p>
          </div>

          {/* Coluna 2: Bases Legais */}
          <div>
            <div className="flex items-center gap-2 text-[#1D1D1F] font-bold mb-2">
              <FileText className="w-4 h-4 text-[#0071E3]" />
              <span>Bases Fiscais Oficiais</span>
            </div>
            <p className="leading-relaxed">
              Tabelas oficiais de INSS e IRPF 2025, Desconto Simplificado da Receita Federal, Lei Complementar nº 123/2006 (Simples Nacional) e Lei nº 9.250/95 (isenção de bolsas).
            </p>
          </div>

          {/* Coluna 3: Privacidade */}
          <div>
            <div className="flex items-center gap-2 text-[#1D1D1F] font-bold mb-2">
              <ShieldCheck className="w-4 h-4 text-[#34C759]" />
              <span>Privacidade Total</span>
            </div>
            <p className="leading-relaxed">
              Zero telemetria ou envio de dados para servidores. Todos os cálculos rodam estritamente no seu navegador (Client-Side). Parâmetros salvos apenas no seu dispositivo.
            </p>
          </div>

        </div>

        <div className="pt-6 border-t border-[#E5E5EA] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#86868B]">
          <p className="m-0">
            Aviso legal: Simulador com finalidade educativa e comparativa. Consulte sempre seu contador de confiança para decisões fiscais personalizadas.
          </p>
          <p className="m-0 text-[#86868B]">
            Design inspirado no ecossistema Apple com foco em clareza e precisão matemática.
          </p>
        </div>
      </div>
    </footer>
  );
};
