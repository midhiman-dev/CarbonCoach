import { describe, it, expect } from 'vitest';
import { validateProfile } from './profileValidation';
import type { CarbonProfile } from '@carboncoach/shared';

describe('validateProfile', () => {
  const validProfile: CarbonProfile = {
    commuteMode: 'metro',
    weeklyCommuteKm: 20,
    dietPattern: 'mixed',
    monthlyHomeEnergyKwh: 150,
    shoppingFrequency: 'medium',
    deliveriesPerWeek: 2,
    flightsPerYear: 1,
    householdSize: 1,
    preference: 'balanced',
  };

  it('should pass on a valid profile', () => {
    const errors = validateProfile(validProfile);
    expect(Object.keys(errors).length).toBe(0);
  });

  it('should fail if required fields are missing', () => {
    const errors = validateProfile({
      ...validProfile,
      commuteMode: undefined,
      dietPattern: undefined,
      preference: undefined,
    });
    expect(errors.commuteMode).toBeDefined();
    expect(errors.dietPattern).toBeDefined();
    expect(errors.preference).toBeDefined();
  });

  it('should fail if weeklyCommuteKm is negative', () => {
    const errors = validateProfile({
      ...validProfile,
      weeklyCommuteKm: -1,
    });
    expect(errors.weeklyCommuteKm).toBe('Enter 0 or a positive number.');
  });

  it('should fail if weeklyCommuteKm is unusually high', () => {
    const errors = validateProfile({
      ...validProfile,
      weeklyCommuteKm: 3000,
    });
    expect(errors.weeklyCommuteKm).toContain('unusually high');
  });

  it('should fail if monthlyHomeEnergyKwh is negative', () => {
    const errors = validateProfile({
      ...validProfile,
      monthlyHomeEnergyKwh: -1,
    });
    expect(errors.monthlyHomeEnergyKwh).toBe('Enter 0 or a positive number.');
  });

  it('should fail if monthlyHomeEnergyKwh is unusually high', () => {
    const errors = validateProfile({
      ...validProfile,
      monthlyHomeEnergyKwh: 6000,
    });
    expect(errors.monthlyHomeEnergyKwh).toContain('unusually high');
  });

  it('should fail if deliveriesPerWeek is negative or not a whole number', () => {
    let errors = validateProfile({
      ...validProfile,
      deliveriesPerWeek: -1,
    });
    expect(errors.deliveriesPerWeek).toBe('Enter 0 or a positive number.');

    errors = validateProfile({
      ...validProfile,
      deliveriesPerWeek: 2.5,
    });
    expect(errors.deliveriesPerWeek).toBe('Use a whole number for deliveries.');
  });

  it('should fail if flightsPerYear is negative or not a whole number', () => {
    let errors = validateProfile({
      ...validProfile,
      flightsPerYear: -1,
    });
    expect(errors.flightsPerYear).toBe('Enter 0 or a positive number.');

    errors = validateProfile({
      ...validProfile,
      flightsPerYear: 1.5,
    });
    expect(errors.flightsPerYear).toBe('Use a whole number for flight counts.');
  });

  it('should fail if householdSize is below 1 or not a whole number', () => {
    let errors = validateProfile({
      ...validProfile,
      householdSize: 0,
    });
    expect(errors.householdSize).toBe('Household size must be at least 1.');

    errors = validateProfile({
      ...validProfile,
      householdSize: 1.5,
    });
    expect(errors.householdSize).toBe('Use a whole number for household size.');
  });
});
