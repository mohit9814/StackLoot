import { useState, useEffect, useMemo, useCallback } from 'react';
import type { WishlistGoal, GoalProgressInfo } from '../types/goal';
import { DEFAULT_INITIAL_GOALS } from '../config/appConfig';

export function useGoals(
  currentSavedAmount: number,
  monthlyContribution: number,
  annualRate: number,
  initialGoals: WishlistGoal[] = DEFAULT_INITIAL_GOALS,
  onGoalsChange?: (goals: WishlistGoal[]) => void
) {
  const [goals, setGoals] = useState<WishlistGoal[]>(initialGoals);

  // Synchronize when active profile changes
  useEffect(() => {
    setGoals(initialGoals);
  }, [initialGoals]);

  const updateGoalsState = useCallback((newGoals: WishlistGoal[]) => {
    setGoals(newGoals);
    if (onGoalsChange) {
      onGoalsChange(newGoals);
    }
  }, [onGoalsChange]);

  const addGoal = useCallback((title: string, targetAmount: number, category: WishlistGoal['category'], notes?: string) => {
    const newGoal: WishlistGoal = {
      id: `goal-${Date.now()}`,
      title: title.trim(),
      targetAmount,
      category,
      createdAt: new Date().toISOString(),
      notes,
    };
    const updated = [newGoal, ...goals];
    updateGoalsState(updated);
  }, [goals, updateGoalsState]);

  const removeGoal = useCallback((id: string) => {
    const updated = goals.filter(g => g.id !== id);
    updateGoalsState(updated);
  }, [goals, updateGoalsState]);

  // Compute goal progress analytics
  const goalsWithProgress: GoalProgressInfo[] = useMemo(() => {
    const monthlyRate = annualRate / 100 / 12;

    return goals.map(goal => {
      const percentageCompleted = Math.min(100, Math.round((currentSavedAmount / goal.targetAmount) * 100));
      const isUnlocked = currentSavedAmount >= goal.targetAmount;

      // Project months needed under compounding
      let compMonths = 0;
      let runningCompBalance = currentSavedAmount;
      const maxIter = 120;
      while (runningCompBalance < goal.targetAmount && compMonths < maxIter && monthlyContribution > 0) {
        compMonths++;
        const balanceBefore = runningCompBalance + monthlyContribution;
        const interest = balanceBefore * monthlyRate;
        runningCompBalance = balanceBefore + interest;
      }

      // Project months under zero interest (piggy bank)
      const remainingNeeded = Math.max(0, goal.targetAmount - currentSavedAmount);
      const noCompMonths = monthlyContribution > 0 ? Math.ceil(remainingNeeded / monthlyContribution) : 0;
      const monthsSaved = Math.max(0, noCompMonths - compMonths);

      return {
        goal,
        currentSaved: currentSavedAmount,
        percentageCompleted,
        projectedMonthsUnderCompound: compMonths,
        projectedMonthsUnderNoCompounding: noCompMonths,
        monthsSavedViaCompound: monthsSaved,
        isUnlocked,
      };
    });
  }, [goals, currentSavedAmount, monthlyContribution, annualRate]);

  return {
    goals,
    goalsWithProgress,
    addGoal,
    removeGoal,
  };
}
