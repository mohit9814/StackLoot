import React from 'react';
import type { ActivePlanLedger, CurrencyConfig } from '../../types/allowance';
import { formatCurrency, formatCurrencyExact } from '../../config/currencies';
import { Wallet, PlusCircle, AlertTriangle, RotateCcw, Sparkles, History } from 'lucide-react';

interface LedgerSummaryProps {
  plan: ActivePlanLedger | null;
  currency: CurrencyConfig;
  onOpenDepositModal: () => void;
  onOpenEscapeHatchModal: () => void;
  onStartNewPlan: () => void;
  onOpenBacklogModal: () => void;
  onResetLedger: () => void;
}

export const LedgerSummary: React.FC<LedgerSummaryProps> = ({
  plan,
  currency,
  onOpenDepositModal,
  onOpenEscapeHatchModal,
  onStartNewPlan,
  onOpenBacklogModal,
  onResetLedger,
}) => {
  if (!plan) {
    return (
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 text-center space-y-5 shadow-xl">
        <div className="w-16 h-16 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center mx-auto ring-1 ring-indigo-500/20">
          <Wallet className="w-8 h-8" />
        </div>
        <div className="max-w-md mx-auto space-y-1">
          <h3 className="text-xl font-bold text-white">No Active Ledger Session</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Start fresh from Month 1, or backdate past months to calculate backlog allowance and retroactive compound interest!
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={onStartNewPlan}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-500/20 transition-all cursor-pointer"
          >
            Start Fresh (Month 1)
          </button>
          <button
            onClick={onOpenBacklogModal}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-amber-600 to-indigo-600 hover:from-amber-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <History className="w-4 h-4 text-amber-200" />
            <span>Set Up Backlog & Past Interest</span>
          </button>
        </div>
      </div>
    );
  }

  const completedMonths = plan.transactions.filter((t) => t.type === 'DEPOSIT').length;
  const progressPercent = Math.min(100, Math.round((completedMonths / plan.targetTermMonths) * 100));

  const statusColors = {
    ACTIVE: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    COMPLETED: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    EARLY_WITHDRAWN: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  }[plan.status];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
      {/* Plan Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg font-extrabold text-white">
              {plan.teenName}'s Savings Account
            </h2>
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${statusColors}`}>
              {plan.status === 'ACTIVE' ? 'Active Term' : plan.status === 'COMPLETED' ? 'Term Completed 🎉' : 'Early Withdrawn'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Sponsored by <strong className="text-slate-300">{plan.parentName}</strong> • Started {new Date(plan.startDate).toLocaleDateString()}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {plan.status === 'ACTIVE' && (
            <>
              <button
                onClick={onOpenDepositModal}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Deposit Month {completedMonths + 1}</span>
              </button>
              <button
                onClick={onOpenBacklogModal}
                title="Adjust backlog or backdate past months"
                className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 hover:border-amber-500/40 font-semibold text-xs px-3 py-2 rounded-xl transition-colors cursor-pointer"
              >
                <History className="w-3.5 h-3.5" />
                <span>Backlog Catch-Up</span>
              </button>
              <button
                onClick={onOpenEscapeHatchModal}
                className="flex items-center gap-1.5 bg-slate-800 hover:bg-amber-950/40 text-slate-400 hover:text-amber-300 border border-slate-700 hover:border-amber-700/50 font-semibold text-xs px-3 py-2 rounded-xl transition-colors cursor-pointer"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Escape Hatch</span>
              </button>
            </>
          )}
          <button
            onClick={onResetLedger}
            title="Clear and reset ledger"
            className="p-2 text-slate-500 hover:text-slate-300 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress & Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-slate-800/60 border border-slate-750 rounded-2xl p-4">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
            Current Balance
          </span>
          <span className="text-2xl font-black text-white font-mono">
            {formatCurrency(plan.currentBalance, currency)}
          </span>
          <span className="text-[11px] text-emerald-400 block mt-1 font-medium">
            Compound Base
          </span>
        </div>

        <div className="bg-slate-800/60 border border-slate-750 rounded-2xl p-4">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
            Principal Saved
          </span>
          <span className="text-2xl font-black text-slate-300 font-mono">
            {formatCurrency(plan.totalPrincipalContributed, currency)}
          </span>
          <span className="text-[11px] text-slate-400 block mt-1">
            {plan.deferralPercentage}% Deferral
          </span>
        </div>

        <div className="bg-slate-800/60 border border-slate-750 rounded-2xl p-4">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
            Interest Accrued
          </span>
          <span className="text-2xl font-black text-indigo-300 font-mono">
            +{formatCurrencyExact(plan.totalInterestEarned, currency)}
          </span>
          <span className="text-[11px] text-indigo-400 block mt-1 font-semibold">
            {plan.annualInterestRate}% p.a.
          </span>
        </div>

        <div className="bg-slate-800/60 border border-slate-750 rounded-2xl p-4">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
            Parent Match & Bonus
          </span>
          <span className="text-2xl font-black text-amber-300 font-mono">
            +{formatCurrency(plan.totalBonusesEarned, currency)}
          </span>
          <span className="text-[11px] text-amber-400 block mt-1 font-medium">
            Incentive Kicker
          </span>
        </div>
      </div>

      {/* Term Progress Bar */}
      <div className="bg-slate-850 rounded-2xl p-4 border border-slate-750 space-y-2">
        <div className="flex justify-between text-xs">
          <span className="font-semibold text-slate-300">
            Term Progress: {completedMonths} of {plan.targetTermMonths} Months Completed
          </span>
          <span className="font-bold font-mono text-indigo-400">{progressPercent}%</span>
        </div>
        <div className="w-full bg-slate-700/80 h-3 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        {plan.selectedPerk && (
          <div className="flex items-center gap-1.5 text-xs text-amber-300 font-medium pt-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Target Perk Reward: {plan.selectedPerk}</span>
          </div>
        )}
      </div>
    </div>
  );
};
