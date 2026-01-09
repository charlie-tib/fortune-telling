
import React, { useState, useMemo } from 'react';
import { Search, Info, ArrowDown } from 'lucide-react';
import { TRIGRAMS, GET_HEXAGRAM_NAME, GET_HEXAGRAM_MEANING } from '../constants';
import { Hexagram } from '../types';
import HexagramView from './HexagramView';

const HexagramLookup: React.FC = () => {
  const [upperNum, setUpperNum] = useState<number>(1);
  const [lowerNum, setLowerNum] = useState<number>(1);

  const hexagram = useMemo((): Hexagram => {
    const upper = TRIGRAMS[upperNum] || TRIGRAMS[1];
    const lower = TRIGRAMS[lowerNum] || TRIGRAMS[1];
    return {
      upper,
      lower,
      name: GET_HEXAGRAM_NAME(upperNum, lowerNum),
      lines: [...lower.lines, ...upper.lines]
    };
  }, [upperNum, lowerNum]);

  const meaning = useMemo(() => GET_HEXAGRAM_MEANING(upperNum, lowerNum), [upperNum, lowerNum]);

  const NumberSelector = ({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) => (
    <div className="flex flex-col gap-2">
      <label className="text-slate-400 text-sm font-medium px-1">{label}</label>
      <div className="grid grid-cols-4 gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
          <button
            key={n}
            onClick={() => onChange(n)}
            className={`py-2 rounded-lg text-sm font-bold transition-all border ${
              value === n
                ? 'bg-amber-500 border-amber-500 text-slate-900 shadow-lg shadow-amber-500/20'
                : 'bg-slate-900/40 border-slate-700 text-slate-400 hover:border-slate-500'
            }`}
          >
            {n}
            <span className="block text-[10px] font-normal opacity-70">{TRIGRAMS[n].name}</span>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col md:flex-row gap-8 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="flex-1 space-y-8 bg-slate-800/40 border border-slate-700 rounded-3xl p-6 backdrop-blur-md">
        <div className="flex items-center gap-2 text-amber-500 mb-2">
          <Search size={20} />
          <h2 className="text-xl font-bold">卦象速查</h2>
        </div>
        
        <p className="text-slate-400 text-sm leading-relaxed">
          直接选择上下卦的编号（1-8），系统将为您即时推演对应的卦象名称及其核心易理。
        </p>

        <div className="space-y-6">
          <NumberSelector label="上卦 (外卦/天)" value={upperNum} onChange={setUpperNum} />
          <div className="flex justify-center">
            <ArrowDown className="text-slate-600" size={20} />
          </div>
          <NumberSelector label="下卦 (内卦/地)" value={lowerNum} onChange={setLowerNum} />
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-6">
        <HexagramView hexagram={hexagram} title="所选卦象" />
        
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-6">
          <div className="flex items-center gap-2 text-amber-400 mb-3 font-bold">
            <Info size={18} />
            <span>核心解析</span>
          </div>
          <p className="text-slate-200 text-lg font-serif leading-relaxed">
            {meaning}
          </p>
          <div className="mt-4 pt-4 border-t border-amber-500/10 text-xs text-slate-500 italic">
            注：此为本卦之基本定义。如需深入结合变爻分析，请使用“虔心问卜”功能。
          </div>
        </div>
      </div>
    </div>
  );
};

export default HexagramLookup;
