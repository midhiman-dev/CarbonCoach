export interface NavigationItem {
  id: string;
  label: string;
  description: string;
  icon?: string;
}

export const navigationItems: NavigationItem[] = [
  {
    id: 'overview',
    label: 'Overview',
    description: 'Dashboard summary of your carbon awareness progress',
  },
  {
    id: 'profile',
    label: 'Profile',
    description: 'Configure your commuting, energy, and consumption habits',
  },
  {
    id: 'footprint',
    label: 'Footprint',
    description: 'Calculated totals, categories breakdown, and AI coaching explanations',
  },
  {
    id: 'recommendations',
    label: 'Recommendations',
    description: 'Ranked carbon reduction actions and suggested weekly plan',
  },
  {
    id: 'choice-lab',
    label: 'Daily Choice Lab',
    description: 'Compare impact scenarios and receive choice coaching nudges',
  },
  {
    id: 'carbon-world',
    label: 'Carbon World',
    description: 'Visual representations of your personal eco-landscape progress',
  },
  {
    id: 'tracker',
    label: 'Weekly Tracker',
    description: 'Track your weekly action checklist locally on this device',
  },
  {
    id: 'privacy',
    label: 'Privacy',
    description: 'Review local-first data isolation policies and details',
  },
  {
    id: 'assumptions',
    label: 'Assumptions',
    description: 'Transparent emission factor references and estimation calculations',
  },
];
