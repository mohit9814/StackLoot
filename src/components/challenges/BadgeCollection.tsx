import React from 'react';
import type { BadgeId } from '../../types/gamification';
import { BADGES_CATALOG } from '../../config/appConfig';
import { Award, Lock, CheckCircle2, Sprout, Snowflake, Zap, Trophy, Gem, TrendingUp, GraduationCap, Target } from 'lucide-react';

interface BadgeCollectionProps {
  unlockedBadgeIds: BadgeId[];
  totalXp: number;
}

export const BadgeCollection: React.FC<BadgeCollectionProps> = ({
  unlockedBadgeIds,
  totalXp,
}) => {
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    Sprout,
    Snowflake,
    Zap,
    Trophy,
    Gem,
    TrendingUp,
    GraduationCap,
    Target,
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Financial Mastery Badges</h2>
            <p className="text-xs text-slate-400">
              {unlockedBadgeIds.length} of {BADGES_CATALOG.length} Badges Unlocked • {totalXp} XP Earned
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {BADGES_CATALOG.map((badge) => {
          const isUnlocked = unlockedBadgeIds.includes(badge.id);
          const Icon = iconMap[badge.iconName] || Award;

          return (
            <div
              key={badge.id}
              className={`relative rounded-2xl p-4 border transition-all duration-200 flex flex-col justify-between ${
                isUnlocked
                  ? 'bg-gradient-to-b from-slate-800 to-slate-900 border-indigo-500/40 shadow-lg shadow-indigo-500/5'
                  : 'bg-slate-950/40 border-slate-850 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`p-2.5 rounded-xl ${
                      isUnlocked
                        ? 'bg-gradient-to-tr from-amber-500/20 to-indigo-500/20 text-amber-300 ring-1 ring-amber-400/30'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  {isUnlocked ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-slate-600" />
                  )}
                </div>

                <h4 className="text-xs font-bold text-white mb-1">{badge.title}</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">{badge.description}</p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono">
                <span className={isUnlocked ? 'text-amber-400 font-bold' : 'text-slate-500'}>
                  +{badge.requiredXp} XP
                </span>
                <span className={isUnlocked ? 'text-emerald-400 font-semibold' : 'text-slate-600'}>
                  {isUnlocked ? 'Unlocked' : 'Locked'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
