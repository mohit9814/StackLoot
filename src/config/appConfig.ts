import type { SimulationParams } from '../types/allowance';
import type { ChallengeTierConfig, Badge } from '../types/gamification';
import type { WishlistGoal } from '../types/goal';

export const COMMERCIAL_BANK_RATE_PERCENT = 3.0; // 3% standard bank rate benchmark

export const DEFAULT_SIMULATION_PARAMS: SimulationParams = {
  monthlyAllowance: 2000,
  deferralPercentage: 100,
  annualInterestRate: 10, // 10% p.a., compounded monthly
  termMonths: 6,
  completionBonusPercentage: 20, // 20% flat completion bonus
  parentInterestMatchMultiplier: 1.0, // 100% match on interest earned
};

export const CHALLENGE_TIERS: ChallengeTierConfig[] = [
  {
    level: 1,
    name: 'The 3-Month Sprint',
    subtitle: 'Taste the First Snowball',
    minMonths: 3,
    minDeferralPercent: 50,
    baseInterestRate: 10,
    interestMatchBonus: 0,
    termCompletionBonus: 10,
    defaultPerkTitle: 'Favorite Pizza Night or Game DLC Add-on',
    perkOptions: [
      'Favorite Pizza Night with Friends',
      'Game DLC / Steam Credit (₹500)',
      'Cinema Tickets for Two',
      'Choose the Weekend Family Movie & Treats',
    ],
    description: 'Commit to deferring at least 50% of your allowance for 3 months. Earn high yield plus a sweet real-life treat on completion.',
    badgeUnlock: 'THREE_MONTH_SPRINT',
  },
  {
    level: 2,
    name: 'The 6-Month Marathon',
    subtitle: 'Parent Double-Match & Compounding Accelerator',
    minMonths: 6,
    minDeferralPercent: 75,
    baseInterestRate: 12,
    interestMatchBonus: 100, // Double the interest
    termCompletionBonus: 20,
    defaultPerkTitle: '100% Parent Match on Total Interest + New Tech Gadget',
    perkOptions: [
      '100% Parent Match (Interest Doubled!)',
      'Upgraded Headphones or Tech Accessory',
      'Amusement Park / Concert Pass',
      'Guitar Gear / Creative Instrument Upgrade',
    ],
    description: 'Defer 75% to 100% for 6 full months. Unlock an enhanced interest rate plus Mom & Dad match 100% of all interest your money earned!',
    badgeUnlock: 'SIX_MONTH_MARATHON',
  },
  {
    level: 3,
    name: 'The Real-World Graduate',
    subtitle: 'Step into Real Markets (Index Fund / Custodial)',
    minMonths: 12,
    minDeferralPercent: 75,
    baseInterestRate: 15,
    interestMatchBonus: 100,
    termCompletionBonus: 25,
    defaultPerkTitle: 'Custodial Index Fund Account Setup & First Share Owned',
    perkOptions: [
      'Custodial Nifty 50 / S&P 500 Index Fund Starter',
      'High-Yield Sovereign / Corporate Bond Account',
      'Startup Seed Angel Simulator Portfolio',
      'Personal Laptop / Workstation Capital Match',
    ],
    description: 'Graduate from the "Bank of Dad" simulator. Deploy your compounding capital into real-world index funds and custodial investments.',
    badgeUnlock: 'REAL_WORLD_GRADUATE',
  },
];

export const BADGES_CATALOG: Badge[] = [
  {
    id: 'FIRST_DEPOSIT',
    title: 'First Seed Planted',
    description: 'Made your first monthly allowance deferral deposit into the Bank of Dad.',
    iconName: 'Sprout',
    requiredXp: 100,
  },
  {
    id: 'SNOWBALL_STARTER',
    title: 'Snowball Starter',
    description: 'Accrued your first ₹100 in compounding interest.',
    iconName: 'Snowflake',
    requiredXp: 250,
  },
  {
    id: 'THREE_MONTH_SPRINT',
    title: 'Sprint Finisher',
    description: 'Successfully completed the 3-Month Deferred Sprint without breaking the lock.',
    iconName: 'Zap',
    requiredXp: 500,
  },
  {
    id: 'SIX_MONTH_MARATHON',
    title: 'Marathon Champion',
    description: 'Completed the 6-Month Marathon and earned the Parent Match bonus!',
    iconName: 'Trophy',
    requiredXp: 1200,
  },
  {
    id: 'DIAMOND_HANDS',
    title: 'Diamond Hands',
    description: 'Held a 100% deferral streak for 4 consecutive months without early withdrawals.',
    iconName: 'Gem',
    requiredXp: 800,
  },
  {
    id: 'COMPOUND_PRODIGY',
    title: 'Compounding Prodigy',
    description: 'Generated more interest in a single month than your entire Month 1 allowance.',
    iconName: 'TrendingUp',
    requiredXp: 1500,
  },
  {
    id: 'REAL_WORLD_GRADUATE',
    title: 'Market Graduate',
    description: 'Completed Level 3 and opened a custodial market-linked investment.',
    iconName: 'GraduationCap',
    requiredXp: 2500,
  },
  {
    id: 'GOAL_CRUSHER',
    title: 'Goal Crusher',
    description: 'Fully funded a custom Wishlist target using deferred compounding savings.',
    iconName: 'Target',
    requiredXp: 1000,
  },
];

export const DEFAULT_INITIAL_GOALS: WishlistGoal[] = [
  {
    id: 'goal-1',
    title: 'Electric Guitar & Amp Upgrade',
    targetAmount: 12000,
    category: 'MUSIC',
    createdAt: new Date().toISOString(),
    notes: 'Yamaha Pacifica + Boss Katana Mini Amp',
  },
  {
    id: 'goal-2',
    title: 'High-Performance Gaming GPU / Console',
    targetAmount: 25000,
    category: 'GAMING',
    createdAt: new Date().toISOString(),
    notes: 'PlayStation 5 or RTX Graphics Card for PC build',
  },
  {
    id: 'goal-3',
    title: 'Noise Cancelling Headphones',
    targetAmount: 8000,
    category: 'TECH',
    createdAt: new Date().toISOString(),
    notes: 'Sony WH-CH720N for study & travel focus',
  },
];
