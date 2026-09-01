export type BadgeId = 
  | 'FIRST_DEPOSIT'
  | 'SNOWBALL_STARTER'
  | 'THREE_MONTH_SPRINT'
  | 'SIX_MONTH_MARATHON'
  | 'DIAMOND_HANDS'
  | 'COMPOUND_PRODIGY'
  | 'REAL_WORLD_GRADUATE'
  | 'GOAL_CRUSHER';

export interface Badge {
  id: BadgeId;
  title: string;
  description: string;
  iconName: string;
  unlockedAt?: string;
  requiredXp: number;
}

export type ChallengeLevel = 1 | 2 | 3;

export interface ChallengeTierConfig {
  level: ChallengeLevel;
  name: string;
  subtitle: string;
  minMonths: number;
  minDeferralPercent: number;
  baseInterestRate: number;
  interestMatchBonus: number; // e.g. 100%
  termCompletionBonus: number; // e.g. 20%
  defaultPerkTitle: string;
  perkOptions: string[];
  description: string;
  badgeUnlock: BadgeId;
}

export interface UserGamificationState {
  currentLevel: number;
  totalXp: number;
  unlockedBadgeIds: BadgeId[];
  streakMonths: number;
}
