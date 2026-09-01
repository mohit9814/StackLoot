import React, { useState, useRef, useEffect } from 'react';
import type { UserProfile } from '../../types/profile';
import type { UserRole } from '../../types/userRole';
import { ChevronDown, Users, Sparkles, Check } from 'lucide-react';

interface ProfileSelectorProps {
  profiles: UserProfile[];
  activeProfile: UserProfile;
  userRole: UserRole;
  onSelectProfile: (id: string) => void;
  onOpenManageModal: () => void;
}

export const ProfileSelector: React.FC<ProfileSelectorProps> = ({
  profiles,
  activeProfile,
  userRole,
  onSelectProfile,
  onOpenManageModal,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-700 hover:border-indigo-500/50 transition-all text-xs font-semibold text-white cursor-pointer shadow-sm"
        title="Switch Saver Profile"
      >
        <span className="text-sm">{activeProfile.avatarEmoji || '🚀'}</span>
        <span className="font-bold text-slate-100 max-w-[90px] sm:max-w-[120px] truncate">
          {activeProfile.teenName}
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-750 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-2.5 py-1.5 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-800 flex items-center justify-between">
            <span>Saver Profiles</span>
            <span className="text-indigo-400 font-mono">{profiles.length} Active</span>
          </div>

          <div className="py-1 space-y-1 max-h-48 overflow-y-auto">
            {profiles.map((p) => {
              const isSelected = p.id === activeProfile.id;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    onSelectProfile(p.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600/20 text-indigo-200 font-bold border border-indigo-500/30'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-sm">{p.avatarEmoji || '🚀'}</span>
                    <span className="truncate">{p.teenName}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          <div className="pt-1.5 border-t border-slate-800 space-y-1">
            <button
              onClick={() => {
                onOpenManageModal();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-indigo-300 hover:text-indigo-200 hover:bg-indigo-950/40 rounded-xl transition-colors font-semibold cursor-pointer"
            >
              {userRole === 'PARENT' ? (
                <>
                  <Users className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Manage / Add Profiles</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>View All Profiles</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
