import type {
  MonthlyBreakdown,
  SimulationParams,
  SimulationResult,
  ActivePlanLedger,
  LedgerTransaction,
  BacklogSetupParams,
} from '../types/allowance';
import { COMMERCIAL_BANK_RATE_PERCENT } from '../config/appConfig';

export interface OpportunityLossComparison {
  termMonths: number;
  compoundedTotal: number;
  cashPiggyBankTotal: number;
  spentTotal: number;
  compoundingYieldLost: number; // Gains given up if kept in cash
  totalWealthLostIfSpent: number; // Total wealth lost if spent 100%
  percentGainOverPiggyBank: number;
}

export interface OpportunityLossReport {
  sixMonths: OpportunityLossComparison;
  oneYear: OpportunityLossComparison;
}

/**
 * Calculates compound interest and growth projection for deferred allowance.
 */
export function calculateCompoundSchedule(params: SimulationParams): SimulationResult {
  const {
    monthlyAllowance,
    deferralPercentage,
    annualInterestRate,
    termMonths,
    completionBonusPercentage,
    parentInterestMatchMultiplier,
    initialLumpSumDeposit = 0,
  } = params;

  const monthlyDeferredPrincipal = (monthlyAllowance * deferralPercentage) / 100;
  const monthlyLiquidPocket = monthlyAllowance - monthlyDeferredPrincipal;
  const monthlyRate = annualInterestRate / 100 / 12;
  const standardBankMonthlyRate = COMMERCIAL_BANK_RATE_PERCENT / 100 / 12;

  const breakdown: MonthlyBreakdown[] = [];
  let currentBalance = initialLumpSumDeposit;
  let bankBalance = initialLumpSumDeposit;
  let totalInterest = 0;
  let totalParentMatch = 0;

  for (let month = 1; month <= termMonths; month++) {
    const startingBalance = currentBalance;
    const addedAllowance = monthlyDeferredPrincipal;
    
    // Balance before monthly interest calculation
    const balanceBeforeInterest = startingBalance + addedAllowance;
    const interestEarned = balanceBeforeInterest * monthlyRate;
    const parentInterestMatch = interestEarned * parentInterestMatchMultiplier;
    
    totalInterest += interestEarned;
    totalParentMatch += parentInterestMatch;
    
    currentBalance = balanceBeforeInterest + interestEarned;
    
    // Standard bank calculation for comparison
    const bankBalanceBeforeInterest = bankBalance + addedAllowance;
    const bankInterest = bankBalanceBeforeInterest * standardBankMonthlyRate;
    bankBalance = bankBalanceBeforeInterest + bankInterest;

    breakdown.push({
      month,
      startingBalance,
      addedAllowance,
      liquidAllowance: monthlyLiquidPocket,
      interestEarned,
      parentInterestMatch,
      cumulativeInterest: totalInterest,
      endingBalance: currentBalance,
      standardBankEndingBalance: bankBalance,
    });
  }

  const totalPrincipalSaved = (monthlyDeferredPrincipal * termMonths) + initialLumpSumDeposit;
  const totalLiquidPocketMoney = monthlyLiquidPocket * termMonths;
  const completionBonus = (totalPrincipalSaved * completionBonusPercentage) / 100;
  const finalTotalBalance = currentBalance + totalParentMatch + completionBonus;

  // Snowball factor: ratio of final month's interest to month 1 interest
  const firstMonthInterest = breakdown[0]?.interestEarned || 1;
  const lastMonthInterest = breakdown[breakdown.length - 1]?.interestEarned || 1;
  const snowballFactor = firstMonthInterest > 0 ? Number((lastMonthInterest / firstMonthInterest).toFixed(2)) : 1;

  // Effective annual yield calculation
  const totalGains = totalInterest + totalParentMatch + completionBonus;
  const effectiveAnnualYield = totalPrincipalSaved > 0 
    ? ((totalGains / totalPrincipalSaved) * (12 / termMonths)) * 100 
    : 0;

  return {
    breakdown,
    totalPrincipalSaved,
    totalLiquidPocketMoney,
    totalInterestEarned: totalInterest,
    totalParentInterestMatch: totalParentMatch,
    completionBonus,
    finalTotalBalance,
    bankComparisonTotal: bankBalance,
    effectiveAnnualYield,
    snowballFactor,
  };
}

/**
 * Calculates Opportunity Loss / Cost of Not Compounding across 6 Months and 1 Year.
 */
export function calculateOpportunityLoss(
  monthlyAllowance: number,
  deferralPercentage: number,
  annualInterestRate: number,
  parentInterestMatchMultiplier: number,
  completionBonusPercentage: number,
  initialLumpSumDeposit: number = 0
): OpportunityLossReport {
  const getComparisonForMonths = (months: number): OpportunityLossComparison => {
    const sim = calculateCompoundSchedule({
      monthlyAllowance,
      deferralPercentage,
      annualInterestRate,
      termMonths: months,
      completionBonusPercentage,
      parentInterestMatchMultiplier,
      initialLumpSumDeposit,
    });

    const cashPiggyBankTotal = sim.totalPrincipalSaved;
    const compoundedTotal = sim.finalTotalBalance;
    const compoundingYieldLost = Math.max(0, compoundedTotal - cashPiggyBankTotal);
    const percentGainOverPiggyBank = cashPiggyBankTotal > 0
      ? Math.round((compoundingYieldLost / cashPiggyBankTotal) * 100)
      : 0;

    return {
      termMonths: months,
      compoundedTotal,
      cashPiggyBankTotal,
      spentTotal: 0,
      compoundingYieldLost,
      totalWealthLostIfSpent: compoundedTotal,
      percentGainOverPiggyBank,
    };
  };

  return {
    sixMonths: getComparisonForMonths(6),
    oneYear: getComparisonForMonths(12),
  };
}

