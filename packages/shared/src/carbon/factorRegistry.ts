import { FootprintCategory } from '../types/carbon';
import { EmissionFactor } from './factorTypes';

const registry: EmissionFactor[] = [
  // Transport
  {
    id: 'transport.car.km',
    category: 'transport',
    label: 'Car travel',
    value: 0.18,
    unit: 'kgCO2e_per_km',
    confidence: 'medium',
    sourceType: 'demo_assumption',
    sourceLabel: 'CarbonCoach demo factor registry',
    version: '2026-06-p0',
    assumptionNote:
      'Directional demo estimate for petrol/diesel car travel. Actual emissions vary by vehicle, occupancy, fuel, and traffic.',
  },
  {
    id: 'transport.two_wheeler.km',
    category: 'transport',
    label: 'Two-wheeler travel',
    value: 0.08,
    unit: 'kgCO2e_per_km',
    confidence: 'medium',
    sourceType: 'demo_assumption',
    sourceLabel: 'CarbonCoach demo factor registry',
    version: '2026-06-p0',
    assumptionNote: 'Directional demo estimate for petrol motorbike or scooter.',
  },
  {
    id: 'transport.bus.km',
    category: 'transport',
    label: 'Bus travel',
    value: 0.05,
    unit: 'kgCO2e_per_km',
    confidence: 'medium',
    sourceType: 'demo_assumption',
    sourceLabel: 'CarbonCoach demo factor registry',
    version: '2026-06-p0',
    assumptionNote: 'Directional average per-passenger emissions for standard city bus transit.',
  },
  {
    id: 'transport.metro.km',
    category: 'transport',
    label: 'Metro/Train travel',
    value: 0.03,
    unit: 'kgCO2e_per_km',
    confidence: 'medium',
    sourceType: 'demo_assumption',
    sourceLabel: 'CarbonCoach demo factor registry',
    version: '2026-06-p0',
    assumptionNote: 'Directional average per-passenger emissions for electric rail/subway systems.',
  },

  // Food
  {
    id: 'food.vegetarian.meal',
    category: 'food',
    label: 'Vegetarian meal',
    value: 1.5,
    unit: 'kgCO2e_per_meal',
    confidence: 'medium',
    sourceType: 'demo_assumption',
    sourceLabel: 'CarbonCoach demo factor registry',
    version: '2026-06-p0',
    assumptionNote: 'Average footprint of a plant-forward vegetarian meal containing dairy/eggs.',
  },
  {
    id: 'food.mixed.meal',
    category: 'food',
    label: 'Mixed diet meal',
    value: 2.5,
    unit: 'kgCO2e_per_meal',
    confidence: 'medium',
    sourceType: 'demo_assumption',
    sourceLabel: 'CarbonCoach demo factor registry',
    version: '2026-06-p0',
    assumptionNote:
      'Average footprint of a typical meal containing a balance of meat, vegetables, and grains.',
  },
  {
    id: 'food.meat_heavy.meal',
    category: 'food',
    label: 'Meat-heavy meal',
    value: 4.5,
    unit: 'kgCO2e_per_meal',
    confidence: 'medium',
    sourceType: 'demo_assumption',
    sourceLabel: 'CarbonCoach demo factor registry',
    version: '2026-06-p0',
    assumptionNote:
      'High-impact estimate for meals rich in red meat or high-carbon animal products.',
  },
  {
    id: 'food.vegan.meal',
    category: 'food',
    label: 'Vegan meal',
    value: 0.9,
    unit: 'kgCO2e_per_meal',
    confidence: 'medium',
    sourceType: 'demo_assumption',
    sourceLabel: 'CarbonCoach demo factor registry',
    version: '2026-06-p0',
    assumptionNote: 'Low-impact footprint of a purely plant-based meal without animal products.',
  },

  // Home Energy
  {
    id: 'home_energy.electricity.kwh',
    category: 'homeEnergy',
    label: 'Grid electricity',
    value: 0.45,
    unit: 'kgCO2e_per_kwh',
    confidence: 'medium',
    sourceType: 'demo_assumption',
    sourceLabel: 'CarbonCoach demo factor registry',
    version: '2026-06-p0',
    assumptionNote:
      'Average CO2 intensity per kWh of electricity drawn from a standard fossil-heavy grid.',
  },

  // Shopping / Delivery
  {
    id: 'shopping.delivery.single',
    category: 'shopping',
    label: 'Standard package delivery',
    value: 1.2,
    unit: 'kgCO2e_per_delivery',
    confidence: 'medium',
    sourceType: 'demo_assumption',
    sourceLabel: 'CarbonCoach demo factor registry',
    version: '2026-06-p0',
    assumptionNote: 'Average delivery emissions per box from transport hub to doorstep.',
  },
  {
    id: 'shopping.goods.low',
    category: 'shopping',
    label: 'Low impact shopping (e.g. books, digital, simple goods)',
    value: 3.0,
    unit: 'kgCO2e_per_month',
    confidence: 'medium',
    sourceType: 'demo_assumption',
    sourceLabel: 'CarbonCoach demo factor registry',
    version: '2026-06-p0',
    assumptionNote:
      'Directional estimate for low-impact clothing, reuse, or digital/book purchases.',
  },
  {
    id: 'shopping.goods.medium',
    category: 'shopping',
    label: 'Medium impact shopping (e.g. standard apparel, mixed retail)',
    value: 15.0,
    unit: 'kgCO2e_per_month',
    confidence: 'medium',
    sourceType: 'demo_assumption',
    sourceLabel: 'CarbonCoach demo factor registry',
    version: '2026-06-p0',
    assumptionNote: 'Average monthly shopping impact for clothing and consumer household goods.',
  },
  {
    id: 'shopping.goods.high',
    category: 'shopping',
    label: 'High impact shopping (e.g. electronics, appliances)',
    value: 50.0,
    unit: 'kgCO2e_per_month',
    confidence: 'medium',
    sourceType: 'demo_assumption',
    sourceLabel: 'CarbonCoach demo factor registry',
    version: '2026-06-p0',
    assumptionNote:
      'Average monthly shopping footprint when buying major electronics, fast fashion, or bulky appliances.',
  },

  // Flights
  {
    id: 'flights.short_haul.one_way',
    category: 'flights',
    label: 'Short-haul flight',
    value: 150.0,
    unit: 'kgCO2e_per_flight',
    confidence: 'medium',
    sourceType: 'demo_assumption',
    sourceLabel: 'CarbonCoach demo factor registry',
    version: '2026-06-p0',
    assumptionNote:
      'Estimated footprint of a short one-way domestic flight (typically under 3 hours).',
  },
  {
    id: 'flights.medium_haul.one_way',
    category: 'flights',
    label: 'Medium-haul flight',
    value: 400.0,
    unit: 'kgCO2e_per_flight',
    confidence: 'medium',
    sourceType: 'demo_assumption',
    sourceLabel: 'CarbonCoach demo factor registry',
    version: '2026-06-p0',
    assumptionNote:
      'Estimated footprint of a medium-haul one-way international flight (typically 3 to 6 hours).',
  },
];

export function getEmissionFactors(): EmissionFactor[] {
  return [...registry];
}

export function getFactorsByCategory(category: FootprintCategory): EmissionFactor[] {
  return registry.filter((factor) => factor.category === category);
}

export function getFactorById(id: string): EmissionFactor | undefined {
  return registry.find((factor) => factor.id === id);
}

export function getRequiredFactorById(id: string): EmissionFactor {
  const factor = getFactorById(id);
  if (!factor) {
    throw new Error(`Required emission factor not found: ${id}`);
  }
  return factor;
}
