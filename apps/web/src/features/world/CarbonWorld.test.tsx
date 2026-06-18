import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
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

    expect(screen.getByText('Seed / Hazy Patch')).toBeInTheDocument();
    expect(screen.getByText(/Progress: 0 of 2 actions complete/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(
        /Carbon World stage: Seed \/ Hazy Patch. The landscape is sparse and covered in haze under a dark sky, representing the starting point of your weekly progress./i,
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

    expect(screen.getByText('Growing Grove')).toBeInTheDocument();
    expect(screen.getByText(/Progress: 1 of 2 actions complete/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(
        /Carbon World stage: Growing Grove. Young trees and growing greenery are thriving under a clear blue sky, showing steady weekly progress. Progress is 50 percent./i,
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

  it('differentiates 67% (2 of 3) and 100% (3 of 3) progress with distinct labels and copy', () => {
    const threeActions: RankedCarbonAction[] = [
      ...mockActions,
      {
        id: 'act-3',
        title: 'Action 3',
        category: 'homeEnergy',
        impactBand: 'medium',
        score: 6,
        fitReasons: ['Low Effort'],
        effort: 'low',
        costEffect: 'neutral',
        reason: 'Low Effort',
        assumptionNote: 'demo note',
      },
    ];

    // Render 67% progress (2 of 3 actions complete)
    const { rerender } = render(
      <CarbonWorld
        profile={mockProfile}
        weeklyPlanActions={threeActions}
        trackerState={{
          ...mockTrackerState,
          completedActionIds: ['act-1', 'act-2'],
        }}
        onNavigateToOnboarding={vi.fn()}
        onNavigateToTracker={vi.fn()}
      />,
    );

    expect(screen.getByText('Growing Grove')).toBeInTheDocument();
    expect(screen.getByText('Your action garden is growing steadily.')).toBeInTheDocument();

    // Render 100% progress (3 of 3 actions complete)
    rerender(
      <CarbonWorld
        profile={mockProfile}
        weeklyPlanActions={threeActions}
        trackerState={{
          ...mockTrackerState,
          completedActionIds: ['act-1', 'act-2', 'act-3'],
        }}
        onNavigateToOnboarding={vi.fn()}
        onNavigateToTracker={vi.fn()}
      />,
    );

    expect(screen.queryByText('Growing Grove')).not.toBeInTheDocument();
    expect(screen.getByText('Thriving Grove')).toBeInTheDocument();
    expect(
      screen.getByText('Your weekly actions have helped your Carbon World thrive.'),
    ).toBeInTheDocument();
  });

  it('renders correct dynamic CTA buttons based on completeness', () => {
    const handleTracker = vi.fn();
    const handleRecommendations = vi.fn();

    // Incomplete stage (0 of 2 actions complete)
    const { rerender } = render(
      <CarbonWorld
        profile={mockProfile}
        weeklyPlanActions={mockActions}
        trackerState={mockTrackerState}
        onNavigateToOnboarding={vi.fn()}
        onNavigateToTracker={handleTracker}
        onNavigateToRecommendations={handleRecommendations}
      />,
    );

    const incompleteBtn = screen.getByRole('button', { name: 'Return to weekly tracker' });
    expect(incompleteBtn).toBeInTheDocument();
    fireEvent.click(incompleteBtn);
    expect(handleTracker).toHaveBeenCalled();

    // Complete stage (2 of 2 actions complete)
    rerender(
      <CarbonWorld
        profile={mockProfile}
        weeklyPlanActions={mockActions}
        trackerState={{
          ...mockTrackerState,
          completedActionIds: ['act-1', 'act-2'],
        }}
        onNavigateToOnboarding={vi.fn()}
        onNavigateToTracker={handleTracker}
        onNavigateToRecommendations={handleRecommendations}
      />,
    );

    const completeBtn = screen.getByRole('button', { name: 'Review recommended actions' });
    expect(completeBtn).toBeInTheDocument();
    fireEvent.click(completeBtn);
    expect(handleRecommendations).toHaveBeenCalled();
  });
});
