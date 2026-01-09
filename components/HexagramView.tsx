
import React from 'react';
import { Info, Layers } from 'lucide-react';
import { Hexagram } from '../types';

interface HexagramViewProps {
  hexagram: Hexagram;
  title: string;
  changingLine?: number;
}

const HexagramView: React.FC<HexagramViewProps> = ({ hexagram, title, changingLine }) => {
  // Determine the description based on the title keywords
  const getGuaDescription = () => {
    if (title.includes('本卦')) {
      return '【本卦】象征事物的现状、当前所处的环境以及事物的基本性质。它是占卜的起点。';
    }
    if (title.includes('互卦')) {
      return '【互卦】由本卦的中间四爻交互组成，象征事物发展的中间过程、内在矛盾或隐藏的因素。';
    }
    if (title.includes('变卦')) {
      return '【变卦】本卦动爻改变后形成的卦，象征事物的最终结局、未来趋向或变化后的结果。';
    }
    return '';
  };

  const description = getGuaDescription();

  return (
    <div className="flex flex-col items-center bg-slate-800/50 p-6 rounded-xl border border-slate-700 backdrop-blur-sm transition-transform hover:scale-[1.02] duration-300">
      <div className="flex items-center gap-2 mb-4 group relative cursor-help">
        <h3 className="text-xl font-bold text-amber-400">{title}</h3>
        <Info size={16} className="text-slate-500 group-hover:text-amber-400 transition-colors" />
        
        {/* Tooltip */}
        {description && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 p-3 bg-slate-900 border border-slate-600 text-slate-200 text-xs rounded-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 pointer-events-none">
            {description}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900"></div>
          </div>
        )}
      </div>

      <div className="flex flex-col-reverse gap-2 w-32">
        {hexagram.lines.map((line, idx) => {
          const isChanging = changingLine === (idx + 1);
          return (
            <div key={idx} className="relative">
              {line === 1 ? (
                <div className={`gua-line-yang transition-all duration-300 ${isChanging ? 'shadow-[0_0_15px_rgba(251,191,36,0.6)] animate-pulse' : ''}`} />
              ) : (
                <div className="gua-line-yin">
                  <div className={`transition-all duration-300 ${isChanging ? 'shadow-[0_0_15px_rgba(251,191,36,0.6)] animate-pulse' : ''}`} />
                  <div className={`transition-all duration-300 ${isChanging ? 'shadow-[0_0_15px_rgba(251,191,36,0.6)] animate-pulse' : ''}`} />
                </div>
              )}
              {isChanging && (
                <div className="absolute -right-6 top-1/2 -translate-y-1/2 text-amber-500 font-bold animate-bounce">
                  *
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 text-center w-full">
        <div className="text-2xl font-bold tracking-widest text-white">{hexagram.name}</div>
        
        {/* Trigram Details Panel */}
        <div className="mt-4 bg-slate-900/40 rounded-lg p-3 border border-slate-700/50 text-left">
          <div className="flex items-center gap-1.5 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <Layers size={12} />
            <span>卦象组成</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">上卦（外）</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-amber-500/90">{hexagram.upper.name}为{hexagram.upper.nature}</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-amber-500/10 text-amber-400/80 rounded border border-amber-500/20">{hexagram.upper.attribute}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">下卦（内）</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-amber-500/90">{hexagram.lower.name}为{hexagram.lower.nature}</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-amber-500/10 text-amber-400/80 rounded border border-amber-500/20">{hexagram.lower.attribute}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HexagramView;
