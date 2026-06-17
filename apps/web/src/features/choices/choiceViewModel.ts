import type { FootprintCategory, ImpactBand } from '@carboncoach/shared';

export function formatCategoryLabel(category: FootprintCategory): string {
  switch (category) {
    case 'transport':
      return 'Transport';
    case 'food':
      return 'Food';
    case 'homeEnergy':
      return 'Home Energy';
    case 'shopping':
      return 'Shopping';
    case 'flights':
      return 'Flights';
    default:
      return category;
  }
}

export function formatImpactBandLabel(impact: ImpactBand): string {
  switch (impact) {
    case 'low':
      return 'Low Impact';
    case 'medium':
      return 'Medium Impact';
    case 'high':
      return 'High Impact';
    default:
      return impact;
  }
}

export function getRecommendedOptionLabel(isRecommended: boolean): string {
  return isRecommended ? 'Recommended Option' : '';
}
