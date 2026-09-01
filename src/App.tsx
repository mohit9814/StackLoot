import { useState, useCallback, useEffect, useMemo } from 'react';
import type { CurrencyCode, BacklogSetupParams, SimulationParams } from './types/allowance';
import type { ChallengeTierConfig } from './types/gamification';
import type { UserRole } from './types/userRole';
import { CURRENCIES, formatCurrency } from './config/currencies';
import { CHALLENGE_TIERS } from './config/appConfig';
import { storageService } from './services/storageService';
import { useAppRoute } from './hooks/useAppRoute';
import { useProfiles } from './hooks/useProfiles';
import { useSimulation } from './hooks/useSimulation';
import { useLedger } from './hooks/useLedger';
import { useGoals } from './hooks/useGoals';
import { useGamification } from './hooks/useGamification';

import { Navbar } from './components/common/Navbar';
import { TabSelector, type AppTab } from './components/common/TabSelector';
import { MetricCard } from './components/common/MetricCard';

import { TeenDashboardView } from './components/teen/TeenDashboardView';
import { QuickSetupWizard } from './components/onboarding/QuickSetupWizard';

import { SimulatorControls } from './components/simulator/SimulatorControls';
import { GrowthChart } from './components/simulator/GrowthChart';
import { SnowballVelocity } from './components/simulator/SnowballVelocity';
import { BreakdownTable } from './components/simulator/BreakdownTable';

import { ChallengeTierCard } from './components/challenges/ChallengeTierCard';
import { BadgeCollection } from './components/challenges/BadgeCollection';
import { TreatPickerModal } from './components/challenges/TreatPickerModal';

import { LedgerSummary } from './components/ledger/LedgerSummary';
import { TransactionTable } from './components/ledger/TransactionTable';
import { DepositModal } from './components/ledger/DepositModal';
import { EscapeHatchModal } from './components/ledger/EscapeHatchModal';
import { NewPlanModal } from './components/ledger/NewPlanModal';
import { BacklogSetupModal } from './components/ledger/BacklogSetupModal';

import { GoalCard } from './components/goals/GoalCard';
import { AddGoalModal } from './components/goals/AddGoalModal';
import { ManageProfilesModal } from './components/profiles/ManageProfilesModal';

import { FamilyCharter } from './components/agreement/FamilyCharter';
import { DeskTrackerPrint } from './components/agreement/DeskTrackerPrint';

import { RuleOf72Card } from './components/academy/RuleOf72Card';
import { MarketVsBankCard } from './components/academy/MarketVsBankCard';

