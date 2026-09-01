import React from 'react';
import type { SimulationParams, CurrencyConfig } from '../../types/allowance';
import { Sliders, RotateCcw, Zap, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '../../config/currencies';

interface SimulatorControlsProps {
  params: SimulationParams;
  onUpdateParam: <K extends keyof SimulationParams>(key: K, value: SimulationParams[K]) => void;
  onApplyTier: (tier: 1 | 2 | 3) => void;
  onReset: () => void;
  onActivatePlan: () => void;
  isPlanActive?: boolean;
  teenName?: string;
  currency: CurrencyConfig;
}

export const SimulatorControls: React.FC<SimulatorControlsProps> = ({
  params,
  onUpdateParam,
  onApplyTier,
  onReset,
  onActivatePlan,
  isPlanActive = false,
  teenName = 'Akshat',
  currency,
}) => {
  const deferredAmount = (params.monthlyAllowance * params.deferralPercentage) / 100;
  const liquidAmount = params.monthlyAllowance - deferredAmount;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Rule Parameters</h2>
            <p className="text-xs text-slate-400">Custom Bank of Mom & Dad Yield Engine</p>
          </div>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Quick Tier Preset Buttons */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>Quick Challenge Presets</span>
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => onApplyTier(1)}
            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              params.termMonths === 3 && params.annualInterestRate === 10
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-sm ring-1 ring-amber-500/40'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500 hover:bg-slate-750'
            }`}
          >
            3-Mo Sprint (10%)
          </button>
          <button
            type="button"
            onClick={() => onApplyTier(2)}
            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              params.termMonths === 6 && params.annualInterestRate === 12
                ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300 shadow-sm ring-1 ring-indigo-500/40'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500 hover:bg-slate-750'
            }`}
          >
            6-Mo Marathon (12%)
          </button>
          <button
            type="button"
            onClick={() => onApplyTier(3)}
            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              params.termMonths === 12 && params.annualInterestRate === 15
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-sm ring-1 ring-emerald-500/40'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500 hover:bg-slate-750'
            }`}
          >
            Graduate 12-Mo (15%)
          </button>
        </div>
      </div>

      {/* Monthly Allowance Slider */}
      <div className="space-y-2">
        <div className="flex justify-between items-baseline">
          <label className="text-xs font-medium text-slate-300">Base Monthly Allowance</label>
          <span className="text-sm font-bold font-mono text-white bg-slate-800 px-2.5 py-0.5 rounded-lg border border-slate-700">
            {formatCurrency(params.monthlyAllowance, currency)}
          </span>
        </div>
        <input
          type="range"
          min={500}
          max={10000}
          step={250}
          value={params.monthlyAllowance}
          onChange={(e) => onUpdateParam('monthlyAllowance', Number(e.target.value))}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
        />
      </div>

      {/* Deferral Percentage Slider */}
      <div className="space-y-2">
        <div className="flex justify-between items-baseline">
          <label className="text-xs font-medium text-slate-300">Deferral Window Lock %</label>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-emerald-400 font-semibold">
              Save: {formatCurrency(deferredAmount, currency)}
            </span>
            <span className="text-xs text-slate-500">|</span>
            <span className="text-xs text-slate-400">
              Pocket: {formatCurrency(liquidAmount, currency)}
            </span>
            <span className="text-sm font-bold font-mono text-white bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-700">
              {params.deferralPercentage}%
            </span>
          </div>
        </div>
        <input
          type="range"
          min={10}
          max={100}
          step={5}
          value={params.deferralPercentage}
          onChange={(e) => onUpdateParam('deferralPercentage', Number(e.target.value))}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
        />
      </div>

      {/* Bank of Dad Annual Yield Rate */}
      <div className="space-y-2">
        <div className="flex justify-between items-baseline">
          <div>
            <label className="text-xs font-medium text-slate-300">"Bank of Dad" Annual Rate</label>
            <span className="block text-[11px] text-indigo-400 font-medium">Compounded Monthly</span>
          </div>
          <span className="text-sm font-bold font-mono text-indigo-300 bg-indigo-950/60 px-2.5 py-0.5 rounded-lg border border-indigo-700/50">
            {params.annualInterestRate}% p.a.
          </span>
        </div>
        <input
          type="range"
          min={5}
          max={30}
          step={1}
          value={params.annualInterestRate}
          onChange={(e) => onUpdateParam('annualInterestRate', Number(e.target.value))}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
        />
      </div>

      {/* Term Length (Months) */}
      <div className="space-y-2">
        <div className="flex justify-between items-baseline">
          <label className="text-xs font-medium text-slate-300">Lock-in Deferral Duration</label>
          <span className="text-sm font-bold font-mono text-white bg-slate-800 px-2.5 py-0.5 rounded-lg border border-slate-700">
            {params.termMonths} Months
          </span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[3, 6, 12, 24].map((months) => (
            <button
              key={months}
              type="button"
              onClick={() => onUpdateParam('termMonths', months)}
              className={`py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                params.termMonths === months
                  ? 'bg-indigo-600 border-indigo-400 text-white shadow-md'
                  : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {months} Mo
            </button>
          ))}
        </div>
      </div>

      {/* Milestone Completion Bonus Kicker */}
      <div className="space-y-2">
        <div className="flex justify-between items-baseline">
          <div>
            <label className="text-xs font-medium text-slate-300">Milestone Completion Kicker</label>
            <span className="block text-[11px] text-amber-400 font-medium">Lump-sum bonus on term end</span>
          </div>
          <span className="text-sm font-bold font-mono text-amber-300 bg-amber-950/60 px-2.5 py-0.5 rounded-lg border border-amber-700/50">
            +{params.completionBonusPercentage}%
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={40}
          step={5}
          value={params.completionBonusPercentage}
          onChange={(e) => onUpdateParam('completionBonusPercentage', Number(e.target.value))}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
        />
      </div>

      {/* Parent Match Multiplier on Interest */}
      <div className="space-y-2">
        <div className="flex justify-between items-baseline">
          <div>
            <label className="text-xs font-medium text-slate-300">Parent Interest Match</label>
            <span className="block text-[11px] text-emerald-400 font-medium">Match whatever his money made</span>
          </div>
          <span className="text-sm font-bold font-mono text-emerald-300 bg-emerald-950/60 px-2.5 py-0.5 rounded-lg border border-emerald-700/50">
            {params.parentInterestMatchMultiplier * 100}%
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { val: 0, label: '0% (Standard)' },
            { val: 0.5, label: '50% Match' },
            { val: 1.0, label: '100% (Double)' },
          ].map((item) => (
            <button
              key={item.val}
              type="button"
              onClick={() => onUpdateParam('parentInterestMatchMultiplier', item.val)}
              className={`py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                params.parentInterestMatchMultiplier === item.val
                  ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300 font-bold'
                  : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:bg-slate-750'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Direct 1-Click Plan Activation Button */}
      <div className="pt-3 border-t border-slate-800 space-y-2">
        <button
          type="button"
          onClick={onActivatePlan}
          className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xs rounded-2xl shadow-xl shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
        >
          <ShieldCheck className="w-4 h-4 text-amber-300" />
          <span>
            {isPlanActive
              ? `Update & Re-Lock Plan for ${teenName}`
              : `🚀 Activate Plan for ${teenName} with these Rules`}
          </span>
        </button>
        {isPlanActive && (
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-emerald-400 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Active Plan Locked In ({params.termMonths} Mo @ {params.annualInterestRate}% p.a.)</span>
          </div>
        )}
      </div>
    </div>
  );
};
