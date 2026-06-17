import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CarbonWorld } from './CarbonWorld';
import type { CarbonProfile, WeeklyTrackerState, RankedCarbonAction } from '@carboncoach/shared';

describe('CarbonWorld UI Component', () => {
  const mockProfile: CarbonProfile = {
    commuteMode: 'metro',
    weeklyCommuteKm: 50,
    dietPattern: 'mostlyVegetarian',
    shoppingFrequency: 'medium',
    deliveriesPerWeek: 2,
    flightsPerYear: 1,
    preference: 'balanced',
  };

  const mockActions: RankedCarbonAction[] = [
    {
      id: 'act-1',
      title: 'Action 1',
      category: 'transport',
      impactBand: 'low',
      score: 10,
      fitReasons: ['Balanced'],
      effort: 'low',
      costEffect: 'neutral',
      reason: 'Balanced',
      assumptionNote: 'demo note',
    },
    {
      id: 'act-2',
      title: 'Action 2',
      category: 'food',
      impactBand: 'high',
      score: 8,
      fitReasons: ['High impact'],
      effort: 'medium',
      costEffect: 'savesMoney',
      reason: 'High impact',
      assumptionNote: 'demo note',
    },
  ];

  const mockTrackerState: WeeklyTrackerState = {
    version: 1,
    weekId: '2026-06-15',
    completedActionIds: [],
    updatedAtIso: new Date().toISOString(),
  };

  it('renders Carbon World title and onboarding empty state when no profile exists', () => {
    const handleOnboarding = vi.fn();
    const handleTracker = vi.fn();

    render(
      <CarbonWorld
        profile={null}
        weeklyPlanActions={mockActions}
        trackerState={mockTrackerState}
        onNavigateToOnboarding={handleOnboarding}
        onNavigateToTracker={handleTracker}
      />,
    );

    expect(screen.getByText('Carbon World')).toBeInTheDocument();
    expect(screen.getByText(/Profile Onboarding Required/i)).toBeInTheDocument();
  });

  it('renders empty state when weekly tracker actions do not exist', () => {
    render(
      <CarbonWorld
        profile={mockProfile}
        weeklyPlanActions={[]}
        trackerState={mockTrackerState}
        onNavigateToOnboarding={vi.fn()}
        onNavigateToTracker={vi.fn()}
      />,
    );

    expect(screen.getByText(/Weekly Actions Needed/i)).toBeInTheDocument();
  });

  it('renders seed stage with 0% progress when no actions are completed', () => {
    render(
      <CarbonWorld
        profile={mockProfile}
        weeklyPlanActions={mockActions}
        trackerState={mockTrackerState}
        onNavigateToOnboarding={vi.fn()}
        onNavigateToTracker={vi.fn()}
      />,
    );

    expect(screen.getByText('Seed of Action')).toBeInTheDocument();
    expect(screen.getByText(/Progress: 0 of 2 actions complete/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(
        /Carbon World: Seed stage. Your action garden is quiet and ready to grow. Progress is 0 percent./i,
      ),
    ).toBeInTheDocument();
  });

  it('renders garden stage and progress text when some actions are completed', () => {
    render(
      <CarbonWorld
        profile={mockProfile}
        weeklyPlanActions={mockActions}
        trackerState={{
          ...mockTrackerState,
          completedActionIds: ['act-1'],
        }}
        onNavigateToOnboarding={vi.fn()}
        onNavigateToTracker={vi.fn()}
      />,
    );

    expect(screen.getByText('Growing Habits')).toBeInTheDocument();
    expect(screen.getByText(/Progress: 1 of 2 actions complete/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(
        /Carbon World: Garden stage. Plants are growing and the sky is bright. Progress is 50 percent./i,
      ),
    ).toBeInTheDocument();
  });

  it('does not render avoided/saved emissions claims', () => {
    const { container } = render(
      <CarbonWorld
        profile={mockProfile}
        weeklyPlanActions={mockActions}
        trackerState={mockTrackerState}
        onNavigateToOnboarding={vi.fn()}
        onNavigateToTracker={vi.fn()}
      />,
    );

    const text = container.textContent || '';
    expect(text).not.toContain('saved kg');
    expect(text).not.toContain('avoided emissions');
    expect(text).not.toContain('reduced emissions');
    expect(text).not.toContain('emissions saved');
  });
});
