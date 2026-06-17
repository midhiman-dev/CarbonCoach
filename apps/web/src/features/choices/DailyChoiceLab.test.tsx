import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DailyChoiceLab } from './DailyChoiceLab';
import { choiceCopy } from './choiceCopy';
import type { CarbonProfile } from '@carboncoach/shared';

describe('DailyChoiceLab Component', () => {
  const mockProfile: CarbonProfile = {
    commuteMode: 'car',
    weeklyCommuteKm: 40,
    dietPattern: 'mixed',
    shoppingFrequency: 'medium',
    deliveriesPerWeek: 2,
    flightsPerYear: 1,
    preference: 'saveMoney',
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders Daily Choice Lab title, description, and interactive Choice Coach panel', () => {
    render(<DailyChoiceLab profile={mockProfile} />);

    expect(screen.getByText(choiceCopy.title)).toBeInTheDocument();
    expect(screen.getByText(choiceCopy.description)).toBeInTheDocument();
    expect(screen.getByText('Choice Coach')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Ask CarbonCoach to explain this deterministic choice comparison in plain language.',
      ),
    ).toBeInTheDocument();
  });

  it('renders scenario selector with default commuting scenario options', () => {
    render(<DailyChoiceLab profile={mockProfile} />);

    // Selector is present
    const select = screen.getByLabelText(choiceCopy.selectLabel);
    expect(select).toBeInTheDocument();
    expect(select).toHaveValue('commute-choice');

    // Default scenario options are rendered
    expect(screen.getByText('Take the Metro')).toBeInTheDocument();
    expect(screen.getByText('Drive Private Car')).toBeInTheDocument();
    expect(screen.getByText('Carpool with Coworkers')).toBeInTheDocument();
  });

  it('changing scenario updates displayed options, descriptions, and assumptions', () => {
    render(<DailyChoiceLab profile={mockProfile} />);

    const select = screen.getByLabelText(choiceCopy.selectLabel);
    fireEvent.change(select, { target: { value: 'meal-choice' } });

    // Options updated
    expect(screen.getByText('Locally Sourced Vegetarian Bowl')).toBeInTheDocument();
    expect(screen.getByText('Beef Burger Combo')).toBeInTheDocument();
    expect(screen.getByText('Chicken Salad')).toBeInTheDocument();

    // Context changes
    expect(
      screen.getByText(/Assumes average agricultural and supply chain footprint/i),
    ).toBeInTheDocument();
  });

  it('renders recommended/lower-impact badges and impact band labels as text', () => {
    render(<DailyChoiceLab profile={mockProfile} />);

    // Recommended badge matches label
    expect(screen.getAllByText(choiceCopy.recommendedOptionLabel)[0]).toBeInTheDocument();

    // Impact band text is visible
    expect(screen.getAllByText('Low Impact')[0]).toBeInTheDocument();
    expect(screen.getAllByText('High Impact')[0]).toBeInTheDocument();
  });

  it('renders deterministic recommendation explanation matching preference', () => {
    render(<DailyChoiceLab profile={mockProfile} />);

    // Explanation should contain recommended option and preference-specific text
    expect(
      screen.getByText(/We recommend "Take the Metro" because it is rated as a low-impact choice/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/saving costs/i)).toBeInTheDocument(); // Because preference is 'saveMoney'
  });

  it('does not make /api/coach calls or use localStorage', () => {
    const fetchSpy = vi.spyOn(global, 'fetch');
    const localStorageSpy = vi.spyOn(Storage.prototype, 'getItem');

    render(<DailyChoiceLab profile={mockProfile} />);

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(localStorageSpy).not.toHaveBeenCalled();
  });

  it('does not render unsupported percentage or currency claims', () => {
    render(<DailyChoiceLab profile={mockProfile} />);

    const rootElement = screen.getByText(choiceCopy.title).closest('div');
    expect(rootElement?.textContent).not.toContain('%');
    expect(rootElement?.textContent).not.toContain('₹');
    expect(rootElement?.textContent).not.toContain('$');
  });
});
