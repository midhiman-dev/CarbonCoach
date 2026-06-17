import { describe, it, expect } from 'vitest';
import {
  formatCategoryLabel,
  formatImpactBandLabel,
  getRecommendedOptionLabel,
} from './choiceViewModel';

describe('choiceViewModel', () => {
  it('formats category label correctly', () => {
    expect(formatCategoryLabel('transport')).toBe('Transport');
    expect(formatCategoryLabel('food')).toBe('Food');
    expect(formatCategoryLabel('homeEnergy')).toBe('Home Energy');
    expect(formatCategoryLabel('shopping')).toBe('Shopping');
    expect(formatCategoryLabel('flights')).toBe('Flights');
  });

  it('formats impact band label correctly', () => {
    expect(formatImpactBandLabel('low')).toBe('Low Impact');
    expect(formatImpactBandLabel('medium')).toBe('Medium Impact');
    expect(formatImpactBandLabel('high')).toBe('High Impact');
  });

  it('returns recommended option label safely', () => {
    expect(getRecommendedOptionLabel(true)).toBe('Recommended Option');
    expect(getRecommendedOptionLabel(false)).toBe('');
  });
});
