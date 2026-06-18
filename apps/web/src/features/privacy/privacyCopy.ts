export const privacyCopy = {
  title: 'Privacy & Local Data',
  subtitle: 'How CarbonCoach handles your profile, tracker progress, and optional coach requests.',
  intro:
    'CarbonCoach is designed with a local-first architecture. Your data belongs to you, and we prioritize isolation and minimization at every step.',
  principles: [
    'Local-first: Your data stays on your device by default.',
    'Data Minimization: When you ask the AI for advice, we only send aggregated summaries, not your raw profile.',
    'No Ad Tracking: We do not track or sell your data.',
    'Transparent AI: Unsupported generated numbers are rejected before coach responses are shown.',
  ],
  noAccountSection: {
    title: 'No Accounts, No Databases',
    description:
      'We do not require you to sign up, log in, or provide personal identity information. No backend database stores your profile or tracker progress. All profile preferences and habits remain locally inside this browser on this device.',
  },
  coachFlowSection: {
    title: 'How the AI Coach Accesses Data',
    description:
      'To provide personalized explanations, the application communicates with our server-side assistant. This only happens when you explicitly trigger a coach request.',
    steps: [
      {
        title: 'User-Triggered Only',
        text: 'The coach is never contacted automatically. Requests only occur when you click "Explain my footprint" or "Coach me on this choice".',
      },
      {
        title: 'Minimized Context',
        text: 'We do not send a full copy of your local data. Only aggregated categories (like transport or energy totals), top contributor names, and selected option details are sent.',
      },
      {
        title: 'Transient Processing',
        text: 'The backend service processes the request, asks the Gemini API using secure server-side environment variables, checks the response using our Numeric Guard, and returns the explanation. No data is saved on the server after the request completes.',
      },
      {
        title: 'Secure API Keys',
        text: 'Gemini API keys are kept entirely on the server and are never exposed to the frontend browser.',
      },
    ],
    notSentList: [
      'Raw localStorage dumps',
      'Browser cookies or history',
      'API keys or sensitive tokens',
      'Personal identity details',
    ],
  },
  clearDataSection: {
    title: 'Manage Your Data',
    description:
      'Since your data is stored on this device, clearing your browser cache or using the control below will delete all stored profile inputs and weekly action progress. No server data needs to be cleared because nothing is stored there.',
  },
};
