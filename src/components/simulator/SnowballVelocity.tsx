import React from 'react';
import type { MonthlyBreakdown, CurrencyConfig } from '../../types/allowance';
import { formatCurrency, formatCurrencyExact } from '../../config/currencies';
import { Sparkles, Flame, Snowflake } from 'lucide-react';

interface SnowballVelocityProps {
  breakdown: MonthlyBreakdown[];
  currency: CurrencyConfig;
  snowballFactor: number;
}

export const SnowballVelocity: React.FC<SnowballVelocityProps> = ({
  breakdown,
  currency,
  snowballFactor,
}) => {
  if (breakdown.length === 0) return null;

  const firstMonth = breakdown[0];
  const lastMonth = breakdown[breakdown.length - 1];

  return (
    <div className="bg-gradient-to-br from-indigo-950/40 via-slate-900/90 to-purple-950/40 border border-indigo-500/20 rounded-3xl p-6 shadow-xl relative overflow-hidden">
      {/* Background ambient decorative glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center gap-2.5 mb-5">
        <div className="p-2.5 bg-amber-500/15 text-amber-400 rounded-xl">
          <Snowflake className="w-5 h-5 animate-spin-slow" />
        </div>
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            The Snowball Velocity Effect
            <span className="bg-amber-500/20 text-amber-300 text-[11px] font-extrabold px-2 py-0.5 rounded-full border border-amber-500/40">
              {snowballFactor}x Acceleration
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Why deferring allowance compounds exponentially over time
          </p>
        </div>
      </div>

      {/* Month 1 vs Final Month Comparison cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        {/* Month 1 */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold uppercase tracking-wider">Month 1 (Day 30)</span>
            <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded">Deposit: {formatCurrency(firstMonth.addedAllowance, currency)}</span>
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <div>
              <span className="text-xs text-slate-400 block">Monthly Interest Earned</span>
              <span className="text-2xl font-black text-slate-200 font-mono">
                {formatCurrencyExact(firstMonth.interestEarned, currency)}
              </span>
            </div>
            <span className="text-xs font-semibold text-slate-400 bg-slate-800/80 px-2 py-1 rounded-lg">
              Seed Stage
            </span>
          </div>
        </div>

        {/* Final Month */}
        <div className="bg-gradient-to-br from-indigo-900/40 to-slate-900/90 border border-indigo-500/40 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-indigo-300 mb-2">
            <span className="font-semibold uppercase tracking-wider">Month {lastMonth.month} (Compounded)</span>
            <span className="bg-indigo-900/60 text-indigo-200 px-2 py-0.5 rounded border border-indigo-700/50">
              Same Deposit: {formatCurrency(lastMonth.addedAllowance, currency)}
            </span>
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <div>
              <span className="text-xs text-indigo-300 block">Monthly Interest Earned</span>
              <span className="text-2xl font-black text-emerald-400 font-mono">
                {formatCurrencyExact(lastMonth.interestEarned, currency)}
              </span>
            </div>
            <div className="flex items-center gap-1 bg-emerald-500/20 text-emerald-300 text-xs font-extrabold px-2.5 py-1 rounded-lg border border-emerald-500/40">
              <Flame className="w-3.5 h-3.5 text-emerald-400" />
              <span>{snowballFactor}x Higher!</span>
            </div>
          </div>
        </div>
      </div>

      {/* The Core Lesson Insight Box */}
      <div className="bg-slate-900/90 border border-indigo-500/30 rounded-2xl p-4 flex items-start gap-3">
        <div className="p-2 bg-indigo-500/20 text-indigo-300 rounded-lg shrink-0 mt-0.5">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="text-xs leading-relaxed text-slate-300">
          <span className="font-bold text-white">The Core Lesson: </span>
          Even though the monthly deposit of{' '}
          <strong className="text-indigo-300">{formatCurrency(lastMonth.addedAllowance, currency)}</strong> is identical in both months, your interest in Month {lastMonth.month} is{' '}
          <strong className="text-emerald-400">nearly {snowballFactor} times higher</strong> than Month 1.
          Your money has started working for you, earning money on top of money previously earned. That is the compounding snowball.
        </div>
      </div>
    </div>
  );
};
