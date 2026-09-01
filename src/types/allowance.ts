export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  label: string;
  exchangeRateMultiplier: number;
}

export interface SimulationParams {
  monthlyAllowance: number;
  deferralPercentage: number; // 0 to 100
  annualInterestRate: number; // in percentage, e.g., 10 for 10%
  termMonths: number; // e.g., 3, 6, 12, 24
  completionBonusPercentage: number; // e.g. 20 for 20%
  parentInterestMatchMultiplier: number; // e.g. 1.0 for 100% match (doubling interest)
  initialLumpSumDeposit?: number; // Optional prior lump sum balance brought forward
}

export interface MonthlyBreakdown {
  month: number;
  startingBalance: number;
  addedAllowance: number; // Principal added this month
  liquidAllowance: number; // Non-deferred part kept immediately for pocket money
  interestEarned: number; // Compounded interest for the month
  parentInterestMatch: number; // Optional parent match on the interest
  cumulativeInterest: number;
  endingBalance: number;
  standardBankEndingBalance: number; // Commercial bank 3% benchmark
}

export interface SimulationResult {
  breakdown: MonthlyBreakdown[];
  totalPrincipalSaved: number;
  totalLiquidPocketMoney: number;
  totalInterestEarned: number;
  totalParentInterestMatch: number;
  completionBonus: number;
  finalTotalBalance: number;
  bankComparisonTotal: number;
  effectiveAnnualYield: number;
  snowballFactor: number; // Ratio of last month interest to first month interest
}

export type TransactionType = 'DEPOSIT' | 'INTEREST_CREDIT' | 'BONUS_MATCH' | 'EARLY_WITHDRAWAL' | 'TERM_PAYOUT';

export interface LedgerTransaction {
  id: string;
  date: string; // ISO date string
  monthIndex: number;
  type: TransactionType;
  amount: number;
  balanceAfter: number;
  notes: string;
  isPenaltyApplied?: boolean;
}

export interface ActivePlanLedger {
  planId: string;
  teenName: string;
  parentName: string;
  startDate: string;
  targetTermMonths: number;
  monthlyAllowance: number;
  deferralPercentage: number;
  annualInterestRate: number;
  completionBonusPercentage: number;
  parentInterestMatchMultiplier: number;
  initialLumpSumDeposit?: number;
  currentBalance: number;
  totalPrincipalContributed: number;
  totalInterestEarned: number;
  totalBonusesEarned: number;
  status: 'ACTIVE' | 'COMPLETED' | 'EARLY_WITHDRAWN';
  transactions: LedgerTransaction[];
  selectedPerk?: string;
}

export interface BacklogSetupParams {
  teenName: string;
  parentName: string;
  monthlyAllowance: number;
  deferralPercentage: number;
  annualInterestRate: number;
  targetTermMonths: number;
  completionBonusPercentage: number;
  parentInterestMatchMultiplier: number;
  selectedPerk?: string;
  backlogMonthsCompleted: number; // e.g., 3 months
  startDate: string; // ISO Date or YYYY-MM-DD
  initialLumpSumDeposit?: number;
}
