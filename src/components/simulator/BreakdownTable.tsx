import React from 'react';
import type { MonthlyBreakdown, CurrencyConfig } from '../../types/allowance';
import { formatCurrencyExact } from '../../config/currencies';
import { Table } from 'lucide-react';

interface BreakdownTableProps {
  breakdown: MonthlyBreakdown[];
  currency: CurrencyConfig;
  annualRate: number;
  completionBonus: number;
  finalTotal: number;
}

export const BreakdownTable: React.FC<BreakdownTableProps> = ({
  breakdown,
  currency,
  annualRate,
  completionBonus,
  finalTotal,
}) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl">
            <Table className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Monthly Compounding Schedule</h2>
            <p className="text-xs text-slate-400">
              Detailed step-by-step balance & interest ledger ({annualRate}% p.a.)
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-800/80 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-3 px-3 rounded-l-xl">Month</th>
              <th className="py-3 px-3">Starting Balance</th>
              <th className="py-3 px-3">Added Allowance</th>
              <th className="py-3 px-3 text-indigo-400">Interest Earned</th>
              <th className="py-3 px-3 text-emerald-400">Parent Match</th>
              <th className="py-3 px-3 text-right">Ending Balance</th>
              <th className="py-3 px-3 text-right text-slate-400 rounded-r-xl">Bank (3%)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {breakdown.map((item) => (
              <tr key={item.month} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3 px-3 font-bold text-white font-sans">
                  Month {item.month}
                </td>
                <td className="py-3 px-3 text-slate-400">
                  {formatCurrencyExact(item.startingBalance, currency)}
                </td>
                <td className="py-3 px-3 text-slate-200">
                  {formatCurrencyExact(item.addedAllowance, currency)}
                </td>
                <td className="py-3 px-3 text-indigo-300 font-semibold">
                  +{formatCurrencyExact(item.interestEarned, currency)}
                </td>
                <td className="py-3 px-3 text-emerald-400 font-semibold">
                  +{formatCurrencyExact(item.parentInterestMatch, currency)}
                </td>
                <td className="py-3 px-3 text-right font-bold text-white">
                  {formatCurrencyExact(item.endingBalance, currency)}
                </td>
                <td className="py-3 px-3 text-right text-slate-500">
                  {formatCurrencyExact(item.standardBankEndingBalance, currency)}
                </td>
              </tr>
            ))}

            {/* Completion Bonus Row if applicable */}
            {completionBonus > 0 && (
              <tr className="bg-amber-500/10 border-t-2 border-amber-500/30 text-amber-300 font-bold">
                <td colSpan={3} className="py-3 px-3 font-sans">
                  ⭐ Milestone Completion Bonus Kicker
                </td>
                <td colSpan={2} className="py-3 px-3 text-amber-300">
                  +{formatCurrencyExact(completionBonus, currency)}
                </td>
                <td colSpan={2} className="py-3 px-3 text-right font-black text-amber-300">
                  {formatCurrencyExact(finalTotal, currency)}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
