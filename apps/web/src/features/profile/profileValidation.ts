import type { CarbonProfile } from '@carboncoach/shared';

export interface ProfileErrors {
  commuteMode?: string;
  weeklyCommuteKm?: string;
  dietPattern?: string;
  monthlyHomeEnergyKwh?: string;
  shoppingFrequency?: string;
  deliveriesPerWeek?: string;
  flightsPerYear?: string;
  householdSize?: string;
  preference?: string;
}

export const validateProfile = (profile: Partial<CarbonProfile>): ProfileErrors => {
  const errors: ProfileErrors = {};

  // commuteMode
  if (!profile.commuteMode) {
    errors.commuteMode = 'Choose one commute mode.';
  }

  // weeklyCommuteKm
  if (
    profile.weeklyCommuteKm === undefined ||
    profile.weeklyCommuteKm === null ||
    isNaN(profile.weeklyCommuteKm)
  ) {
    errors.weeklyCommuteKm = 'Enter a commute distance.';
  } else if (profile.weeklyCommuteKm < 0) {
    errors.weeklyCommuteKm = 'Enter 0 or a positive number.';
  } else if (profile.weeklyCommuteKm > 2000) {
    errors.weeklyCommuteKm = 'This value looks unusually high (max 2000 km/week). Please check it.';
  }

  // dietPattern
  if (!profile.dietPattern) {
    errors.dietPattern = 'Choose one diet pattern.';
  }

  // monthlyHomeEnergyKwh
  if (profile.monthlyHomeEnergyKwh !== undefined && profile.monthlyHomeEnergyKwh !== null) {
    if (isNaN(profile.monthlyHomeEnergyKwh)) {
      errors.monthlyHomeEnergyKwh = 'Enter a valid number.';
    } else if (profile.monthlyHomeEnergyKwh < 0) {
      errors.monthlyHomeEnergyKwh = 'Enter 0 or a positive number.';
    } else if (profile.monthlyHomeEnergyKwh > 5000) {
      errors.monthlyHomeEnergyKwh =
        'This value looks unusually high (max 5000 kWh/month). Please check it.';
    }
  }

  // shoppingFrequency
  if (!profile.shoppingFrequency) {
    errors.shoppingFrequency = 'Choose one shopping frequency.';
  }

  // deliveriesPerWeek
  if (
    profile.deliveriesPerWeek === undefined ||
    profile.deliveriesPerWeek === null ||
    isNaN(profile.deliveriesPerWeek)
  ) {
    errors.deliveriesPerWeek = 'Enter number of deliveries.';
  } else if (profile.deliveriesPerWeek < 0) {
    errors.deliveriesPerWeek = 'Enter 0 or a positive number.';
  } else if (!Number.isInteger(profile.deliveriesPerWeek)) {
    errors.deliveriesPerWeek = 'Use a whole number for deliveries.';
  } else if (profile.deliveriesPerWeek > 100) {
    errors.deliveriesPerWeek =
      'This value looks unusually high (max 100 deliveries/week). Please check it.';
  }

  // flightsPerYear
  if (
    profile.flightsPerYear === undefined ||
    profile.flightsPerYear === null ||
    isNaN(profile.flightsPerYear)
  ) {
    errors.flightsPerYear = 'Enter number of flights.';
  } else if (profile.flightsPerYear < 0) {
    errors.flightsPerYear = 'Enter 0 or a positive number.';
  } else if (!Number.isInteger(profile.flightsPerYear)) {
    errors.flightsPerYear = 'Use a whole number for flight counts.';
  } else if (profile.flightsPerYear > 100) {
    errors.flightsPerYear =
      'This value looks unusually high (max 100 flights/year). Please check it.';
  }

  // householdSize
  if (profile.householdSize !== undefined && profile.householdSize !== null) {
    if (isNaN(profile.householdSize)) {
      errors.householdSize = 'Enter household size.';
    } else if (profile.householdSize < 1) {
      errors.householdSize = 'Household size must be at least 1.';
    } else if (!Number.isInteger(profile.householdSize)) {
      errors.householdSize = 'Use a whole number for household size.';
    } else if (profile.householdSize > 20) {
      errors.householdSize = 'This value looks unusually high (max 20 people). Please check it.';
    }
  }

  // preference
  if (!profile.preference) {
    errors.preference = 'Choose one priority option.';
  }

  return errors;
};
