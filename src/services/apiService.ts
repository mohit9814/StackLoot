import type { UserProfile } from '../types/profile';
import type { CurrencyCode } from '../types/allowance';

export interface AppPersistentState {
  profiles: UserProfile[];
  activeProfileId: string;
  currencyCode: CurrencyCode;
  lastUpdated: string;
}

export const apiService = {
  async fetchServerState(): Promise<AppPersistentState | null> {
    try {
      const res = await fetch('/api/state', {
        headers: { Accept: 'application/json' },
        cache: 'no-store',
      });
      if (!res.ok) return null;
      const data: AppPersistentState = await res.json();
      if (Array.isArray(data?.profiles) && data.profiles.length > 0) {
        return data;
      }
      return null;
    } catch {
      return null;
    }
  },

  async persistServerState(state: AppPersistentState): Promise<boolean> {
    try {
      const res = await fetch('/api/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state),
      });
      return res.ok;
    } catch {
      return false;
    }
  },
};
