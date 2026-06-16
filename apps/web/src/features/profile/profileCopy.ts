export const profileCopy = {
  title: 'Set up your carbon profile',
  subtitle: 'Configure your lifestyle inputs for estimation',
  description:
    'Use approximate values. CarbonCoach is designed for awareness and better everyday choices, not formal carbon accounting.',

  sections: {
    transport: {
      title: 'Transport',
      commuteModeLabel: 'Primary commute mode',
      commuteModeHelper: 'Select the mode you use most frequently for commuting.',
      weeklyCommuteKmLabel: 'Approximate weekly commute distance (km)',
      weeklyCommuteKmHelper: 'Total distance traveled per week in kilometers.',
    },
    food: {
      title: 'Food',
      dietPatternLabel: 'Diet pattern',
      dietPatternHelper: 'Choose the option that closest matches your eating habits.',
    },
    homeEnergy: {
      title: 'Home Energy',
      monthlyHomeEnergyKwhLabel: 'Approximate monthly electricity usage (kWh)',
      monthlyHomeEnergyKwhHelper: "Your home's electricity consumption per month.",
      householdSizeLabel: 'Household size (people)',
      householdSizeHelper: 'Number of people living in your home.',
    },
    shopping: {
      title: 'Shopping & Deliveries',
      shoppingFrequencyLabel: 'Shopping frequency',
      shoppingFrequencyHelper: 'Frequency of purchasing new clothes, electronics, goods, etc.',
      deliveriesPerWeekLabel: 'Deliveries per week',
      deliveriesPerWeekHelper:
        'Average number of online shopping or food delivery packages delivered per week.',
    },
    flights: {
      title: 'Flights',
      flightsPerYearLabel: 'Flights per year',
      flightsPerYearHelper: 'Total number of short-haul and long-haul flights taken in a year.',
    },
    preference: {
      title: 'Coaching Preference',
      priorityLabel: 'Coaching Priority',
      priorityHelper: 'Your personal priority to help us customize weekly action recommendations.',
    },
  },

  options: {
    commuteMode: [
      { value: 'metro', label: 'Metro / Train' },
      { value: 'bus', label: 'Public Bus' },
      { value: 'car', label: 'Personal Car' },
      { value: 'twoWheeler', label: 'Motorbike / Scooter' },
      { value: 'walkCycle', label: 'Walk or Cycle' },
      { value: 'workFromHome', label: 'Remote / Work From Home' },
      { value: 'mixed', label: 'Mixed Commute' },
    ],
    dietPattern: [
      { value: 'mixed', label: 'Mixed Diet (Meat, Veg, Dairy)' },
      { value: 'mostlyVegetarian', label: 'Mostly Vegetarian' },
      { value: 'vegan', label: 'Vegan' },
      { value: 'meatHeavy', label: 'Meat-Heavy' },
    ],
    shoppingFrequency: [
      { value: 'low', label: 'Low (Essential items only)' },
      { value: 'medium', label: 'Medium (Regular shopping)' },
      { value: 'high', label: 'High (Frequent brand/online orders)' },
    ],
    preference: [
      { value: 'balanced', label: 'Balanced approach' },
      { value: 'saveMoney', label: 'Save Money priority' },
      { value: 'lowEffort', label: 'Low Effort/Convenience priority' },
      { value: 'highestImpact', label: 'Highest Carbon Reduction priority' },
    ],
  },

  buttons: {
    submit: 'Save Profile',
    reset: 'Reset Defaults',
    edit: 'Edit Profile Settings',
  },

  success: {
    title: 'Profile Saved',
    summary:
      'Profile ready. Your approximate footprint summary will be calculated in the next step.',
    placeholderNextStep: 'Footprint summary will appear after calculator UI is connected.',
  },
};
