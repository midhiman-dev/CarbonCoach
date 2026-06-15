export type FootprintCategory = 'transport' | 'food' | 'homeEnergy' | 'shopping' | 'flights';

export type ImpactBand = 'low' | 'medium' | 'high';

export type ConfidenceLevel = 'low' | 'medium' | 'high';

export type CommuteMode =
  | 'car'
  | 'twoWheeler'
  | 'bus'
  | 'metro'
  | 'walkCycle'
  | 'workFromHome'
  | 'mixed';

export type DietPattern = 'mostlyVegetarian' | 'mixed' | 'meatHeavy' | 'vegan';

export type UserPreference = 'balanced' | 'saveMoney' | 'lowEffort' | 'highestImpact';

export interface CarbonProfile {
  commuteMode: CommuteMode;
  weeklyCommuteKm: number;
  dietPattern: DietPattern;
  monthlyHomeEnergyKwh?: number;
  shoppingFrequency: 'low' | 'medium' | 'high';
  deliveriesPerWeek: number;
  flightsPerYear: number;
  householdSize?: number;
  preference: UserPreference;
}

export interface CategoryFootprintEstimate {
  category: FootprintCategory;
  monthlyKgCO2e: number;
  confidence: ConfidenceLevel;
  factorIds: string[];
  assumptionNotes: string[];
}

export interface FootprintEstimate {
  monthlyTotalKgCO2e: number;
  categories: CategoryFootprintEstimate[];
  topCategory: FootprintCategory | null;
  assumptionNotes: string[];
  confidence: ConfidenceLevel;
}
