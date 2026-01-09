
import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, Hash, Loader2, RotateCcw, BookOpen, HelpCircle, Info, Search, Share, PlusSquare, X } from 'lucide-react';
import { DivinationResult, DivinationMethod } from './types';
import { calculateByTime, calculateByNumbers } from './services/divinationEngine';
import { interpretGua } from './services/geminiService';
import HexagramView from './components/HexagramView';
import HexagramLookup from './components/HexagramLookup';

type ViewMode = 'divine' | 'lookup';

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('divine');
  const [question, setQuestion] = useState('');
  const [method, setMethod] = useState<DivinationMethod>(DivinationMethod.TIME);
  const [numbers, setNumbers] = useState({ n1: '', n2: '', n3: '' });
  const [result, setResult] = useState<DivinationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [interpretation, setInterpretation] = useState('');
  const [isInterpreting, setIsInterpreting] = useState(false);
  const [showInstallGuide, setShowInstallGuide] = useState(false);

  // 检测是否为 iOS 且未安装 PWA
  useEffect(() => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const isStandalone = (window.navigator as any).standalone || window.matchMedia('(display-mode: standalone)').matches;
    
    if (isIOS && !isStandalone) {
      // 延迟显示引导，避免打扰
      const timer = setTimeout(() => setShowInstallGuide(true), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleStartDivination = async () => {
    if (!question.trim()) {
      alert("请输入您想预测的事情");
      return;
    }

    if (method === DivinationMethod.NUMBERS) {
      if (!numbers.n1 || !numbers.n2 || !numbers.n3) {
        alert("请输入完整的三个起卦数字");
        return;
      }
    }

    setIsCalculating(true);
    let divinationResult: DivinationResult;

    if (method === DivinationMethod.TIME) {
      divinationResult = calculateByTime(question);
    } else {
      const n1 = parseInt(numbers.n1) || 1;
      const n2 = parseInt(numbers.n2) || 1;
      const n3 = parseInt(numbers.n3) || 1;
      divinationResult = calculateByNumbers(question, n1, n2, n3);
    }

    setTimeout(() => {
      setResult(divinationResult);
      setIsCalculating(false);
    }, 1500);
  };

  const handleInterpret = async () => {
    if (!result) return;
    setIsInterpreting(true);
    const text = await interpretGua(result);
    setInterpretation(text);
    setIsInterpreting(false);
  };

  const reset = () => {
    setResult(null);
    setInterpretation('');
    setQuestion('');
    setNumbers({ n1: '', n2: '', n3: '' });
  };

  return (
    <div className="min-h-screen mystic-gradient flex flex-col items-center py-6 px-4 md:py-10 md:px-8 pb-32">
      {/* Header */}
      <header className="mb-8 text-center pt-4">
        <div className="flex justify-center items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center text-slate-900 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
            <Sparkles size={28} />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tighter text-amber-500">梅花易数</h1>
        </div>
        <p className="text-slate-400 text-base md:text-lg">AI 灵卦 · 通晓古今</p>
      </header>

      {/* Navigation Tabs */}
      {!result && (
        <div className="flex bg-slate-900/60 p-1 rounded-2xl border border-slate-700/50 mb-10 w-full max-w-md backdrop-blur-xl">
          <button
            onClick={() => setViewMode('divine')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all ${
              viewMode === 'divine'
                ? 'bg-amber-500 text-slate-900 shadow-lg'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles size={18} />
            <span>虔心问卜</span>
          </button>
          <button
            onClick={() => setViewMode('lookup')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all ${
              viewMode === 'lookup'
                ? 'bg-amber-500 text-slate-900 shadow-lg'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Search size={18} />
            <span>万卦速查</span>
          </button>
        </div>
      )}

      {viewMode === 'lookup' && !result ? (
        <HexagramLookup />
      ) : (
        <div className="w-full flex flex-col items-center">
          {!result ? (
            <div className="w-full max-w-2xl bg-slate-800/40 border border-slate-700 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-8">
                <label className="block text-slate-300 mb-3 text-lg font-medium">您心中有何疑惑？</label>
                <textarea
                  className="w-full bg-slate-900/50 border border-slate-600 rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all h-32 resize-none text-base"
                  placeholder="例如：近期的事业发展如何？一段关系的前景？"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                />
              </div>

              <div className="mb-8">
                <label className="block text-slate-300 mb-4 text-lg font-medium">起卦方式</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setMethod(DivinationMethod.TIME)}
                    className={`flex items-center justify-center gap-2 p-4 rounded-xl border transition-all ${
                      method === DivinationMethod.TIME
                        ? 'bg-amber-500/20 border-amber-500 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.1)]'
                        : 'bg-slate-900/50 border-slate-700 text-slate-400 hover:border-slate-500'
                    }`}
                  >
                    <Calendar size={20} />
                    <span>时间起卦</span>
                  </button>
                  <button
                    onClick={() => setMethod(DivinationMethod.NUMBERS)}
                    className={`flex items-center justify-center gap-2 p-4 rounded-xl border transition-all ${
                      method === DivinationMethod.NUMBERS
                        ? 'bg-amber-500/20 border-amber-500 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.1)]'
                        : 'bg-slate-900/50 border-slate-700 text-slate-400 hover:border-slate-500'
                    }`}
                  >
                    <Hash size={20} />
                    <span>数字起卦</span>
                  </button>
                </div>
              </div>

              {method === DivinationMethod.NUMBERS && (
                <div className="mb-8 animate-in fade-in slide-in-from-top-2 duration-500">
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <HelpCircle className="text-amber-500 shrink-0 mt-1" size={18} />
                      <div className="text-sm text-slate-300 leading-relaxed">
                        <p className="font-bold text-amber-400 mb-1">大师指点：数由心生</p>
                        请凭第一直觉输入三个数字。
                        <div className="mt-1 flex flex-wrap gap-x-3 text-xs opacity-70">
                          <span>1: 上卦</span>
                          <span>2: 下卦</span>
                          <span>3: 变爻</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    {['n1', 'n2', 'n3'].map((key) => (
                      <input
                        key={key}
                        type="number"
                        className="w-full bg-slate-900/50 border border-slate-600 rounded-lg p-3 text-center text-white text-xl font-bold focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all"
                        placeholder="0"
                        value={numbers[key as keyof typeof numbers]}
                        onChange={(e) => setNumbers({ ...numbers, [key]: e.target.value })}
                      />
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={handleStartDivination}
                disabled={isCalculating}
                className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-amber-800 disabled:cursor-not-allowed text-slate-900 font-bold py-5 rounded-2xl text-xl transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95"
              >
                {isCalculating ? (
                  <>
                    <Loader2 className="animate-spin" />
                    正在推演...
                  </>
                ) : (
                  '虔心起卦'
                )}
              </button>
            </div>
          ) : (
            <div className="w-full max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="mb-8 text-center bg-slate-800/30 p-4 rounded-2xl border border-slate-700/30">
                <span className="text-slate-400 text-xs uppercase tracking-widest">问卦之事</span>
                <p className="text-xl italic text-amber-200 mt-1 font-serif">「 {result.question} 」</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <HexagramView hexagram={result.benGua} title="本卦 (现状)" changingLine={result.changingLine} />
                <HexagramView hexagram={result.huGua} title="互卦 (过程)" />
                <HexagramView hexagram={result.bianGua} title="变卦 (结果)" />
              </div>

              <div className="flex flex-col items-center gap-6">
                {!interpretation ? (
                  <button
                    onClick={handleInterpret}
                    disabled={isInterpreting}
                    className="group relative px-10 py-5 bg-transparent border-2 border-amber-500 text-amber-500 rounded-full font-bold text-xl hover:bg-amber-500 hover:text-slate-900 transition-all flex items-center gap-3 overflow-hidden shadow-[0_0_20px_rgba(245,158,11,0.2)] active:scale-95"
                  >
                    {isInterpreting ? (
                      <>
                        <Loader2 className="animate-spin" />
                        解卦中...
                      </>
                    ) : (
                      <>
                        <BookOpen />
                        开启 AI 深度解卦
                      </>
                    )}
                  </button>
                ) : (
                  <div className="w-full bg-slate-900/80 border border-slate-700 rounded-3xl p-8 md:p-12 shadow-inner prose prose-invert max-w-none animate-in fade-in duration-1000">
                    <div className="flex items-center gap-3 mb-6 text-amber-500 border-b border-slate-700 pb-4">
                      <Sparkles />
                      <h2 className="text-2xl font-bold m-0 text-amber-500 font-serif">玄机解析</h2>
                    </div>
                    <div className="text-slate-200 leading-relaxed whitespace-pre-wrap font-serif text-lg">
                      {interpretation}
                    </div>
                  </div>
                )}

                <button
                  onClick={reset}
                  className="mt-8 flex items-center gap-2 text-slate-500 hover:text-amber-500 transition-colors py-2 px-6 rounded-full hover:bg-slate-800 border border-transparent hover:border-slate-700"
                >
                  <RotateCcw size={18} />
                  重新问卜
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* iOS Install Guide Banner */}
      {showInstallGuide && (
        <div className="fixed bottom-6 left-4 right-4 z-[100] animate-in slide-in-from-bottom-10 duration-500">
          <div className="bg-slate-900/90 backdrop-blur-2xl border border-amber-500/30 rounded-2xl p-4 shadow-2xl flex flex-col gap-3 relative overflow-hidden">
            <button 
              onClick={() => setShowInstallGuide(false)}
              className="absolute top-2 right-2 p-1 text-slate-500 hover:text-white"
            >
              <X size={18} />
            </button>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center shadow-lg shrink-0">
                <Sparkles className="text-slate-900" size={24} />
              </div>
              <div className="flex-1">
                <h4 className="text-white font-bold text-sm">安装“灵卦”App</h4>
                <p className="text-slate-400 text-xs">添加到主屏幕，享受全屏沉浸式算卦体验</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2 border-t border-slate-700/50 text-[10px] text-slate-300 font-medium">
              <span>点击底部</span>
              <div className="bg-slate-100/10 p-1.5 rounded-md"><Share size={14} className="text-amber-400" /></div>
              <span>然后找到</span>
              <div className="bg-slate-100/10 p-1.5 rounded-md flex items-center gap-1">
                <PlusSquare size={14} className="text-amber-400" />
                <span>添加到主屏幕</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="mt-20 text-slate-600 text-xs tracking-widest uppercase flex flex-col items-center gap-2">
        <div className="w-20 h-px bg-slate-800"></div>
        <span>© 无妄居 · 易经智慧 · 仅供参考</span>
      </footer>
    </div>
  );
}

export default App;
