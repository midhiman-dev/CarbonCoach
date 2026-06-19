import { describe, it, expect } from 'vitest';
import { calculateFootprint } from '../src/carbon/calculator';
import { recommendActions } from '../src/recommendations/recommendationEngine';
import { toggleTrackedAction } from '../src/tracker/trackerLogic';
import { createCarbonWorldState } from '../src/world/worldEngine';
import type { CarbonProfile, WeeklyTrackerState } from '../src/types';

describe('Critical Flow Regressions', () => {
  it('Flow 1: Profile -> Calculator -> Recommendations -> Weekly Plan', () => {
    const profile: CarbonProfile = {
      commuteMode: 'car',
      weeklyCommuteKm: 300, // Very high transport impact
      dietPattern: 'meatHeavy', // High food impact
      shoppingFrequency: 'high',
      deliveriesPerWeek: 5,
      flightsPerYear: 3, // High flight impact
      preference: 'balanced',
    };

    // 1. Calculator
    const footprint = calculateFootprint(profile);

    expect(footprint.monthlyTotalKgCO2e).toBeGreaterThan(0);
    expect(footprint.topCategory).toBeDefined();

    // 2. Recommendations
    const actions = recommendActions({ footprint, preference: profile.preference });
    expect(actions.length).toBeGreaterThan(0);

    // The top recommended action should align with the dominant category
    expect(actions[0].category).toBe(footprint.topCategory);
  });

  it('Flow 2: Tracker Progression -> Carbon World Level Progression', () => {
    const initialState: WeeklyTrackerState = {
      version: 1,
      weekId: '2026-06-15',
      completedActionIds: [],
      updatedAtIso: new Date().toISOString(),
    };

    // 0 actions -> seed stage
    const state0 = createCarbonWorldState({
      completedActions: initialState.completedActionIds.length,
      totalActions: 3,
    });
    expect(state0.stage).toBe('seed');
    expect(state0.progressPercent).toBe(0);

    // Complete 1 action
    const tState1 = toggleTrackedAction(initialState, 'act-1');
    const state1 = createCarbonWorldState({
      completedActions: tState1.completedActionIds.length,
      totalActions: 3,
    });
    expect(state1.stage).toBe('sprout');
    expect(state1.progressPercent).toBe(33);

    // Complete 2nd action
    const tState2 = toggleTrackedAction(tState1, 'act-2');
    const state2 = createCarbonWorldState({
      completedActions: tState2.completedActionIds.length,
      totalActions: 3,
    });
    expect(state2.stage).toBe('garden');
    expect(state2.progressPercent).toBe(67);

    // Complete 3rd action
    const tState3 = toggleTrackedAction(tState2, 'act-3');
    const state3 = createCarbonWorldState({
      completedActions: tState3.completedActionIds.length,
      totalActions: 3,
    });
    expect(state3.stage).toBe('grove');
    expect(state3.progressPercent).toBe(100);

    // Undo an action
    const tStateUndo = toggleTrackedAction(tState3, 'act-2'); // toggle again to undo
    const stateUndo = createCarbonWorldState({
      completedActions: tStateUndo.completedActionIds.length,
      totalActions: 3,
    });
    expect(stateUndo.stage).toBe('garden');
    expect(stateUndo.progressPercent).toBe(67);
  });
});
