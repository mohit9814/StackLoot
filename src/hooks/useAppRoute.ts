import { useState, useEffect, useCallback } from 'react';
import type { UserRole } from '../types/userRole';
import type { UserProfile } from '../types/profile';

export type AppRoute = 'PARENT' | 'SON';

// Secret obfuscated token for parent admin access (unguessable by teenagers)
export const PARENT_SECRET_PATH = 'parent-vault-8f3a9';
export const PARENT_AUTH_STORAGE_KEY = 'stackloot_parent_auth_v1';

export function useAppRoute() {
  const getRouteFromLocation = (): {
    route: AppRoute;
    profileIdParam?: string;
    sharedProfile?: UserProfile;
    isParentAuthorized: boolean;
  } => {
    if (typeof window === 'undefined') {
      return { route: 'SON', isParentAuthorized: false };
    }

    const pathname = window.location.pathname.toLowerCase();
    const hash = window.location.hash;
    const searchParams = new URLSearchParams(window.location.search);
    const profileIdParam = searchParams.get('profile') || undefined;

    // Check for encoded profile payload in URL
    let sharedProfile: UserProfile | undefined = undefined;
    let sharePayload = searchParams.get('share');
    if (!sharePayload && hash.includes('share=')) {
      const match = hash.match(/share=([^&]+)/);
      if (match) sharePayload = match[1];
    }

    if (sharePayload) {
      try {
        const decoded = JSON.parse(decodeURIComponent(escape(atob(sharePayload))));
        if (decoded && decoded.id && decoded.teenName) {
          sharedProfile = decoded;
        }
      } catch {
        // ignore invalid payload
      }
    }

    // Check for parent secret route or active session authorization
    const hasSecretInPath = pathname.includes(PARENT_SECRET_PATH);
    const hasSecretInQuery = searchParams.get('auth') === 'parent_8f3a9';
    const hasExistingParentSession = sessionStorage.getItem(PARENT_AUTH_STORAGE_KEY) === 'granted';

    if (hasSecretInPath || hasSecretInQuery) {
      sessionStorage.setItem(PARENT_AUTH_STORAGE_KEY, 'granted');
      return { route: 'PARENT', profileIdParam, sharedProfile, isParentAuthorized: true };
    }

    if (hasExistingParentSession && !pathname.includes('/son')) {
      return { route: 'PARENT', profileIdParam, sharedProfile, isParentAuthorized: true };
    }

    // Default to secure SON view
    return { route: 'SON', profileIdParam, sharedProfile, isParentAuthorized: false };
  };

  const [currentRouteInfo, setCurrentRouteInfo] = useState(getRouteFromLocation);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentRouteInfo(getRouteFromLocation());
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigateToRoute = useCallback((targetRoute: AppRoute, profileId?: string) => {
    const searchParams = new URLSearchParams(window.location.search);
    if (profileId) {
      searchParams.set('profile', profileId);
    }

    const queryStr = searchParams.toString() ? `?${searchParams.toString()}` : '';
    let newPath = `/${queryStr}`;

    if (targetRoute === 'PARENT') {
      sessionStorage.setItem(PARENT_AUTH_STORAGE_KEY, 'granted');
      newPath = `/${PARENT_SECRET_PATH}${queryStr}`;
    } else {
      sessionStorage.removeItem(PARENT_AUTH_STORAGE_KEY);
      newPath = `/son${queryStr}`;
    }

    window.history.pushState({}, '', newPath);
    setCurrentRouteInfo({
      route: targetRoute,
      profileIdParam: profileId,
      isParentAuthorized: targetRoute === 'PARENT',
    });
  }, []);

  const lockParentSession = useCallback(() => {
    sessionStorage.removeItem(PARENT_AUTH_STORAGE_KEY);
    window.history.pushState({}, '', '/');
    setCurrentRouteInfo({
      route: 'SON',
      profileIdParam: undefined,
      isParentAuthorized: false,
    });
  }, []);

  const isSonOnlyRoute = currentRouteInfo.route === 'SON';
  const effectiveRole: UserRole = currentRouteInfo.route === 'PARENT' ? 'PARENT' : 'TEEN';

  const getSonDirectUrl = useCallback((profile: UserProfile): string => {
    if (typeof window === 'undefined') return '';
    const host = window.location.host;
    const protocol = window.location.protocol;
    try {
      const payloadStr = unescape(encodeURIComponent(JSON.stringify(profile)));
      const base64 = btoa(payloadStr);
      return `${protocol}//${host}/son#share=${base64}`;
    } catch {
      return `${protocol}//${host}/son?profile=${encodeURIComponent(profile.id)}`;
    }
  }, []);

  const getParentSecretUrl = useCallback((): string => {
    if (typeof window === 'undefined') return '';
    const host = window.location.host;
    const protocol = window.location.protocol;
    return `${protocol}//${host}/${PARENT_SECRET_PATH}`;
  }, []);

  return {
    currentRoute: currentRouteInfo.route,
    profileIdParam: currentRouteInfo.profileIdParam,
    sharedProfile: currentRouteInfo.sharedProfile,
    isParentAuthorized: currentRouteInfo.isParentAuthorized,
    isSonOnlyRoute,
    effectiveRole,
    navigateToRoute,
    lockParentSession,
    getSonDirectUrl,
    getParentSecretUrl,
  };
}
