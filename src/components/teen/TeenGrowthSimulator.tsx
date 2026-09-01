import React, { useState } from 'react';
import type { CurrencyConfig, SimulationParams, SimulationResult } from '../../types/allowance';
import { formatCurrency, formatCurrencyExact } from '../../config/currencies';
import { GrowthChart } from '../simulator/GrowthChart';
import {
  Zap,
  Award,
  Sparkles,
  ShieldCheck,
  Flame,
  Snowflake,
  Info,
} from 'lucide-react';

interface TeenGrowthSimulatorProps {
  params: SimulationParams;
  simulation: SimulationResult;
  currency: CurrencyConfig;
  teenName: string;
  isPlanActive?: boolean;
}

export const TeenGrowthSimulator: React.FC<TeenGrowthSimulatorProps> = ({
  params,
  simulation,
  currency,
  teenName,
  isPlanActive = false,
}) => {
  const [activeMonthStep, setActiveMonthStep] = useState<number>(params.termMonths);

  const selectedMonthData = simulation.breakdown.find((b) => b.month === activeMonthStep) || simulation.breakdown[simulation.breakdown.length - 1];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
      {/* Disclaimer if plan not active yet */}
      {!isPlanActive && (
        <div className="bg-indigo-950/60 border border-indigo-500/40 rounded-2xl p-4 flex items-center gap-3 text-xs text-indigo-200">
          <Info className="w-5 h-5 text-indigo-400 shrink-0" />
          <div>
            <strong className="text-white">Preview Simulation Model:</strong> This roadmap illustrates how your savings and bonuses will compound once Dad configures and launches your official plan in Parent Mode.
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-indigo-500/15 text-indigo-400 rounded-xl">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </span>
            <h3 className="text-base font-extrabold text-white">
              {teenName}'s Compounding & Acceleration Roadmap
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Governed by Dad's official yield rules: <strong className="text-indigo-300">{params.annualInterestRate}% p.a. monthly compound</strong> + <strong className="text-amber-300">{params.parentInterestMatchMultiplier * 100}% Parent Match</strong> + <strong className="text-emerald-300">+{params.completionBonusPercentage}% Milestone Kicker</strong>.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 text-xs font-mono text-emerald-400 font-bold shrink-0">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{isPlanActive ? 'Parent Rule Verified' : 'Standard Template'}</span>
        </div>
      </div>

      {/* 3 Accelerator Levers: How & When They Kick In */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Lever 1: Compounding Yield */}
        <div className="bg-gradient-to-br from-indigo-950/40 to-slate-850 border border-indigo-500/30 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-indigo-300 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-indigo-400" />
              <span>Lever 1: Monthly Yield</span>
            </span>
            <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-mono px-2 py-0.5 rounded-full font-bold">
              Kicks in: Every 30 Days
            </span>
          </div>
          <h4 className="text-lg font-black text-white font-mono">
            {params.annualInterestRate}% p.a. Compounded
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Interest is calculated every month on your full accumulated balance, so your interest begins earning its own interest!
          </p>
        </div>

        {/* Lever 2: Parent Match */}
        <div className="bg-gradient-to-br from-amber-950/40 to-slate-850 border border-amber-500/30 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-amber-300 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Lever 2: Parent Match</span>
            </span>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 font-mono px-2 py-0.5 rounded-full font-bold">
              Kicks in: Along with Interest
            </span>
          </div>
          <h4 className="text-lg font-black text-amber-300 font-mono">
            {params.parentInterestMatchMultiplier * 100}% Instant Double
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Dad doubles every single rupee of compounding interest your money generates as an incentive for not touching your funds.
          </p>
        </div>

        {/* Lever 3: Milestone Kicker */}
        <div className="bg-gradient-to-br from-emerald-950/40 to-slate-850 border border-emerald-500/30 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-emerald-300 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-emerald-400" />
              <span>Lever 3: Completion Kicker</span>
            </span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded-full font-bold">
              Kicks in: Month {params.termMonths} Finish
            </span>
          </div>
          <h4 className="text-lg font-black text-emerald-400 font-mono">
            +{params.completionBonusPercentage}% Lump Sum
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            A flat +{params.completionBonusPercentage}% bonus on your total principal saved ({formatCurrency(simulation.completionBonus, currency)}) credited upon reaching the goal line!
          </p>
        </div>
      </div>

      {/* Interactive Growth Trajectory Scrubber */}
      <div className="bg-slate-850 border border-slate-750 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="text-xs font-bold text-white flex items-center gap-1.5">
            <Snowflake className="w-4 h-4 text-indigo-400 animate-spin-slow" />
            <span>Interactive Month-by-Month Growth Scrubber</span>
          </span>
          <span className="text-xs font-mono text-indigo-300 bg-indigo-950/60 px-2.5 py-1 rounded-lg border border-indigo-500/30">
            Inspecting Month {activeMonthStep} of {params.termMonths}
          </span>
        </div>

        {/* Month Buttons */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {simulation.breakdown.map((row) => (
            <button
              key={row.month}
              type="button"
              onClick={() => setActiveMonthStep(row.month)}
              className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                activeMonthStep === row.month
                  ? 'bg-indigo-600 border-indigo-400 text-white shadow-md'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-750 hover:text-slate-200'
              }`}
            >
              Month {row.month}
            </button>
          ))}
        </div>

        {/* Selected Month Spotlight */}
        {selectedMonthData && (
          <div className="bg-slate-900 border border-indigo-500/30 rounded-xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div>
              <span className="text-[10px] uppercase text-slate-400 block font-semibold">Deposit Added</span>
              <span className="text-sm font-bold text-white font-mono">
                {formatCurrency(selectedMonthData.addedAllowance, currency)}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-indigo-300 block font-semibold">Monthly Interest</span>
              <span className="text-sm font-bold text-emerald-400 font-mono">
                +{formatCurrencyExact(selectedMonthData.interestEarned, currency)}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-amber-300 block font-semibold">Parent Match</span>
              <span className="text-sm font-bold text-amber-300 font-mono">
                +{formatCurrencyExact(selectedMonthData.parentInterestMatch, currency)}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-slate-300 block font-semibold">Accumulated Vault</span>
              <span className="text-sm font-black text-indigo-300 font-mono">
                {formatCurrencyExact(selectedMonthData.endingBalance, currency)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Visual Chart Comparison */}
      <GrowthChart
        breakdown={simulation.breakdown}
        currency={currency}
      />
    </div>
  );
};
