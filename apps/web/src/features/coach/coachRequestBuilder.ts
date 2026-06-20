import type {
  FootprintEstimate,
  RankedCarbonAction,
  UserPreference,
  CoachTone,
  FootprintCoachRequest,
  WeeklyActionPlan} from '@carboncoach/shared';
import {
  extractAllowedNumbersFromFootprintContext,
} from '@carboncoach/shared';

export interface BuildRequestInput {
  footprint: FootprintEstimate;
  recommendedActions: RankedCarbonAction[];
  weeklyPlan?: WeeklyActionPlan;
  preference: UserPreference;
  tone?: CoachTone;
}

/**
 * Builds a footprint_coach request payload with minimized context and allowed numbers.
 */
export function buildFootprintCoachRequest(input: BuildRequestInput): FootprintCoachRequest {
  const { footprint, recommendedActions, weeklyPlan, preference, tone = 'simple' } = input;

  const context = {
    monthlyTotalKgCO2e: footprint.monthlyTotalKgCO2e,
    topCategory: footprint.topCategory,
    confidence: footprint.confidence,
    categories: footprint.categories.map((c) => ({
      category: c.category,
      monthlyKgCO2e: c.monthlyKgCO2e,
      confidence: c.confidence,
    })),
    recommendedActions: recommendedActions.map((a) => ({
      id: a.id,
      title: a.title,
      category: a.category,
      impactBand: a.impactBand,
      effort: a.effort,
      costEffect: a.costEffect,
      estimatedMonthlyReductionKgCO2e: a.estimatedMonthlyReductionKgCO2e,
      reason: a.reason,
    })),
    assumptionNotes: footprint.assumptionNotes || [],
    preference,
  };

  const allowedNumbers = extractAllowedNumbersFromFootprintContext({
    footprint,
    recommendedActions,
    weeklyPlan,
  });

  return {
    mode: 'footprint_coach',
    tone,
    context,
    allowedNumbers,
  };
}
