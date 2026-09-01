import { useState, useEffect, useCallback } from 'react';
import type { ActivePlanLedger, LedgerTransaction, BacklogSetupParams } from '../types/allowance';
import { calculateEarlyWithdrawal, createBackdatedPlan } from '../services/compoundEngine';

export function useLedger(
  initialPlan: ActivePlanLedger | null,
  onPlanUpdate?: (plan: ActivePlanLedger | null) => void
) {
  const [activePlan, setActivePlan] = useState<ActivePlanLedger | null>(initialPlan);

  // Sync state when active profile changes
  useEffect(() => {
    setActivePlan(initialPlan);
  }, [initialPlan]);

  const updatePlanState = useCallback((plan: ActivePlanLedger | null) => {
    setActivePlan(plan);
    if (onPlanUpdate) {
      onPlanUpdate(plan);
    }
  }, [onPlanUpdate]);

  // Create a brand new active plan from Day 1
  const createPlan = useCallback((
    teenName: string,
    parentName: string,
    monthlyAllowance: number,
    deferralPercentage: number,
    annualInterestRate: number,
    targetTermMonths: number,
    completionBonusPercentage: number,
    parentInterestMatchMultiplier: number,
    selectedPerk?: string
  ): ActivePlanLedger => {
    const initialPrincipal = (monthlyAllowance * deferralPercentage) / 100;
    const initialTransaction: LedgerTransaction = {
      id: `tx-${Date.now()}-1`,
      date: new Date().toISOString(),
      monthIndex: 1,
      type: 'DEPOSIT',
      amount: initialPrincipal,
      balanceAfter: initialPrincipal,
      notes: `Month 1 Initial Deferred Allowance Deposit (${deferralPercentage}%)`,
    };

    const newPlan: ActivePlanLedger = {
      planId: `plan-${Date.now()}`,
      teenName: teenName.trim() || 'Akshat',
      parentName: parentName.trim() || 'Dad',
      startDate: new Date().toISOString(),
      targetTermMonths,
      monthlyAllowance,
      deferralPercentage,
      annualInterestRate,
      completionBonusPercentage,
      parentInterestMatchMultiplier,
      currentBalance: initialPrincipal,
      totalPrincipalContributed: initialPrincipal,
      totalInterestEarned: 0,
      totalBonusesEarned: 0,
      status: 'ACTIVE',
      transactions: [initialTransaction],
      selectedPerk,
    };

    updatePlanState(newPlan);
    return newPlan;
  }, [updatePlanState]);

  // Setup Backdated Historical Backlog Plan
  const setupBackdatedPlan = useCallback((params: BacklogSetupParams): ActivePlanLedger => {
    const backdatedPlan = createBackdatedPlan(params);
    updatePlanState(backdatedPlan);
    return backdatedPlan;
  }, [updatePlanState]);

  // Process next monthly deposit & interest accrual
  const processNextMonthlyCycle = useCallback(() => {
    if (!activePlan || activePlan.status !== 'ACTIVE') return;

    const currentDepositsCount = activePlan.transactions.filter(t => t.type === 'DEPOSIT').length;
    const nextMonthIndex = currentDepositsCount + 1;
    const monthlyDepositPrincipal = (activePlan.monthlyAllowance * activePlan.deferralPercentage) / 100;
    
    // Monthly interest calculation on starting balance + deposit
    const balanceBeforeInterest = activePlan.currentBalance + monthlyDepositPrincipal;
    const monthlyRate = activePlan.annualInterestRate / 100 / 12;
    const interestEarned = balanceBeforeInterest * monthlyRate;
    const parentMatchEarned = interestEarned * activePlan.parentInterestMatchMultiplier;

    const newTransactions: LedgerTransaction[] = [...activePlan.transactions];

    // Deposit transaction
    const depositTx: LedgerTransaction = {
      id: `tx-${Date.now()}-dep`,
      date: new Date().toISOString(),
      monthIndex: nextMonthIndex,
      type: 'DEPOSIT',
      amount: monthlyDepositPrincipal,
      balanceAfter: activePlan.currentBalance + monthlyDepositPrincipal,
      notes: `Month ${nextMonthIndex} Deferred Allowance Deposit`,
    };
    newTransactions.push(depositTx);

    // Interest credit transaction
    const interestTx: LedgerTransaction = {
      id: `tx-${Date.now()}-int`,
      date: new Date().toISOString(),
      monthIndex: nextMonthIndex,
      type: 'INTEREST_CREDIT',
      amount: interestEarned,
      balanceAfter: activePlan.currentBalance + monthlyDepositPrincipal + interestEarned,
      notes: `Month ${nextMonthIndex} Compounding Interest (${activePlan.annualInterestRate}% p.a.)`,
    };
    newTransactions.push(interestTx);

    let bonusMatchTxAmount = 0;
    if (parentMatchEarned > 0) {
      bonusMatchTxAmount = parentMatchEarned;
      const matchTx: LedgerTransaction = {
        id: `tx-${Date.now()}-match`,
        date: new Date().toISOString(),
        monthIndex: nextMonthIndex,
        type: 'BONUS_MATCH',
        amount: parentMatchEarned,
        balanceAfter: activePlan.currentBalance + monthlyDepositPrincipal + interestEarned + parentMatchEarned,
        notes: `Month ${nextMonthIndex} Parent 100% Interest Match`,
      };
      newTransactions.push(matchTx);
    }

    const updatedBalance = activePlan.currentBalance + monthlyDepositPrincipal + interestEarned + bonusMatchTxAmount;
    const updatedTotalPrincipal = activePlan.totalPrincipalContributed + monthlyDepositPrincipal;
    const updatedTotalInterest = activePlan.totalInterestEarned + interestEarned;
    const updatedTotalBonuses = activePlan.totalBonusesEarned + bonusMatchTxAmount;

    // Check if target term reached
    let newStatus: 'ACTIVE' | 'COMPLETED' = 'ACTIVE';
    let finalCompletionBonus = 0;

    if (nextMonthIndex >= activePlan.targetTermMonths) {
      newStatus = 'COMPLETED';
      finalCompletionBonus = (updatedTotalPrincipal * activePlan.completionBonusPercentage) / 100;
      if (finalCompletionBonus > 0) {
        newTransactions.push({
          id: `tx-${Date.now()}-bonus`,
          date: new Date().toISOString(),
          monthIndex: nextMonthIndex,
          type: 'BONUS_MATCH',
          amount: finalCompletionBonus,
          balanceAfter: updatedBalance + finalCompletionBonus,
          notes: `🎉 Milestone Completion Kicker (${activePlan.completionBonusPercentage}% of Principal)!`,
        });
      }
    }

    const updatedPlan: ActivePlanLedger = {
      ...activePlan,
      currentBalance: updatedBalance + finalCompletionBonus,
      totalPrincipalContributed: updatedTotalPrincipal,
      totalInterestEarned: updatedTotalInterest,
      totalBonusesEarned: updatedTotalBonuses + finalCompletionBonus,
      status: newStatus,
      transactions: newTransactions,
    };

    updatePlanState(updatedPlan);
  }, [activePlan, updatePlanState]);

  // Early withdrawal escape hatch
  const executeEarlyWithdrawal = useCallback(() => {
    if (!activePlan || activePlan.status !== 'ACTIVE') return;

    const penaltyCalc = calculateEarlyWithdrawal(
      activePlan.currentBalance,
      activePlan.totalPrincipalContributed,
      activePlan.totalInterestEarned + activePlan.totalBonusesEarned
    );

    const withdrawalTx: LedgerTransaction = {
      id: `tx-${Date.now()}-withdraw`,
      date: new Date().toISOString(),
      monthIndex: activePlan.transactions.length,
      type: 'EARLY_WITHDRAWAL',
      amount: penaltyCalc.netPayout,
      balanceAfter: 0,
      notes: `Early Liquidity Release: 100% Principal refunded (${penaltyCalc.principalReturned}). Accrued interest (${penaltyCalc.interestForfeited}) forfeited.`,
      isPenaltyApplied: true,
    };

    const updatedPlan: ActivePlanLedger = {
      ...activePlan,
      currentBalance: 0,
      status: 'EARLY_WITHDRAWN',
      transactions: [...activePlan.transactions, withdrawalTx],
    };

    updatePlanState(updatedPlan);
  }, [activePlan, updatePlanState]);

  // Reset or clear ledger
  const resetLedger = useCallback(() => {
    updatePlanState(null);
  }, [updatePlanState]);

  return {
    activePlan,
    createPlan,
    setupBackdatedPlan,
    processNextMonthlyCycle,
    executeEarlyWithdrawal,
    resetLedger,
  };
}
