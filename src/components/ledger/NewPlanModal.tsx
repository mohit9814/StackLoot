import React, { useState } from 'react';
import type { CurrencyConfig } from '../../types/allowance';
import { X, Sparkles, ShieldCheck } from 'lucide-react';

interface NewPlanModalProps {
  isOpen: boolean;
  currency: CurrencyConfig;
  onClose: () => void;
  onCreatePlan: (
    teenName: string,
    parentName: string,
    monthlyAllowance: number,
    deferralPercentage: number,
    annualInterestRate: number,
    targetTermMonths: number,
    completionBonusPercentage: number,
    parentInterestMatchMultiplier: number,
    selectedPerk?: string
  ) => void;
}

export const NewPlanModal: React.FC<NewPlanModalProps> = ({
  isOpen,
  currency,
  onClose,
  onCreatePlan,
}) => {
  const [teenName, setTeenName] = useState('Akshat');
  const [parentName, setParentName] = useState('Dad');
  const [allowance, setAllowance] = useState(2000);
  const [deferralPercent, setDeferralPercent] = useState(100);
  const [rate, setRate] = useState(10);
  const [termMonths, setTermMonths] = useState(6);
  const [bonus, setBonus] = useState(20);
  const [parentMatch, setParentMatch] = useState(1.0);
  const [perk, setPerk] = useState('Favorite Pizza Night + 100% Parent Match');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreatePlan(
      teenName,
      parentName,
      allowance,
      deferralPercent,
      rate,
      termMonths,
      bonus,
      parentMatch,
      perk
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-750 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-500/15 text-indigo-400 rounded-xl">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Initialize Family Savings Pact</h3>
              <p className="text-xs text-slate-400">Launch a live ledger with real compounding</p>
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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-medium text-slate-300 block mb-1">Teen's Name</label>
              <input
                type="text"
                required
                value={teenName}
                onChange={(e) => setTeenName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
              />
            </div>
            <div>
              <label className="font-medium text-slate-300 block mb-1">Parent / Sponsor</label>
              <input
                type="text"
                required
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-medium text-slate-300 block mb-1">
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
              <label className="font-medium text-slate-300 block mb-1">Deferral Lock %</label>
              <select
                value={deferralPercent}
                onChange={(e) => setDeferralPercent(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value={50}>50% Deferral (Level 1)</option>
                <option value={75}>75% Deferral (Level 2)</option>
                <option value={100}>100% Deferral (Max Snowball)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="font-medium text-slate-300 block mb-1">Annual Yield (%)</label>
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
              <label className="font-medium text-slate-300 block mb-1">Term</label>
              <select
                value={termMonths}
                onChange={(e) => setTermMonths(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value={3}>3 Months</option>
                <option value={6}>6 Months</option>
                <option value={12}>12 Months</option>
              </select>
            </div>
            <div>
              <label className="font-medium text-slate-300 block mb-1">Bonus Kicker (%)</label>
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

          <div>
            <label className="font-medium text-slate-300 block mb-1">Parent Interest Match</label>
            <select
              value={parentMatch}
              onChange={(e) => setParentMatch(Number(e.target.value))}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value={0}>0% (Standard Interest Only)</option>
              <option value={0.5}>50% Parent Match</option>
              <option value={1.0}>100% Parent Match (Double Interest)</option>
            </select>
          </div>

          <div>
            <label className="font-medium text-slate-300 block mb-1">Target Reward Perk</label>
            <input
              type="text"
              value={perk}
              onChange={(e) => setPerk(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex gap-2.5 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Sign & Launch Plan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
