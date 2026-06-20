import { useMemo } from 'react';
import type {
  CarbonProfile,
  WeeklyTrackerState,
  RankedCarbonAction,
  CarbonWorldState} from '@carboncoach/shared';
import {
  calculateTrackerProgress,
  createCarbonWorldState
} from '@carboncoach/shared';

export interface UseCarbonWorldProps {
  profile: CarbonProfile | null;
  weeklyPlanActions: RankedCarbonAction[];
  trackerState: WeeklyTrackerState | null;
}

export function useCarbonWorld({ profile, weeklyPlanActions, trackerState }: UseCarbonWorldProps) {
  const worldState = useMemo<CarbonWorldState | null>(() => {
    if (!profile || weeklyPlanActions.length === 0 || !trackerState) {
      return null;
    }
    const actionIds = weeklyPlanActions.map((a) => a.id);
    const { completed, total } = calculateTrackerProgress(trackerState, actionIds);
    return createCarbonWorldState({ completedActions: completed, totalActions: total });
  }, [profile, weeklyPlanActions, trackerState]);

  return {
    worldState,
    hasProfile: !!profile,
    hasTracker: !!trackerState && weeklyPlanActions.length > 0,
  };
}
