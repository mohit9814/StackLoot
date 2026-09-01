import React, { useState } from 'react';
import type { CurrencyConfig } from '../../types/allowance';
import { formatCurrency } from '../../config/currencies';
import { CHALLENGE_TIERS } from '../../config/appConfig';
import {
  X,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Trophy,
  Target,
  Gift,
  ShieldCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuickSetupWizardProps {
  isOpen: boolean;
  currency: CurrencyConfig;
  onClose: () => void;
  onCompleteSetup: (
    teenName: string,
    parentName: string,
    monthlyAllowance: number,
    deferralPercentage: number,
    annualInterestRate: number,
    targetTermMonths: number,
    completionBonusPercentage: number,
    parentInterestMatchMultiplier: number,
    selectedGoalTitle: string,
    selectedGoalTarget: number,
    selectedPerk: string
  ) => void;
}

export const QuickSetupWizard: React.FC<QuickSetupWizardProps> = ({
  isOpen,
  currency,
  onClose,
  onCompleteSetup,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Participants & Allowance
  const [teenName, setTeenName] = useState('Akshat');
  const [parentName, setParentName] = useState('Dad');
  const [allowance, setAllowance] = useState(2000);
  const [deferralPercent, setDeferralPercent] = useState(100);

  // Step 2: Tier & Incentive Rule
  const [selectedTierLevel, setSelectedTierLevel] = useState<number>(2); // Level 2 default (6-month marathon)

  // Step 3: Target Goal
  const [goalTitle, setGoalTitle] = useState('Electric Guitar & Amp');
  const [goalTarget, setGoalTarget] = useState(15000);

  // Step 4: Agreed Treat Perk
  const [selectedPerk, setSelectedPerk] = useState('Epic Pizza Night + 100% Parent Double Match');

  if (!isOpen) return null;

  const currentTier = CHALLENGE_TIERS.find((t) => t.level === selectedTierLevel) || CHALLENGE_TIERS[1];

  const handleFinish = () => {
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }

    onCompleteSetup(
      teenName,
      parentName,
      allowance,
      deferralPercent,
      currentTier.baseInterestRate,
      currentTier.minMonths,
      currentTier.termCompletionBonus,
      currentTier.interestMatchBonus > 0 ? 1.0 : 0,
      goalTitle,
      goalTarget,
      selectedPerk
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-indigo-500/40 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Wizard Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl shadow-lg shadow-indigo-500/25">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">60-Second Co-Pilot Setup Wizard</h3>
              <p className="text-xs text-slate-400">Step {step} of 4: Quick-start your family compounding plan</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                step >= s ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-slate-800'
              }`}
            />
          ))}
        </div>

        {/* STEP 1: Names & Monthly Allowance */}
        {step === 1 && (
          <div className="space-y-4 text-xs">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Who is participating?</span>
              </h4>
              <p className="text-slate-400">Set the names and monthly allowance parameters.</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Teen / Son's Name</label>
                <input
                  type="text"
                  required
                  value={teenName}
                  onChange={(e) => setTeenName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Parent / Sponsor Name</label>
                <input
                  type="text"
                  required
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

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
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Deferral Lock %</label>
                <select
                  value={deferralPercent}
                  onChange={(e) => setDeferralPercent(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value={50}>50% Deferral (Split 50/50)</option>
                  <option value={75}>75% Deferral (High Snowball)</option>
                  <option value={100}>100% Deferral (Max Power)</option>
                </select>
              </div>
            </div>

            <div className="bg-slate-850 p-3.5 rounded-2xl border border-slate-750 flex items-center justify-between">
              <span className="text-slate-300">Monthly Saved Principal:</span>
              <strong className="text-emerald-400 font-mono text-sm">
                {formatCurrency((allowance * deferralPercent) / 100, currency)}
              </strong>
            </div>
          </div>
        )}

        {/* STEP 2: Challenge Tier Selection */}
        {step === 2 && (
          <div className="space-y-4 text-xs">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Pick your Challenge Tier</span>
              </h4>
              <p className="text-slate-400">Choose a lock-in commitment that fits your timeline.</p>
            </div>

            <div className="space-y-2.5">
              {CHALLENGE_TIERS.map((tier) => (
                <div
                  key={tier.level}
                  onClick={() => setSelectedTierLevel(tier.level)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    selectedTierLevel === tier.level
                      ? 'bg-indigo-950/40 border-indigo-500 shadow-lg shadow-indigo-500/10 text-white'
                      : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <strong className="text-white font-bold">{tier.name}</strong>
                      <span className="text-[10px] bg-slate-700 px-2 py-0.5 rounded-full text-slate-300">
                        {tier.minMonths} Months
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">{tier.subtitle}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black font-mono text-emerald-400">
                      {tier.baseInterestRate}% p.a.
                    </span>
                    <span className="text-[10px] text-slate-400 block">+{tier.termCompletionBonus}% Bonus</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: Goal Wishlist Target */}
        {step === 3 && (
          <div className="space-y-4 text-xs">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-indigo-400" />
                <span>What is {teenName} saving towards?</span>
              </h4>
              <p className="text-slate-400">Earmarking savings to a real dream dramatically boosts motivation!</p>
            </div>

            <div>
              <label className="font-semibold text-slate-300 block mb-1">Target Dream Goal</label>
              <input
                type="text"
                required
                value={goalTitle}
                onChange={(e) => setGoalTitle(e.target.value)}
                placeholder="e.g. Electric Guitar & Amp, Gaming GPU, Laptop"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-300 block mb-1">
                Target Cost / Goal Price ({currency.symbol})
              </label>
              <input
                type="number"
                min={500}
                step={500}
                required
                value={goalTarget}
                onChange={(e) => setGoalTarget(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Quick preset suggestions */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-semibold text-slate-400">Quick Presets:</span>
              <div className="flex gap-2 flex-wrap">
                {[
                  { title: '🎸 Electric Guitar & Amp', cost: 15000 },
                  { title: '🎮 Gaming Console / GPU', cost: 30000 },
                  { title: '🎧 Premium Headphones', cost: 8000 },
                ].map((preset) => (
                  <button
                    key={preset.title}
                    type="button"
                    onClick={() => {
                      setGoalTitle(preset.title);
                      setGoalTarget(preset.cost);
                    }}
                    className="text-[11px] bg-slate-800 hover:bg-slate-750 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700 transition-colors cursor-pointer"
                  >
                    {preset.title}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Agreed Treat Perk & Final Review */}
        {step === 4 && (
          <div className="space-y-4 text-xs">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Gift className="w-4 h-4 text-amber-400" />
                <span>Agreed Reward Treat on Completion</span>
              </h4>
              <p className="text-slate-400">The experiential perk Dad will treat you to when you complete the term!</p>
            </div>

            <div>
              <label className="font-semibold text-slate-300 block mb-1">Completion Treat Perk</label>
              <input
                type="text"
                required
                value={selectedPerk}
                onChange={(e) => setSelectedPerk(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Summary Pact Box */}
            <div className="bg-gradient-to-br from-indigo-950/60 to-purple-950/40 border border-indigo-500/30 rounded-2xl p-4 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300 block">
                🤝 Family Pact Summary
              </span>
              <div className="space-y-1 text-slate-200">
                <p>• <strong>{teenName}</strong> defers <strong>{deferralPercent}%</strong> of <strong>{formatCurrency(allowance, currency)}/mo</strong>.</p>
                <p>• <strong>{parentName}</strong> guarantees <strong>{currentTier.baseInterestRate}% p.a. monthly compound</strong> for <strong>{currentTier.minMonths} months</strong>.</p>
                <p>• Flat <strong>+{currentTier.termCompletionBonus}% completion bonus</strong> + <strong>100% Parent Interest Match</strong>.</p>
                <p>• Target Goal: <strong className="text-emerald-400">{goalTitle} ({formatCurrency(goalTarget, currency)})</strong>.</p>
              </div>
            </div>
          </div>
        )}

        {/* Wizard Footer Nav */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3 | 4)}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep((s) => (s + 1) as 1 | 2 | 3 | 4)}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-500/20 transition-all cursor-pointer"
            >
              <span>Next Step</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="flex items-center gap-1.5 px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-extrabold text-xs rounded-xl shadow-xl shadow-emerald-500/25 transition-all cursor-pointer active:scale-95"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Launch Family Pact!</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
