import type { UserProfile, CreateProfileParams } from '../types/profile';
import { DEFAULT_SIMULATION_PARAMS, DEFAULT_INITIAL_GOALS } from '../config/appConfig';
import { apiService, type AppPersistentState } from './apiService';

const STORAGE_KEY_PROFILES = 'bod_profiles_v1';
const STORAGE_KEY_ACTIVE_PROFILE_ID = 'bod_active_profile_id_v1';

export function createDefaultProfile(id = 'profile-akshat-default', name = 'Akshat'): UserProfile {
  return {
    id,
    teenName: name,
    parentName: 'Dad',
    avatarEmoji: '🚀',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    currencyCode: 'INR',
    simulationParams: { ...DEFAULT_SIMULATION_PARAMS },
    activePlan: null,
    goals: [...DEFAULT_INITIAL_GOALS],
    gamification: {
      currentLevel: 1,
      totalXp: 50,
      unlockedBadgeIds: ['FIRST_DEPOSIT'],
      streakMonths: 0,
    },
  };
}

export const profileService = {
  loadProfiles(): UserProfile[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_PROFILES);
      let parsed: UserProfile[] = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(parsed) || parsed.length === 0) {
        return [createDefaultProfile()];
      }
      return parsed;
    } catch {
      return [createDefaultProfile()];
    }
  },

  saveProfiles(profiles: UserProfile[]): void {
    try {
      localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(profiles));
      const activeId = this.loadActiveProfileId();
      const current = profiles.find((p) => p.id === activeId) || profiles[0];
      if (current?.activePlan) {
        localStorage.setItem('bank_of_dad_active_plan_v1', JSON.stringify(current.activePlan));
      }

      // Persist to filesystem API
      const persistentState: AppPersistentState = {
        profiles,
        activeProfileId: activeId,
        currencyCode: current?.currencyCode || 'INR',
        lastUpdated: new Date().toISOString(),
      };
      apiService.persistServerState(persistentState).catch((err) => {
        console.warn('Filesystem persist warning:', err);
      });
    } catch (e) {
      console.error('Failed to save profiles to localStorage', e);
    }
  },

  loadActiveProfileId(): string {
    const stored = localStorage.getItem(STORAGE_KEY_ACTIVE_PROFILE_ID);
    if (stored) return stored;
    const profiles = this.loadProfiles();
    return profiles[0]?.id || 'profile-akshat-default';
  },

  setActiveProfileId(id: string): void {
    try {
      localStorage.setItem(STORAGE_KEY_ACTIVE_PROFILE_ID, id);
      const profiles = this.loadProfiles();
      const current = profiles.find((p) => p.id === id) || profiles[0];
      const persistentState: AppPersistentState = {
        profiles,
        activeProfileId: id,
        currencyCode: current?.currencyCode || 'INR',
        lastUpdated: new Date().toISOString(),
      };
      apiService.persistServerState(persistentState).catch(() => {});
    } catch (e) {
      console.error('Failed to save active profile id', e);
    }
  },

  createProfile(params: CreateProfileParams): UserProfile {
    const profiles = this.loadProfiles();
    const id = `profile-${Date.now()}`;
    const newProfile: UserProfile = {
      id,
      teenName: params.teenName.trim() || 'New Saver',
      parentName: params.parentName?.trim() || 'Dad',
      avatarEmoji: params.avatarEmoji || '💎',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      currencyCode: params.currencyCode || 'INR',
      simulationParams: {
        ...DEFAULT_SIMULATION_PARAMS,
        monthlyAllowance: params.monthlyAllowance || DEFAULT_SIMULATION_PARAMS.monthlyAllowance,
        deferralPercentage: params.deferralPercentage || DEFAULT_SIMULATION_PARAMS.deferralPercentage,
        annualInterestRate: params.annualInterestRate || DEFAULT_SIMULATION_PARAMS.annualInterestRate,
        termMonths: params.termMonths || DEFAULT_SIMULATION_PARAMS.termMonths,
      },
      activePlan: null,
      goals: [...DEFAULT_INITIAL_GOALS],
      gamification: {
        currentLevel: 1,
        totalXp: 50,
        unlockedBadgeIds: ['FIRST_DEPOSIT'],
        streakMonths: 0,
      },
    };

    const updated = [...profiles, newProfile];
    this.saveProfiles(updated);
    this.setActiveProfileId(id);
    return newProfile;
  },

  importOrUpdateProfile(profile: UserProfile): void {
    const profiles = this.loadProfiles();
    const existingIndex = profiles.findIndex((p) => p.id === profile.id);
    let updated: UserProfile[];
    if (existingIndex >= 0) {
      updated = [...profiles];
      updated[existingIndex] = { ...profile, updatedAt: new Date().toISOString() };
    } else {
      updated = [profile, ...profiles];
    }
    this.saveProfiles(updated);
    this.setActiveProfileId(profile.id);
  },

  updateProfile(id: string, updates: Partial<UserProfile>): UserProfile[] {
    const profiles = this.loadProfiles();
    const updated = profiles.map((p) => {
      if (p.id === id) {
        return {
          ...p,
          ...updates,
          updatedAt: new Date().toISOString(),
        };
      }
      return p;
    });
    this.saveProfiles(updated);
    return updated;
  },

  resetProfile(id: string): UserProfile[] {
    const profiles = this.loadProfiles();
    const updated: UserProfile[] = profiles.map((p) => {
      if (p.id === id) {
        return {
          ...p,
          activePlan: null,
          simulationParams: { ...DEFAULT_SIMULATION_PARAMS },
          goals: [...DEFAULT_INITIAL_GOALS],
          gamification: {
            currentLevel: 1,
            totalXp: 50,
            unlockedBadgeIds: ['FIRST_DEPOSIT'],
            streakMonths: 0,
          },
          updatedAt: new Date().toISOString(),
        };
      }
      return p;
    });
    this.saveProfiles(updated);
    return updated;
  },

  deleteProfile(id: string): { updatedProfiles: UserProfile[]; newActiveId: string } {
    const profiles = this.loadProfiles();
    if (profiles.length <= 1) {
      const reset = this.resetProfile(id);
      return { updatedProfiles: reset, newActiveId: id };
    }

    const filtered = profiles.filter((p) => p.id !== id);
    this.saveProfiles(filtered);

    let currentActive = this.loadActiveProfileId();
    if (currentActive === id) {
      currentActive = filtered[0].id;
      this.setActiveProfileId(currentActive);
    }

    return { updatedProfiles: filtered, newActiveId: currentActive };
  },
};
