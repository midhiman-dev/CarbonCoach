import { ChoiceScenario, UserPreference, CoachTone, ChoiceCoachRequest } from '@carboncoach/shared';

export interface BuildChoiceRequestInput {
  scenario: ChoiceScenario;
  preference?: UserPreference;
  tone?: CoachTone;
}

/**
 * Builds a choice_coach request payload with minimized context and allowed numbers.
 */
export function buildChoiceCoachRequest(input: BuildChoiceRequestInput): ChoiceCoachRequest {
  const { scenario, preference = 'balanced', tone = 'simple' } = input;

  const context = {
    scenarioId: scenario.id,
    scenarioTitle: scenario.title,
    options: scenario.options.map((o) => ({
      id: o.id,
      label: o.label,
      impactBand: o.impactBand,
      reasons: o.reasons || [],
    })),
    recommendedOptionId: scenario.recommendedOptionId,
    preference,
    assumptionNotes: scenario.assumptionNote ? [scenario.assumptionNote] : [],
  };

  // Collect allowed numbers: only deterministic estimatedKgCO2e values when they exist.
  const numberSet = new Set<string>();
  scenario.options.forEach((o) => {
    if (o.estimatedKgCO2e !== undefined) {
      numberSet.add(o.estimatedKgCO2e.toString());
    }
  });

  return {
    mode: 'choice_coach',
    tone,
    context,
    allowedNumbers: Array.from(numberSet),
  };
}
