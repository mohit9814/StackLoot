import React, { useState } from 'react';
import type { ActivePlanLedger, CurrencyConfig, SimulationResult, SimulationParams } from '../../types/allowance';
import type { GoalProgressInfo } from '../../types/goal';
import type { UserGamificationState } from '../../types/gamification';
import { formatCurrency, formatCurrencyExact } from '../../config/currencies';
import { BADGES_CATALOG } from '../../config/appConfig';
import { TeenGrowthSimulator } from './TeenGrowthSimulator';
import { OpportunityLossCard } from './OpportunityLossCard';
import {
  Flame,
  Snowflake,
  Sparkles,
  Target,
  Zap,
  Trophy,
  Printer,
  Award,
  TrendingUp,
  Wallet,
  TrendingDown,
  Compass,
} from 'lucide-react';

interface TeenDashboardViewProps {
  plan: ActivePlanLedger | null;
  params: SimulationParams;
  simulation: SimulationResult;
  currency: CurrencyConfig;
  gamification: UserGamificationState;
  goals: GoalProgressInfo[];
  onViewPrintTracker: () => void;
}

export const TeenDashboardView: React.FC<TeenDashboardViewProps> = ({
  plan,
  params,
  simulation,
  currency,
  gamification,
  goals,
  onViewPrintTracker,
}) => {
  const [activeTeenSection, setActiveTeenSection] = useState<'VAULT' | 'ROADMAP' | 'LOSS_CALCULATOR'>('VAULT');

  const teenName = plan?.teenName || 'Akshat';
  const hasPlan = plan !== null;
  const isPlanCompleted = plan?.status === 'COMPLETED';
  const isPlanActiveOrComplete = hasPlan && (plan.status === 'ACTIVE' || plan.status === 'COMPLETED');

  const liveBalance = plan ? plan.currentBalance : 0;
  const completedMonths = plan ? plan.transactions.filter((t) => t.type === 'DEPOSIT').length : 0;
  const targetMonths = plan ? plan.targetTermMonths : params.termMonths || 6;
  const progressPercent = isPlanActiveOrComplete
    ? Math.min(100, Math.round((completedMonths / targetMonths) * 100))
    : 0;

  const primaryGoal = goals.find((g) => !g.isUnlocked) || goals[0];

  return (
    <div className="space-y-6">
      {/* Mode Identification Banner & Sub-Nav */}
      <div className="bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-slate-900/90 border border-indigo-500/30 rounded-2xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 px-5">
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>🎮 {teenName}'s Compounding Dashboard & Mission Control</span>
        </div>

        {/* Section Navigation Tabs for Teen */}
        <div className="flex items-center bg-slate-950/70 p-1 rounded-xl border border-slate-800 text-xs font-bold">
          <button
            onClick={() => setActiveTeenSection('VAULT')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all cursor-pointer ${
              activeTeenSection === 'VAULT'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Vault</span>
          </button>
          <button
            onClick={() => setActiveTeenSection('ROADMAP')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all cursor-pointer ${
              activeTeenSection === 'ROADMAP'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>Growth Simulator</span>
          </button>
          <button
            onClick={() => setActiveTeenSection('LOSS_CALCULATOR')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all cursor-pointer ${
              activeTeenSection === 'LOSS_CALCULATOR'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-rose-300'
            }`}
          >
            <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
            <span>Opportunity Loss</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: VAULT & ACTIVE PROGRESS */}
      {activeTeenSection === 'VAULT' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Hero Teen Balance Card */}
          <div className="relative bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 border-2 border-indigo-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
            {/* Glow ambient */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-start justify-between gap-6">
              {/* Left Column: Current Vault Balance & Live Contributed */}
              <div className="space-y-4 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-indigo-500/25 text-indigo-200 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full border border-indigo-500/40 flex items-center gap-1.5 shadow-sm">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>{teenName}'s Live Compounding Vault</span>
                  </span>
                  {isPlanCompleted ? (
                    <span className="bg-purple-500/25 text-purple-300 text-xs font-bold px-3 py-1 rounded-full border border-purple-500/40">
                      🎉 Term Completed ({completedMonths}/{targetMonths} Mo)
                    </span>
                  ) : isPlanActiveOrComplete ? (
                    <span className="bg-emerald-500/25 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/40">
                      Month {completedMonths} of {targetMonths} Active
                    </span>
                  ) : (
                    <span className="bg-amber-500/25 text-amber-300 text-xs font-bold px-3 py-1 rounded-full border border-amber-500/40">
                      Awaiting Setup in Parent Mode
                    </span>
                  )}
                </div>

                <div>
                  <span className="text-xs uppercase font-bold text-slate-400 tracking-wider block">
                    Current Vault Balance Today
                  </span>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white font-mono tracking-tight text-glow mt-0.5">
                    {formatCurrency(liveBalance, currency)}
                  </h1>
                </div>

                {/* Breakdown summary */}
                <div className="flex items-center gap-4 text-xs text-slate-300 font-medium flex-wrap pt-1">
                  {isPlanActiveOrComplete ? (
                    <>
                      <div className="flex items-center gap-1.5 bg-slate-900/60 px-3 py-1.5 rounded-xl border border-slate-800">
                        <Wallet className="w-3.5 h-3.5 text-slate-400" />
                        <span>Principal Deposited: <strong className="text-white font-mono">{formatCurrency(plan.totalPrincipalContributed, currency)}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-emerald-950/30 px-3 py-1.5 rounded-xl border border-emerald-500/30">
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Yield + Match Accrued: <strong className="text-emerald-400 font-mono font-bold">+{formatCurrencyExact(plan.totalInterestEarned + plan.totalBonusesEarned, currency)}</strong></span>
                      </div>
                    </>
                  ) : (
                    <p className="text-slate-400">
                      Dad sets up and manages the official plan in Parent Mode. Once initialized, your live deposits and monthly compounding will appear here!
                    </p>
                  )}
                </div>
              </div>

              {/* Right Column: Projected End-of-Term Payout Card with FULL BREAKUP */}
              <div className="flex flex-col gap-3 shrink-0 lg:w-80">
                <div className="bg-slate-900/90 border border-indigo-500/40 rounded-2xl p-4 text-left space-y-3 shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 block">
                        🎯 {isPlanCompleted ? '🎉 Total Completed Payout' : isPlanActiveOrComplete ? `Projected ${targetMonths}-Month Snowball Payout` : 'Projected Payout Target'}
                      </span>
                      <span className="text-2xl font-black text-emerald-400 font-mono">
                        {isPlanActiveOrComplete ? formatCurrency(simulation.finalTotalBalance, currency) : 'Pending Parent Setup'}
                      </span>
                    </div>
                    {isPlanActiveOrComplete && (
                      <span
                        title="Month 6 monthly interest is 6.39x Month 1 monthly interest"
                        className="text-[11px] font-bold font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-lg border border-amber-600/40"
                      >
                        {simulation.snowballFactor}x Monthly Velocity
                      </span>
                    )}
                  </div>

                  {/* 4-Pillar Detailed Breakup */}
                  {isPlanActiveOrComplete ? (
                    <div className="space-y-2 text-xs pt-0.5">
                      <div className="flex justify-between items-center text-slate-300">
                        <span className="flex items-center gap-1.5 text-[11px] text-slate-400">
                          <Wallet className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                          <span>Principal ({targetMonths} mo):</span>
                        </span>
                        <span className="font-mono font-bold text-white">
                          {formatCurrency(simulation.totalPrincipalSaved, currency)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-emerald-300">
                        <span className="flex items-center gap-1.5 text-[11px] text-slate-400">
                          <TrendingUp className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>Yield ({params.annualInterestRate}% p.a.):</span>
                        </span>
                        <span className="font-mono font-bold text-emerald-400">
                          +{formatCurrencyExact(simulation.totalInterestEarned, currency)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-purple-300">
                        <span className="flex items-center gap-1.5 text-[11px] text-slate-400">
                          <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                          <span>Dad's Match ({params.parentInterestMatchMultiplier * 100}%):</span>
                        </span>
                        <span className="font-mono font-bold text-purple-300">
                          +{formatCurrencyExact(simulation.totalParentInterestMatch, currency)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-amber-300">
                        <span className="flex items-center gap-1.5 text-[11px] text-slate-400">
                          <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>Milestone Bonus (+{params.completionBonusPercentage}%):</span>
                        </span>
                        <span className="font-mono font-bold text-amber-300">
                          +{formatCurrency(simulation.completionBonus, currency)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[10px] text-slate-400">
                      Calculated once Dad launches your savings plan from the Parent Console.
                    </p>
                  )}
                </div>

                {/* Print Habit Tracker button */}
                <button
                  onClick={onViewPrintTracker}
                  className="py-2.5 px-4 bg-slate-800/90 hover:bg-slate-800 text-slate-200 font-semibold text-xs rounded-2xl border border-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Print Desk Habit Tracker</span>
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-6 pt-5 border-t border-slate-800/80 space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300">
                  {isPlanActiveOrComplete
                    ? `Lock-in Term Progress (${completedMonths} of ${targetMonths} Months)`
                    : 'Lock-in Term Progress (Pending Setup)'}
                </span>
                <span className="text-emerald-400 font-mono font-bold">{progressPercent}%</span>
              </div>
              <div className="w-full bg-slate-800/90 h-3.5 rounded-full overflow-hidden p-0.5 border border-slate-700">
                <div
                  className="bg-gradient-to-r from-indigo-500 via-amber-400 to-emerald-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* 3 Son Engagement Spotlight Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Snowball Velocity Card */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Monthly Earning Velocity</span>
                  <div className="p-2 bg-amber-500/15 text-amber-400 rounded-xl">
                    <Snowflake className="w-4 h-4 animate-spin-slow" />
                  </div>
                </div>
                <h4 className="text-2xl font-black text-white font-mono">
                  {isPlanActiveOrComplete ? `${simulation.snowballFactor}x Monthly Growth` : 'Up to 6x Acceleration'}
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Your monthly interest accelerates from <strong>₹25.00/mo</strong> in Month 1 to <strong>₹159.69/mo</strong> in Month 6—meaning your money earns <strong>6.39x more interest per month</strong> by the end of the term!
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
                <Flame className="w-3.5 h-3.5" />
                <span>{isPlanActiveOrComplete ? 'Compounding Snowball In Action' : 'Snowball Engine Ready'}</span>
              </div>
            </div>

            {/* Wishlist Target Spotlight */}
            {primaryGoal && (
              <div className="bg-slate-900/90 border border-indigo-500/40 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300">Target Dream Goal</span>
                    <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-xl">
                      <Target className="w-4 h-4" />
                    </div>
                  </div>
                  <h4 className="text-base font-extrabold text-white truncate">{primaryGoal.goal.title}</h4>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-xl font-bold font-mono text-emerald-400">{primaryGoal.percentageCompleted}%</span>
                    <span className="text-xs text-slate-400">of {formatCurrency(primaryGoal.goal.targetAmount, currency)}</span>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
                  <span>Time with compound:</span>
                  <strong className="text-indigo-300 font-mono">
                    {isPlanActiveOrComplete ? `~${primaryGoal.projectedMonthsUnderCompound} Months` : 'Pending Setup'}
                  </strong>
                </div>
              </div>
            )}

            {/* Level & Trophy Cabinet */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Trophy Cabinet</span>
                  <div className="p-2 bg-emerald-500/15 text-emerald-400 rounded-xl">
                    <Trophy className="w-4 h-4" />
                  </div>
                </div>
                <h4 className="text-2xl font-black text-white font-mono">Level {gamification.currentLevel}</h4>
                <p className="text-xs text-slate-400 mt-1">
                  {gamification.unlockedBadgeIds.length} Badges Unlocked • {gamification.totalXp} XP Total
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-1 text-xs text-amber-400 font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Diamond Hands Active</span>
              </div>
            </div>
          </div>

          {/* Son's Badges Grid */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <Award className="w-4 h-4 text-amber-400" />
                <span>{teenName}'s Achievement Badges</span>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {gamification.unlockedBadgeIds.length} / {BADGES_CATALOG.length} Unlocked
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {BADGES_CATALOG.map((badge) => {
                const isUnlocked = gamification.unlockedBadgeIds.includes(badge.id);
                return (
                  <div
                    key={badge.id}
                    className={`p-3 rounded-2xl border text-xs transition-all ${
                      isUnlocked
                        ? 'bg-slate-800/80 border-indigo-500/40 text-white shadow-md'
                        : 'bg-slate-950/40 border-slate-850 opacity-40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm">{isUnlocked ? '🏆' : '🔒'}</span>
                      <span className="text-[10px] font-mono text-amber-400 font-bold">+{badge.requiredXp} XP</span>
                    </div>
                    <h5 className="font-bold text-slate-100 truncate">{badge.title}</h5>
                    <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-2">{badge.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: ROADMAP & ACCELERATORS (Following Parent's Rules) */}
      {activeTeenSection === 'ROADMAP' && (
        <div className="animate-in fade-in duration-150">
          <TeenGrowthSimulator
            params={params}
            simulation={simulation}
            currency={currency}
            teenName={teenName}
            isPlanActive={isPlanActiveOrComplete}
          />
        </div>
      )}

      {/* SECTION 3: OPPORTUNITY LOSS CALCULATOR (Cost of not compounding) */}
      {activeTeenSection === 'LOSS_CALCULATOR' && (
        <div className="animate-in fade-in duration-150">
          <OpportunityLossCard
            params={params}
            currency={currency}
            teenName={teenName}
            isPlanActive={isPlanActiveOrComplete}
          />
        </div>
      )}
    </div>
  );
};
