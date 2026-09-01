import React, { useState } from 'react';
import type { WishlistGoal } from '../../types/goal';
import type { CurrencyConfig } from '../../types/allowance';
import { X, Target, Plus } from 'lucide-react';

interface AddGoalModalProps {
  isOpen: boolean;
  currency: CurrencyConfig;
  onClose: () => void;
  onAddGoal: (title: string, targetAmount: number, category: WishlistGoal['category'], notes?: string) => void;
}

export const AddGoalModal: React.FC<AddGoalModalProps> = ({
  isOpen,
  currency,
  onClose,
  onAddGoal,
}) => {
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState<number>(5000);
  const [category, setCategory] = useState<WishlistGoal['category']>('TECH');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && targetAmount > 0) {
      onAddGoal(title, targetAmount, category, notes.trim() || undefined);
      setTitle('');
      setNotes('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-750 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-500/15 text-indigo-400 rounded-xl">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Add Earmarked Goal</h3>
              <p className="text-xs text-slate-400">Tie compounding savings to a concrete dream</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1.5">Goal Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Electric Guitar Amp, Gaming Console, Headphones"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1.5">
                Target Cost ({currency.symbol})
              </label>
              <input
                type="number"
                min={100}
                step={100}
                required
                value={targetAmount}
                onChange={(e) => setTargetAmount(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1.5">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as WishlistGoal['category'])}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="TECH">Tech & Hardware</option>
                <option value="MUSIC">Music & Instruments</option>
                <option value="GAMING">Gaming</option>
                <option value="EDUCATION">Education & Books</option>
                <option value="LIFESTYLE">Lifestyle & Fashion</option>
                <option value="EXPERIENCE">Trip & Experience</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1.5">Model / Specific Notes (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Specific model, color, brand"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Goal</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
