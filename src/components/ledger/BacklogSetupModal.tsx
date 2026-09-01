import React, { useState, useMemo } from 'react';
import type { CurrencyConfig, BacklogSetupParams } from '../../types/allowance';
import { formatCurrency, formatCurrencyExact } from '../../config/currencies';
import { calculateCompoundSchedule } from '../../services/compoundEngine';
import { X, History, Sparkles, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface BacklogSetupModalProps {
  isOpen: boolean;
  currency: CurrencyConfig;
  onClose: () => void;
  onConfirmBacklog: (params: BacklogSetupParams) => void;
}

export const BacklogSetupModal: React.FC<BacklogSetupModalProps> = ({
  isOpen,
  currency,
  onClose,
  onConfirmBacklog,
}) => {
  const [teenName, setTeenName] = useState('Akshat');
  const [parentName, setParentName] = useState('Dad');
  const [allowance, setAllowance] = useState(2000);
  const [deferralPercent, setDeferralPercent] = useState(100);
  const [rate, setRate] = useState(10);
  const [targetTermMonths, setTargetTermMonths] = useState(6);
  const [backlogMonths, setBacklogMonths] = useState(3);
  const [bonus, setBonus] = useState(20);
  const [parentMatch, setParentMatch] = useState(1.0);
  const [initialLumpSum, setInitialLumpSum] = useState(0);

  // Compute default starting date based on backlog months
  const defaultStartDate = useMemo(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - backlogMonths);
    return d.toISOString().slice(0, 10);
  }, [backlogMonths]);

  const [startDate, setStartDate] = useState(defaultStartDate);

  // Calculate preview of retroactive interest and totals
  const preview = useMemo(() => {
    const monthlyDeferred = (allowance * deferralPercent) / 100;
    const sim = calculateCompoundSchedule({
      monthlyAllowance: allowance,
      deferralPercentage: deferralPercent,
      annualInterestRate: rate,
      termMonths: backlogMonths,
      completionBonusPercentage: backlogMonths >= targetTermMonths ? bonus : 0,
      parentInterestMatchMultiplier: parentMatch,
    });

    const totalPrincipal = (monthlyDeferred * backlogMonths) + initialLumpSum;
    const totalInterest = sim.totalInterestEarned;
    const totalMatch = sim.totalParentInterestMatch;
    const totalCurrentBalance = totalPrincipal + totalInterest + totalMatch;

    return {
      totalPrincipal,
      totalInterest,
      totalMatch,
      totalCurrentBalance,
      simBreakdown: sim.breakdown,
    };
  }, [allowance, deferralPercent, rate, backlogMonths, targetTermMonths, bonus, parentMatch, initialLumpSum]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } catch {
      // ignore
    }
    onConfirmBacklog({
      teenName,
      parentName,
      monthlyAllowance: allowance,
      deferralPercentage: deferralPercent,
      annualInterestRate: rate,
      targetTermMonths,
      completionBonusPercentage: bonus,
      parentInterestMatchMultiplier: parentMatch,
      backlogMonthsCompleted: backlogMonths,
      startDate,
      initialLumpSumDeposit: initialLumpSum > 0 ? initialLumpSum : undefined,
      selectedPerk: 'Agreed Family Completion Reward',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-indigo-500/40 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-amber-500/15 text-amber-400 rounded-xl">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Backdate Backlog & Past Interest</h3>
              <p className="text-xs text-slate-400">Set up prior months and credit retroactive compound interest</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Names */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-300 block mb-1">Son / Teen's Name</label>
              <input
                type="text"
                required
                value={teenName}
                onChange={(e) => setTeenName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-300 block mb-1">Parent / Sponsor Name</label>
              <input
                type="text"
                required
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
              />
            </div>
          </div>

          {/* Backlog Months Slider / Quick Pick */}
          <div className="bg-indigo-950/30 border border-indigo-500/30 p-4 rounded-2xl space-y-2.5">
            <div className="flex justify-between items-baseline">
              <label className="font-bold text-white flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-amber-400" />
                <span>How many past months to backdate?</span>
              </label>
              <span className="text-sm font-extrabold font-mono text-amber-300 bg-amber-950/60 px-2.5 py-0.5 rounded-lg border border-amber-600/40">
                {backlogMonths} Months Already Saved
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 6].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setBacklogMonths(m)}
                  className={`py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    backlogMonths === m
                      ? 'bg-amber-500/30 border-amber-500 text-amber-200'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-750'
                  }`}
                >
                  {m} {m === 1 ? 'Month' : 'Months'}
                </button>
              ))}
            </div>
          </div>

          {/* Monthly Allowance & Deferral */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-300 block mb-1">
                Monthly Allowance ({currency.symbol})
              </label>
              <input
                type="number"
                min={100}
                step={100}
                required
                value={allowance}
                onChange={(e) => setAllowance(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-300 block mb-1">Deferral Lock %</label>
              <select
                value={deferralPercent}
                onChange={(e) => setDeferralPercent(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value={50}>50% Deferral</option>
                <option value={75}>75% Deferral</option>
                <option value={100}>100% Deferral (Full)</option>
              </select>
            </div>
          </div>

          {/* Rate, Term, Start Date */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="font-semibold text-slate-300 block mb-1">Annual Yield (%)</label>
              <input
                type="number"
                min={5}
                max={30}
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-300 block mb-1">Total Term</label>
              <select
                value={targetTermMonths}
                onChange={(e) => setTargetTermMonths(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value={3}>3 Months</option>
                <option value={6}>6 Months</option>
                <option value={12}>12 Months</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-300 block mb-1">Backlog Start</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-2 text-white text-[11px] focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Match & Bonus configuration */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-300 block mb-1">Parent Interest Match</label>
              <select
                value={parentMatch}
                onChange={(e) => setParentMatch(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value={0}>0% (Standard Interest Only)</option>
                <option value={0.5}>50% Match</option>
                <option value={1.0}>100% Match (Double Interest)</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-300 block mb-1">Milestone Bonus (%)</label>
              <input
                type="number"
                min={0}
                max={50}
                value={bonus}
                onChange={(e) => setBonus(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Initial Prior Lump Sum (Optional) */}
          <div>
            <label className="font-semibold text-slate-300 block mb-1">
              Prior Initial Lump-Sum Starting Balance (Optional {currency.symbol})
            </label>
            <input
              type="number"
              min={0}
              step={100}
              value={initialLumpSum}
              onChange={(e) => setInitialLumpSum(Number(e.target.value))}
              placeholder="0 (leave blank if none)"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Live Retroactive Calculation Preview Card */}
          <div className="bg-slate-850 border border-slate-750 rounded-2xl p-4 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-200 border-b border-slate-750 pb-2">
              <span className="flex items-center gap-1.5 text-indigo-400">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Retroactive Catch-Up Calculation</span>
              </span>
              <span className="text-emerald-400 font-mono">
                {backlogMonths} of {targetTermMonths} Months Completed
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center pt-1">
              <div className="bg-slate-800 p-2.5 rounded-xl">
                <span className="text-[10px] uppercase text-slate-400 block font-semibold">Principal Saved</span>
                <span className="text-sm font-bold text-white font-mono">
                  {formatCurrency(preview.totalPrincipal, currency)}
                </span>
              </div>
              <div className="bg-indigo-950/40 border border-indigo-500/30 p-2.5 rounded-xl">
                <span className="text-[10px] uppercase text-indigo-300 block font-semibold">Retroactive Interest</span>
                <span className="text-sm font-bold text-emerald-400 font-mono">
                  +{formatCurrencyExact(preview.totalInterest, currency)}
                </span>
              </div>
              <div className="bg-amber-950/40 border border-amber-500/30 p-2.5 rounded-xl">
                <span className="text-[10px] uppercase text-amber-300 block font-semibold">Parent Match</span>
                <span className="text-sm font-bold text-amber-300 font-mono">
                  +{formatCurrencyExact(preview.totalMatch, currency)}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-750 flex justify-between items-center text-xs">
              <span className="font-bold text-white">Starting Available Balance Today:</span>
              <span className="text-base font-black text-emerald-400 font-mono">
                {formatCurrencyExact(preview.totalCurrentBalance, currency)}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-gradient-to-r from-amber-600 to-indigo-600 hover:from-amber-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Catch Up & Activate Backlog</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
