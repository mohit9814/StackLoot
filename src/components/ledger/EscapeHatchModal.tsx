import React from 'react';
import type { ActivePlanLedger, CurrencyConfig } from '../../types/allowance';
import { formatCurrency, formatCurrencyExact } from '../../config/currencies';
import { calculateEarlyWithdrawal } from '../../services/compoundEngine';
import { X, AlertTriangle, ShieldAlert } from 'lucide-react';

interface EscapeHatchModalProps {
  isOpen: boolean;
  plan: ActivePlanLedger | null;
  currency: CurrencyConfig;
  onClose: () => void;
  onConfirmWithdrawal: () => void;
}

export const EscapeHatchModal: React.FC<EscapeHatchModalProps> = ({
  isOpen,
  plan,
  currency,
  onClose,
  onConfirmWithdrawal,
}) => {
  if (!isOpen || !plan) return null;

  const totalGains = plan.totalInterestEarned + plan.totalBonusesEarned;
  const penalty = calculateEarlyWithdrawal(plan.currentBalance, plan.totalPrincipalContributed, totalGains);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-amber-500/40 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/15 text-amber-400 rounded-xl">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Liquidity Escape Hatch</h3>
              <p className="text-xs text-slate-400">Early Withdrawal & Penalty Terms</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Lesson context */}
        <div className="bg-amber-950/30 border border-amber-500/30 rounded-2xl p-4 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-200 leading-relaxed">
            <strong>The Financial Rule:</strong> You are 100% safe to withdraw your original money anytime. However, breaking the lock early forfeits all accrued interest and completion bonuses.
          </p>
        </div>

        {/* Penalty breakdown comparison */}
        <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/60 space-y-2.5 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Total Account Balance:</span>
            <span className="font-mono font-bold text-slate-200">
              {formatCurrencyExact(plan.currentBalance, currency)}
            </span>
          </div>

          <div className="flex justify-between items-center text-rose-400 font-semibold">
            <span>Interest & Bonuses Forfeited:</span>
            <span className="font-mono">
              -{formatCurrencyExact(penalty.interestForfeited, currency)}
            </span>
          </div>

          <div className="pt-2 border-t border-slate-700 flex justify-between items-center text-sm font-bold">
            <span className="text-white">Net Payout to Teen (Principal):</span>
            <span className="font-mono text-emerald-400">
              {formatCurrency(penalty.netPayout, currency)}
            </span>
          </div>
        </div>

        <div className="flex gap-2.5">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
          >
            Keep Compounding (Cancel)
          </button>
          <button
            onClick={() => {
              onConfirmWithdrawal();
              onClose();
            }}
            className="px-4 py-2.5 bg-rose-600/80 hover:bg-rose-600 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Confirm Withdrawal
          </button>
        </div>
      </div>
    </div>
  );
};
