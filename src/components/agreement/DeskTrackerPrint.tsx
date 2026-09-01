import React from 'react';
import type { MonthlyBreakdown, CurrencyConfig } from '../../types/allowance';
import { formatCurrency, formatCurrencyExact } from '../../config/currencies';
import { Sparkles } from 'lucide-react';

interface DeskTrackerPrintProps {
  breakdown: MonthlyBreakdown[];
  currency: CurrencyConfig;
  teenName: string;
}

export const DeskTrackerPrint: React.FC<DeskTrackerPrintProps> = ({
  breakdown,
  currency,
  teenName,
}) => {
  return (
    <div className="printable-document bg-white text-slate-900 rounded-3xl p-8 sm:p-12 shadow-2xl border border-slate-200 max-w-4xl mx-auto space-y-6 mt-8 font-sans">
      <div className="flex justify-between items-center border-b-2 border-slate-900 pb-4">
        <div>
          <h2 className="text-xl font-black uppercase text-slate-900 tracking-tight">
            {teenName}'s Physical Desk Compounding Tracker
          </h2>
          <p className="text-xs text-slate-600 font-medium">
            Hang on your wall or desk • Check off each monthly milestone as you level up
          </p>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-mono uppercase bg-slate-900 text-white px-2.5 py-1 rounded font-bold">
            Physical Ledger
          </span>
        </div>
      </div>

      <div className="border border-slate-300 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
            <tr>
              <th className="py-2.5 px-3">Done</th>
              <th className="py-2.5 px-3">Month</th>
              <th className="py-2.5 px-3">Deposit</th>
              <th className="py-2.5 px-3 text-indigo-700">Interest Added</th>
              <th className="py-2.5 px-3 text-right">Account Balance</th>
              <th className="py-2.5 px-3 text-center">Parent Initials</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 font-mono">
            {breakdown.map((row) => (
              <tr key={row.month} className="hover:bg-slate-50">
                <td className="py-2.5 px-3 font-sans">
                  <div className="w-4 h-4 border-2 border-slate-400 rounded flex items-center justify-center">
                    {/* Blank checkbox for physical pencil check-off */}
                  </div>
                </td>
                <td className="py-2.5 px-3 font-sans font-bold text-slate-900">
                  Month {row.month}
                </td>
                <td className="py-2.5 px-3 text-slate-700">
                  {formatCurrency(row.addedAllowance, currency)}
                </td>
                <td className="py-2.5 px-3 font-bold text-indigo-700">
                  +{formatCurrencyExact(row.interestEarned, currency)}
                </td>
                <td className="py-2.5 px-3 text-right font-black text-slate-900">
                  {formatCurrencyExact(row.endingBalance, currency)}
                </td>
                <td className="py-2.5 px-3 text-center text-slate-300 font-serif italic">
                  [ ____ ]
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Motivational Milestone Footer */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between text-xs text-slate-700">
        <div className="flex items-center gap-2 font-bold text-slate-900">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Every checkmark is proof of patience, compounding, and delayed gratification!</span>
        </div>
        <span className="font-mono text-slate-500 text-[10px]">Bank of Mom & Dad</span>
      </div>
    </div>
  );
};
