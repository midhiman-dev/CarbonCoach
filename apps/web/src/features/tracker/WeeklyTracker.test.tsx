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
    expect(screen.getByText(/Tracker Inactive/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Set up your profile to view an approximate estimate/i),
    ).toBeInTheDocument();

    const btn = screen.getByRole('button', { name: /Set up your profile/i });
    fireEvent.click(btn);
    expect(handleNavigate).toHaveBeenCalled();
  });

  it('renders tracker with human-readable date label when profile exists', () => {
    render(<WeeklyTracker profile={mockProfile} onNavigateToOnboarding={vi.fn()} />);

    // Check humanized week label
    expect(screen.getByText(/Week of 15 Jun 2026/i)).toBeInTheDocument();

    // Check completion count is displayed
    expect(screen.getByText(/0 of \d+ complete/i)).toBeInTheDocument();
  });

  it('shows first incomplete action as Next action', () => {
    render(<WeeklyTracker profile={mockProfile} onNavigateToOnboarding={vi.fn()} />);

    // Next action header label is displayed
    expect(screen.getByText(/^Next action$/i)).toBeInTheDocument();

    // Check we render first incomplete action inside next action block
    const checklistItems = screen.getAllByRole('checkbox');
    // Initially they are all incomplete, so the first checkbox should correspond to the next action title
    const firstCheckboxLabel = checklistItems[0].getAttribute('aria-label');
    expect(firstCheckboxLabel).toContain('Mark "');
  });

  it('marking the next action complete updates progress display', () => {
    render(<WeeklyTracker profile={mockProfile} onNavigateToOnboarding={vi.fn()} />);

    // Initial progress
    expect(screen.getByText(/0 of \d+ complete/i)).toBeInTheDocument();

    // Mark next action complete via the button in the Next Action card
    const markCompleteBtn = screen.getByRole('button', { name: /Mark .* as complete/i });
    fireEvent.click(markCompleteBtn);

    // Progress should update to 1 complete
    expect(screen.getByText(/1 of \d+ complete/i)).toBeInTheDocument();
  });

  it('checking a checkbox updates progress and saves to localStorage', () => {
    render(<WeeklyTracker profile={mockProfile} onNavigateToOnboarding={vi.fn()} />);
    const checkboxes = screen.getAllByRole('checkbox');
    const firstCheckbox = checkboxes[0];

    expect(firstCheckbox).not.toBeChecked();
    expect(screen.getByText(/0 of \d+ complete/i)).toBeInTheDocument();

    fireEvent.click(firstCheckbox);

    expect(firstCheckbox).toBeChecked();
    expect(screen.getByText(/1 of \d+ complete/i)).toBeInTheDocument();
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'carboncoach:weekly-tracker',
      expect.stringContaining('2026-06-15'),
    );
  });

  it('all actions complete state shows Carbon World CTA with actual calculated stage title', () => {
    const handleNavigateWorld = vi.fn();
    render(
      <WeeklyTracker
        profile={mockProfile}
        onNavigateToOnboarding={vi.fn()}
        onNavigateToWorld={handleNavigateWorld}
      />,
    );

    // Mark all actions complete
    const checkboxes = screen.getAllByRole('checkbox') as HTMLInputElement[];
    checkboxes.forEach((cb) => {
      if (!cb.checked) {
        fireEvent.click(cb);
      }
    });

    // "Next action" header label should NOT be rendered since all are complete
    expect(screen.queryByText(/^Next action$/i)).not.toBeInTheDocument();

    // "This week is complete" header should render
    expect(screen.getByText(/This week is complete/i)).toBeInTheDocument();

    // The visual CTA "View Thriving Grove" should render
    const ctaBtn = screen.getByRole('button', { name: /View Thriving Grove/i });
    expect(ctaBtn).toBeInTheDocument();

    // Clicking it navigates to Carbon World
    fireEvent.click(ctaBtn);
    expect(handleNavigateWorld).toHaveBeenCalled();
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
    expect(screen.getByText(/0 of \d+ complete/i)).toBeInTheDocument();
  });

  it('tracker does not make environmental outcome claims (e.g. avoided carbon/saved emissions)', () => {
    const { container } = render(
      <WeeklyTracker profile={mockProfile} onNavigateToOnboarding={vi.fn()} />,
    );
    const text = container.textContent || '';
    expect(text).not.toContain('avoided emissions');
    expect(text).not.toContain('avoided impact');
    expect(text).not.toContain('emissions saved');
    expect(text).not.toContain('kg avoided');
    expect(text).not.toContain('reduced emissions');
  });

  it('local-data control is discoverable and triggers privacy navigation', () => {
    const handleNavigatePrivacy = vi.fn();
    render(
      <WeeklyTracker
        profile={mockProfile}
        onNavigateToOnboarding={vi.fn()}
        onNavigateToPrivacy={handleNavigatePrivacy}
      />,
    );

    // Local data description note is visible
    expect(screen.getByText(/Local progress is stored in this browser/i)).toBeInTheDocument();

    // Button to manage local data exists and triggers navigation
    const manageBtn = screen.getByRole('button', { name: /Manage local data/i });
    expect(manageBtn).toBeInTheDocument();
    fireEvent.click(manageBtn);
    expect(handleNavigatePrivacy).toHaveBeenCalled();
  });
});
