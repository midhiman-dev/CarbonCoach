import { FootprintCategory } from '@carboncoach/shared';
import { ActionEffort, CostEffect } from '@carboncoach/shared';

/**
 * Maps a FootprintCategory key to a reader-friendly display label.
 */
export function formatActionCategory(category: FootprintCategory): string {
  const labels: Record<FootprintCategory, string> = {
    transport: 'Transport',
    food: 'Food',
    homeEnergy: 'Home Energy',
    shopping: 'Shopping',
    flights: 'Flights',
  };
  return labels[category] || category;
}

/**
 * Formats impact band key to display text.
 */
export function formatImpactBand(impactBand: 'low' | 'medium' | 'high'): string {
  const labels = {
    low: 'Low Impact',
    medium: 'Medium Impact',
    high: 'High Impact',
  };
  return labels[impactBand] || impactBand;
}

/**
 * Formats effort key to display text.
 */
export function formatEffort(effort: ActionEffort): string {
  const labels = {
    low: 'Low Effort',
    medium: 'Medium Effort',
    high: 'High Effort',
  };
  return labels[effort] || effort;
}

/**
 * Formats cost effect key to display text.
 */
export function formatCostEffect(costEffect: CostEffect): string {
  const labels = {
    savesMoney: 'Cost-friendly',
    neutral: 'No Cost',
    mayCostMore: 'May Cost More',
  };
  return labels[costEffect] || costEffect;
}

/**
 * Formats estimated monthly reduction to display text.
 */
export function formatReductionKgCO2e(value?: number): string | undefined {
  if (value === undefined || value === null || isNaN(value)) {
    return undefined;
  }
  return `Estimated reduction: ${Math.round(value)} kg CO2e / month`;
}
