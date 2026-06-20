import type { CarbonProfile, CategoryFootprintEstimate, ConfidenceLevel } from '../types/carbon';
import { getRequiredFactorById } from './factorRegistry';
import { categoryAssumptionNotes } from './assumptions';

export function nonNegativeNumber(value: number | undefined, fallback = 0): number {
  if (value === undefined || value === null || Number.isNaN(value) || !Number.isFinite(value)) {
    return fallback;
  }
  return Math.max(0, value);
}

function determineConfidence(factorConfidences: ConfidenceLevel[]): ConfidenceLevel {
  if (factorConfidences.includes('low')) return 'low';
  if (factorConfidences.includes('medium')) return 'medium';
  return 'high';
}

export function calculateTransport(profile: CarbonProfile): CategoryFootprintEstimate {
  const weeklyKm = nonNegativeNumber(profile.weeklyCommuteKm, 0);
  const mode = profile.commuteMode;

  if (mode === 'walkCycle' || mode === 'workFromHome') {
    return {
      category: 'transport',
      monthlyKgCO2e: 0,
      confidence: 'high',
      factorIds: [],
      assumptionNotes: [categoryAssumptionNotes.transport],
    };
  }

  let factorId = '';
  switch (mode) {
    case 'car':
      factorId = 'transport.car.km';
      break;
    case 'twoWheeler':
      factorId = 'transport.two_wheeler.km';
      break;
    case 'bus':
      factorId = 'transport.bus.km';
      break;
    case 'metro':
      factorId = 'transport.metro.km';
      break;
    case 'mixed':
      factorId = 'transport.bus.km';
      break; // blended assumption fallback
    default:
      factorId = 'transport.bus.km';
      break;
  }

  const factor = getRequiredFactorById(factorId);
  const monthlyKm = weeklyKm * 4;
  const rawTotal = monthlyKm * factor.value;

  const notes = [categoryAssumptionNotes.transport];
  if (mode === 'mixed') {
    notes.push('Mixed commute assumes bus emissions as a blended average.');
  }

  return {
    category: 'transport',
    monthlyKgCO2e: Math.round(rawTotal),
    confidence: factor.confidence,
    factorIds: [factor.id],
    assumptionNotes: notes,
  };
}

export function calculateFood(profile: CarbonProfile): CategoryFootprintEstimate {
  let factorId = '';
  switch (profile.dietPattern) {
    case 'vegan':
      factorId = 'food.vegan.meal';
      break;
    case 'mostlyVegetarian':
      factorId = 'food.vegetarian.meal';
      break;
    case 'mixed':
      factorId = 'food.mixed.meal';
      break;
    case 'meatHeavy':
      factorId = 'food.meat_heavy.meal';
      break;
    default:
      factorId = 'food.mixed.meal';
      break;
  }

  const factor = getRequiredFactorById(factorId);
  const mealsPerMonth = 90; // 3 meals a day * 30
  const rawTotal = mealsPerMonth * factor.value;

  const notes = [
    categoryAssumptionNotes.food,
    'Assuming 90 meals per month (3 meals per day) for baseline diet footprint.',
  ];

  return {
    category: 'food',
    monthlyKgCO2e: Math.round(rawTotal),
    confidence: factor.confidence,
    factorIds: [factor.id],
    assumptionNotes: notes,
  };
}

export function calculateHomeEnergy(profile: CarbonProfile): CategoryFootprintEstimate {
  const factor = getRequiredFactorById('home_energy.electricity.kwh');
  let kwh = profile.monthlyHomeEnergyKwh;
  let usedDefault = false;

  if (kwh === undefined || kwh === null || Number.isNaN(kwh) || !Number.isFinite(kwh) || kwh < 0) {
    kwh = 120;
    usedDefault = true;
  }

  const rawTotal = kwh * factor.value;
  const notes = [categoryAssumptionNotes.homeEnergy];
  if (usedDefault) {
    notes.push(
      'Used default demo assumption of 120 kWh per month since exact usage was not provided.',
    );
  }

  return {
    category: 'homeEnergy',
    monthlyKgCO2e: Math.round(rawTotal),
    confidence: factor.confidence,
    factorIds: [factor.id],
    assumptionNotes: notes,
  };
}

export function calculateShopping(profile: CarbonProfile): CategoryFootprintEstimate {
  let factorId = '';
  switch (profile.shoppingFrequency) {
    case 'low':
      factorId = 'shopping.goods.low';
      break;
    case 'medium':
      factorId = 'shopping.goods.medium';
      break;
    case 'high':
      factorId = 'shopping.goods.high';
      break;
    default:
      factorId = 'shopping.goods.medium';
      break;
  }

  const baseFactor = getRequiredFactorById(factorId);
  const deliveryFactor = getRequiredFactorById('shopping.delivery.single');

  const weeklyDeliveries = nonNegativeNumber(profile.deliveriesPerWeek, 0);
  const monthlyDeliveries = weeklyDeliveries * 4;

  const baseTotal = baseFactor.value;
  const deliveryTotal = monthlyDeliveries * deliveryFactor.value;
  const rawTotal = baseTotal + deliveryTotal;

  return {
    category: 'shopping',
    monthlyKgCO2e: Math.round(rawTotal),
    confidence: determineConfidence([baseFactor.confidence, deliveryFactor.confidence]),
    factorIds: [baseFactor.id, deliveryFactor.id],
    assumptionNotes: [categoryAssumptionNotes.shopping],
  };
}

export function calculateFlights(profile: CarbonProfile): CategoryFootprintEstimate {
  const flights = nonNegativeNumber(profile.flightsPerYear, 0);
  const factor = getRequiredFactorById('flights.short_haul.one_way');

  const monthlyFlights = flights / 12;
  const rawTotal = monthlyFlights * factor.value;

  return {
    category: 'flights',
    monthlyKgCO2e: Math.round(rawTotal),
    confidence: factor.confidence,
    factorIds: [factor.id],
    assumptionNotes: [
      categoryAssumptionNotes.flights,
      'Estimating flight emissions by averaging annual flights over 12 months using short-haul baseline.',
    ],
  };
}
