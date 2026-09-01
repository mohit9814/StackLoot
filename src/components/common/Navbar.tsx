import React, { useState } from 'react';
import { Sparkles, Trophy, Download, Upload, Printer, ShieldCheck, Link, Check, Lock, Key, LogOut, Coins } from 'lucide-react';
import type { CurrencyCode } from '../../types/allowance';
import { CurrencySelector } from './CurrencySelector';
import type { UserGamificationState } from '../../types/gamification';
import type { UserRole } from '../../types/userRole';
import type { UserProfile } from '../../types/profile';
import { ProfileSelector } from '../profiles/ProfileSelector';

interface NavbarProps {
  currentCurrency: CurrencyCode;
  onSelectCurrency: (code: CurrencyCode) => void;
  gamification: UserGamificationState;
  userRole: UserRole;
  onToggleRole: (role: UserRole) => void;
  profiles: UserProfile[];
  activeProfile: UserProfile;
  isSonOnlyRoute: boolean;
  onSelectProfile: (id: string) => void;
  onOpenManageProfiles: () => void;
  onCopySonLink: () => void;
  onCopyParentSecretLink?: () => void;
  onLockParentMode?: () => void;
  onExportData: () => void;
  onImportData: () => void;
  onPrintCharter: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentCurrency,
  onSelectCurrency,
  gamification,
  userRole,
  onToggleRole,
  profiles,
  activeProfile,
  isSonOnlyRoute,
  onSelectProfile,
  onOpenManageProfiles,
  onCopySonLink,
  onCopyParentSecretLink,
  onLockParentMode,
  onExportData,
  onImportData,
  onPrintCharter,
}) => {
  const [copiedSonLink, setCopiedSonLink] = useState(false);
  const [copiedParentLink, setCopiedParentLink] = useState(false);

  const nextLevelXp = gamification.currentLevel === 1 ? 1000 : gamification.currentLevel === 2 ? 2500 : 5000;
  const currentLevelMinXp = gamification.currentLevel === 1 ? 0 : gamification.currentLevel === 2 ? 1000 : 2500;
  const progressPercent = Math.min(100, Math.round(((gamification.totalXp - currentLevelMinXp) / (nextLevelXp - currentLevelMinXp)) * 100));

  const handleCopySon = () => {
    onCopySonLink();
    setCopiedSonLink(true);
    setTimeout(() => setCopiedSonLink(false), 2000);
  };

  const handleCopyParent = () => {
    if (onCopyParentSecretLink) {
      onCopyParentSecretLink();
      setCopiedParentLink(true);
      setTimeout(() => setCopiedParentLink(false), 2000);
    }
  };

  return (
    <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40 px-4 lg:px-8 py-3.5 no-print">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & Profile Switcher */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-white/20">
              <Coins className="w-5 h-5 text-amber-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black text-white tracking-tight bg-gradient-to-r from-amber-300 via-indigo-200 to-purple-300 bg-clip-text text-transparent">
                  StackLoot
                </h1>
                <span className="bg-indigo-500/20 text-indigo-300 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md border border-indigo-500/30">
                  {isSonOnlyRoute ? 'Junior Vault' : 'Parent OS'}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                {isSonOnlyRoute
                  ? `${activeProfile.teenName}'s Compounding Vault & Mission Control`
                  : 'Smart Compound Vault & Allowance Engine'}
              </p>
            </div>
          </div>

          {/* Profile Switcher */}
          <div className="md:ml-3">
            <ProfileSelector
              profiles={profiles}
              activeProfile={activeProfile}
              userRole={userRole}
              onSelectProfile={onSelectProfile}
              onOpenManageModal={onOpenManageProfiles}
            />
          </div>
        </div>

        {/* Level, Role Switcher and Actions */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end flex-wrap">
          {/* Role Controls */}
          {isSonOnlyRoute ? (
            /* Locked Son Badge (Cannot switch to Parent on unauthenticated route) */
            <div className="flex items-center gap-1.5 bg-indigo-950/60 border border-indigo-500/30 px-3 py-1.5 rounded-xl text-xs font-bold text-indigo-300 shadow-inner">
              <Lock className="w-3.5 h-3.5 text-indigo-400" />
              <span>{activeProfile.teenName}'s Portal</span>
            </div>
          ) : (
            /* Authorized Parent Controls */
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700">
                <button
                  type="button"
                  onClick={() => onToggleRole('TEEN')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    userRole === 'TEEN'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>Preview Son's View</span>
                </button>
                <button
                  type="button"
                  onClick={() => onToggleRole('PARENT')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    userRole === 'PARENT'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Parent Studio</span>
                </button>
              </div>

              {/* Share Son's Direct Link Button */}
              <button
                type="button"
                onClick={handleCopySon}
                title="Copy Son's Direct Clean Link"
                className="flex items-center gap-1.5 bg-indigo-950/50 hover:bg-indigo-900/60 text-indigo-300 border border-indigo-500/30 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
              >
                {copiedSonLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Son Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Link className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Copy Son's Link</span>
                  </>
                )}
              </button>

              {/* Secret Parent Link Button */}
              {onCopyParentSecretLink && (
                <button
                  type="button"
                  onClick={handleCopyParent}
                  title="Copy Secret Parent URL to bookmark on your device"
                  className="flex items-center gap-1.5 bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 border border-amber-500/40 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
                >
                  {copiedParentLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Parent URL Copied!</span>
                    </>
                  ) : (
                    <>
                      <Key className="w-3.5 h-3.5 text-amber-400" />
                      <span>Copy Secret Parent URL</span>
                    </>
                  )}
                </button>
              )}

              {/* Lock / Exit Parent Mode Button */}
              {onLockParentMode && (
                <button
                  type="button"
                  onClick={onLockParentMode}
                  title="Lock Parent Mode & Return to Son's Portal"
                  className="flex items-center gap-1.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-400" />
                  <span>Lock Parent Mode</span>
                </button>
              )}
            </div>
          )}

          {/* Gamification Level & XP pill */}
          <div className="flex items-center gap-3 bg-slate-800/80 border border-slate-700/80 rounded-xl px-3.5 py-1.5 shadow-inner">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
              <Trophy className="w-4 h-4" />
              <span>Lvl {gamification.currentLevel}</span>
            </div>
            <div className="w-16 lg:w-24 bg-slate-700 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="text-[11px] font-mono text-slate-300 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>{gamification.totalXp} XP</span>
            </div>
          </div>

          {/* Currency picker */}
          <CurrencySelector
            currentCurrency={currentCurrency}
            onSelectCurrency={onSelectCurrency}
          />

          {/* Quick Print Charter / Tracker button */}
          <button
            onClick={onPrintCharter}
            title="Print Family Charter & Desk Ledger"
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-2 rounded-lg border border-slate-700 transition-colors shadow-sm cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Print</span>
          </button>

          {/* Backup Data (Parent Only) */}
          {!isSonOnlyRoute && (
            <div className="flex items-center gap-1">
              <button
                onClick={onExportData}
                title="Export Ledger Backup (JSON)"
                className="p-2 text-slate-400 hover:text-slate-200 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-lg transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onImportData}
                title="Restore Ledger Backup"
                className="p-2 text-slate-400 hover:text-slate-200 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-lg transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
