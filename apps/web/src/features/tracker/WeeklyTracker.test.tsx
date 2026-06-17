import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { WeeklyTracker } from './WeeklyTracker';
import type { CarbonProfile } from '@carboncoach/shared';

// Mock shared dependency helpers
vi.mock('@carboncoach/shared', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@carboncoach/shared')>();
  return {
    ...actual,
    createCurrentWeekId: () => '2026-06-15',
  };
});

describe('WeeklyTracker UI', () => {
  const mockProfile: CarbonProfile = {
    commuteMode: 'metro',
    weeklyCommuteKm: 50,
    dietPattern: 'mostlyVegetarian',
    shoppingFrequency: 'medium',
    deliveriesPerWeek: 2,
    flightsPerYear: 1,
    preference: 'balanced',
  };

  beforeEach(() => {
    vi.stubGlobal('localStorage', {
      getItem: vi.fn().mockReturnValue(null),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    });
  });

  it('renders empty state when no profile exists', () => {
    const handleNavigate = vi.fn();
    render(<WeeklyTracker profile={null} onNavigateToOnboarding={handleNavigate} />);
    expect(screen.getByText(/Set up your profile first/i)).toBeInTheDocument();

    const btn = screen.getByRole('button', { name: /Go to Profile Onboarding/i });
    fireEvent.click(btn);
    expect(handleNavigate).toHaveBeenCalled();
  });

  it('renders tracker and checklist actions when profile exists', () => {
    render(<WeeklyTracker profile={mockProfile} onNavigateToOnboarding={vi.fn()} />);
    expect(screen.getByText(/Current Week: 2026-06-15/i)).toBeInTheDocument();
    expect(screen.getByText(/Track a few suggested actions/i)).toBeInTheDocument();

    // Check we render actions (should render some actions based on recommendations)
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes.length).toBeGreaterThan(0);
  });

  it('checking an action updates progress and saves to localStorage', () => {
    render(<WeeklyTracker profile={mockProfile} onNavigateToOnboarding={vi.fn()} />);
    const checkboxes = screen.getAllByRole('checkbox');
    const firstCheckbox = checkboxes[0];

    expect(firstCheckbox).not.toBeChecked();
    expect(screen.getByText(/0 of \d+ actions completed/i)).toBeInTheDocument();

    fireEvent.click(firstCheckbox);

    expect(firstCheckbox).toBeChecked();
    expect(screen.getByText(/1 of \d+ actions completed/i)).toBeInTheDocument();
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'carboncoach:weekly-tracker',
      expect.stringContaining('2026-06-15'),
    );
  });

  it('reset progress button clears the checklist state', () => {
    render(<WeeklyTracker profile={mockProfile} onNavigateToOnboarding={vi.fn()} />);
    const checkboxes = screen.getAllByRole('checkbox');

    // Check one
    fireEvent.click(checkboxes[0]);
    expect(checkboxes[0]).toBeChecked();

    const resetBtn = screen.getByRole('button', { name: /Reset tracker progress/i });
    fireEvent.click(resetBtn);

    expect(checkboxes[0]).not.toBeChecked();
    expect(screen.getByText(/0 of \d+ actions completed/i)).toBeInTheDocument();
  });
});
