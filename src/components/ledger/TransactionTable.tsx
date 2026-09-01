import React from 'react';
import type { LedgerTransaction, CurrencyConfig } from '../../types/allowance';
import { formatCurrencyExact } from '../../config/currencies';
import { ArrowDownLeft, TrendingUp, Gift, AlertOctagon, CheckCircle2 } from 'lucide-react';

interface TransactionTableProps {
  transactions: LedgerTransaction[];
  currency: CurrencyConfig;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({ transactions, currency }) => {
  const getIcon = (type: LedgerTransaction['type']) => {
    switch (type) {
      case 'DEPOSIT':
        return <ArrowDownLeft className="w-4 h-4 text-emerald-400" />;
      case 'INTEREST_CREDIT':
        return <TrendingUp className="w-4 h-4 text-indigo-400" />;
      case 'BONUS_MATCH':
        return <Gift className="w-4 h-4 text-amber-400" />;
      case 'EARLY_WITHDRAWAL':
        return <AlertOctagon className="w-4 h-4 text-rose-400" />;
      case 'TERM_PAYOUT':
        return <CheckCircle2 className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-bold text-white">Live Transaction Audit Log</h3>
          <p className="text-xs text-slate-400">Timestamped record of deposits and compounding credits</p>
        </div>
        <span className="text-xs font-mono text-slate-500">{transactions.length} Entries</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-800/80 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-3 px-3 rounded-l-xl">Type</th>
              <th className="py-3 px-3">Date</th>
              <th className="py-3 px-3">Description</th>
              <th className="py-3 px-3 text-right">Amount</th>
              <th className="py-3 px-3 text-right rounded-r-xl">Balance After</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {transactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-slate-800 rounded-lg">{getIcon(tx.type)}</div>
                    <span className="font-sans font-semibold text-white">{tx.type}</span>
                  </div>
                </td>
                <td className="py-3 px-3 text-slate-400 font-sans text-[11px]">
                  {new Date(tx.date).toLocaleDateString()}
                </td>
                <td className="py-3 px-3 text-slate-300 font-sans max-w-xs truncate">
                  {tx.notes}
                </td>
                <td className={`py-3 px-3 text-right font-bold ${
                  tx.type === 'EARLY_WITHDRAWAL' ? 'text-rose-400' : 'text-emerald-400'
                }`}>
                  {tx.type === 'EARLY_WITHDRAWAL' ? '-' : '+'}
                  {formatCurrencyExact(tx.amount, currency)}
                </td>
                <td className="py-3 px-3 text-right font-black text-white">
                  {formatCurrencyExact(tx.balanceAfter, currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
