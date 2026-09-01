import React, { useState } from 'react';
import type { ChallengeTierConfig } from '../../types/gamification';
import { X, Gift, Check } from 'lucide-react';

interface TreatPickerModalProps {
  tier: ChallengeTierConfig | null;
  currentPerk?: string;
  onClose: () => void;
  onSelectPerk: (perk: string) => void;
}

export const TreatPickerModal: React.FC<TreatPickerModalProps> = ({
  tier,
  currentPerk,
  onClose,
  onSelectPerk,
}) => {
  const [customInput, setCustomInput] = useState('');

  if (!tier) return null;

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customInput.trim()) {
      onSelectPerk(customInput.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/15 text-amber-400 rounded-xl">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Choose Completion Perk</h3>
              <p className="text-xs text-slate-400">{tier.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Perk list */}
        <div className="space-y-2">
          {tier.perkOptions.map((perk) => {
            const isSelected = (currentPerk || tier.defaultPerkTitle) === perk;
            return (
              <button
                key={perk}
                onClick={() => {
                  onSelectPerk(perk);
                  onClose();
                }}
                className={`w-full text-left p-3 rounded-xl border text-xs font-medium flex items-center justify-between transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600/20 border-indigo-500 text-white font-semibold'
                    : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                }`}
              >
                <span>{perk}</span>
                {isSelected && <Check className="w-4 h-4 text-indigo-400 shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Custom perk input */}
        <form onSubmit={handleCustomSubmit} className="space-y-2 pt-2 border-t border-slate-800">
          <label className="text-xs font-medium text-slate-400">Or enter a custom agreed reward:</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. New skateboard deck, concert ticket..."
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={!customInput.trim()}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Set
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