/**
 * Calculates early withdrawal penalty and net payout if teen requests liquidity escape hatch.
 */
export function calculateEarlyWithdrawal(
  currentBalance: number,
  totalPrincipalContributed: number,
  totalInterestAccrued: number
): {
  principalReturned: number;
  interestForfeited: number;
  penaltyFeePercent: number;
  netPayout: number;
} {
  return {
    principalReturned: totalPrincipalContributed,
    interestForfeited: totalInterestAccrued,
    penaltyFeePercent: currentBalance > 0 ? (totalInterestAccrued / currentBalance) * 100 : 0,
    netPayout: totalPrincipalContributed,
  };
}

/**
 * Creates a backdated active plan ledger with historical deposit, interest, and bonus transactions.
 * Enables setting up a backlog (e.g. 3 past months) and automatically calculates exact retroactive compounding.
 */
export function createBackdatedPlan(params: BacklogSetupParams): ActivePlanLedger {
  const {
    teenName,
    parentName,
    monthlyAllowance,
    deferralPercentage,
    annualInterestRate,
    targetTermMonths,
    completionBonusPercentage,
    parentInterestMatchMultiplier,
    selectedPerk,
    backlogMonthsCompleted,
    startDate,
    initialLumpSumDeposit = 0,
  } = params;

  const monthlyDeferredPrincipal = (monthlyAllowance * deferralPercentage) / 100;
  const monthlyRate = annualInterestRate / 100 / 12;

  const transactions: LedgerTransaction[] = [];
  let runningBalance = 0;
  let totalPrincipal = 0;
  let totalInterest = 0;
  let totalBonuses = 0;

  const baseDate = new Date(startDate);

  // Optional initial prior lump sum deposit
  if (initialLumpSumDeposit > 0) {
    runningBalance += initialLumpSumDeposit;
    totalPrincipal += initialLumpSumDeposit;
    transactions.push({
      id: `tx-init-${Date.now()}`,
      date: new Date(baseDate).toISOString(),
      monthIndex: 0,
      type: 'DEPOSIT',
      amount: initialLumpSumDeposit,
      balanceAfter: runningBalance,
      notes: `Prior Initial Savings Balance Brought Forward`,
    });
  }

  // Iterate over each backdated completed month
  for (let m = 1; m <= backlogMonthsCompleted; m++) {
    const monthDate = new Date(baseDate);
    monthDate.setMonth(baseDate.getMonth() + (m - 1));
    const dateStr = monthDate.toISOString();

    // 1. Monthly Deposit
    runningBalance += monthlyDeferredPrincipal;
    totalPrincipal += monthlyDeferredPrincipal;
    transactions.push({
      id: `tx-backlog-dep-${m}`,
      date: dateStr,
      monthIndex: m,
      type: 'DEPOSIT',
      amount: monthlyDeferredPrincipal,
      balanceAfter: runningBalance,
      notes: `Month ${m} Backdated Allowance Deposit (${deferralPercentage}%)`,
    });

    // 2. Compounding Interest Accrual on balance
    const interestEarned = runningBalance * monthlyRate;
    runningBalance += interestEarned;
    totalInterest += interestEarned;
    transactions.push({
      id: `tx-backlog-int-${m}`,
      date: dateStr,
      monthIndex: m,
      type: 'INTEREST_CREDIT',
      amount: interestEarned,
      balanceAfter: runningBalance,
      notes: `Month ${m} Retroactive Compound Interest (${annualInterestRate}% p.a.)`,
    });

    // 3. Parent Interest Match
    const parentMatch = interestEarned * parentInterestMatchMultiplier;
    if (parentMatch > 0) {
      runningBalance += parentMatch;
      totalBonuses += parentMatch;
      transactions.push({
        id: `tx-backlog-match-${m}`,
        date: dateStr,
        monthIndex: m,
        type: 'BONUS_MATCH',
        amount: parentMatch,
        balanceAfter: runningBalance,
        notes: `Month ${m} Parent ${(parentInterestMatchMultiplier * 100).toFixed(0)}% Interest Match`,
      });
    }
  }

  // Check if term completed during backlog
  let status: 'ACTIVE' | 'COMPLETED' = 'ACTIVE';
  if (backlogMonthsCompleted >= targetTermMonths) {
    status = 'COMPLETED';
    const completionBonus = (totalPrincipal * completionBonusPercentage) / 100;
    if (completionBonus > 0) {
      runningBalance += completionBonus;
      totalBonuses += completionBonus;
      const finalDate = new Date(baseDate);
      finalDate.setMonth(baseDate.getMonth() + (backlogMonthsCompleted - 1));
      transactions.push({
        id: `tx-backlog-bonus-${Date.now()}`,
        date: finalDate.toISOString(),
        monthIndex: backlogMonthsCompleted,
        type: 'BONUS_MATCH',
        amount: completionBonus,
        balanceAfter: runningBalance,
        notes: `🎉 Milestone Completion Kicker (${completionBonusPercentage}% of Principal)!`,
      });
    }
  }

  return {
    planId: `plan-${Date.now()}`,
    teenName: teenName.trim() || 'Akshat',
    parentName: parentName.trim() || 'Dad',
    startDate: new Date(startDate).toISOString(),
    targetTermMonths,
    monthlyAllowance,
    deferralPercentage,
    annualInterestRate,
    completionBonusPercentage,
    parentInterestMatchMultiplier,
    initialLumpSumDeposit,
    currentBalance: runningBalance,
    totalPrincipalContributed: totalPrincipal,
    totalInterestEarned: totalInterest,
    totalBonusesEarned: totalBonuses,
    status,
    transactions,
    selectedPerk,
  };
}
