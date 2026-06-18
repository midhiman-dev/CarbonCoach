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
        label: 'Solo car trip',
        description: 'Commute alone in a standard petrol-powered vehicle or single-occupancy cab.',
        impactBand: 'high',
        reasons: [
          'Shared transit can often have a lower estimated impact per passenger than travelling alone by car.',
          'Solo car trips do not share vehicle emissions with other passengers.',
        ],
      },
      {
        id: 'metro',
        label: 'Metro or urban rail, where available',
        description: 'Use metro or urban rail for your commute where it is available.',
        impactBand: 'low',
        reasons: [
          'High passenger density usually lowers the estimated impact per traveler.',
          'Electric rail has no direct tailpipe emissions during travel; electricity-source assumptions vary.',
        ],
      },
      {
        id: 'carpool',
        label: 'Carpool',
        description: 'Share a journey with other passengers in a single vehicle.',
        impactBand: 'medium',
        reasons: [
          'Carpooling shares a journey with other passengers and may lower the estimated impact per person compared with a solo car trip.',
          'Reduces the estimated per-person impact by spreading fuel consumption across multiple riders.',
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
      'This comparison uses simplified meal-category assumptions. It does not account for exact ingredients, dairy quantity, portion size, cooking fuel, restaurant practices, food sourcing, or food waste.',
    recommendedOptionId: 'vegetarian-thali',
    options: [
      {
        id: 'mutton-biryani',
        label: 'Mutton Biryani Meal',
        description: 'A rice-based meal with mutton and richer accompaniments.',
        impactBand: 'high',
        reasons: [
          'Ruminant meat generally has a higher estimated footprint than poultry or plant-forward meals.',
          'Preparation, portion size, and sourcing can change the estimate.',
        ],
      },
      {
        id: 'vegetarian-thali',
        label: 'Vegetarian Thali',
        description:
          'A balanced meal with seasonal vegetables, dal, rice or roti, and simple sides.',
        impactBand: 'low',
        reasons: [
          'Plant-forward meals are generally estimated as lower impact than meals centered on meat.',
          'Ingredients, dairy content, preparation, and sourcing can affect the estimate.',
        ],
      },
      {
        id: 'chicken-biryani',
        label: 'Chicken Biryani Meal',
        description: 'A rice-based meal with chicken and standard accompaniments.',
        impactBand: 'medium',
        reasons: [
          'Poultry is generally estimated lower than ruminant meat, but higher than many plant-forward meals.',
          'Ingredients, portion size, and cooking method can affect the estimate.',
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
      'Actual delivery impact depends on distance, route planning, load size, delivery vehicle, packaging, and fulfilment practices.',
    recommendedOptionId: 'consolidated',
    options: [
      {
        id: 'express',
        label: 'Instant / Same-Day Delivery',
        description: 'Get your item delivered within a few hours via dedicated dispatch.',
        impactBand: 'high',
        reasons: [
          'Often forces dedicated, less-optimized delivery routes.',
          'Harder to combine shipments, resulting in more vehicle miles traveled per item.',
        ],
      },
      {
        id: 'standard',
        label: 'Standard Delivery',
        description: 'Get your items delivered within 2–3 business days via regular logistics.',
        impactBand: 'medium',
        reasons: [
          'Typically uses standard transit networks with some route consolidation.',
          'Slower than express but may still result in multiple separate deliveries.',
        ],
      },
      {
        id: 'consolidated',
        label: 'Consolidated Weekly Delivery',
        description: 'Wait and have all your orders delivered together on a designated day.',
        impactBand: 'low',
        reasons: [
          'Consolidating purchases may allow fewer separate deliveries and is treated as a lower-impact option in this simplified comparison.',
          'Fewer delivery vehicle trips to your residence.',
        ],
      },
    ],
  },
  {
    id: 'home-energy-choice',
    title: 'Summer AC Settings',
    category: 'homeEnergy',
    description: 'Select your home cooling preference on a warm summer day.',
    assumptionNote:
      'Actual energy use varies with room size, insulation, outdoor temperature, appliance efficiency, occupancy, and local electricity supply.',
    recommendedOptionId: 'moderate-cooling',
    options: [
      {
        id: 'deep-freeze',
        label: 'AC at 20°C',
        description: 'Running the AC at a low temperature setting for deep cooling.',
        impactBand: 'high',
        reasons: [
          'Air conditioning units consume significantly more energy to maintain lower temperatures.',
          'Puts higher strain on the power grid during peak hours.',
        ],
      },
      {
        id: 'moderate-cooling',
        label: 'AC at 24°C with ceiling fan',
        description: 'Moderate cooling setting combined with fan support.',
        impactBand: 'low',
        reasons: [
          'A moderate AC setting with fan support can be a practical lower-impact choice in this simplified comparison.',
          'Fans circulate air efficiently, reducing the need for continuous low AC temperatures.',
        ],
      },
    ],
  },
];
