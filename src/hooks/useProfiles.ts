import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import type { UserProfile, CreateProfileParams } from '../types/profile';
import { profileService, createDefaultProfile } from '../services/profileService';
import { apiService } from '../services/apiService';

export function useProfiles() {
  const [profiles, setProfiles] = useState<UserProfile[]>(() => profileService.loadProfiles());
  const [activeProfileId, setActiveProfileIdState] = useState<string>(() => profileService.loadActiveProfileId());
  const isSyncingFromServerRef = useRef(false);

  // Hydrate from filesystem API on initial load
  useEffect(() => {
    let isMounted = true;
    apiService.fetchServerState().then((serverData) => {
      if (!isMounted || !serverData) return;
      if (Array.isArray(serverData.profiles) && serverData.profiles.length > 0) {
        isSyncingFromServerRef.current = true;
        setProfiles(serverData.profiles);
        if (serverData.activeProfileId) {
          setActiveProfileIdState(serverData.activeProfileId);
          localStorage.setItem('bod_active_profile_id_v1', serverData.activeProfileId);
        }
        localStorage.setItem('bod_profiles_v1', JSON.stringify(serverData.profiles));
        setTimeout(() => {
          isSyncingFromServerRef.current = false;
        }, 100);
      }
    });

    // Periodic sync from filesystem (for seamless multi-device & phone synchronization)
    const interval = setInterval(() => {
      apiService.fetchServerState().then((serverData) => {
        if (!serverData?.profiles || isSyncingFromServerRef.current) return;
        const localProfilesStr = localStorage.getItem('bod_profiles_v1');
        const serverProfilesStr = JSON.stringify(serverData.profiles);
        if (localProfilesStr !== serverProfilesStr) {
          setProfiles(serverData.profiles);
          localStorage.setItem('bod_profiles_v1', serverProfilesStr);
          if (serverData.activeProfileId) {
            setActiveProfileIdState(serverData.activeProfileId);
            localStorage.setItem('bod_active_profile_id_v1', serverData.activeProfileId);
          }
        }
      });
    }, 2500);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Listen to cross-tab/window storage updates
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'bod_profiles_v1' || e.key === 'bod_active_profile_id_v1' || e.key === 'bank_of_dad_active_plan_v1') {
        setProfiles(profileService.loadProfiles());
        setActiveProfileIdState(profileService.loadActiveProfileId());
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const activeProfile = useMemo(() => {
    return profiles.find((p) => p.id === activeProfileId) || profiles[0] || createDefaultProfile();
  }, [profiles, activeProfileId]);

  const switchProfile = useCallback((id: string) => {
    profileService.setActiveProfileId(id);
    setActiveProfileIdState(id);
  }, []);

  const importSharedProfile = useCallback((shared: UserProfile) => {
    profileService.importOrUpdateProfile(shared);
    const refreshed = profileService.loadProfiles();
    setProfiles(refreshed);
    setActiveProfileIdState(shared.id);
  }, []);

  const createNewProfile = useCallback((params: CreateProfileParams) => {
    const newP = profileService.createProfile(params);
    const refreshed = profileService.loadProfiles();
    setProfiles(refreshed);
    setActiveProfileIdState(newP.id);
    return newP;
  }, []);

  const updateActiveProfileData = useCallback((updates: Partial<UserProfile>) => {
    setProfiles((prev) => {
      const updated = prev.map((p) => {
        if (p.id === activeProfileId) {
          return {
            ...p,
            ...updates,
            updatedAt: new Date().toISOString(),
          };
        }
        return p;
      });
      profileService.saveProfiles(updated);
      return updated;
    });
  }, [activeProfileId]);

  const resetProfile = useCallback((id: string) => {
    const updated = profileService.resetProfile(id);
    setProfiles(updated);
  }, []);

  const deleteProfile = useCallback((id: string) => {
    const { updatedProfiles, newActiveId } = profileService.deleteProfile(id);
    setProfiles(updatedProfiles);
    setActiveProfileIdState(newActiveId);
  }, []);

  return {
    profiles,
    activeProfile,
    activeProfileId,
    switchProfile,
    importSharedProfile,
    createNewProfile,
    updateActiveProfileData,
    resetProfile,
    deleteProfile,
  };
}
