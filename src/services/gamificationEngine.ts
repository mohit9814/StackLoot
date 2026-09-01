import type { BadgeId, UserGamificationState } from '../types/gamification';
import type { ActivePlanLedger } from '../types/allowance';

export function calculateLevelFromXp(xp: number): number {
  if (xp >= 2500) return 3; // Level 3: Real-World Graduate
  if (xp >= 1000) return 2; // Level 2: 6-Month Marathoner
  return 1; // Level 1: 3-Month Sprinter
}

export function evaluateBadges(
  currentState: UserGamificationState,
  plan: ActivePlanLedger | null,
  goalsCompletedCount: number
): {
  newBadges: BadgeId[];
  earnedXp: number;
} {
  const existingBadgeSet = new Set(currentState.unlockedBadgeIds);
  const newBadges: BadgeId[] = [];
  let earnedXp = 0;

  if (!plan) {
    return { newBadges, earnedXp };
  }

  // 1. FIRST_DEPOSIT
  const depositCount = plan.transactions.filter(t => t.type === 'DEPOSIT').length;
  if (depositCount >= 1 && !existingBadgeSet.has('FIRST_DEPOSIT')) {
    newBadges.push('FIRST_DEPOSIT');
    earnedXp += 100;
  }

  // 2. SNOWBALL_STARTER (accrued at least 100 in interest)
  if (plan.totalInterestEarned >= 100 && !existingBadgeSet.has('SNOWBALL_STARTER')) {
    newBadges.push('SNOWBALL_STARTER');
    earnedXp += 150;
  }

  // 3. THREE_MONTH_SPRINT (completed at least 3 monthly deposits without penalty)
  if (depositCount >= 3 && plan.status === 'ACTIVE' && !existingBadgeSet.has('THREE_MONTH_SPRINT')) {
    newBadges.push('THREE_MONTH_SPRINT');
    earnedXp += 250;
  }

  // 4. SIX_MONTH_MARATHON
  if (depositCount >= 6 && plan.status === 'ACTIVE' && !existingBadgeSet.has('SIX_MONTH_MARATHON')) {
    newBadges.push('SIX_MONTH_MARATHON');
    earnedXp += 500;
  }

  // 5. DIAMOND_HANDS (100% deferral for 4+ deposits)
  if (plan.deferralPercentage === 100 && depositCount >= 4 && !existingBadgeSet.has('DIAMOND_HANDS')) {
    newBadges.push('DIAMOND_HANDS');
    earnedXp += 300;
  }

  // 6. COMPOUND_PRODIGY (interest earned exceeds 300)
  if (plan.totalInterestEarned >= 300 && !existingBadgeSet.has('COMPOUND_PRODIGY')) {
    newBadges.push('COMPOUND_PRODIGY');
    earnedXp += 400;
  }

  // 7. REAL_WORLD_GRADUATE (completed full 12-month or plan status completed)
  if (plan.status === 'COMPLETED' && !existingBadgeSet.has('REAL_WORLD_GRADUATE')) {
    newBadges.push('REAL_WORLD_GRADUATE');
    earnedXp += 600;
  }

  // 8. GOAL_CRUSHER
  if (goalsCompletedCount > 0 && !existingBadgeSet.has('GOAL_CRUSHER')) {
    newBadges.push('GOAL_CRUSHER');
    earnedXp += 350;
  }

  return { newBadges, earnedXp };
}
