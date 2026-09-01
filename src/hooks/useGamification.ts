import { useState, useEffect, useCallback } from 'react';
import type { UserGamificationState, BadgeId } from '../types/gamification';
import type { ActivePlanLedger } from '../types/allowance';
import { storageService } from '../services/storageService';
import { calculateLevelFromXp, evaluateBadges } from '../services/gamificationEngine';
import confetti from 'canvas-confetti';

export function useGamification(activePlan: ActivePlanLedger | null, completedGoalsCount: number) {
  const [state, setState] = useState<UserGamificationState>(() => {
    return storageService.loadGamificationState();
  });

  const [recentUnlock, setRecentUnlock] = useState<BadgeId | null>(null);

  // Sync to storage
  useEffect(() => {
    storageService.saveGamificationState(state);
  }, [state]);

  // Check for badge unlocks whenever ledger or goals update
  useEffect(() => {
    const { newBadges, earnedXp } = evaluateBadges(state, activePlan, completedGoalsCount);

    if (newBadges.length > 0) {
      const updatedXp = state.totalXp + earnedXp;
      const updatedLevel = calculateLevelFromXp(updatedXp);
      const updatedBadgeIds = [...state.unlockedBadgeIds, ...newBadges];

      setState(prev => ({
        ...prev,
        totalXp: updatedXp,
        currentLevel: updatedLevel,
        unlockedBadgeIds: updatedBadgeIds,
      }));

      setRecentUnlock(newBadges[0]);

      // Fire celebratory confetti!
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // Ignore in environments without canvas
      }
    }
  }, [activePlan, completedGoalsCount, state]);

  const clearRecentUnlock = useCallback(() => {
    setRecentUnlock(null);
  }, []);

  return {
    state,
    recentUnlock,
    clearRecentUnlock,
  };
}
