import type { ActivePlanLedger, CurrencyCode } from '../types/allowance';
import type { WishlistGoal } from '../types/goal';
import type { UserGamificationState } from '../types/gamification';
import { DEFAULT_INITIAL_GOALS } from '../config/appConfig';

const STORAGE_KEYS = {
  ACTIVE_PLAN: 'bank_of_dad_active_plan_v1',
  GOALS: 'bank_of_dad_goals_v1',
  GAMIFICATION: 'bank_of_dad_gamification_v1',
  CURRENCY: 'bank_of_dad_currency_v1',
} as const;

export const storageService = {
  // Active Plan Ledger
  loadActivePlan(): ActivePlanLedger | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACTIVE_PLAN);
      if (!data) return null;
      return JSON.parse(data);
    } catch {
      return null;
    }
  },

  saveActivePlan(plan: ActivePlanLedger): void {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_PLAN, JSON.stringify(plan));
  },

  clearActivePlan(): void {
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_PLAN);
  },

  // Goals
  loadGoals(): WishlistGoal[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.GOALS);
      if (!data) return DEFAULT_INITIAL_GOALS;
      return JSON.parse(data);
    } catch {
      return DEFAULT_INITIAL_GOALS;
    }
  },

  saveGoals(goals: WishlistGoal[]): void {
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
  },

  // Gamification
  loadGamificationState(): UserGamificationState {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.GAMIFICATION);
      if (!data) {
        return {
          currentLevel: 1,
          totalXp: 100,
          unlockedBadgeIds: ['FIRST_DEPOSIT'],
          streakMonths: 1,
        };
      }
      return JSON.parse(data);
    } catch {
      return {
        currentLevel: 1,
        totalXp: 100,
        unlockedBadgeIds: ['FIRST_DEPOSIT'],
        streakMonths: 1,
      };
    }
  },

  saveGamificationState(state: UserGamificationState): void {
    localStorage.setItem(STORAGE_KEYS.GAMIFICATION, JSON.stringify(state));
  },

  // Currency
  loadCurrency(): CurrencyCode {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENCY) as CurrencyCode;
    return saved || 'INR';
  },

  saveCurrency(code: CurrencyCode): void {
    localStorage.setItem(STORAGE_KEYS.CURRENCY, code);
  },

  // Backup & Restore
  exportAllData(): string {
    const payload = {
      activePlan: this.loadActivePlan(),
      goals: this.loadGoals(),
      gamification: this.loadGamificationState(),
      currency: this.loadCurrency(),
      exportDate: new Date().toISOString(),
    };
    return JSON.stringify(payload, null, 2);
  },

  importAllData(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.activePlan) this.saveActivePlan(parsed.activePlan);
      if (parsed.goals) this.saveGoals(parsed.goals);
      if (parsed.gamification) this.saveGamificationState(parsed.gamification);
      if (parsed.currency) this.saveCurrency(parsed.currency);
      return true;
    } catch {
      return false;
    }
  },
};
