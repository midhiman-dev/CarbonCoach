import { describe, it, expect } from 'vitest';
import {
  formatKgCO2e,
  formatCategoryLabel,
  formatConfidenceLabel,
  getCategoryDescription,
  getCategoryImpactBand,
} from './footprintViewModel';

describe('footprintViewModel helpers', () => {
  it('formats kg CO2e correctly', () => {
    expect(formatKgCO2e(0)).toBe('0 kg CO2e');
    expect(formatKgCO2e(125.4)).toBe('125 kg CO2e');
    expect(formatKgCO2e(125.7)).toBe('126 kg CO2e');
    expect(formatKgCO2e(1000)).toBe('1,000 kg CO2e');
  });

  it('formats category labels correctly', () => {
    expect(formatCategoryLabel('transport')).toBe('Transport');
    expect(formatCategoryLabel('homeEnergy')).toBe('Home Energy');
    expect(formatCategoryLabel('food')).toBe('Food');
    expect(formatCategoryLabel('shopping')).toBe('Shopping');
    expect(formatCategoryLabel('flights')).toBe('Flights');
  });

  it('formats confidence labels correctly', () => {
    expect(formatConfidenceLabel('low')).toBe('Low Confidence');
    expect(formatConfidenceLabel('medium')).toBe('Medium Confidence');
    expect(formatConfidenceLabel('high')).toBe('High Confidence');
  });

  it('provides category descriptions', () => {
    expect(getCategoryDescription('transport')).toContain('transit');
    expect(getCategoryDescription('food')).toContain('Diet');
  });

  it('maps category values to impact bands correctly', () => {
    // transport: low <= 80, moderate <= 250, high > 250
    expect(getCategoryImpactBand('transport', 50)).toBe('low');
    expect(getCategoryImpactBand('transport', 150)).toBe('moderate');
    expect(getCategoryImpactBand('transport', 300)).toBe('high');

    // food: low <= 100, moderate <= 220, high > 220
    expect(getCategoryImpactBand('food', 90)).toBe('low');
    expect(getCategoryImpactBand('food', 150)).toBe('moderate');
    expect(getCategoryImpactBand('food', 250)).toBe('high');
  });
});
