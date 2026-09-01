import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';

export const RuleOf72Card: React.FC = () => {
  const [interestRate, setInterestRate] = useState<number>(10);
  const yearsToDouble = interestRate > 0 ? (72 / interestRate).toFixed(1) : '∞';
  const monthsToDouble = interestRate > 0 ? ((72 / interestRate) * 12).toFixed(0) : '∞';

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
      <div className="flex items-center gap-2.5 border-b border-slate-800 pb-4">
        <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl">
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-white">The Rule of 72</h3>
          <p className="text-xs text-slate-400">Mental math trick to estimate when money doubles</p>
        </div>
      </div>

      <p className="text-xs text-slate-300 leading-relaxed">
        Divide the number <strong>72</strong> by your annual interest rate to find the approximate number of years it takes for your money to double without adding another penny!
      </p>

      {/* Interactive slider */}
      <div className="space-y-2 bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60">
        <div className="flex justify-between items-baseline">
          <label className="text-xs font-semibold text-slate-300">Annual Return Rate (%):</label>
          <span className="text-sm font-bold font-mono text-emerald-400">{interestRate}% p.a.</span>
        </div>
        <input
          type="range"
          min={2}
          max={36}
          step={1}
          value={interestRate}
          onChange={(e) => setInterestRate(Number(e.target.value))}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
        />
      </div>

      {/* Result Display */}
      <div className="grid grid-cols-2 gap-3 text-center">
        <div className="bg-slate-850 border border-slate-750 rounded-2xl p-3.5">
          <span className="text-[11px] text-slate-400 font-medium block">Years to Double</span>
          <span className="text-2xl font-black text-white font-mono">{yearsToDouble} Yrs</span>
        </div>
        <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-2xl p-3.5">
          <span className="text-[11px] text-indigo-300 font-medium block">Months to Double</span>
          <span className="text-2xl font-black text-indigo-300 font-mono">~{monthsToDouble} Mo</span>
        </div>
      </div>

      {/* Comparison table */}
      <div className="text-[11px] text-slate-400 space-y-1 bg-slate-950/40 p-3.5 rounded-xl border border-slate-850">
        <div className="flex justify-between text-slate-300">
          <span>Commercial Bank Savings (3.5%):</span>
          <strong className="font-mono text-slate-400">~20.5 Years to double</strong>
        </div>
        <div className="flex justify-between text-indigo-300 font-semibold">
          <span>"Bank of Dad" High-Yield (12%):</span>
          <strong className="font-mono text-emerald-400">Only 6 Years to double!</strong>
        </div>
      </div>
    </div>
  );
};
