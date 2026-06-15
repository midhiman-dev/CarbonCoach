import { describe, it, expect } from 'vitest';
import {
  getEmissionFactors,
  getFactorsByCategory,
  getFactorById,
  getRequiredFactorById,
} from './factorRegistry';
import { FootprintCategory } from '../types/carbon';

describe('Emission Factor Registry Integrity', () => {
  it('registry should not be empty', () => {
    const factors = getEmissionFactors();
    expect(factors.length).toBeGreaterThan(0);
  });

  it('all factors must have unique IDs', () => {
    const factors = getEmissionFactors();
    const ids = factors.map((f) => f.id);
    const uniqueIds = new Set(ids);
    expect(ids.length).toBe(uniqueIds.size);
  });

  it('all factors must have positive values', () => {
    const factors = getEmissionFactors();
    factors.forEach((factor) => {
      expect(factor.value).toBeGreaterThan(0);
    });
  });

  it('all factors must have non-empty assumption notes', () => {
    const factors = getEmissionFactors();
    factors.forEach((factor) => {
      expect(factor.assumptionNote).toBeDefined();
      expect(factor.assumptionNote.trim().length).toBeGreaterThan(0);
    });
  });

  it('all P0 categories must have at least one factor', () => {
    const categories: FootprintCategory[] = [
      'transport',
      'food',
      'homeEnergy',
      'shopping',
      'flights',
    ];

    categories.forEach((category) => {
      const categoryFactors = getFactorsByCategory(category);
      expect(categoryFactors.length).toBeGreaterThan(0);
    });
  });

  it('getFactorsByCategory returns only matching category factors', () => {
    const category: FootprintCategory = 'transport';
    const factors = getFactorsByCategory(category);
    factors.forEach((factor) => {
      expect(factor.category).toBe(category);
    });
  });

  it('getFactorById returns expected factor or undefined', () => {
    const factor = getFactorById('transport.car.km');
    expect(factor).toBeDefined();
    expect(factor?.id).toBe('transport.car.km');

    const missingFactor = getFactorById('non.existent.id');
    expect(missingFactor).toBeUndefined();
  });

  it('getRequiredFactorById returns factor or throws clear error if missing', () => {
    const factor = getRequiredFactorById('transport.car.km');
    expect(factor).toBeDefined();
    expect(factor.id).toBe('transport.car.km');

    expect(() => {
      getRequiredFactorById('non.existent.id');
    }).toThrowError('Required emission factor not found: non.existent.id');
  });
});
