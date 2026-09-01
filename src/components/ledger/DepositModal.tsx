import React from 'react';
import type { ActivePlanLedger, CurrencyConfig } from '../../types/allowance';
import { formatCurrency, formatCurrencyExact } from '../../config/currencies';
import { X, PlusCircle, Sparkles, ShieldCheck } from 'lucide-react';

interface DepositModalProps {
  isOpen: boolean;
  plan: ActivePlanLedger | null;
  currency: CurrencyConfig;
  onClose: () => void;
  onConfirmDeposit: () => void;
}

export const DepositModal: React.FC<DepositModalProps> = ({
  isOpen,
  plan,
  currency,
  onClose,
  onConfirmDeposit,
}) => {
  if (!isOpen || !plan) return null;

  const currentDepositsCount = plan.transactions.filter((t) => t.type === 'DEPOSIT').length;
  const nextMonthIndex = currentDepositsCount + 1;
  const monthlyDepositPrincipal = (plan.monthlyAllowance * plan.deferralPercentage) / 100;
  const balanceBeforeInterest = plan.currentBalance + monthlyDepositPrincipal;
  const monthlyRate = plan.annualInterestRate / 100 / 12;
  const projectedInterest = balanceBeforeInterest * monthlyRate;
  const projectedParentMatch = projectedInterest * plan.parentInterestMatchMultiplier;
  const newProjectedBalance = balanceBeforeInterest + projectedInterest + projectedParentMatch;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-750 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/15 text-emerald-400 rounded-xl">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Record Month {nextMonthIndex} Deposit</h3>
              <p className="text-xs text-slate-400">Bank of Dad Allowance Cycle</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/60 space-y-3 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Starting Balance:</span>
            <span className="font-mono font-bold text-slate-200">
              {formatCurrencyExact(plan.currentBalance, currency)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400">Monthly Deferred Allowance:</span>
            <span className="font-mono font-bold text-emerald-400">
              +{formatCurrency(monthlyDepositPrincipal, currency)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400">Compounding Interest Credit:</span>
            <span className="font-mono font-bold text-indigo-300">
              +{formatCurrencyExact(projectedInterest, currency)}
            </span>
          </div>

          {projectedParentMatch > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Parent 100% Interest Match:</span>
              <span className="font-mono font-bold text-amber-300">
                +{formatCurrencyExact(projectedParentMatch, currency)}
              </span>
            </div>
          )}

          <div className="pt-2 border-t border-slate-700 flex justify-between items-center text-sm font-bold">
            <span className="text-white">New Account Balance:</span>
            <span className="font-mono text-emerald-400">
              {formatCurrencyExact(newProjectedBalance, currency)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-400 bg-indigo-950/40 border border-indigo-500/20 p-3 rounded-xl">
          <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>
            Locking in this deposit reinforces delayed gratification and earns immediate compounding yield.
          </span>
        </div>

        <div className="flex gap-2.5">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirmDeposit();
              onClose();
            }}
            className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Confirm & Credit</span>
          </button>
        </div>
      </div>
    </div>
  );
};
