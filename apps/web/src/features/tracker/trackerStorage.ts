import type { CarbonProfile, WeeklyTrackerState } from '@carboncoach/shared';

const PROFILE_KEY = 'carboncoach:profile';
const TRACKER_KEY = 'carboncoach:weekly-tracker';

/**
 * Checks if localStorage is available in the current environment.
 */
function isLocalStorageAvailable(): boolean {
  try {
    const testKey = '__storage_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

export function loadStoredProfile(): CarbonProfile | null {
  if (!isLocalStorageAvailable()) {
    return null;
  }
  try {
    const data = window.localStorage.getItem(PROFILE_KEY);
    if (!data) {
      return null;
    }
    const parsed = JSON.parse(data) as CarbonProfile;
    // Basic structural validation
    if (typeof parsed !== 'object' || parsed === null) {
      return null;
    }
    if (!parsed.commuteMode || !parsed.preference) {
      return null;
    }
    return parsed;
  } catch (e) {
    console.error('Error loading stored profile:', e);
    return null;
  }
}

export function saveStoredProfile(profile: CarbonProfile): void {
  if (!isLocalStorageAvailable()) {
    return;
  }
  try {
    window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Error saving stored profile:', e);
  }
}

export function clearStoredProfile(): void {
  if (!isLocalStorageAvailable()) {
    return;
  }
  try {
    window.localStorage.removeItem(PROFILE_KEY);
  } catch (e) {
    console.error('Error clearing stored profile:', e);
  }
}

export function loadTrackerState(): WeeklyTrackerState | null {
  if (!isLocalStorageAvailable()) {
    return null;
  }
  try {
    const data = window.localStorage.getItem(TRACKER_KEY);
    if (!data) {
      return null;
    }
    const parsed = JSON.parse(data) as WeeklyTrackerState;
    // Structural and version mismatch validation
    if (typeof parsed !== 'object' || parsed === null) {
      return null;
    }
    if (parsed.version !== 1) {
      return null;
    }
    if (typeof parsed.weekId !== 'string' || !Array.isArray(parsed.completedActionIds)) {
      return null;
    }
    return parsed;
  } catch (e) {
    console.error('Error loading stored tracker state:', e);
    return null;
  }
}

export function saveTrackerState(state: WeeklyTrackerState): void {
  if (!isLocalStorageAvailable()) {
    return;
  }
  try {
    window.localStorage.setItem(TRACKER_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Error saving stored tracker state:', e);
  }
}

export function clearTrackerState(): void {
  if (!isLocalStorageAvailable()) {
    return;
  }
  try {
    window.localStorage.removeItem(TRACKER_KEY);
  } catch (e) {
    console.error('Error clearing stored tracker state:', e);
  }
}

export function clearAllLocalCarbonCoachData(): void {
  if (!isLocalStorageAvailable()) {
    return;
  }
  try {
    window.localStorage.removeItem(PROFILE_KEY);
    window.localStorage.removeItem(TRACKER_KEY);
  } catch (e) {
    console.error('Error clearing all local CarbonCoach data:', e);
  }
}
