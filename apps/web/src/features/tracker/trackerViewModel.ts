import { useState, useEffect } from 'react';
import type {
  CarbonProfile,
  WeeklyTrackerState,
  RankedCarbonAction} from '@carboncoach/shared';
import {
  calculateFootprint,
  createWeeklyActionPlan,
  createCurrentWeekId,
  createInitialWeeklyTrackerState,
  toggleTrackedAction,
  calculateTrackerProgress
} from '@carboncoach/shared';
import { loadTrackerState, saveTrackerState } from './trackerStorage';

export function useWeeklyTracker(profile: CarbonProfile | null) {
  const [trackerState, setTrackerState] = useState<WeeklyTrackerState | null>(null);

  // Load tracker state on mount or profile change
  useEffect(() => {
    if (!profile) {
      setTrackerState(null);
      return;
    }

    const currentWeekId = createCurrentWeekId();
    const stored = loadTrackerState();

    if (stored && stored.weekId === currentWeekId) {
      setTrackerState(stored);
    } else {
      // Create new tracker state for the current week
      const initialState = createInitialWeeklyTrackerState(currentWeekId);
      saveTrackerState(initialState);
      setTrackerState(initialState);
    }
  }, [profile]);

  // Generate weekly plan actions deterministically
  const weeklyPlanActions: RankedCarbonAction[] = [];
  let planSummary = '';
  if (profile) {
    const footprint = calculateFootprint(profile);
    const plan = createWeeklyActionPlan({ footprint, preference: profile.preference });
    weeklyPlanActions.push(...plan.actions);
    planSummary = plan.summary;
  }

  const actionIds = weeklyPlanActions.map((a) => a.id);

  const toggleAction = (actionId: string) => {
    if (!trackerState) return;
    const newState = toggleTrackedAction(trackerState, actionId);
    saveTrackerState(newState);
    setTrackerState(newState);
  };

  const resetTracker = () => {
    const currentWeekId = createCurrentWeekId();
    const initialState = createInitialWeeklyTrackerState(currentWeekId);
    saveTrackerState(initialState);
    setTrackerState(initialState);
  };

  const progress = trackerState
    ? calculateTrackerProgress(trackerState, actionIds)
    : { completed: 0, total: 0, percent: 0 };

  return {
    trackerState,
    weeklyPlanActions,
    planSummary,
    toggleAction,
    resetTracker,
    progress,
  };
}
export type UseWeeklyTrackerReturn = ReturnType<typeof useWeeklyTracker>;
