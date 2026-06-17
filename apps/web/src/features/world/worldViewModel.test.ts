import { describe, expect, it } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useCarbonWorld } from './worldViewModel';
import type { CarbonProfile, WeeklyTrackerState, RankedCarbonAction } from '@carboncoach/shared';

describe('worldViewModel useCarbonWorld', () => {
  const mockProfile: CarbonProfile = {
    commuteMode: 'metro',
    weeklyCommuteKm: 50,
    dietPattern: 'mostlyVegetarian',
    shoppingFrequency: 'medium',
    deliveriesPerWeek: 2,
    flightsPerYear: 1,
    preference: 'balanced',
  };

  const mockActions: RankedCarbonAction[] = [
    {
      id: 'act-1',
      title: 'Action 1',
      category: 'transport',
      impactBand: 'low',
      score: 10,
      fitReasons: ['Balanced preference'],
      effort: 'low',
      costEffect: 'neutral',
      reason: 'Balanced preference',
      assumptionNote: 'demo note',
    },
    {
      id: 'act-2',
      title: 'Action 2',
      category: 'food',
      impactBand: 'high',
      score: 8,
      fitReasons: ['High impact contributor'],
      effort: 'medium',
      costEffect: 'savesMoney',
      reason: 'High impact contributor',
      assumptionNote: 'demo note',
    },
  ];

  const mockTrackerState: WeeklyTrackerState = {
    version: 1,
    weekId: '2026-06-15',
    completedActionIds: [],
    updatedAtIso: new Date().toISOString(),
  };

  it('returns null worldState when no profile exists', () => {
    const { result } = renderHook(() =>
      useCarbonWorld({
        profile: null,
        weeklyPlanActions: mockActions,
        trackerState: mockTrackerState,
      }),
    );

    expect(result.current.worldState).toBeNull();
    expect(result.current.hasProfile).toBe(false);
    expect(result.current.hasTracker).toBe(true);
  });

  it('returns null worldState when no weekly plan actions exist', () => {
    const { result } = renderHook(() =>
      useCarbonWorld({
        profile: mockProfile,
        weeklyPlanActions: [],
        trackerState: mockTrackerState,
      }),
    );

    expect(result.current.worldState).toBeNull();
    expect(result.current.hasProfile).toBe(true);
    expect(result.current.hasTracker).toBe(false);
  });

  it('returns null worldState when no trackerState exists', () => {
    const { result } = renderHook(() =>
      useCarbonWorld({
        profile: mockProfile,
        weeklyPlanActions: mockActions,
        trackerState: null,
      }),
    );

    expect(result.current.worldState).toBeNull();
    expect(result.current.hasProfile).toBe(true);
    expect(result.current.hasTracker).toBe(false);
  });

  it('calculates worldState correctly with tracker progress', () => {
    const { result } = renderHook(() =>
      useCarbonWorld({
        profile: mockProfile,
        weeklyPlanActions: mockActions,
        trackerState: {
          ...mockTrackerState,
          completedActionIds: ['act-1'],
        },
      }),
    );

    expect(result.current.worldState).not.toBeNull();
    expect(result.current.worldState?.stage).toBe('garden'); // 1 of 2 is 50% -> garden
    expect(result.current.worldState?.completedActions).toBe(1);
    expect(result.current.worldState?.totalActions).toBe(2);
    expect(result.current.worldState?.progressPercent).toBe(50);
  });
});
