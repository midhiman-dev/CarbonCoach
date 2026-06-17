import type { FootprintCategory, ImpactBand } from '../types/carbon';

export interface WeeklyTrackerAction {
  id: string;
  title: string;
  category: FootprintCategory;
  impactBand: ImpactBand;
  sourceActionId?: string;
}

export interface WeeklyTrackerState {
  version: 1;
  weekId: string;
  completedActionIds: string[];
  updatedAtIso: string;
}
