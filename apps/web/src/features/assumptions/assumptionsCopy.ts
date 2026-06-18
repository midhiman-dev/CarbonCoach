export const assumptionsCopy = {
  title: 'Estimates & Assumptions',
  subtitle: 'How CarbonCoach produces approximate estimates and deterministic recommendations.',
  intro:
    'All carbon footprint numbers in this application are approximate estimates. They are designed to support personal awareness and comparison, not official carbon accounting.',
  disclaimer:
    'Estimates are based on demo coefficients and general average indices. Actual impacts vary widely based on your specific location, grid source, product lifecycles, and actual behaviors.',

  boundaries: {
    title: 'What CarbonCoach does not claim',
    points: [
      'It is not a certified carbon accounting tool.',
      'It does not verify real-world emissions reductions.',
      'It does not replace official inventories, scientific measurements, or audits.',
      'It does not guarantee cost savings or monetary reductions.',
      'It does not use AI/LLMs to invent calculations or numbers.',
      'It does not treat tracker completion as proof of actual carbon reduction.',
    ],
  },

  sections: [
    {
      id: 'transport',
      title: 'Transport',
      estimated: 'Approximate monthly commuting carbon impact based on distance and mode.',
      assumptions:
        'Uses generic category averages per kilometer for cars, motorbikes, buses, and trains.',
      notClaimed:
        'Does not account for passenger loads, vehicle model, age, traffic, or fuel quality.',
    },
    {
      id: 'food',
      title: 'Food',
      estimated: 'Footprint pattern estimated from meal frequency and broad diet categories.',
      assumptions:
        'Applies fixed impact weights for vegan, vegetarian, mixed, and meat-heavy patterns.',
      notClaimed:
        'Does not track food sourcing, transport distance, packaging, or cooking methods.',
    },
    {
      id: 'homeEnergy',
      title: 'Home Energy',
      estimated: 'Estimated share of household electricity carbon intensity.',
      assumptions:
        'Calculates per-capita usage by dividing monthly kWh by household size, applying a default grid factor.',
      notClaimed:
        'Does not reflect specific renewable power purchase agreements or solar generation.',
    },
    {
      id: 'shopping',
      title: 'Shopping & Deliveries',
      estimated: 'Directional impact of retail goods purchases and standard shipping packages.',
      assumptions: 'Assigns impact bands for shopping frequencies and delivery counts.',
      notClaimed:
        'Does not detail exact product materials, shipping routes, or courier vehicle types.',
    },
    {
      id: 'flights',
      title: 'Flights',
      estimated: 'Footprint of typical short-haul and medium-haul air travel.',
      assumptions: 'Uses broad class averages for short/medium flight segments.',
      notClaimed:
        'Does not adjust for specific airplane models, airline routing, cabin class, or high-altitude radiative forcing.',
    },
    {
      id: 'recommendations',
      title: 'Recommendations & Action Plan',
      estimated: 'Potential actions ranked by user preference and impact levels.',
      assumptions:
        'Actions are ordered using deterministic scoring logic aligning with preference settings (Balanced, Save Money, Low Effort, Highest Impact).',
      notClaimed:
        'Does not guarantee specific results or that actions fit every lifestyle or budget.',
    },
    {
      id: 'choiceLab',
      title: 'Daily Choice Lab',
      estimated: 'Scenario comparison between high-impact and lower-impact choices.',
      assumptions:
        'Calculates the difference between specific scenario choices using deterministic formulas and static coefficients.',
      notClaimed: 'Does not represent exact individual choices or real-world product footprints.',
    },
    {
      id: 'aiCoach',
      title: 'AI Coach Role',
      estimated: 'Explanations and coaching tips.',
      assumptions:
        'The AI reads deterministic values and provides conversational summaries. It is strictly forbidden from inventing numbers.',
      notClaimed:
        'Does not calculate footprints or verify numbers. Its output is explanatory only.',
    },
    {
      id: 'weeklyTracker',
      title: 'Weekly Tracker',
      estimated: 'Checklist of actions marked completed for the current week.',
      assumptions: 'Updates completion status locally on the device.',
      notClaimed:
        'Tracker completion is a progress metaphor and is not proof of actual emission reductions.',
    },
    {
      id: 'carbonWorld',
      title: 'Carbon World',
      estimated: 'A visual progress landscape showing completed actions.',
      assumptions: 'Sky clarity and trees scale mathematically based on completed tracker tasks.',
      notClaimed:
        'Visual representations are motivational metaphors and do not represent measured scientific changes.',
    },
  ],
};
