import { CarbonAction } from '../types/actions';

export const actionCatalog: CarbonAction[] = [
  // Transport
  {
    id: 'transport.replace_short_car_trips',
    title: 'Replace two short cab rides per week with metro or bus',
    category: 'transport',
    impactBand: 'medium',
    effort: 'medium',
    costEffect: 'savesMoney',
    reason: 'Metro and bus have significantly lower emissions per passenger than cars.',
    assumptionNote:
      'Impact varies based on typical cab distance and local public transit footprint.',
    estimatedMonthlyReductionKgCO2e: 12,
  },
  {
    id: 'transport.walk_cycle_short_trip',
    title: 'Walk or cycle for one short trip per week instead of driving',
    category: 'transport',
    impactBand: 'low',
    effort: 'medium',
    costEffect: 'savesMoney',
    reason: 'Walking and cycling produce zero tailpipe emissions.',
    assumptionNote: 'Estimated reduction assumes a typical 2-4 km short trip.',
  },

  // Food
  {
    id: 'food.plant_forward_meal_swap',
    title: 'Choose one plant-forward meal swap this week',
    category: 'food',
    impactBand: 'medium',
    effort: 'low',
    costEffect: 'savesMoney',
    reason: 'Plant-based meals generally have a much lower carbon footprint than meat-heavy meals.',
    assumptionNote:
      'Savings based on replacing one typical meat-heavy meal with a vegetarian option.',
  },
  {
    id: 'food.reduce_meat_heavy_meal_once',
    title: 'Reduce meat-heavy portions or swap for chicken in one meal',
    category: 'food',
    impactBand: 'low',
    effort: 'low',
    costEffect: 'savesMoney',
    reason: 'Poultry and smaller portions have lower emissions than red meat.',
    assumptionNote: 'Reduction is directional as actual footprint depends on specific ingredients.',
  },

  // Home Energy
  {
    id: 'home_energy.track_weekly_usage',
    title: 'Track home energy for one week before changing appliances',
    category: 'homeEnergy',
    impactBand: 'low',
    effort: 'low',
    costEffect: 'neutral',
    reason: 'Awareness of high-usage devices is the first step to reducing energy waste.',
    assumptionNote:
      'This is an awareness action; direct carbon reduction happens only if habits change.',
  },
  {
    id: 'home_energy.reduce_ac_runtime',
    title: 'Reduce AC or heater runtime by one hour a day',
    category: 'homeEnergy',
    impactBand: 'medium',
    effort: 'low',
    costEffect: 'savesMoney',
    reason: 'Heating and cooling are usually the largest drivers of home energy use.',
    assumptionNote:
      'Savings assume average HVAC consumption. Exact amount varies by unit efficiency.',
  },

  // Shopping
  {
    id: 'shopping.combine_deliveries',
    title: 'Reduce one delivery by combining orders',
    category: 'shopping',
    impactBand: 'low',
    effort: 'low',
    costEffect: 'savesMoney',
    reason: 'Fewer deliveries mean less delivery vehicle travel per item.',
    assumptionNote: 'Based on average standard delivery emissions per box.',
  },
  {
    id: 'shopping.repair_or_reuse_one_item',
    title: 'Repair or reuse one item instead of buying new',
    category: 'shopping',
    impactBand: 'medium',
    effort: 'medium',
    costEffect: 'savesMoney',
    reason: 'Manufacturing new goods often involves high embodied carbon.',
    assumptionNote:
      'Savings depend on the specific material and manufacturing process of the item.',
  },

  // Flights
  {
    id: 'flights.consider_train_for_short_trip',
    title: 'Avoid one non-essential short-haul flight when a train is practical',
    category: 'flights',
    impactBand: 'high',
    effort: 'high',
    costEffect: 'neutral',
    reason:
      'Trains typically produce a fraction of the emissions per passenger compared to flights.',
    assumptionNote: 'Savings based on average short-haul flight vs electric rail.',
  },
  {
    id: 'flights.plan_lower_frequency_air_travel',
    title: 'Combine travel purposes to reduce flight frequency',
    category: 'flights',
    impactBand: 'high',
    effort: 'medium',
    costEffect: 'savesMoney',
    reason: 'Taking fewer flights is one of the most effective ways to lower your footprint.',
    assumptionNote: 'Eliminating a single flight produces large immediate carbon savings.',
  },
];

export function getActionCatalog(): CarbonAction[] {
  return [...actionCatalog];
}
