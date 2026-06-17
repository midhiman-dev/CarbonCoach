import type { FootprintCategory, ImpactBand, UserPreference } from '../types/carbon';

export interface ChoiceOption {
  id: string;
  label: string;
  description: string;
  impactBand: ImpactBand;
  reasons: string[];
  estimatedKgCO2e?: number;
}

export interface ChoiceScenario {
  id: string;
  title: string;
  category: FootprintCategory;
  description: string;
  assumptionNote: string;
  options: ChoiceOption[];
  recommendedOptionId: string;
}

export interface ChoiceComparisonResult {
  scenario: ChoiceScenario;
  recommendedOption: ChoiceOption;
  options: ChoiceOption[];
  preference?: UserPreference;
  explanation: string;
}
