import type { FootprintEstimate, UserPreference } from '../types/carbon';
import type { WeeklyActionPlan } from '../types/actions';
import { recommendActions } from './recommendationEngine';

export function createWeeklyActionPlan(input: {
  footprint: FootprintEstimate;
  preference: UserPreference;
  maxActions?: number;
}): WeeklyActionPlan {
  const { footprint, preference, maxActions = 3 } = input;

  const actions = recommendActions({
    footprint,
    preference,
    limit: maxActions,
  });

  let summary = 'This week, start with low-effort actions to build a simple tracking habit.';
  if (footprint.monthlyTotalKgCO2e > 0 && footprint.topCategory) {
    summary = `This week, start with ${footprint.topCategory}-focused actions because ${footprint.topCategory} is your top estimated contributor.`;
  }

  const allNotes = new Set<string>();
  if (footprint.assumptionNotes && footprint.assumptionNotes.length > 0) {
    allNotes.add('Plan uses estimates from your footprint calculation.');
  }

  actions.forEach((action) => {
    if (action.assumptionNote) {
      allNotes.add(action.assumptionNote);
    }
  });

  return {
    actions,
    summary,
    assumptionNotes: Array.from(allNotes),
  };
}
