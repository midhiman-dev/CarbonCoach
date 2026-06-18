import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { OverviewDashboard } from './OverviewDashboard';
import { overviewCopy } from './overviewCopy';
import type { CarbonProfile, FootprintEstimate } from '@carboncoach/shared';

describe('OverviewDashboard', () => {
  const mockNavigate = vi.fn();

  const mockProfile: CarbonProfile = {
    commuteMode: 'metro',
    weeklyCommuteKm: 50,
    dietPattern: 'mostlyVegetarian',
    shoppingFrequency: 'medium',
    deliveriesPerWeek: 2,
    flightsPerYear: 1,
    preference: 'balanced',
  };

  const mockEstimate: FootprintEstimate = {
    monthlyTotalKgCO2e: 320,
    categories: [
      {
        category: 'transport',
        monthlyKgCO2e: 120,
        confidence: 'medium',
        factorIds: [],
        assumptionNotes: [],
      },
      {
        category: 'food',
        monthlyKgCO2e: 100,
        confidence: 'high',
        factorIds: [],
        assumptionNotes: [],
      },
      {
        category: 'homeEnergy',
        monthlyKgCO2e: 60,
        confidence: 'medium',
        factorIds: [],
        assumptionNotes: [],
      },
      {
        category: 'shopping',
        monthlyKgCO2e: 40,
        confidence: 'medium',
        factorIds: [],
        assumptionNotes: [],
      },
    ],
    topCategory: 'transport',
    confidence: 'medium',
    assumptionNotes: ['Mock note'],
  };

  const mockTrackerProgress = {
    completed: 1,
    total: 3,
    percent: 33.0,
  };

  it('renders hero message and trust badges', () => {
    render(
      <OverviewDashboard
        savedProfile={null}
        estimate={null}
        weeklyPlanActionsCount={0}
        trackerProgress={{ completed: 0, total: 0, percent: 0 }}
        onNavigate={mockNavigate}
      />,
    );

    // Verify hero text
    expect(screen.getByText(overviewCopy.heroTitle)).toBeInTheDocument();

    // Verify trust badges
    expect(screen.getByText(overviewCopy.trustStrip.localFirst)).toBeInTheDocument();
    expect(screen.getByText(overviewCopy.trustStrip.deterministic)).toBeInTheDocument();
  });

  it('renders journey steps and triggers navigation', () => {
    render(
      <OverviewDashboard
        savedProfile={null}
        estimate={null}
        weeklyPlanActionsCount={0}
        trackerProgress={{ completed: 0, total: 0, percent: 0 }}
        onNavigate={mockNavigate}
      />,
    );

    // Click on Profile journey step
    const profileBtn = screen.getByRole('button', { name: /Set up profile/i });
    fireEvent.click(profileBtn);
    expect(mockNavigate).toHaveBeenCalledWith('profile');
  });

  it('renders appropriate Next Best Action when no profile exists', () => {
    render(
      <OverviewDashboard
        savedProfile={null}
        estimate={null}
        weeklyPlanActionsCount={0}
        trackerProgress={{ completed: 0, total: 0, percent: 0 }}
        onNavigate={mockNavigate}
      />,
    );

    expect(screen.getByText(/Step 1: Build Your Carbon Profile/i)).toBeInTheDocument();
    const actionBtn = screen.getByRole('button', { name: /Set up your profile/i });
    fireEvent.click(actionBtn);
    expect(mockNavigate).toHaveBeenCalledWith('profile');
  });

  it('renders appropriate Next Best Action when profile exists but plan has no actions', () => {
    render(
      <OverviewDashboard
        savedProfile={mockProfile}
        estimate={mockEstimate}
        weeklyPlanActionsCount={0}
        trackerProgress={{ completed: 0, total: 0, percent: 0 }}
        onNavigate={mockNavigate}
      />,
    );

    expect(screen.getByText(/Step 2: Custom Action Plan Ready/i)).toBeInTheDocument();
    const actionBtn = screen.getByRole('button', { name: /Explore recommended actions/i });
    fireEvent.click(actionBtn);
    expect(mockNavigate).toHaveBeenCalledWith('recommendations');
  });

  it('renders appropriate Next Best Action when tracker is active', () => {
    render(
      <OverviewDashboard
        savedProfile={mockProfile}
        estimate={mockEstimate}
        weeklyPlanActionsCount={3}
        trackerProgress={mockTrackerProgress}
        onNavigate={mockNavigate}
      />,
    );

    expect(screen.getByText(/Step 3: Track Weekly Actions/i)).toBeInTheDocument();
    const actionBtn = screen.getByRole('button', { name: /Continue weekly tracker/i });
    fireEvent.click(actionBtn);
    expect(mockNavigate).toHaveBeenCalledWith('tracker');
  });

  it('renders Carbon World status preview', () => {
    render(
      <OverviewDashboard
        savedProfile={mockProfile}
        estimate={mockEstimate}
        weeklyPlanActionsCount={3}
        trackerProgress={mockTrackerProgress}
        onNavigate={mockNavigate}
      />,
    );

    expect(screen.getByText('Sprouting Patch')).toBeInTheDocument();
    expect(screen.getByText('1 of 3 actions complete')).toBeInTheDocument();
  });
});
