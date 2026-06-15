import type { FootprintCategory, ImpactBand } from './carbon';

export type ActionEffort = 'low' | 'medium' | 'high';

export type CostEffect = 'savesMoney' | 'neutral' | 'mayCostMore';

export interface CarbonAction {
  id: string;
  title: string;
  category: FootprintCategory;
  impactBand: ImpactBand;
  effort: ActionEffort;
  costEffect: CostEffect;
  estimatedMonthlyReductionKgCO2e?: number;
  reason: string;
  assumptionNote: string;
}

export interface RankedCarbonAction extends CarbonAction {
  score: number;
  fitReasons: string[];
}

export interface WeeklyActionPlan {
  actions: RankedCarbonAction[];
  summary: string;
  assumptionNotes: string[];
}
