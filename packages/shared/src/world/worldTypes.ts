export type CarbonWorldStage = 'seed' | 'sprout' | 'garden' | 'grove';

export interface CarbonWorldState {
  stage: CarbonWorldStage;
  completedActions: number;
  totalActions: number;
  progressPercent: number;
  title: string;
  description: string;
  encouragement: string;
}
