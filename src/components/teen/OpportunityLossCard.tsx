import React, { useState } from 'react';
import type { CurrencyConfig, SimulationParams } from '../../types/allowance';
import { formatCurrency, formatCurrencyExact } from '../../config/currencies';
import { calculateOpportunityLoss } from '../../services/compoundEngine';
import { AlertCircle, TrendingDown, Sparkles, CheckCircle2, XCircle, Info } from 'lucide-react';

interface OpportunityLossCardProps {
  params: SimulationParams;
  currency: CurrencyConfig;
  teenName: string;
  isPlanActive?: boolean;
}

export const OpportunityLossCard: React.FC<OpportunityLossCardProps> = ({
  params,
  currency,
  teenName,
  isPlanActive = false,
}) => {
  const [selectedHorizon, setSelectedHorizon] = useState<'6M' | '1Y'>('6M');

  const report = calculateOpportunityLoss(
    params.monthlyAllowance,
    params.deferralPercentage,
    params.annualInterestRate,
    params.parentInterestMatchMultiplier,
    params.completionBonusPercentage,
    params.initialLumpSumDeposit || 0
  );

  const activeData = selectedHorizon === '6M' ? report.sixMonths : report.oneYear;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6">
      {/* Disclaimer if plan not active yet */}
      {!isPlanActive && (
        <div className="bg-rose-950/40 border border-rose-500/30 rounded-2xl p-4 flex items-center gap-3 text-xs text-rose-200">
          <Info className="w-5 h-5 text-rose-400 shrink-0" />
          <div>
            <strong className="text-white">Template Opportunity Cost:</strong> Displays projected free yield based on standard terms. Once Dad launches your plan in Parent Mode, this will reflect your exact active allowance.
          </div>
        </div>
      )}

      {/* Header with Horizon Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-rose-500/15 text-rose-400 rounded-xl">
              <TrendingDown className="w-4 h-4" />
            </span>
            <h3 className="text-base font-extrabold text-white">The Cost of Not Compounding</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            See exactly how much free money {teenName} leaves on the table by keeping cash vs compounding.
          </p>
        </div>

        {/* 6 Month vs 1 Year Switcher */}
        <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700 shrink-0">
          <button
            onClick={() => setSelectedHorizon('6M')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedHorizon === '6M'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            6-Month Loss
          </button>
          <button
            onClick={() => setSelectedHorizon('1Y')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedHorizon === '1Y'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            1-Year Loss
          </button>
        </div>
      </div>

      {/* Hero Callout: Money Left on Table */}
      <div className="bg-gradient-to-br from-rose-950/40 via-slate-900 to-amber-950/30 border border-rose-500/30 rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="space-y-1 text-center md:text-left">
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-300 flex items-center gap-1.5 justify-center md:justify-start">
            <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
            <span>Compounding Bonus Left on the Table ({activeData.termMonths} Months)</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white font-mono">
            +{formatCurrencyExact(activeData.compoundingYieldLost, currency)}
          </h2>
          <p className="text-xs text-slate-300">
            Extra profit created out of thin air by Dad's yield, parent match, and completion kicker!
          </p>
        </div>

        <div className="bg-rose-950/60 border border-rose-500/40 rounded-2xl p-4 text-center shrink-0 w-full md:w-auto">
          <span className="text-[10px] font-bold uppercase text-rose-300 block">Bonus Multiplier</span>
          <span className="text-2xl font-black text-rose-400 font-mono">
            +{activeData.percentGainOverPiggyBank}%
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">more wealth than cash</span>
        </div>
      </div>

      {/* 3-Way Scenario Contrast Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Scenario 1: Bank of Dad Compounding (WIN) */}
        <div className="bg-gradient-to-b from-indigo-950/40 to-slate-900 border-2 border-emerald-500/50 rounded-2xl p-4 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Bank of Dad Plan</span>
            </span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full">
              MAX WEALTH
            </span>
          </div>

          <div>
            <span className="text-2xl font-black text-white font-mono block">
              {formatCurrency(activeData.compoundedTotal, currency)}
            </span>
            <span className="text-[11px] text-emerald-400 font-semibold">
              Principal + Yield + Match + Kicker
            </span>
          </div>

          <div className="text-[11px] text-slate-300 space-y-1 pt-2 border-t border-slate-800">
            <p>• Principal: {formatCurrency(activeData.cashPiggyBankTotal, currency)}</p>
            <p className="text-emerald-400 font-bold">
              • Pure Gains: +{formatCurrencyExact(activeData.compoundingYieldLost, currency)}
            </p>
          </div>
        </div>

        {/* Scenario 2: Piggy Bank Cash (0% Compound) */}
        <div className="bg-slate-850 border border-slate-750 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1">
              <span>🐷 Piggy Bank (Cash)</span>
            </span>
            <span className="text-[10px] bg-slate-700 text-slate-400 font-bold px-2 py-0.5 rounded-full">
              0% YIELD
            </span>
          </div>

          <div>
            <span className="text-2xl font-black text-slate-300 font-mono block">
              {formatCurrency(activeData.cashPiggyBankTotal, currency)}
            </span>
            <span className="text-[11px] text-slate-400">
              Only what you deposited
            </span>
          </div>

          <div className="text-[11px] text-rose-400 space-y-1 pt-2 border-t border-slate-750 font-semibold">
            <p>• Yield Earned: ₹0</p>
            <p>• You Lost: -{formatCurrencyExact(activeData.compoundingYieldLost, currency)} in potential bonuses</p>
          </div>
        </div>

        {/* Scenario 3: Instant Gratification (100% Spent) */}
        <div className="bg-slate-850 border border-rose-500/30 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-400 flex items-center gap-1">
              <XCircle className="w-3.5 h-3.5" />
              <span>Spend Everything</span>
            </span>
            <span className="text-[10px] bg-rose-500/20 text-rose-300 font-bold px-2 py-0.5 rounded-full">
              TOTAL LOSS
            </span>
          </div>

          <div>
            <span className="text-2xl font-black text-rose-400 font-mono block">
              {formatCurrency(0, currency)}
            </span>
            <span className="text-[11px] text-rose-300/80">
              All allowance spent on impulse
            </span>
          </div>

          <div className="text-[11px] text-slate-400 space-y-1 pt-2 border-t border-slate-750">
            <p>• Zero savings accumulated</p>
            <p className="text-rose-400 font-bold">
              • Lost Wealth: -{formatCurrency(activeData.totalWealthLostIfSpent, currency)}
            </p>
          </div>
        </div>
      </div>

      {/* Tangible Real-World Loss Insight */}
      <div className="bg-slate-800/60 border border-slate-750 rounded-2xl p-4 flex items-center gap-3 text-xs text-slate-300">
        <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
        <div>
          <strong className="text-white">Why Delayed Gratification Wins:</strong> In {activeData.termMonths} months, the <strong>+{formatCurrencyExact(activeData.compoundingYieldLost, currency)}</strong> you earn for free is enough to buy premium headphones, a brand new video game, or concert tickets without spending a single rupee of your own pocket!
        </div>
      </div>
    </div>
  );
};
