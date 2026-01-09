import React, { useState } from 'react';
import { Sparkles, Calendar, Hash, Loader2, RotateCcw, BookOpen, Compass } from 'lucide-react';
import { DivinationResult, DivinationMethod } from './types';
import { calculateByTime, calculateByNumbers } from './services/divinationEngine';
import { interpretGua } from './services/aiService';
import HexagramView from './components/HexagramView';
import HexagramLookup from './components/HexagramLookup';

function App() {
  const [viewMode, setViewMode] = useState<'divine' | 'lookup'>('divine');
  const [question, setQuestion] = useState('');
  const [method, setMethod] = useState<DivinationMethod>(DivinationMethod.TIME);
  const [numbers, setNumbers] = useState({ n1: '', n2: '', n3: '' });
  const [result, setResult] = useState<DivinationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [interpretation, setInterpretation] = useState('');
  const [isInterpreting, setIsInterpreting] = useState(false);

  const handleDivine = () => {
    if (!question.trim()) return alert("请心存诚意，写下所问。");
    setIsCalculating(true);
    // 模拟起卦的仪式感延迟
    setTimeout(() => {
      const res = method === DivinationMethod.TIME 
        ? calculateByTime(question) 
        : calculateByNumbers(question, parseInt(numbers.n1), parseInt(numbers.n2), parseInt(numbers.n3));
      setResult(res);
      setIsCalculating(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen mystic-bg pb-24 overflow-y-auto">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* 精致页眉 */}
        <header className="flex flex-col items-center mb-16">
          <div className="relative mb-6">
            <div className="absolute inset-0 blur-2xl bg-amber-500/10 rounded-full"></div>
            <div className="tai-chi-spin relative p-4 border border-amber-500/20 rounded-full">
              <Compass size={42} className="text-[#c5a059]" strokeWidth={1.2} />
            </div>
          </div>
          <h1 className="text-4xl font-serif font-bold text-white tracking-[0.6em] mb-4">灵 卦</h1>
          <p className="text-amber-500/40 text-[10px] tracking-[0.4em] uppercase font-light">DeepSeek AI · Ancient Wisdom</p>
        </header>

        {!result ? (
          <div className="max-w-xl mx-auto space-y-8 animate-in fade-in duration-1000">
            {/* 模式切换 */}
            <div className="flex p-1 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-md">
              <button 
                onClick={() => setViewMode('divine')}
                className={`flex-1 py-3 text-xs tracking-widest rounded-xl transition-all ${viewMode === 'divine' ? 'bg-amber-600/20 text-amber-500 font-bold border border-amber-500/20 shadow-inner' : 'text-zinc-600'}`}
              >
                虔心起卦
              </button>
              <button 
                onClick={() => setViewMode('lookup')}
                className={`flex-1 py-3 text-xs tracking-widest rounded-xl transition-all ${viewMode === 'lookup' ? 'bg-amber-600/20 text-amber-500 font-bold border border-amber-500/20 shadow-inner' : 'text-zinc-600'}`}
              >
                卦象速查
              </button>
            </div>

            {viewMode === 'lookup' ? <HexagramLookup /> : (
              <div className="glass-card rounded-[2.5rem] p-10 space-y-10">
                <div className="space-y-4">
                  <label className="text-amber-500/50 text-[10px] tracking-widest block px-1">所问何事</label>
                  <textarea
                    placeholder="输入您心中的疑惑..."
                    className="w-full bg-black/40 border-none rounded-2xl p-6 text-white text-lg font-serif h-36 placeholder:text-zinc-800 focus:ring-1 focus:ring-amber-500/30 transition-all resize-none"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setMethod(DivinationMethod.TIME)}
                    className={`flex items-center justify-center gap-3 py-4 rounded-2xl border transition-all ${method === DivinationMethod.TIME ? 'border-amber-500/40 text-amber-500 bg-amber-500/5' : 'border-white/5 text-zinc-700 hover:border-white/10'}`}
                  >
                    <Calendar size={16} /> <span className="text-xs font-medium">按时起卦</span>
                  </button>
                  <button
                    onClick={() => setMethod(DivinationMethod.NUMBERS)}
                    className={`flex items-center justify-center gap-3 py-4 rounded-2xl border transition-all ${method === DivinationMethod.NUMBERS ? 'border-amber-500/40 text-amber-500 bg-amber-500/5' : 'border-white/5 text-zinc-700 hover:border-white/10'}`}
                  >
                    <Hash size={16} /> <span className="text-xs font-medium">报数起卦</span>
                  </button>
                </div>

                {method === DivinationMethod.NUMBERS && (
                  <div className="flex gap-4 animate-in slide-in-from-top-4 duration-500">
                    {[1, 2, 3].map(i => (
                      <input
                        key={i}
                        type="number"
                        placeholder="灵数"
                        className="flex-1 bg-black/40 p-4 rounded-xl text-center text-xl font-bold text-amber-500 focus:outline-none border-b border-amber-500/10"
                        onChange={(e) => {
                          const val = e.target.value;
                          setNumbers(prev => ({ ...prev, [`n${i}`]: val }));
                        }}
                      />
                    ))}
                  </div>
                )}

                <button
                  onClick={handleDivine}
                  disabled={isCalculating}
                  className="btn-gold w-full py-5 rounded-2xl shadow-2xl active:scale-[0.98] disabled:opacity-50 flex justify-center items-center gap-4 text-sm tracking-[0.5em] font-bold"
                >
                  {isCalculating ? <Loader2 className="animate-spin" /> : "开启推演"}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-12 animate-in fade-in duration-1000">
            <div className="text-center px-4">
              <span className="text-amber-500 text-xs tracking-[0.2em] bg-amber-500/5 px-6 py-2 rounded-full border border-amber-500/10 italic">
                “ {result.question} ”
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <HexagramView hexagram={result.benGua} title="本卦 · 见微知著" changingLine={result.changingLine} />
              <HexagramView hexagram={result.huGua} title="互卦 · 洞见玄机" />
              <HexagramView hexagram={result.bianGua} title="变卦 · 终局指点" />
            </div>

            <div className="flex flex-col items-center">
              {!interpretation ? (
                <button
                  onClick={async () => {
                    setIsInterpreting(true);
                    const text = await interpretGua(result);
                    setInterpretation(text);
                    setIsInterpreting(false);
                  }}
                  className="btn-gold px-16 py-5 rounded-full flex items-center gap-4 text-sm font-bold tracking-widest"
                  disabled={isInterpreting}
                >
                  {isInterpreting ? <Loader2 className="animate-spin" /> : <BookOpen size={18} />}
                  开启 DeepSeek 解卦
                </button>
              ) : (
                <div className="w-full glass-card rounded-[3rem] p-10 md:p-14 border-amber-500/20 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Sparkles size={120} className="text-amber-500" />
                  </div>
                  <div className="flex items-center gap-4 text-amber-500 mb-10 border-b border-amber-500/10 pb-6">
                    <Sparkles size={20} />
                    <h2 className="text-2xl font-serif font-bold tracking-[0.2em]">易理指引</h2>
                  </div>
                  <div className="text-zinc-300 leading-[2.4] text-lg font-serif whitespace-pre-wrap selection:bg-amber-500/20">
                    {interpretation}
                  </div>
                  <div className="mt-12 pt-8 border-t border-white/5 text-center">
                    <p className="text-zinc-700 text-[10px] tracking-widest">卦意随缘，行善积德方为上策</p>
                  </div>
                </div>
              )}

              <button 
                onClick={() => {setResult(null); setInterpretation('');}}
                className="mt-16 text-zinc-700 hover:text-amber-500 flex items-center gap-2 transition-colors group"
              >
                <RotateCcw size={14} className="group-hover:rotate-180 transition-transform duration-500" />
                <span className="text-[10px] tracking-widest uppercase">重起一卦</span>
              </button>
            </div>
          </div>
        )}

        <footer className="mt-40 text-center opacity-10">
          <p className="text-white text-[8px] tracking-[1em] uppercase">Built with Heart & AI · DeepSeek Powered</p>
        </footer>
      </div>
    </div>
  );
}

export default App;