import React from 'react';
import { Calculator, Award, Wallet, Target, FileText, BookOpen } from 'lucide-react';

export type AppTab = 'SIMULATOR' | 'CHALLENGES' | 'LEDGER' | 'GOALS' | 'CHARTER' | 'ACADEMY';

interface TabSelectorProps {
  activeTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  hasActiveLedger: boolean;
}

export const TabSelector: React.FC<TabSelectorProps> = ({
  activeTab,
  onSelectTab,
  hasActiveLedger,
}) => {
  const tabs: { id: AppTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string }[] = [
    { id: 'SIMULATOR', label: 'Growth Simulator', icon: Calculator },
    { id: 'CHALLENGES', label: 'Challenge Tiers', icon: Award },
    { id: 'LEDGER', label: 'Active Ledger', icon: Wallet, badge: hasActiveLedger ? 'Live' : undefined },
    { id: 'GOALS', label: 'Goal Wishlist', icon: Target },
    { id: 'CHARTER', label: 'Family Charter', icon: FileText },
    { id: 'ACADEMY', label: 'Wealth Lab', icon: BookOpen },
  ];

  return (
    <nav className="flex items-center gap-1.5 p-1.5 bg-slate-900/90 border border-slate-800 rounded-2xl overflow-x-auto no-scrollbar shadow-lg no-print">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm whitespace-nowrap transition-all duration-200 cursor-pointer ${
              isActive
                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
            <span>{tab.label}</span>
            {tab.badge && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            )}
          </button>
        );
      })}
    </nav>
  );
};
