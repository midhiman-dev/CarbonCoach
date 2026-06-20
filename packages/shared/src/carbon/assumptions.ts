import type { FootprintCategory } from '../types/carbon';

export const carbonEstimateDisclaimer =
  'Carbon footprint estimates are approximate and based on standard emission factors. ' +
  'Actual footprints depend heavily on local grids, specific vehicle models, driving efficiency, diet composition, and product lifecycles.';

export const categoryAssumptionNotes: Record<FootprintCategory, string> = {
  transport:
    'Transport estimates are directional based on fuel type or transit mode averages, assuming average passenger loads and traffic conditions.',
  food: 'Food estimates use general category values (vegan, vegetarian, mixed, meat-heavy) and do not account for sourcing, packaging, or kitchen prep efficiency.',
  homeEnergy:
    'Home energy calculations assume average regional grid emission intensity for electricity usage, or average heating fuel factors.',
  shopping:
    'Shopping estimates reflect typical lifecycle impacts of retail goods and courier deliveries, which vary widely depending on transport distance and packaging materials.',
  flights:
    'Flight emission estimates use generic short-haul and medium-haul factors, which vary based on aircraft type, routing, seat class, and high-altitude radiative forcing impacts.',
};
