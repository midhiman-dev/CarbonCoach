import { describe, expect, it, vi, beforeEach } from 'vitest';
import {
  loadStoredProfile,
  saveStoredProfile,
  clearStoredProfile,
  loadTrackerState,
  saveTrackerState,
  clearTrackerState,
  clearAllLocalCarbonCoachData,
} from './trackerStorage';
import type { CarbonProfile, WeeklyTrackerState } from '@carboncoach/shared';

describe('trackerStorage', () => {
  const mockProfile: CarbonProfile = {
    commuteMode: 'metro',
    weeklyCommuteKm: 50,
    dietPattern: 'mostlyVegetarian',
    shoppingFrequency: 'medium',
    deliveriesPerWeek: 2,
    flightsPerYear: 1,
    preference: 'balanced',
  };

  const mockState: WeeklyTrackerState = {
    version: 1,
    weekId: '2026-06-15',
    completedActionIds: ['action-1'],
    updatedAtIso: '2026-06-17T12:00:00.000Z',
  };

  beforeEach(() => {
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    });
  });

  it('saves and loads profile', () => {
    const store: Record<string, string> = {};
    vi.mocked(localStorage.setItem).mockImplementation((key, val) => {
      store[key] = val;
    });
    vi.mocked(localStorage.getItem).mockImplementation((key) => store[key] || null);

    saveStoredProfile(mockProfile);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'carboncoach:profile',
      JSON.stringify(mockProfile),
    );

    const loaded = loadStoredProfile();
    expect(loaded).toEqual(mockProfile);
  });

  it('saves and loads tracker state', () => {
    const store: Record<string, string> = {};
    vi.mocked(localStorage.setItem).mockImplementation((key, val) => {
      store[key] = val;
    });
    vi.mocked(localStorage.getItem).mockImplementation((key) => store[key] || null);

    saveTrackerState(mockState);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'carboncoach:weekly-tracker',
      JSON.stringify(mockState),
    );

    const loaded = loadTrackerState();
    expect(loaded).toEqual(mockState);
  });

  it('returns null for missing data', () => {
    vi.mocked(localStorage.getItem).mockReturnValue(null);
    expect(loadStoredProfile()).toBeNull();
    expect(loadTrackerState()).toBeNull();
  });

  it('returns null for malformed JSON', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(localStorage.getItem).mockReturnValue('invalid-json');
    expect(loadStoredProfile()).toBeNull();
    expect(loadTrackerState()).toBeNull();
    errorSpy.mockRestore();
  });

  it('returns null for tracker state with version mismatch', () => {
    const staleState = {
      version: 0,
      weekId: '2026-06-15',
      completedActionIds: [],
    };
    vi.mocked(localStorage.getItem).mockReturnValue(JSON.stringify(staleState));
    expect(loadTrackerState()).toBeNull();
  });

  it('handles unavailable localStorage safely without throwing', () => {
    vi.stubGlobal('localStorage', undefined);
    expect(() => saveStoredProfile(mockProfile)).not.toThrow();
    expect(loadStoredProfile()).toBeNull();
    expect(() => saveTrackerState(mockState)).not.toThrow();
    expect(loadTrackerState()).toBeNull();
    expect(() => clearAllLocalCarbonCoachData()).not.toThrow();
  });

  it('returns null for invalid profile payloads missing required fields', () => {
    const invalidProfile = { commuteMode: 'car' }; // Missing preference
    vi.mocked(localStorage.getItem).mockReturnValue(JSON.stringify(invalidProfile));
    expect(loadStoredProfile()).toBeNull();
  });

  it('returns null for profile payloads that are not objects', () => {
    vi.mocked(localStorage.getItem).mockReturnValue(JSON.stringify("string instead of object"));
    expect(loadStoredProfile()).toBeNull();
  });

  it('returns null for invalid tracker payloads missing required fields', () => {
    const invalidTracker = { version: 1, weekId: '2026-06-15' }; // Missing completedActionIds
    vi.mocked(localStorage.getItem).mockReturnValue(JSON.stringify(invalidTracker));
    expect(loadTrackerState()).toBeNull();
  });

  it('returns null for tracker payloads that are not objects', () => {
    vi.mocked(localStorage.getItem).mockReturnValue(JSON.stringify(123));
    expect(loadTrackerState()).toBeNull();
  });

  it('clears profile and tracker state', () => {
    clearStoredProfile();
    expect(localStorage.removeItem).toHaveBeenCalledWith('carboncoach:profile');

    clearTrackerState();
    expect(localStorage.removeItem).toHaveBeenCalledWith('carboncoach:weekly-tracker');

    clearAllLocalCarbonCoachData();
    expect(localStorage.removeItem).toHaveBeenCalledWith('carboncoach:profile');
    expect(localStorage.removeItem).toHaveBeenCalledWith('carboncoach:weekly-tracker');
  });
});
