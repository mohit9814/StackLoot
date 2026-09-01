import React, { useState } from 'react';
import type { UserProfile, CreateProfileParams } from '../../types/profile';
import type { UserRole } from '../../types/userRole';
import type { CurrencyConfig } from '../../types/allowance';
import { formatCurrency } from '../../config/currencies';
import {
  X,
  Plus,
  RotateCcw,
  Trash2,
  CheckCircle2,
  ShieldAlert,
  Sparkles,
  Users,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ManageProfilesModalProps {
  isOpen: boolean;
  profiles: UserProfile[];
  activeProfile: UserProfile;
  userRole: UserRole;
  currency: CurrencyConfig;
  onClose: () => void;
  onSelectProfile: (id: string) => void;
  onCreateProfile: (params: CreateProfileParams) => void;
  onResetProfile: (id: string) => void;
  onDeleteProfile: (id: string) => void;
}

const AVATAR_OPTIONS = ['🚀', '💎', '🎮', '🎸', '⚽', '🏎️', '🧠', '🌟', '🛹', '🎯'];

export const ManageProfilesModal: React.FC<ManageProfilesModalProps> = ({
  isOpen,
  profiles,
  activeProfile,
  userRole,
  currency,
  onClose,
  onSelectProfile,
  onCreateProfile,
  onResetProfile,
  onDeleteProfile,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newTeenName, setNewTeenName] = useState('');
  const [newParentName] = useState('Dad');
  const [selectedAvatar, setSelectedAvatar] = useState('🚀');
  const [newAllowance, setNewAllowance] = useState(2000);

  const [confirmResetId, setConfirmResetId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeenName.trim()) return;

    try {
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    } catch {
      // ignore
    }

    onCreateProfile({
      teenName: newTeenName.trim(),
      parentName: newParentName.trim() || 'Dad',
      avatarEmoji: selectedAvatar,
      monthlyAllowance: newAllowance,
    });

    setNewTeenName('');
    setIsCreating(false);
  };

  const handleExecuteReset = (id: string) => {
    onResetProfile(id);
    setConfirmResetId(null);
  };

  const handleExecuteDelete = (id: string) => {
    onDeleteProfile(id);
    setConfirmDeleteId(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-750 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-indigo-500/15 text-indigo-400 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Family Saver Profiles</h3>
              <p className="text-xs text-slate-400">
                {userRole === 'PARENT'
                  ? 'Manage, add, reset, or configure savings accounts for each child'
                  : 'Switch your active savings profile'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Security notice for Teen view */}
        {userRole === 'TEEN' && (
          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-3.5 flex items-center gap-2.5 text-xs text-slate-300">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Profile administrative actions (resetting or deleting) are restricted to <strong>Parent Mode</strong>.
            </span>
          </div>
        )}

        {/* Profiles List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span>Registered Accounts ({profiles.length})</span>
            {userRole === 'PARENT' && !isCreating && (
              <button
                onClick={() => setIsCreating(true)}
                className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Sibling / Profile</span>
              </button>
            )}
          </div>

          <div className="space-y-2.5">
            {profiles.map((p) => {
              const isSelected = p.id === activeProfile.id;
              const hasActivePlan = p.activePlan !== null;
              const currentBal = p.activePlan ? p.activePlan.currentBalance : 0;

              return (
                <div
                  key={p.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isSelected
                      ? 'bg-indigo-950/40 border-indigo-500 shadow-md text-white'
                      : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div
                      className="flex items-center gap-3 cursor-pointer flex-1"
                      onClick={() => onSelectProfile(p.id)}
                    >
                      <span className="text-2xl p-2 bg-slate-800 rounded-2xl border border-slate-750 shadow-inner">
                        {p.avatarEmoji || '🚀'}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white text-sm">{p.teenName}</h4>
                          {isSelected && (
                            <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 px-2 py-0.2 rounded-full font-bold">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {hasActivePlan ? (
                            <>
                              Balance: <strong className="text-emerald-400 font-mono">{formatCurrency(currentBal, currency)}</strong> • {p.activePlan?.targetTermMonths} Mo Term
                            </>
                          ) : (
                            'No active ledger plan yet'
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Action Controls for Parent Mode */}
                    {userRole === 'PARENT' && (
                      <div className="flex items-center gap-1.5 shrink-0">
                        {confirmResetId === p.id ? (
                          <div className="flex items-center gap-1 bg-amber-950/60 border border-amber-500/40 p-1 rounded-xl text-[11px]">
                            <span className="text-amber-300 font-bold px-1">Reset?</span>
                            <button
                              onClick={() => handleExecuteReset(p.id)}
                              className="px-2 py-1 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg cursor-pointer"
                            >
                              Yes
                            </button>
                            <button
                              onClick={() => setConfirmResetId(null)}
                              className="px-2 py-1 bg-slate-700 text-slate-300 rounded-lg cursor-pointer"
                            >
                              No
                            </button>
                          </div>
                        ) : confirmDeleteId === p.id ? (
                          <div className="flex items-center gap-1 bg-rose-950/60 border border-rose-500/40 p-1 rounded-xl text-[11px]">
                            <span className="text-rose-300 font-bold px-1">Delete?</span>
                            <button
                              onClick={() => handleExecuteDelete(p.id)}
                              className="px-2 py-1 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg cursor-pointer"
                            >
                              Yes
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              className="px-2 py-1 bg-slate-700 text-slate-300 rounded-lg cursor-pointer"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <>
                            <button
                              onClick={() => setConfirmResetId(p.id)}
                              title="Reset account (restart from Day 1)"
                              className="p-2 text-slate-400 hover:text-amber-300 hover:bg-slate-700/80 rounded-xl transition-colors cursor-pointer"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                            {profiles.length > 1 && (
                              <button
                                onClick={() => setConfirmDeleteId(p.id)}
                                title="Delete profile"
                                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-700/80 rounded-xl transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Create Profile Section (Parent Mode Only) */}
        {userRole === 'PARENT' && isCreating && (
          <form onSubmit={handleCreateSubmit} className="bg-slate-850 border border-slate-750 p-4 rounded-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-750 pb-2">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Create New Child / Saver Profile</span>
              </span>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Avatar Picker */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300 block">Choose Avatar</label>
              <div className="flex gap-2 flex-wrap">
                {AVATAR_OPTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setSelectedAvatar(emoji)}
                    className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center border transition-all cursor-pointer ${
                      selectedAvatar === emoji
                        ? 'bg-indigo-600/30 border-indigo-500 scale-110 shadow-sm'
                        : 'bg-slate-800 border-slate-700 hover:bg-slate-750'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Name & Allowance */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Child / Teen's Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aarav, Maya"
                  value={newTeenName}
                  onChange={(e) => setNewTeenName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Monthly Allowance ({currency.symbol})</label>
                <input
                  type="number"
                  min={100}
                  step={100}
                  required
                  value={newAllowance}
                  onChange={(e) => setNewAllowance(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="flex-1 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-md shadow-indigo-500/20 cursor-pointer flex items-center justify-center gap-1"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Save Profile</span>
              </button>
            </div>
          </form>
        )}

        {/* Footer */}
        <div className="pt-2 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-200 font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
