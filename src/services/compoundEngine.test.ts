import { describe, it, expect } from 'vitest';
import {
  calculateCompoundSchedule,
  calculateEarlyWithdrawal,
  createBackdatedPlan,
  calculateOpportunityLoss,
} from './compoundEngine';

describe('compoundEngine - Bank of Mom & Dad Compounding Mechanics', () => {
  it('correctly calculates 6-month simulation matching prompt values for ₹2,000/month at 10% p.a.', () => {
    const result = calculateCompoundSchedule({
      monthlyAllowance: 2000,
      deferralPercentage: 100,
      annualInterestRate: 10,
      termMonths: 6,
      completionBonusPercentage: 0,
      parentInterestMatchMultiplier: 0,
    });

    expect(result.breakdown).toHaveLength(6);
    expect(result.totalPrincipalSaved).toBe(12000);
    
    // Month 1 interest ~ 16.67 (rounds to 17)
    expect(Math.round(result.breakdown[0].interestEarned)).toBe(17);
    expect(Math.round(result.breakdown[0].endingBalance)).toBe(2017);

    // Month 6 interest ~ 102
    expect(Math.round(result.breakdown[5].interestEarned)).toBe(102);
    expect(Math.round(result.breakdown[5].endingBalance)).toBe(12355);

    // Snowball factor is ~ 6x
    expect(result.snowballFactor).toBeGreaterThanOrEqual(5.8);
    expect(result.snowballFactor).toBeLessThanOrEqual(6.2);
  });

  it('correctly applies milestone completion bonus and parent match', () => {
    const result = calculateCompoundSchedule({
      monthlyAllowance: 1000,
      deferralPercentage: 100,
      annualInterestRate: 10,
      termMonths: 6,
      completionBonusPercentage: 20, // 20% of 6,000 = 1,200
      parentInterestMatchMultiplier: 1.0, // 100% match on interest
    });

    expect(result.totalPrincipalSaved).toBe(6000);
    expect(result.completionBonus).toBe(1200);
    expect(result.totalParentInterestMatch).toBeCloseTo(result.totalInterestEarned, 2);
    expect(result.finalTotalBalance).toBeGreaterThan(6000 + 1200 + result.totalInterestEarned);
  });

  it('calculates early withdrawal penalty correctly by forfeiting interest', () => {
    const withdrawal = calculateEarlyWithdrawal(12355, 12000, 355);
    expect(withdrawal.principalReturned).toBe(12000);
    expect(withdrawal.interestForfeited).toBe(355);
    expect(withdrawal.netPayout).toBe(12000);
  });

  it('correctly sets up backdated backlog plan with 3 historical months and interest due', () => {
    const backdatedPlan = createBackdatedPlan({
      teenName: 'Akshat',
      parentName: 'Dad',
      monthlyAllowance: 2000,
      deferralPercentage: 100,
      annualInterestRate: 10,
      targetTermMonths: 6,
      completionBonusPercentage: 20,
      parentInterestMatchMultiplier: 1.0,
      backlogMonthsCompleted: 3,
      startDate: '2026-06-01',
    });

    expect(backdatedPlan.teenName).toBe('Akshat');
    expect(backdatedPlan.totalPrincipalContributed).toBe(6000);
    expect(backdatedPlan.transactions.filter(t => t.type === 'DEPOSIT')).toHaveLength(3);
    expect(backdatedPlan.totalInterestEarned).toBeGreaterThan(100);
    expect(backdatedPlan.currentBalance).toBeGreaterThan(6000);
    expect(backdatedPlan.status).toBe('ACTIVE');
  });

  it('correctly computes Opportunity Loss for 6 months and 1 year', () => {
    const report = calculateOpportunityLoss(2000, 100, 10, 1.0, 20);
    
    // In 6 months:
    expect(report.sixMonths.cashPiggyBankTotal).toBe(12000);
    expect(report.sixMonths.compoundedTotal).toBeGreaterThan(15000);
    expect(report.sixMonths.compoundingYieldLost).toBeGreaterThan(3000);

    // In 1 year:
    expect(report.oneYear.cashPiggyBankTotal).toBe(24000);
    expect(report.oneYear.compoundedTotal).toBeGreaterThan(31000);
    expect(report.oneYear.compoundingYieldLost).toBeGreaterThan(7000);
  });
});
