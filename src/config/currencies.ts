import type { CurrencyCode, CurrencyConfig } from '../types/allowance';

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  INR: {
    code: 'INR',
    symbol: '₹',
    label: 'Indian Rupee (₹)',
    exchangeRateMultiplier: 1,
  },
  USD: {
    code: 'USD',
    symbol: '$',
    label: 'US Dollar ($)',
    exchangeRateMultiplier: 1 / 85,
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    label: 'Euro (€)',
    exchangeRateMultiplier: 1 / 92,
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    label: 'British Pound (£)',
    exchangeRateMultiplier: 1 / 108,
  },
};

export function formatCurrency(amount: number, currency: CurrencyConfig = CURRENCIES.INR): string {
  const rounded = Math.round(amount);
  return `${currency.symbol}${rounded.toLocaleString('en-IN')}`;
}

export function formatCurrencyExact(amount: number, currency: CurrencyConfig = CURRENCIES.INR): string {
  return `${currency.symbol}${amount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
