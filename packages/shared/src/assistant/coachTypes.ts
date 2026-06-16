import type {
  FootprintCategory,
  ConfidenceLevel,
  ImpactBand,
  UserPreference,
} from '../types/carbon';
import type { ActionEffort, CostEffect } from '../types/actions';

export type CoachMode = 'footprint_coach' | 'choice_coach';

export type CoachResponseSource = 'gemini' | 'fallback';

export type CoachTone = 'simple' | 'detailed' | 'encouraging';

export interface FootprintCoachContext {
  monthlyTotalKgCO2e: number;
  topCategory: FootprintCategory | null;
  confidence: ConfidenceLevel;
  categories: Array<{
    category: FootprintCategory;
    monthlyKgCO2e: number;
    confidence: ConfidenceLevel;
  }>;
  recommendedActions: Array<{
    id: string;
    title: string;
    category: FootprintCategory;
    impactBand: ImpactBand;
    effort: ActionEffort;
    costEffect: CostEffect;
    estimatedMonthlyReductionKgCO2e?: number;
    reason: string;
  }>;
  assumptionNotes: string[];
  preference: UserPreference;
}

export interface ChoiceCoachContext {
  scenarioId: string;
  scenarioTitle: string;
  options: Array<{
    id: string;
    label: string;
    impactBand: ImpactBand;
    reasons: string[];
  }>;
  recommendedOptionId: string;
  preference: UserPreference;
  assumptionNotes: string[];
}

export interface BaseCoachRequest {
  mode: CoachMode;
  tone?: CoachTone;
  allowedNumbers: string[];
}

export interface FootprintCoachRequest extends BaseCoachRequest {
  mode: 'footprint_coach';
  context: FootprintCoachContext;
}

export interface ChoiceCoachRequest extends BaseCoachRequest {
  mode: 'choice_coach';
  context: ChoiceCoachContext;
}

export type CoachRequest = FootprintCoachRequest | ChoiceCoachRequest;

export interface CoachResponse {
  mode: CoachMode;
  summary: string;
  explanation: string;
  recommendedNextStep: string;
  weeklyPlan: string[];
  numbersUsed: string[];
  confidenceNote: string;
  disclaimer: string;
  source: CoachResponseSource;
}

export interface NumericGuardInput {
  allowedNumbers: string[];
  responseTextFields: string[];
}

export interface NumericGuardResult {
  isValid: boolean;
  unsupportedNumbers: string[];
  generatedNumbers: string[];
  allowedNumbers: string[];
}
