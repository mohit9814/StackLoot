import React from 'react';
import type { ChallengeTierConfig } from '../../types/gamification';
import type { CurrencyConfig } from '../../types/allowance';
import { Gift, ArrowRight } from 'lucide-react';

interface ChallengeTierCardProps {
  tier: ChallengeTierConfig;
  isActive: boolean;
  onSelectTier: (tier: ChallengeTierConfig) => void;
  onOpenTreatPicker: (tier: ChallengeTierConfig) => void;
  selectedTreat?: string;
  currency: CurrencyConfig;
}

export const ChallengeTierCard: React.FC<ChallengeTierCardProps> = ({
  tier,
  isActive,
  onSelectTier,
  onOpenTreatPicker,
  selectedTreat,
}) => {
  const levelStyles = {
    1: {
      border: 'border-amber-500/30 hover:border-amber-500/60',
      badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      btn: 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-500/20',
    },
    2: {
      border: 'border-indigo-500/30 hover:border-indigo-500/60',
      badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      btn: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20',
    },
    3: {
      border: 'border-emerald-500/30 hover:border-emerald-500/60',
      badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      btn: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20',
    },
  }[tier.level];

  return (
    <div
      className={`relative bg-slate-900/90 border ${levelStyles.border} rounded-3xl p-6 shadow-xl flex flex-col justify-between transition-all duration-200 ${
        isActive ? 'ring-2 ring-indigo-500 shadow-indigo-500/10' : ''
      }`}
    >
      <div>
        {/* Level Tag & Term */}
        <div className="flex items-center justify-between mb-4">
          <span className={`text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full border ${levelStyles.badge}`}>
            Level {tier.level}
          </span>
          <span className="text-xs font-bold font-mono text-slate-400">
            {tier.minMonths} Months Lock
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-extrabold text-white tracking-tight">{tier.name}</h3>
        <p className="text-xs text-indigo-300 font-medium mt-0.5 mb-4">{tier.subtitle}</p>
        <p className="text-xs text-slate-300 leading-relaxed mb-5">{tier.description}</p>

        {/* Core Rules List */}
        <div className="space-y-2.5 bg-slate-800/60 rounded-2xl p-4 mb-5 border border-slate-700/60 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Monthly Deferral Target:</span>
            <span className="font-bold text-white">≥ {tier.minDeferralPercent}% of Allowance</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Bank of Dad Yield:</span>
            <span className="font-bold text-emerald-400">{tier.baseInterestRate}% p.a. monthly compound</span>
          </div>
          {tier.interestMatchBonus > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Parent Interest Match:</span>
              <span className="font-bold text-amber-300">+{tier.interestMatchBonus}% (Doubled!)</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Completion Bonus:</span>
            <span className="font-bold text-indigo-300">+{tier.termCompletionBonus}% of Principal</span>
          </div>
        </div>

        {/* Special Perk Reward */}
        <div className="bg-slate-850 border border-slate-750 rounded-2xl p-3.5 mb-5">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
              <Gift className="w-3.5 h-3.5" />
              <span>Unlockable Perk Reward</span>
            </div>
            <button
              onClick={() => onOpenTreatPicker(tier)}
              className="text-[11px] text-indigo-400 hover:text-indigo-300 underline font-medium cursor-pointer"
            >
              Change Perk
            </button>
          </div>
          <p className="text-xs text-slate-200 font-medium">
            {selectedTreat || tier.defaultPerkTitle}
          </p>
        </div>
      </div>

      {/* Select Tier Action */}
      <button
        onClick={() => onSelectTier(tier)}
        className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${levelStyles.btn}`}
      >
        <span>{isActive ? 'Current Active Tier' : `Adopt Level ${tier.level} Challenge`}</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};
