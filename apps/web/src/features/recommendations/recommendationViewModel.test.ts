import { describe, expect, it } from 'vitest';
import {
  formatActionCategory,
  formatImpactBand,
  formatEffort,
  formatCostEffect,
  formatReductionKgCO2e,
} from './recommendationViewModel';

describe('recommendationViewModel helper tests', () => {
  it('formats category label', () => {
    expect(formatActionCategory('transport')).toBe('Transport');
    expect(formatActionCategory('food')).toBe('Food');
    expect(formatActionCategory('homeEnergy')).toBe('Home Energy');
    expect(formatActionCategory('shopping')).toBe('Shopping');
    expect(formatActionCategory('flights')).toBe('Flights');
  });

  it('formats impact band', () => {
    expect(formatImpactBand('high')).toBe('High Impact');
    expect(formatImpactBand('medium')).toBe('Medium Impact');
    expect(formatImpactBand('low')).toBe('Low Impact');
  });

  it('formats effort', () => {
    expect(formatEffort('low')).toBe('Low Effort');
    expect(formatEffort('medium')).toBe('Medium Effort');
    expect(formatEffort('high')).toBe('High Effort');
  });

  it('formats cost effect', () => {
    expect(formatCostEffect('savesMoney')).toBe('Cost-friendly');
    expect(formatCostEffect('neutral')).toBe('No Cost');
    expect(formatCostEffect('mayCostMore')).toBe('May Cost More');
  });

  it('formats reduction value', () => {
    expect(formatReductionKgCO2e(12)).toBe('Estimated reduction: 12 kg CO2e / month');
    expect(formatReductionKgCO2e(12.6)).toBe('Estimated reduction: 13 kg CO2e / month');
  });

  it('handles missing reduction safely', () => {
    expect(formatReductionKgCO2e(undefined)).toBeUndefined();
  });
});
