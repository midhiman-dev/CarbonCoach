import { LocalDataPolicyItem } from '../types/privacy';

export const localDataPolicyItems: LocalDataPolicyItem[] = [
  {
    key: 'carbonProfile',
    label: 'Lifestyle Profile',
    storage: 'browserLocalStorage',
    purpose: 'Used to calculate your approximate carbon footprint.',
    userVisible: true,
    clearable: true,
  },
  {
    key: 'footprintEstimate',
    label: 'Footprint Estimate',
    storage: 'browserLocalStorage',
    purpose: 'Saved locally to show your progress without recalculating constantly.',
    userVisible: true,
    clearable: true,
  },
  {
    key: 'weeklyTracker',
    label: 'Weekly Tracker',
    storage: 'browserLocalStorage',
    purpose: 'Tracks which actions you have completed this week.',
    userVisible: true,
    clearable: true,
  },
  {
    key: 'coachContext',
    label: 'AI Coach Request',
    storage: 'serverTransient',
    purpose: 'A minimized summary of your footprint is sent to the AI coach. It is not stored.',
    userVisible: false,
    clearable: false,
  },
  {
    key: 'apiKeys',
    label: 'AI API Keys',
    storage: 'notStored',
    purpose: 'The application uses its own server-side API keys, none are stored locally.',
    userVisible: false,
    clearable: false,
  },
];

export const privacyPrinciples: string[] = [
  'Local-first: Your data stays on your device by default.',
  'Data Minimization: When you ask the AI for advice, we only send aggregated summaries, not your raw profile.',
  'No Ad Tracking: We do not track or sell your data.',
  "Transparent AI: We bounded the AI to use our calculations so it doesn't invent numbers.",
];
