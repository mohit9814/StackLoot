import { useState, useEffect, useMemo, useCallback } from 'react';
import type { SimulationParams, SimulationResult } from '../types/allowance';
import { DEFAULT_SIMULATION_PARAMS, CHALLENGE_TIERS } from '../config/appConfig';
import { calculateCompoundSchedule } from '../services/compoundEngine';

export function useSimulation(
  initialParams: SimulationParams = DEFAULT_SIMULATION_PARAMS,
  onParamsChange?: (params: SimulationParams) => void
) {
  const [params, setParamsState] = useState<SimulationParams>(initialParams);

  // Synchronize ONLY when initialParams serialized values genuinely change (e.g. switching child profile)
  const initialParamsKey = useMemo(
    () =>
      `${initialParams.monthlyAllowance}-${initialParams.deferralPercentage}-${initialParams.annualInterestRate}-${initialParams.termMonths}-${initialParams.completionBonusPercentage}-${initialParams.parentInterestMatchMultiplier}-${initialParams.initialLumpSumDeposit || 0}`,
    [
      initialParams.monthlyAllowance,
      initialParams.deferralPercentage,
      initialParams.annualInterestRate,
      initialParams.termMonths,
      initialParams.completionBonusPercentage,
      initialParams.parentInterestMatchMultiplier,
      initialParams.initialLumpSumDeposit,
    ]
  );

  useEffect(() => {
    setParamsState(initialParams);
  }, [initialParamsKey]); // Only re-sync when actual numeric values change!

  const updateSimulationParams = useCallback(
    (newParams: SimulationParams) => {
      setParamsState(newParams);
      if (onParamsChange) {
        onParamsChange(newParams);
      }
    },
    [onParamsChange]
  );

  const simulationResult: SimulationResult = useMemo(() => {
    return calculateCompoundSchedule(params);
  }, [params]);

  const updateParam = useCallback(
    <K extends keyof SimulationParams>(key: K, value: SimulationParams[K]) => {
      setParamsState((prev) => {
        const updated = {
          ...prev,
          [key]: value,
        };
        if (onParamsChange) {
          onParamsChange(updated);
        }
        return updated;
      });
    },
    [onParamsChange]
  );

  const applyChallengeTier = useCallback(
    (level: 1 | 2 | 3) => {
      const tier = CHALLENGE_TIERS.find((t) => t.level === level);
      if (!tier) return;

      setParamsState((prev) => {
        const updated: SimulationParams = {
          ...prev,
          termMonths: tier.minMonths,
          deferralPercentage: tier.minDeferralPercent,
          annualInterestRate: tier.baseInterestRate,
          completionBonusPercentage: tier.termCompletionBonus,
          parentInterestMatchMultiplier: tier.interestMatchBonus / 100,
        };
        if (onParamsChange) {
          onParamsChange(updated);
        }
        return updated;
      });
    },
    [onParamsChange]
  );

  const resetToDefault = useCallback(() => {
    updateSimulationParams(DEFAULT_SIMULATION_PARAMS);
  }, [updateSimulationParams]);

  return {
    params,
    setParams: updateSimulationParams,
    updateParam,
    simulationResult,
    applyChallengeTier,
    resetToDefault,
  };
}
