import React from 'react';
import type { ActivePlanLedger, CurrencyConfig } from '../../types/allowance';
import { formatCurrency } from '../../config/currencies';
import { FileText, Printer, Landmark } from 'lucide-react';

interface FamilyCharterProps {
  plan: ActivePlanLedger | null;
  currency: CurrencyConfig;
}

export const FamilyCharter: React.FC<FamilyCharterProps> = ({ plan, currency }) => {
  const teenName = plan?.teenName || 'Akshat';
  const parentName = plan?.parentName || 'Dad';
  const allowance = plan?.monthlyAllowance || 2000;
  const deferralPercent = plan?.deferralPercentage || 100;
  const rate = plan?.annualInterestRate || 10;
  const termMonths = plan?.targetTermMonths || 6;
  const completionBonus = plan?.completionBonusPercentage || 20;

  const handlePrint = () => {
    window.print();
  };

  const monthlyDeferredAmount = (allowance * deferralPercent) / 100;
  const liquidPocketAmount = allowance - monthlyDeferredAmount;

  return (
    <div className="space-y-6">
      {/* Action Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl no-print">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-400" />
            <span>Family Savings Agreement & Charter</span>
          </h2>
          <p className="text-xs text-slate-400">
            A formal parent-teen agreement establishing terms, compounding yield, and liquidity rules.
          </p>
        </div>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-500/20 transition-all cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Export PDF</span>
        </button>
      </div>

      {/* Printable Document Sheet */}
      <div className="printable-document bg-white text-slate-900 rounded-3xl p-8 sm:p-12 shadow-2xl border border-slate-200 max-w-4xl mx-auto space-y-8 font-sans">
        {/* Document Header */}
        <div className="text-center border-b-2 border-slate-900 pb-6">
          <div className="inline-flex items-center justify-center p-3 bg-slate-900 text-white rounded-2xl mb-3">
            <Landmark className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900">
            "Bank of Dad"
          </h1>
          <p className="text-xs uppercase font-bold tracking-widest text-slate-600 mt-1">
            Deferred Allowance & Wealth Compounding Charter
          </p>
        </div>

        {/* Introduction */}
        <p className="text-xs leading-relaxed text-slate-700">
          This Agreement is entered into on <strong>{new Date().toLocaleDateString()}</strong> by and between{' '}
          <strong className="text-slate-900 border-b border-dotted border-slate-900 pb-0.5">{teenName}</strong> (hereinafter referred to as the <em>"Junior Investor"</em>) and{' '}
          <strong className="text-slate-900 border-b border-dotted border-slate-900 pb-0.5">{parentName}</strong> (hereinafter referred to as the <em>"Bank Trustees"</em>).
        </p>

        {/* Section 1: Core Terms Table */}
        <div className="space-y-2">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
            Section 1: Operating Terms & Yield Schedule
          </h3>
          <div className="border border-slate-300 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <tbody className="divide-y divide-slate-200">
                <tr className="bg-slate-50">
                  <td className="py-2.5 px-4 font-bold text-slate-700">Base Monthly Allowance:</td>
                  <td className="py-2.5 px-4 font-mono font-bold text-slate-900">{formatCurrency(allowance, currency)} / month</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-bold text-slate-700">Mandatory Deferral Rate:</td>
                  <td className="py-2.5 px-4 font-mono font-bold text-slate-900">{deferralPercent}% ({formatCurrency(monthlyDeferredAmount, currency)} saved, {formatCurrency(liquidPocketAmount, currency)} pocket)</td>
                </tr>
                <tr className="bg-slate-50">
                  <td className="py-2.5 px-4 font-bold text-slate-700">Bank Yield Rate:</td>
                  <td className="py-2.5 px-4 font-mono font-bold text-emerald-700">{rate}% per annum, compounded monthly</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-bold text-slate-700">Commitment Term:</td>
                  <td className="py-2.5 px-4 font-mono font-bold text-slate-900">{termMonths} Months</td>
                </tr>
                <tr className="bg-slate-50">
                  <td className="py-2.5 px-4 font-bold text-slate-700">Milestone Completion Kicker:</td>
                  <td className="py-2.5 px-4 font-mono font-bold text-indigo-700">+{completionBonus}% flat bonus on total principal saved</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 2: Covenant & Rules */}
        <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
            Section 2: Covenants & Liquidity Rules
          </h3>
          <ol className="list-decimal list-inside space-y-2">
            <li>
              <strong>Monthly Compounding:</strong> At the start of each month, the deferred allowance is credited to the Junior Investor's ledger and interest is applied to the accumulated balance.
            </li>
            <li>
              <strong>Liquidity Escape Hatch:</strong> The Junior Investor retains the right to withdraw 100% of their contributed principal at any time in case of emergency.
            </li>
            <li>
              <strong>Early Withdrawal Penalty:</strong> Should the Junior Investor withdraw funds prior to the conclusion of the {termMonths}-month term, all accumulated interest and completion bonuses are forfeited.
            </li>
            <li>
              <strong>Goal Earmark:</strong> The final payout shall be earmarked towards productive long-term personal goals or transitioning into real market custodial accounts.
            </li>
          </ol>
        </div>

        {/* Signatures */}
        <div className="pt-8 border-t-2 border-slate-900 grid grid-cols-2 gap-8 text-xs">
          <div>
            <div className="border-b-2 border-slate-900 h-12 mb-2 flex items-end">
              <span className="font-serif italic text-slate-400 text-sm">Junior Investor Signature</span>
            </div>
            <p className="font-bold text-slate-900">{teenName}</p>
            <p className="text-[10px] text-slate-500">Date: {new Date().toLocaleDateString()}</p>
          </div>

          <div>
            <div className="border-b-2 border-slate-900 h-12 mb-2 flex items-end">
              <span className="font-serif italic text-slate-400 text-sm">Bank Trustee Signature</span>
            </div>
            <p className="font-bold text-slate-900">{parentName}</p>
            <p className="text-[10px] text-slate-500">Date: {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
