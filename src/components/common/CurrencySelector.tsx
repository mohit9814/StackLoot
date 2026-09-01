import React from 'react';
import type { CurrencyCode } from '../../types/allowance';
import { CURRENCIES } from '../../config/currencies';

interface CurrencySelectorProps {
  currentCurrency: CurrencyCode;
  onSelectCurrency: (code: CurrencyCode) => void;
}

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  currentCurrency,
  onSelectCurrency,
}) => {
  return (
    <div className="relative inline-block text-left">
      <select
        value={currentCurrency}
        aria-label="Select currency"
        onChange={(e) => onSelectCurrency(e.target.value as CurrencyCode)}
        className="bg-slate-800 border border-slate-700 hover:border-indigo-500 text-slate-200 text-sm font-semibold rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer transition-colors shadow-sm"
      >
        {Object.values(CURRENCIES).map((c) => (
          <option key={c.code} value={c.code}>
            {c.symbol} {c.code}
          </option>
        ))}
      </select>
    </div>
  );
};
