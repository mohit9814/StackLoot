import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';
import type { MonthlyBreakdown, CurrencyConfig } from '../../types/allowance';
import { formatCurrency } from '../../config/currencies';

interface GrowthChartProps {
  breakdown: MonthlyBreakdown[];
  currency: CurrencyConfig;
}

export const GrowthChart: React.FC<GrowthChartProps> = ({ breakdown, currency }) => {
  const chartData = breakdown.map((item) => {
    const cumulativePrincipal = item.addedAllowance * item.month;
    return {
      name: `Month ${item.month}`,
      month: item.month,
      Principal: cumulativePrincipal,
      BankOfDad: Math.round(item.endingBalance),
      StandardBank: Math.round(item.standardBankEndingBalance),
      InterestEarned: Math.round(item.cumulativeInterest),
    };
  });

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-base font-bold text-white">Compounding Trajectory Curve</h2>
          <p className="text-xs text-slate-400">
            Bank of Dad Yield vs Commercial Bank (3%) vs Flat Piggy Bank
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-indigo-400">
            <span className="w-3 h-3 rounded-full bg-indigo-500 inline-block" />
            <span className="font-semibold">Bank of Dad</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <span className="w-3 h-3 rounded-full bg-slate-500 inline-block" />
            <span className="font-medium">Principal Deposited</span>
          </div>
        </div>
      </div>

      <div className="w-full h-72 sm:h-80 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="dadGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="principalGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#475569" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#475569" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 12 }} />
            <YAxis
              stroke="#64748b"
              tick={{ fontSize: 12 }}
              tickFormatter={(val: number) => formatCurrency(val, currency)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#334155',
                borderRadius: '12px',
                color: '#f8fafc',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
              }}
              formatter={(value: unknown, name: unknown) => {
                const numericVal = typeof value === 'number' ? value : 0;
                const labelStr = name === 'BankOfDad'
                  ? 'Bank of Dad'
                  : name === 'Principal'
                  ? 'Cumulative Principal'
                  : name === 'StandardBank'
                  ? 'Standard Bank (3%)'
                  : String(name);
                return [formatCurrency(numericVal, currency), labelStr];
              }}
            />
            <Legend verticalAlign="top" height={36} />
            <Area
              type="monotone"
              dataKey="BankOfDad"
              name="Bank of Dad Balance"
              stroke="#818cf8"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#dadGradient)"
            />
            <Area
              type="monotone"
              dataKey="StandardBank"
              name="Commercial Bank (3%)"
              stroke="#38bdf8"
              strokeWidth={2}
              strokeDasharray="4 4"
              fillOpacity={0}
              fill="none"
            />
            <Area
              type="monotone"
              dataKey="Principal"
              name="Principal (No Interest)"
              stroke="#94a3b8"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#principalGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
