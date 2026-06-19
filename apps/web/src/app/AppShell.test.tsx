import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AppShell } from './AppShell';

vi.mock('../features/profile', () => ({
  ProfileOnboarding: () => <div data-testid="profile-onboarding">Profile Onboarding</div>,
}));

vi.mock('../features/tracker', () => ({
  WeeklyTracker: () => <div data-testid="weekly-tracker">Weekly Tracker</div>,
  trackerStorage: { loadTrackerState: vi.fn(), saveTrackerState: vi.fn() },
  loadStoredProfile: vi.fn().mockReturnValue(null),
  saveStoredProfile: vi.fn(),
  useWeeklyTracker: vi.fn().mockReturnValue({ trackerState: null, progress: { percent: 0, completed: 0, total: 0 }, weeklyPlanActions: [], toggleAction: vi.fn(), resetTracker: vi.fn() }),
}));

describe('AppShell', () => {
  it('renders skip link for accessibility', () => {
    render(<AppShell />);
    const skipLink = screen.getByText(/skip to content/i);
    expect(skipLink).toBeDefined();
  });

  it('renders main navigation landmark', () => {
    render(<AppShell />);
    const nav = screen.getByRole('navigation', { name: /desktop primary navigation/i });
    expect(nav).toBeDefined();
  });

  it('renders main region', () => {
    render(<AppShell />);
    const main = screen.getByRole('main');
    expect(main).toBeDefined();
  });
});
