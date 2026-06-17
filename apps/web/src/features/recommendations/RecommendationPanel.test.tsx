import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RecommendationPanel } from './RecommendationPanel';
import { CarbonProfile } from '@carboncoach/shared';

const mockProfile: CarbonProfile = {
  commuteMode: 'car',
  weeklyCommuteKm: 50,
  dietPattern: 'mixed',
  monthlyHomeEnergyKwh: 150,
  shoppingFrequency: 'medium',
  deliveriesPerWeek: 2,
  flightsPerYear: 1,
  householdSize: 2,
  preference: 'saveMoney',
};

describe('RecommendationPanel Component', () => {
  beforeEach(() => {
    vi.spyOn(global, 'fetch');
    vi.spyOn(Storage.prototype, 'getItem');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders empty state when no profile exists', () => {
    const mockNavigate = vi.fn();
    render(<RecommendationPanel profile={null} onNavigateToProfile={mockNavigate} />);

    expect(screen.getByText('Profile Not Set Up')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Set Up Profile' })).toBeInTheDocument();
  });

  it('renders recommendations when profile exists', () => {
    render(<RecommendationPanel profile={mockProfile} onNavigateToProfile={vi.fn()} />);

    // Check description and priority badge
    expect(screen.getByText(/These actions are selected from CarbonCoach/)).toBeInTheDocument();
    expect(screen.getByText('Priority: Lowest cost')).toBeInTheDocument();

    // Check action catalog item rendering (e.g. from transport or food)
    expect(screen.getAllByText(/Replace two short cab rides/)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Choose one plant-forward meal swap/)[0]).toBeInTheDocument();
  });

  it('renders weekly plan when profile exists', () => {
    render(<RecommendationPanel profile={mockProfile} onNavigateToProfile={vi.fn()} />);

    expect(screen.getByText('Suggested weekly plan')).toBeInTheDocument();
    expect(screen.getByText('Weekly Action Checklist')).toBeInTheDocument();
  });

  it('renders impact/effort/cost badges as text', () => {
    render(<RecommendationPanel profile={mockProfile} onNavigateToProfile={vi.fn()} />);

    expect(screen.getAllByText('High Impact')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Low Effort')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Cost-friendly')[0]).toBeInTheDocument();
  });

  it('renders deterministic reduction only when present', () => {
    render(<RecommendationPanel profile={mockProfile} onNavigateToProfile={vi.fn()} />);

    // present on transport.replace_short_car_trips
    expect(screen.getByText('Estimated reduction: 12 kg CO2e / month')).toBeInTheDocument();

    // not present on food.plant_forward_meal_swap (has no estimatedMonthlyReductionKgCO2e in catalog)
    expect(screen.queryByText(/Estimated reduction:.*meal swap/)).not.toBeInTheDocument();
  });

  it('renders FootprintCoachPanel and does not call /api/coach on initial load', () => {
    render(<RecommendationPanel profile={mockProfile} onNavigateToProfile={vi.fn()} />);

    // Renders the coach panel controls
    expect(screen.getByText('Footprint Coach')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Ask Footprint Coach' })).toBeInTheDocument();
    expect(screen.getByLabelText('Select Tone')).toBeInTheDocument();

    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('does not use localStorage', () => {
    render(<RecommendationPanel profile={mockProfile} onNavigateToProfile={vi.fn()} />);

    expect(Storage.prototype.getItem).not.toHaveBeenCalled();
  });
});
