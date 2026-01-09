import React from 'react';
import { Hexagram } from '../types';

interface HexagramViewProps {
  hexagram: Hexagram;
  title: string;
  changingLine?: number;
}

const HexagramView: React.FC<HexagramViewProps> = ({ hexagram, title, changingLine }) => {
  return (
    <div className="flex flex-col items-center glass-card p-6 rounded-[2rem] transition-all hover:border-amber-500/30">
      <h3 className="text-amber-200/40 text-[10px] tracking-[0.4em] mb-8 uppercase font-medium">{title}</h3>

      <div className="flex flex-col-reverse gap-4 w-36 mb-10">
        {hexagram.lines.map((line, idx) => {
          const isMoving = changingLine === (idx + 1);
          return (
            <div key={idx} className={`${isMoving ? 'moving-line' : ''}`}>
              {line === 1 ? (
                <div className="gua-line-yang" />
              ) : (
                <div className="gua-line-yin">
                  <div /><div />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="text-center w-full">
        <div className="text-2xl font-bold text-white mb-2 tracking-[0.2em] font-serif">{hexagram.name}</div>
        <div className="flex justify-center gap-2">
          <span className="text-[10px] text-amber-600/60 bg-white/5 px-2 py-0.5 rounded border border-white/5">
            {hexagram.upper.name}上
          </span>
          <span className="text-[10px] text-amber-600/60 bg-white/5 px-2 py-0.5 rounded border border-white/5">
            {hexagram.lower.name}下
          </span>
        </div>
      </div>
    </div>
  );
};

export default HexagramView;