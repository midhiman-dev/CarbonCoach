import type { ChoiceScenario } from './choiceTypes';

export const choiceScenarios: ChoiceScenario[] = [
  {
    id: 'commute-choice',
    title: 'Daily Commute to Office',
    category: 'transport',
    description: 'Choose your transportation mode for your daily 15 km commute to the office.',
    assumptionNote:
      'Calculations assume average city driving conditions and typical occupancy levels for shared transit.',
    recommendedOptionId: 'metro',
    options: [
      {
        id: 'private-car',
        label: 'Drive Private Car',
        description: 'Commute alone in a standard petrol-powered vehicle.',
        impactBand: 'high',
        reasons: [
          'Usually higher impact per passenger than shared transit.',
          'Contributes to local traffic congestion and idle emissions.',
        ],
      },
      {
        id: 'metro',
        label: 'Take the Metro',
        description: 'Use the electric rapid transit metro system.',
        impactBand: 'low',
        reasons: [
          'High efficiency due to electric power and high passenger volume.',
          'No direct tailpipe emissions during the ride; electricity source assumptions vary.',
        ],
      },
      {
        id: 'carpool',
        label: 'Carpool with Coworkers',
        description: 'Share a ride with three colleagues in a single private car.',
        impactBand: 'medium',
        reasons: [
          'Divides the travel emissions among all occupants.',
          'Reduces the number of active single-occupancy vehicles on the road.',
        ],
      },
    ],
  },
  {
    id: 'meal-choice',
    title: 'Lunch Decision',
    category: 'food',
    description: 'Decide what to eat for lunch today.',
    assumptionNote:
      'Assumes average agricultural and supply chain footprint differences between plant-based and beef/chicken production.',
    recommendedOptionId: 'vegetarian-local',
    options: [
      {
        id: 'beef-burger',
        label: 'Beef Burger Combo',
        description: 'A traditional beef burger with a side of fries.',
        impactBand: 'high',
        reasons: [
          'Beef production is resource-intensive, requiring significant land and water.',
          'High methane footprint associated with livestock farming.',
        ],
      },
      {
        id: 'vegetarian-local',
        label: 'Locally Sourced Vegetarian Bowl',
        description: 'A seasonal grain and vegetable bowl sourced from nearby farms.',
        impactBand: 'low',
        reasons: [
          'Plant-based ingredients generally have a substantially lower growth footprint.',
          'Fewer transportation emissions by choosing local, seasonal produce.',
        ],
      },
      {
        id: 'chicken-salad',
        label: 'Chicken Salad',
        description: 'A fresh green salad topped with grilled chicken breast.',
        impactBand: 'medium',
        reasons: [
          'Poultry has a lower greenhouse gas footprint compared to beef, but is higher than plant proteins.',
          'Requires feed production and processing resources.',
        ],
      },
    ],
  },
  {
    id: 'shopping-choice',
    title: 'Online Shopping Delivery',
    category: 'shopping',
    description: 'Select a shipping speed for your online order of household goods.',
    assumptionNote:
      'Assumes freight optimization. Instant/express options often lead to half-empty delivery trucks running ad-hoc routes.',
    recommendedOptionId: 'consolidated',
    options: [
      {
        id: 'express',
        label: 'Instant / Same-Day Delivery',
        description: 'Get your item delivered within 4–6 hours via dedicated dispatch.',
        impactBand: 'high',
        reasons: [
          'Often forces dedicated, less-optimized delivery routes.',
          'Harder to combine shipments, resulting in more vehicle miles traveled per item.',
        ],
      },
      {
        id: 'consolidated',
        label: 'Consolidated Weekly Delivery',
        description: 'Wait and have all your orders delivered together on a designated day.',
        impactBand: 'low',
        reasons: [
          'Allows the delivery company to optimize routes and maximize truck capacity.',
          'Fewer delivery vehicles visiting your neighborhood.',
        ],
      },
    ],
  },
  {
    id: 'home-energy-choice',
    title: 'Summer Temperature Settings',
    category: 'homeEnergy',
    description: 'Select your home thermostat setting during a warm summer day.',
    assumptionNote:
      'Assumes standard air conditioning efficiency parameters and electrical grid fuel mixes.',
    recommendedOptionId: 'moderate-cooling',
    options: [
      {
        id: 'deep-freeze',
        label: 'Set Thermostat to 20°C (68°F)',
        description: 'Keep the home highly chilled throughout the day.',
        impactBand: 'high',
        reasons: [
          'Air conditioning units consume significantly more energy to maintain lower temperatures.',
          'Puts higher strain on the power grid during peak hours.',
        ],
      },
      {
        id: 'moderate-cooling',
        label: 'Set Thermostat to 24°C (75°F) with Fan',
        description: 'Maintain a moderate cooling level, using a ceiling fan to circulate air.',
        impactBand: 'low',
        reasons: [
          'Substantially reduces electricity demand compared to deep cooling.',
          'Ceiling fans consume very little power while maintaining comfort.',
        ],
      },
    ],
  },
];
