import React from 'react';
import type { GoalProgressInfo } from '../../types/goal';
import type { CurrencyConfig } from '../../types/allowance';
import { formatCurrency } from '../../config/currencies';
import { Target, Trash2, CheckCircle2, Zap, Clock, Music, Gamepad2, Laptop, GraduationCap, Compass, Sparkles } from 'lucide-react';

interface GoalCardProps {
  goalInfo: GoalProgressInfo;
  currency: CurrencyConfig;
  onRemoveGoal: (id: string) => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({ goalInfo, currency, onRemoveGoal }) => {
  const { goal, percentageCompleted, projectedMonthsUnderCompound, monthsSavedViaCompound, isUnlocked } = goalInfo;

  const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    MUSIC: Music,
    GAMING: Gamepad2,
    TECH: Laptop,
    EDUCATION: GraduationCap,
    LIFESTYLE: Sparkles,
    EXPERIENCE: Compass,
  };

  const Icon = categoryIcons[goal.category] || Target;

  return (
    <div className={`bg-slate-900/90 border rounded-3xl p-6 shadow-xl flex flex-col justify-between transition-all duration-200 ${
      isUnlocked
        ? 'border-emerald-500/50 ring-1 ring-emerald-500/20 bg-gradient-to-b from-slate-900 via-slate-900 to-emerald-950/20'
        : 'border-slate-800 hover:border-slate-700'
    }`}>
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className={`p-2.5 rounded-xl ${
              isUnlocked ? 'bg-emerald-500/20 text-emerald-300' : 'bg-indigo-500/10 text-indigo-400'
            }`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                {goal.category}
              </span>
              <h3 className="text-base font-bold text-white leading-snug">{goal.title}</h3>
            </div>
          </div>
          <button
            onClick={() => onRemoveGoal(goal.id)}
            className="text-slate-600 hover:text-rose-400 transition-colors p-1.5 rounded-lg cursor-pointer"
            title="Remove goal"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {goal.notes && (
          <p className="text-xs text-slate-400 mb-4">{goal.notes}</p>
        )}

        {/* Target Amount & Current Status */}
        <div className="bg-slate-800/60 rounded-2xl p-3.5 mb-4 border border-slate-700/60 flex items-baseline justify-between">
          <div>
            <span className="text-[10px] uppercase text-slate-400 font-semibold block">Target Price</span>
            <span className="text-lg font-black text-white font-mono">
              {formatCurrency(goal.targetAmount, currency)}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase text-slate-400 font-semibold block">Progress</span>
            <span className="text-sm font-bold font-mono text-emerald-400">
              {percentageCompleted}%
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-700/80 h-2.5 rounded-full overflow-hidden mb-4">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isUnlocked
                ? 'bg-emerald-400'
                : 'bg-gradient-to-r from-indigo-500 to-emerald-400'
            }`}
            style={{ width: `${percentageCompleted}%` }}
          />
        </div>
      </div>

      {/* Compounding Acceleration Insight */}
      <div className="pt-3 border-t border-slate-800">
        {isUnlocked ? (
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>Target Achieved! Ready to purchase.</span>
          </div>
        ) : (
          <div className="space-y-1.5 text-[11px] text-slate-300">
            <div className="flex items-center justify-between text-slate-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Est. time with compounding:
              </span>
              <strong className="text-indigo-300 font-mono">~{projectedMonthsUnderCompound} Months</strong>
            </div>
            {monthsSavedViaCompound > 0 && (
              <div className="flex items-center gap-1 text-emerald-400 font-semibold">
                <Zap className="w-3.5 h-3.5" />
                <span>Compound yield saves you {monthsSavedViaCompound} months!</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
