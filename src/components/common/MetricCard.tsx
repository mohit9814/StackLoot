import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  badgeText?: string;
  badgeVariant?: 'green' | 'blue' | 'purple' | 'amber';
  icon: LucideIcon;
  iconBgColor?: string;
  iconColor?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  badgeText,
  badgeVariant = 'green',
  icon: Icon,
  iconBgColor = 'bg-indigo-500/10',
  iconColor = 'text-indigo-400',
}) => {
  const badgeStyles = {
    green: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    blue: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    purple: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    amber: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all duration-200 shadow-lg hover:shadow-indigo-500/5 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {title}
        </span>
        <div className={`p-2.5 rounded-xl ${iconBgColor}`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
      </div>

      <div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white font-mono">
            {value}
          </span>
          {badgeText && (
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium border ${badgeStyles[badgeVariant]}`}
            >
              {badgeText}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-xs text-slate-400 mt-1 font-medium">{subtitle}</p>
        )}
      </div>
    </div>
  );
};
