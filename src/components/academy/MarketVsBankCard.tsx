import React from 'react';
import { Landmark, TrendingUp, Building2 } from 'lucide-react';

export const MarketVsBankCard: React.FC = () => {
  const instruments = [
    {
      title: 'Commercial Bank Savings',
      rate: '2.5% - 3.5%',
      risk: 'Virtually Zero',
      lesson: 'Safe for emergency liquidity, but loses purchasing power against inflation (~6%).',
      icon: Building2,
      color: 'text-slate-400',
      bg: 'bg-slate-800/80 border-slate-700/80',
    },
    {
      title: 'Bank of Mom & Dad (High Yield)',
      rate: '10% - 15%',
      risk: 'Guaranteed by Parents',
      lesson: 'Accelerated incentive sandbox designed to teach teen patience and delayed gratification.',
      icon: Landmark,
      color: 'text-indigo-400',
      bg: 'bg-indigo-950/30 border-indigo-500/30',
    },
    {
      title: 'Custodial Index Fund (Nifty 50 / S&P 500)',
      rate: '11% - 14% (Historical avg)',
      risk: 'Moderate (Short-term swings)',
      lesson: 'The ultimate real-world vehicle. Own a slice of the top 50-500 companies in the economy.',
      icon: TrendingUp,
      color: 'text-emerald-400',
      bg: 'bg-emerald-950/30 border-emerald-500/30',
    },
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
      <div className="flex items-center gap-2.5 border-b border-slate-800 pb-4">
        <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
          <TrendingUp className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-white">The Real-World Financial Ladder</h3>
          <p className="text-xs text-slate-400">
            How Bank of Dad prepares you for real market investing
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {instruments.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className={`p-4 rounded-2xl border ${item.bg} space-y-1.5`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${item.color}`} />
                  <h4 className="text-xs font-bold text-white">{item.title}</h4>
                </div>
                <span className={`text-xs font-bold font-mono ${item.color}`}>
                  {item.rate}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">{item.lesson}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
