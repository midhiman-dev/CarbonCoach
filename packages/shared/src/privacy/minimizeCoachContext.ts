import type { FootprintEstimate, UserPreference } from '../types/carbon';
import type { RankedCarbonAction, WeeklyActionPlan } from '../types/actions';
import type { CoachContextPrivacySummary } from '../types/privacy';

export interface MinimizedFootprintContext {
  monthlyTotalKgCO2e: number;
  categoryTotals: Record<string, number>;
  topCategory: string | null;
  confidence: string;
  assumptionNotes: string[];
  recommendedActionTitles: string[];
  impactBands: string[];
  estimatedMonthlyReductionValues: number[];
  weeklyPlanActionTitles: string[];
  preference: UserPreference;
}

export function summarizeFootprintContextForCoach(input: {
  footprint: FootprintEstimate;
  recommendedActions: RankedCarbonAction[];
  weeklyPlan?: WeeklyActionPlan;
  preference: UserPreference;
}): {
  summary: MinimizedFootprintContext;
  allowedNumbers: string[];
  privacy: CoachContextPrivacySummary;
} {
  const { footprint, recommendedActions, weeklyPlan, preference } = input;

  const categoryTotals: Record<string, number> = {};
  footprint.categories.forEach((cat) => {
    categoryTotals[cat.category] = cat.monthlyKgCO2e;
  });

  const recommendedActionTitles = recommendedActions.map((a) => a.title);
  const impactBands = Array.from(new Set(recommendedActions.map((a) => a.impactBand)));

  const estimatedMonthlyReductionValues = recommendedActions
    .map((a) => a.estimatedMonthlyReductionKgCO2e)
    .filter((val): val is number => val !== undefined);

  const weeklyPlanActionTitles = weeklyPlan?.actions.map((a) => a.title) || [];

  const summary: MinimizedFootprintContext = {
    monthlyTotalKgCO2e: footprint.monthlyTotalKgCO2e,
    categoryTotals,
    topCategory: footprint.topCategory,
    confidence: footprint.confidence,
    assumptionNotes: footprint.assumptionNotes || [],
    recommendedActionTitles,
    impactBands,
    estimatedMonthlyReductionValues,
    weeklyPlanActionTitles,
    preference,
  };

  const allowedNumbers = extractAllowedNumbersFromFootprintContext(input);

  const privacy: CoachContextPrivacySummary = {
    includedFields: [
      'monthlyTotalKgCO2e',
      'categoryTotals',
      'topCategory',
      'confidence',
      'assumptionNotes',
      'recommendedActionTitles',
      'impactBands',
      'estimatedMonthlyReductionValues',
      'weeklyPlanActionTitles',
      'preference',
    ],
    excludedFields: [
      'raw CarbonProfile',
      'exact commute distance',
      'exact dietary details',
      'raw browser state',
      'user identity',
    ],
    notes: [
      'Data has been minimized to include only aggregated footprint estimates and action titles.',
      'No raw user profile data is sent to the coach.',
    ],
  };

  return {
    summary,
    allowedNumbers,
    privacy,
  };
}

export function extractAllowedNumbersFromFootprintContext(input: {
  footprint: FootprintEstimate;
  recommendedActions: RankedCarbonAction[];
  weeklyPlan?: WeeklyActionPlan;
}): string[] {
  const { footprint, recommendedActions, weeklyPlan } = input;
  const numberSet = new Set<string>();

  // Add monthly total
  numberSet.add(footprint.monthlyTotalKgCO2e.toString());

  // Add category totals
  footprint.categories.forEach((cat) => {
    numberSet.add(cat.monthlyKgCO2e.toString());
  });

  // Add reduction values
  recommendedActions.forEach((action) => {
    if (action.estimatedMonthlyReductionKgCO2e !== undefined) {
      numberSet.add(action.estimatedMonthlyReductionKgCO2e.toString());
    }
  });

  if (weeklyPlan) {
    weeklyPlan.actions.forEach((action) => {
      if (action.estimatedMonthlyReductionKgCO2e !== undefined) {
        numberSet.add(action.estimatedMonthlyReductionKgCO2e.toString());
      }
    });
  }

  // Remove possible duplicate string "0" or others
  return Array.from(numberSet);
}
