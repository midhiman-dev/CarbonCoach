import { describe, expect, it } from 'vitest';
import {
  createCurrentWeekId,
  createInitialWeeklyTrackerState,
  toggleTrackedAction,
  isActionCompleted,
  calculateTrackerProgress,
} from './trackerLogic';

describe('trackerLogic', () => {
  it('creates stable week id (Monday date string)', () => {
    // 2026-06-17 is a Wednesday. Monday of that week is 2026-06-15.
    const wednesday = new Date('2026-06-17T12:00:00Z');
    expect(createCurrentWeekId(wednesday)).toBe('2026-06-15');

    // 2026-06-21 is a Sunday. Monday of that week is 2026-06-15.
    const sunday = new Date('2026-06-21T12:00:00Z');
    expect(createCurrentWeekId(sunday)).toBe('2026-06-15');

    // 2026-06-15 is a Monday.
    const monday = new Date('2026-06-15T12:00:00Z');
    expect(createCurrentWeekId(monday)).toBe('2026-06-15');
  });

  it('creates initial weekly tracker state', () => {
    const state = createInitialWeeklyTrackerState('2026-06-15');
    expect(state.version).toBe(1);
    expect(state.weekId).toBe('2026-06-15');
    expect(state.completedActionIds).toEqual([]);
    expect(state.updatedAtIso).toBeDefined();
  });

  it('toggles action completion on and off and does not mutate', () => {
    const initialState = createInitialWeeklyTrackerState('2026-06-15');

    // Toggle on
    const state2 = toggleTrackedAction(initialState, 'action-1');
    expect(state2.completedActionIds).toEqual(['action-1']);
    expect(initialState.completedActionIds).toEqual([]); // No mutation
    expect(isActionCompleted(state2, 'action-1')).toBe(true);

    // Toggle off
    const state3 = toggleTrackedAction(state2, 'action-1');
    expect(state3.completedActionIds).toEqual([]);
    expect(isActionCompleted(state3, 'action-1')).toBe(false);
  });

  it('calculates tracker progress correctly', () => {
    const state = {
      version: 1 as const,
      weekId: '2026-06-15',
      completedActionIds: ['action-1', 'action-3'],
      updatedAtIso: new Date().toISOString(),
    };

    const actionIds = ['action-1', 'action-2', 'action-3', 'action-4'];
    const progress = calculateTrackerProgress(state, actionIds);
    expect(progress.completed).toBe(2);
    expect(progress.total).toBe(4);
    expect(progress.percent).toBe(50);
  });

  it('handles empty action list in progress calculation', () => {
    const state = createInitialWeeklyTrackerState();
    const progress = calculateTrackerProgress(state, []);
    expect(progress.completed).toBe(0);
    expect(progress.total).toBe(0);
    expect(progress.percent).toBe(0);
  });
});
