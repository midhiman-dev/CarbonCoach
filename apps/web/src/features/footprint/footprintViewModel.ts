import { FootprintCategory, ConfidenceLevel } from '@carboncoach/shared';

/**
 * Formats a kg CO2e value to a user-friendly string.
 */
export function formatKgCO2e(value: number): string {
  return `${Math.round(value).toLocaleString()} kg CO2e`;
}

/**
 * Maps a FootprintCategory key to a reader-friendly display label.
 */
export function formatCategoryLabel(category: FootprintCategory): string {
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
 * Maps a ConfidenceLevel to a reader-friendly display label.
 */
export function formatConfidenceLabel(confidence: ConfidenceLevel): string {
  const labels: Record<ConfidenceLevel, string> = {
    low: 'Low Confidence',
    medium: 'Medium Confidence',
    high: 'High Confidence',
  };
  return labels[confidence] || confidence;
}

/**
 * Provides a plain-English explanation label for each category.
 */
export function getCategoryDescription(category: FootprintCategory): string {
  const descriptions: Record<FootprintCategory, string> = {
    transport: 'Daily transit, vehicle travel, and commutes',
    food: 'Diet choices and household meal footprint',
    homeEnergy: 'Electricity and heating consumption at home',
    shopping: 'Retail purchases and courier delivery impact',
    flights: 'Annual aviation and air travel emissions',
  };
  return descriptions[category] || '';
}

/**
 * Maps a monthly category carbon total to a directional impact band.
 * These are demonstration thresholds designed for awareness.
 */
export function getCategoryImpactBand(
  category: FootprintCategory,
  value: number,
): 'low' | 'moderate' | 'high' {
  const thresholds: Record<FootprintCategory, { low: number; moderate: number }> = {
    transport: { low: 80, moderate: 250 },
    food: { low: 100, moderate: 220 },
    homeEnergy: { low: 70, moderate: 180 },
    shopping: { low: 40, moderate: 120 },
    flights: { low: 50, moderate: 300 },
  };

  const limit = thresholds[category];
  if (!limit) return 'moderate';

  if (value <= limit.low) return 'low';
  if (value <= limit.moderate) return 'moderate';
  return 'high';
}
