import { FootprintCategory, ConfidenceLevel } from '../types/carbon';

export type EmissionFactorUnit =
  | 'kgCO2e_per_km'
  | 'kgCO2e_per_kwh'
  | 'kgCO2e_per_meal'
  | 'kgCO2e_per_delivery'
  | 'kgCO2e_per_flight'
  | 'kgCO2e_per_month';

export interface EmissionFactor {
  id: string;
  category: FootprintCategory;
  label: string;
  value: number;
  unit: EmissionFactorUnit;
  confidence: ConfidenceLevel;
  sourceType: 'demo_assumption' | 'documented_reference';
  sourceLabel: string;
  version: string;
  assumptionNote: string;
}
