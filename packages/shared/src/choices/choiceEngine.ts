import type { ChoiceScenario, ChoiceComparisonResult } from './choiceTypes';
import type { UserPreference } from '../types/carbon';
import { choiceScenarios } from './choiceScenarios';

export function getChoiceScenarios(): ChoiceScenario[] {
  // Return a shallow copy of the scenarios to prevent direct mutation
  return [...choiceScenarios];
}

export function getChoiceScenarioById(id: string): ChoiceScenario | undefined {
  return choiceScenarios.find((s) => s.id === id);
}

export function compareChoiceScenario(
  scenarioId: string,
  preference?: UserPreference,
): ChoiceComparisonResult {
  const scenario = getChoiceScenarioById(scenarioId);
  if (!scenario) {
    throw new Error(`Scenario with id "${scenarioId}" not found.`);
  }

  const recommendedOption = scenario.options.find((o) => o.id === scenario.recommendedOptionId);
  if (!recommendedOption) {
    throw new Error(
      `Recommended option "${scenario.recommendedOptionId}" not found in scenario "${scenarioId}".`,
    );
  }

  // Compose a helpful deterministic explanation using the metadata.
  // We can customize the tone/focus based on the user's preference if provided.
  let preferenceNote = '';
  if (preference) {
    switch (preference) {
      case 'saveMoney':
        preferenceNote = ' This choice aligns well with saving costs on operations and resources.';
        break;
      case 'lowEffort':
        preferenceNote = ' Transitioning to this option requires minimal shift in daily routine.';
        break;
      case 'highestImpact':
        preferenceNote =
          ' This selection yields the greatest reduction in carbon footprint potential.';
        break;
      case 'balanced':
      default:
        preferenceNote =
          ' This provides a balanced trade-off between convenience, cost, and ecological impact.';
        break;
    }
  }

  const explanation = `Comparing options for "${scenario.title}": We recommend "${recommendedOption.label}" because it is rated as a ${recommendedOption.impactBand}-impact choice.${preferenceNote} ${recommendedOption.description}`;

  return {
    scenario,
    recommendedOption,
    options: scenario.options,
    preference,
    explanation,
  };
}