import {
  Wallet,
  TrendingUp,
  Snowflake,
  Award,
  Target,
  Plus,
  Sparkles,
  History,
  ShieldCheck,
  Users,
} from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('SIMULATOR');

  // URL Route Detection (/son vs /)
  const {
    isSonOnlyRoute,
    profileIdParam,
    sharedProfile,
    getSonDirectUrl,
    getParentSecretUrl,
    lockParentSession,
  } = useAppRoute();
  const [parentPreviewRole, setParentPreviewRole] = useState<UserRole>('PARENT');

  // If accessed via /son route or unauthenticated, strictly lock role to 'TEEN'
  const userRole: UserRole = isSonOnlyRoute ? 'TEEN' : parentPreviewRole;

  // Profile Management Hook
  const {
    profiles,
    activeProfile,
    switchProfile,
    importSharedProfile,
    createNewProfile,
    updateActiveProfileData,
    resetProfile,
    deleteProfile,
  } = useProfiles();

  // If shared profile payload is provided in URL, import it immediately
  useEffect(() => {
    if (sharedProfile) {
      importSharedProfile(sharedProfile);
    }
  }, [sharedProfile, importSharedProfile]);

  // Switch profile if query parameter specified in URL
  useEffect(() => {
    if (profileIdParam && profiles.some((p) => p.id === profileIdParam)) {
      switchProfile(profileIdParam);
    }
  }, [profileIdParam, profiles, switchProfile]);

  const activeCurrency = CURRENCIES[activeProfile.currencyCode] || CURRENCIES.INR;

  const handleSelectCurrency = (code: CurrencyCode) => {
    updateActiveProfileData({ currencyCode: code });
    storageService.saveCurrency(code);
  };

  // Derive simulation parameters: if active plan exists, strictly prioritize active plan parameters for 100% cascade consistency
  const effectiveSimulationParams: SimulationParams = useMemo(() => {
    if (activeProfile.activePlan) {
      return {
        monthlyAllowance: activeProfile.activePlan.monthlyAllowance,
        deferralPercentage: activeProfile.activePlan.deferralPercentage,
        annualInterestRate: activeProfile.activePlan.annualInterestRate,
        termMonths: activeProfile.activePlan.targetTermMonths,
        completionBonusPercentage: activeProfile.activePlan.completionBonusPercentage,
        parentInterestMatchMultiplier: activeProfile.activePlan.parentInterestMatchMultiplier,
        initialLumpSumDeposit: activeProfile.activePlan.initialLumpSumDeposit || 0,
      };
    }
    return activeProfile.simulationParams;
  }, [activeProfile.activePlan, activeProfile.simulationParams]);

  // Custom Hooks bound to Active Profile
  const handleSimulationParamsChange = useCallback((newParams: SimulationParams) => {
    updateActiveProfileData({ simulationParams: newParams });
  }, [updateActiveProfileData]);

  const {
    params,
    setParams,
    updateParam,
    simulationResult,
    applyChallengeTier,
    resetToDefault,
  } = useSimulation(effectiveSimulationParams, handleSimulationParamsChange);

  const handlePlanUpdate = useCallback((plan: typeof activeProfile.activePlan) => {
    updateActiveProfileData({ activePlan: plan });
  }, [updateActiveProfileData]);

  const {
    activePlan,
    createPlan,
    setupBackdatedPlan,
    processNextMonthlyCycle,
    executeEarlyWithdrawal,
    resetLedger,
  } = useLedger(activeProfile.activePlan, handlePlanUpdate);

  const effectivePlan = activePlan || activeProfile.activePlan;

  const monthlyDeferredContribution = (params.monthlyAllowance * params.deferralPercentage) / 100;
  const currentTrackingBalance = effectivePlan ? effectivePlan.currentBalance : simulationResult.finalTotalBalance;

  const handleGoalsChange = useCallback((newGoals: typeof activeProfile.goals) => {
    updateActiveProfileData({ goals: newGoals });
  }, [updateActiveProfileData]);

  const {
    goalsWithProgress,
    addGoal,
    removeGoal,
  } = useGoals(
    currentTrackingBalance,
    monthlyDeferredContribution,
    params.annualInterestRate,
    activeProfile.goals,
    handleGoalsChange
  );

  const completedGoalsCount = goalsWithProgress.filter((g) => g.isUnlocked).length;
  const { state: gamification } = useGamification(effectivePlan, completedGoalsCount);

  // Modal States
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isEscapeHatchModalOpen, setIsEscapeHatchModalOpen] = useState(false);
  const [isNewPlanModalOpen, setIsNewPlanModalOpen] = useState(false);
  const [isBacklogModalOpen, setIsBacklogModalOpen] = useState(false);
  const [isQuickSetupOpen, setIsQuickSetupOpen] = useState(false);
  const [isAddGoalModalOpen, setIsAddGoalModalOpen] = useState(false);
  const [isManageProfilesOpen, setIsManageProfilesOpen] = useState(false);
  const [treatPickerTier, setTreatPickerTier] = useState<ChallengeTierConfig | null>(null);
  const [selectedTreats, setSelectedTreats] = useState<Record<number, string>>({});

  const handleSelectPerk = (perk: string) => {
    if (treatPickerTier) {
      setSelectedTreats((prev) => ({ ...prev, [treatPickerTier.level]: perk }));
    }
  };

  const handleCompleteQuickSetup = (
    teenName: string,
    parentName: string,
    monthlyAllowance: number,
    deferralPercentage: number,
    annualInterestRate: number,
    targetTermMonths: number,
    completionBonusPercentage: number,
    parentInterestMatchMultiplier: number,
    selectedGoalTitle: string,
    selectedGoalTarget: number,
    selectedPerk: string
  ) => {
    const newPlan = createPlan(
      teenName,
      parentName,
      monthlyAllowance,
      deferralPercentage,
      annualInterestRate,
      targetTermMonths,
      completionBonusPercentage,
      parentInterestMatchMultiplier,
      selectedPerk
    );

    const syncedSimulationParams: SimulationParams = {
      monthlyAllowance,
      deferralPercentage,
      annualInterestRate,
      termMonths: targetTermMonths,
      completionBonusPercentage,
      parentInterestMatchMultiplier,
      initialLumpSumDeposit: 0,
    };

    updateActiveProfileData({
      teenName,
      parentName,
      activePlan: newPlan,
      simulationParams: syncedSimulationParams,
    });

    setParams(syncedSimulationParams);

    if (selectedGoalTitle.trim()) {
      addGoal(selectedGoalTitle, selectedGoalTarget, 'TECH', 'Agreed savings goal');
    }
    setActiveTab('LEDGER');
  };

  const handleConfirmBacklog = (backlogParams: BacklogSetupParams) => {
    const newPlan = setupBackdatedPlan(backlogParams);
    const syncedSimulationParams: SimulationParams = {
      monthlyAllowance: backlogParams.monthlyAllowance,
      deferralPercentage: backlogParams.deferralPercentage,
      annualInterestRate: backlogParams.annualInterestRate,
      termMonths: backlogParams.targetTermMonths,
      completionBonusPercentage: backlogParams.completionBonusPercentage,
      parentInterestMatchMultiplier: backlogParams.parentInterestMatchMultiplier,
      initialLumpSumDeposit: backlogParams.initialLumpSumDeposit || 0,
    };

    updateActiveProfileData({
      teenName: backlogParams.teenName,
      parentName: backlogParams.parentName,
      activePlan: newPlan,
      simulationParams: syncedSimulationParams,
    });

    setParams(syncedSimulationParams);
    setActiveTab('LEDGER');
  };

  const handleCopySonLink = () => {
    const directUrl = getSonDirectUrl(activeProfile);
    navigator.clipboard.writeText(directUrl);
  };

  // Backup Export / Import
  const handleExportData = () => {
    const json = storageService.exportAllData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bank-of-dad-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          if (storageService.importAllData(content)) {
            window.location.reload();
          } else {
            alert('Failed to parse backup file. Please ensure it is valid JSON.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handlePrintCharter = () => {
    setActiveTab('CHARTER');
    setTimeout(() => {
      window.print();
    }, 200);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-indigo-500 selection:text-white">
      {/* Navigation Header */}
      <Navbar
        currentCurrency={activeProfile.currencyCode}
        onSelectCurrency={handleSelectCurrency}
        gamification={gamification}
        userRole={userRole}
        onToggleRole={setParentPreviewRole}
        profiles={profiles}
        activeProfile={activeProfile}
        isSonOnlyRoute={isSonOnlyRoute}
        onSelectProfile={switchProfile}
        onOpenManageProfiles={() => setIsManageProfilesOpen(true)}
        onCopySonLink={handleCopySonLink}
        onCopyParentSecretLink={() => {
          const secretUrl = getParentSecretUrl();
          navigator.clipboard.writeText(secretUrl);
        }}
        onLockParentMode={lockParentSession}
        onExportData={handleExportData}
        onImportData={handleImportData}
        onPrintCharter={handlePrintCharter}
      />

      {/* Main Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-6">
        {/* VIEW 1: SON'S VIEW (Default on /son, or preview mode) */}
        {userRole === 'TEEN' && (
          <div className="space-y-6">
            <TeenDashboardView
              plan={effectivePlan}
              params={params}
              simulation={simulationResult}
              currency={activeCurrency}
              gamification={gamification}
              goals={goalsWithProgress}
              onViewPrintTracker={() => {
                setActiveTab('CHARTER');
                if (!isSonOnlyRoute) {
                  setParentPreviewRole('PARENT');
                }
              }}
            />

            {/* Quick Goals Spotlight on Son's View */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <Target className="w-4 h-4 text-indigo-400" />
                  <span>{activeProfile.teenName}'s Target Wishlist Items</span>
                </div>
                <button
                  onClick={() => setIsAddGoalModalOpen(true)}
                  className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Dream Goal</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {goalsWithProgress.map((goalInfo) => (
                  <GoalCard
                    key={goalInfo.goal.id}
                    goalInfo={goalInfo}
                    currency={activeCurrency}
                    onRemoveGoal={removeGoal}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: PARENT MODE (FULL STUDIO & CONTROLS - Accessible only on Parent route) */}
        {userRole === 'PARENT' && !isSonOnlyRoute && (
          <div className="space-y-6">
            {/* Parent Admin Header Callout */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 px-6 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-500/20 text-indigo-300 rounded-xl">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Parent Admin & Incentive Studio</h3>
                  <p className="text-xs text-slate-400">
                    Active Profile: <strong className="text-white">{activeProfile.avatarEmoji} {activeProfile.teenName}</strong> • Manage balances, backdates, and yields.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setIsManageProfilesOpen(true)}
                  className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-semibold text-xs px-3.5 py-2 rounded-xl transition-all cursor-pointer"
                >
                  <Users className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Manage Profiles</span>
                </button>
                <button
                  onClick={() => setIsBacklogModalOpen(true)}
                  className="flex items-center gap-1.5 bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/40 font-bold text-xs px-3.5 py-2 rounded-xl transition-all cursor-pointer shadow-sm"
                >
                  <History className="w-3.5 h-3.5 text-amber-400" />
                  <span>Backdate Backlog</span>
                </button>
                <button
                  onClick={() => setIsQuickSetupOpen(true)}
                  className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all cursor-pointer shadow-md shadow-indigo-500/20"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>60-Sec Setup</span>
                </button>
              </div>
            </div>

            {/* Tab Bar */}
            <TabSelector
              activeTab={activeTab}
              hasActiveLedger={effectivePlan !== null && (effectivePlan.status === 'ACTIVE' || effectivePlan.status === 'COMPLETED')}
              onSelectTab={setActiveTab}
            />

            {/* Top Key Metrics Banner (Visible on Simulator and Challenges in Parent Mode) */}
            {(activeTab === 'SIMULATOR' || activeTab === 'CHALLENGES') && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 no-print">
                <MetricCard
                  title="Total Principal Saved"
                  value={formatCurrency(simulationResult.totalPrincipalSaved, activeCurrency)}
                  subtitle={`${params.termMonths} Months @ ${params.deferralPercentage}% Deferral`}
                  badgeText="Principal"
                  badgeVariant="blue"
                  icon={Wallet}
                  iconBgColor="bg-blue-500/15"
                  iconColor="text-blue-400"
                />
                <MetricCard
                  title="Total Interest Earned"
                  value={`+${formatCurrency(simulationResult.totalInterestEarned, activeCurrency)}`}
                  subtitle={`Compounded Monthly @ ${params.annualInterestRate}% p.a.`}
                  badgeText="Pure Yield"
                  badgeVariant="green"
                  icon={TrendingUp}
                  iconBgColor="bg-emerald-500/15"
                  iconColor="text-emerald-400"
                />
                <MetricCard
                  title="Parent Match & Bonus"
                  value={`+${formatCurrency(simulationResult.completionBonus + simulationResult.totalParentInterestMatch, activeCurrency)}`}
                  subtitle={`+${params.completionBonusPercentage}% Kicker + ${params.parentInterestMatchMultiplier * 100}% Match`}
                  badgeText="Incentive"
                  badgeVariant="purple"
                  icon={Award}
                  iconBgColor="bg-purple-500/15"
                  iconColor="text-purple-400"
                />
                <MetricCard
                  title="Final Total Payout"
                  value={formatCurrency(simulationResult.finalTotalBalance, activeCurrency)}
                  subtitle={`vs ${formatCurrency(simulationResult.bankComparisonTotal, activeCurrency)} in Standard Bank`}
                  badgeText={`${simulationResult.snowballFactor}x Snowball`}
                  badgeVariant="amber"
                  icon={Snowflake}
                  iconBgColor="bg-amber-500/15"
                  iconColor="text-amber-400"
                />
              </div>
            )}

            {/* Tab 1: Simulator */}
            {activeTab === 'SIMULATOR' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                  <div className="lg:col-span-1">
                    <SimulatorControls
                      params={params}
                      currency={activeCurrency}
                      onUpdateParam={updateParam}
                      onApplyTier={applyChallengeTier}
                      onReset={resetToDefault}
                      onActivatePlan={() => {
                        const newPlan = createPlan(
                          activeProfile.teenName,
                          activeProfile.parentName,
                          params.monthlyAllowance,
                          params.deferralPercentage,
                          params.annualInterestRate,
                          params.termMonths,
                          params.completionBonusPercentage,
                          params.parentInterestMatchMultiplier,
                          'Favorite Pizza Night + 100% Parent Match'
                        );
                        updateActiveProfileData({
                          activePlan: newPlan,
                          simulationParams: params,
                        });
                        setActiveTab('LEDGER');
                      }}
                      isPlanActive={effectivePlan !== null && (effectivePlan.status === 'ACTIVE' || effectivePlan.status === 'COMPLETED')}
                      teenName={activeProfile.teenName}
                    />
                  </div>
                  <div className="lg:col-span-2 space-y-6">
                    <GrowthChart
                      breakdown={simulationResult.breakdown}
                      currency={activeCurrency}
                    />
                    <SnowballVelocity
                      breakdown={simulationResult.breakdown}
                      currency={activeCurrency}
                      snowballFactor={simulationResult.snowballFactor}
                    />
                  </div>
                </div>

                <BreakdownTable
                  breakdown={simulationResult.breakdown}
                  currency={activeCurrency}
                  annualRate={params.annualInterestRate}
                  completionBonus={simulationResult.completionBonus}
                  finalTotal={simulationResult.finalTotalBalance}
                />
              </div>
            )}

            {/* Tab 2: Challenge Tiers & Gamification */}
            {activeTab === 'CHALLENGES' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {CHALLENGE_TIERS.map((tier) => (
                    <ChallengeTierCard
                      key={tier.level}
                      tier={tier}
                      isActive={params.termMonths === tier.minMonths && params.deferralPercentage === tier.minDeferralPercent}
                      onSelectTier={(selected) => {
                        applyChallengeTier(selected.level);
                        setActiveTab('SIMULATOR');
                      }}
                      onOpenTreatPicker={(selected) => setTreatPickerTier(selected)}
                      selectedTreat={selectedTreats[tier.level]}
                      currency={activeCurrency}
                    />
                  ))}
                </div>

                <BadgeCollection
                  unlockedBadgeIds={gamification.unlockedBadgeIds}
                  totalXp={gamification.totalXp}
                />
              </div>
            )}

            {/* Tab 3: Active Ledger Tracking */}
            {activeTab === 'LEDGER' && (
              <div className="space-y-6">
                <LedgerSummary
                  plan={effectivePlan}
                  currency={activeCurrency}
                  onOpenDepositModal={() => setIsDepositModalOpen(true)}
                  onOpenEscapeHatchModal={() => setIsEscapeHatchModalOpen(true)}
                  onStartNewPlan={() => setIsNewPlanModalOpen(true)}
                  onOpenBacklogModal={() => setIsBacklogModalOpen(true)}
                  onResetLedger={resetLedger}
                />

                {effectivePlan && (
                  <TransactionTable
                    transactions={effectivePlan.transactions}
                    currency={activeCurrency}
                  />
                )}
              </div>
            )}

            {/* Tab 4: Goal Wishlist */}
            {activeTab === 'GOALS' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl">
                  <div>
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      <Target className="w-5 h-5 text-indigo-400" />
                      <span>{activeProfile.teenName}'s Goal Wishlist & Earmarks</span>
                    </h2>
                    <p className="text-xs text-slate-400">
                      Tie compounding savings to concrete dreams. Watch compounding slash months off your goal!
                    </p>
                  </div>
                  <button
                    onClick={() => setIsAddGoalModalOpen(true)}
                    className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-500/20 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Goal</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {goalsWithProgress.map((goalInfo) => (
                    <GoalCard
                      key={goalInfo.goal.id}
                      goalInfo={goalInfo}
                      currency={activeCurrency}
                      onRemoveGoal={removeGoal}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Tab 5: Family Charter & Desk Tracker */}
            {activeTab === 'CHARTER' && (
              <div className="space-y-6">
                <FamilyCharter
                  plan={effectivePlan}
                  currency={activeCurrency}
                />
                <DeskTrackerPrint
                  breakdown={simulationResult.breakdown}
                  currency={activeCurrency}
                  teenName={effectivePlan?.teenName || activeProfile.teenName}
                />
              </div>
            )}

            {/* Tab 6: Wealth Academy */}
            {activeTab === 'ACADEMY' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                <RuleOf72Card />
                <MarketVsBankCard />
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modals */}
      <ManageProfilesModal
        isOpen={isManageProfilesOpen}
        profiles={profiles}
        activeProfile={activeProfile}
        userRole={userRole}
        currency={activeCurrency}
        onClose={() => setIsManageProfilesOpen(false)}
        onSelectProfile={switchProfile}
        onCreateProfile={createNewProfile}
        onResetProfile={resetProfile}
        onDeleteProfile={deleteProfile}
      />

      <BacklogSetupModal
        isOpen={isBacklogModalOpen}
        currency={activeCurrency}
        onClose={() => setIsBacklogModalOpen(false)}
        onConfirmBacklog={handleConfirmBacklog}
      />

      <QuickSetupWizard
        currency={activeCurrency}
        isOpen={isQuickSetupOpen}
        onClose={() => setIsQuickSetupOpen(false)}
        onCompleteSetup={handleCompleteQuickSetup}
      />

      <DepositModal
        isOpen={isDepositModalOpen}
        plan={effectivePlan}
        currency={activeCurrency}
        onClose={() => setIsDepositModalOpen(false)}
        onConfirmDeposit={processNextMonthlyCycle}
      />

      <EscapeHatchModal
        isOpen={isEscapeHatchModalOpen}
        plan={effectivePlan}
        currency={activeCurrency}
        onClose={() => setIsEscapeHatchModalOpen(false)}
        onConfirmWithdrawal={executeEarlyWithdrawal}
      />

      <NewPlanModal
        isOpen={isNewPlanModalOpen}
        currency={activeCurrency}
        onClose={() => setIsNewPlanModalOpen(false)}
        onCreatePlan={(
          teenName,
          parentName,
          monthlyAllowance,
          deferralPercentage,
          annualInterestRate,
          targetTermMonths,
          completionBonusPercentage,
          parentInterestMatchMultiplier,
          selectedPerk
        ) => {
          const newPlan = createPlan(
            teenName,
            parentName,
            monthlyAllowance,
            deferralPercentage,
            annualInterestRate,
            targetTermMonths,
            completionBonusPercentage,
            parentInterestMatchMultiplier,
            selectedPerk
          );
          const syncedSimulationParams: SimulationParams = {
            monthlyAllowance,
            deferralPercentage,
            annualInterestRate,
            termMonths: targetTermMonths,
            completionBonusPercentage,
            parentInterestMatchMultiplier,
            initialLumpSumDeposit: 0,
          };
          updateActiveProfileData({
            teenName,
            parentName,
            activePlan: newPlan,
            simulationParams: syncedSimulationParams,
          });
          setParams(syncedSimulationParams);
        }}
      />

      <AddGoalModal
        isOpen={isAddGoalModalOpen}
        currency={activeCurrency}
        onClose={() => setIsAddGoalModalOpen(false)}
        onAddGoal={addGoal}
      />

      <TreatPickerModal
        tier={treatPickerTier}
        currentPerk={treatPickerTier ? selectedTreats[treatPickerTier.level] : undefined}
        onClose={() => setTreatPickerTier(null)}
        onSelectPerk={handleSelectPerk}
      />
    </div>
  );
}

export default App;
