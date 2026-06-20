import type {
  CarbonProfile,
  FootprintEstimate,
  FootprintCategory,
  ConfidenceLevel,
} from '../types/carbon';
import {
  calculateTransport,
  calculateFood,
  calculateHomeEnergy,
  calculateShopping,
  calculateFlights,
} from './categoryCalculators';
import { carbonEstimateDisclaimer } from './assumptions';

export function calculateFootprint(profile: CarbonProfile): FootprintEstimate {
  const transport = calculateTransport(profile);
  const food = calculateFood(profile);
  const homeEnergy = calculateHomeEnergy(profile);
  const shopping = calculateShopping(profile);
  const flights = calculateFlights(profile);

  const categories = [transport, food, homeEnergy, shopping, flights];

  let total = 0;
  let topCategory: FootprintCategory | null = null;
  let maxTotal = -1;

  let hasLow = false;
  let hasMedium = false;

  for (const cat of categories) {
    total += cat.monthlyKgCO2e;
    if (cat.monthlyKgCO2e > maxTotal && cat.monthlyKgCO2e > 0) {
      maxTotal = cat.monthlyKgCO2e;
      topCategory = cat.category;
    }
    if (cat.confidence === 'low') hasLow = true;
    if (cat.confidence === 'medium') hasMedium = true;
  }

  let overallConfidence: ConfidenceLevel = 'high';
  if (hasLow) overallConfidence = 'low';
  else if (hasMedium) overallConfidence = 'medium';

  const allNotes = new Set<string>([carbonEstimateDisclaimer]);
  categories.forEach((cat) => {
    cat.assumptionNotes.forEach((note) => allNotes.add(note));
  });

  return {
    monthlyTotalKgCO2e: total,
    categories,
    topCategory,
    assumptionNotes: Array.from(allNotes),
    confidence: overallConfidence,
  };
}
