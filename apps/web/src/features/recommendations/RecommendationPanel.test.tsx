import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
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
    expect(screen.getByRole('button', { name: 'Set up your profile' })).toBeInTheDocument();
  });

  it('renders recommendations when profile exists and toggles show all', () => {
    render(<RecommendationPanel profile={mockProfile} onNavigateToProfile={vi.fn()} />);

    // Check description and priority badge
    expect(
      screen.getByText(/Personalized from your profile and selected priority/),
    ).toBeInTheDocument();

    expect(screen.getByText('Priority: Lowest cost')).toBeInTheDocument();

    // Verify initially only showing 3 recommendations
    const toggleBtn = screen.getByRole('button', { name: /Show all deterministic actions/i });
    expect(toggleBtn).toBeInTheDocument();

    // Click toggle button to reveal more
    fireEvent.click(toggleBtn);
    expect(screen.getByRole('button', { name: /Show fewer actions/i })).toBeInTheDocument();
  });

  it('renders weekly plan when profile exists', () => {
    render(<RecommendationPanel profile={mockProfile} onNavigateToProfile={vi.fn()} />);

    expect(screen.getByText('Weekly action plan')).toBeInTheDocument();
    expect(screen.getByText('Weekly Action Checklist')).toBeInTheDocument();
  });

  it('collapses plan assumptions by default and expands on click', () => {
    render(<RecommendationPanel profile={mockProfile} onNavigateToProfile={vi.fn()} />);

    const btn = screen.getByRole('button', { name: /How this plan is selected/i });
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveAttribute('aria-expanded', 'false');
    expect(
      screen.queryByText('Plan uses estimates from your footprint calculation.'),
    ).not.toBeInTheDocument();

    fireEvent.click(btn);
    expect(btn).toHaveAttribute('aria-expanded', 'true');
    expect(
      screen.getByText('Plan uses estimates from your footprint calculation.'),
    ).toBeInTheDocument();
  });

  it('collapses action fit reasons and assumptions by default and toggles independently', () => {
    render(<RecommendationPanel profile={mockProfile} onNavigateToProfile={vi.fn()} />);

    const toggleBtn = screen.getByRole('button', { name: /Show all deterministic actions/i });
    fireEvent.click(toggleBtn);

    const fitBtns = screen.getAllByRole('button', { name: /Why this action\?/i });
    const assumptionBtns = screen.getAllByRole('button', { name: /View assumptions/i });

    expect(fitBtns[0]).toHaveAttribute('aria-expanded', 'false');
    expect(assumptionBtns[0]).toHaveAttribute('aria-expanded', 'false');

    // Click fit reasons
    fireEvent.click(fitBtns[0]);
    expect(fitBtns[0]).toHaveAttribute('aria-expanded', 'true');
    expect(assumptionBtns[0]).toHaveAttribute('aria-expanded', 'false');

    // Click assumptions
    fireEvent.click(assumptionBtns[0]);
    expect(assumptionBtns[0]).toHaveAttribute('aria-expanded', 'true');
  });

  it('renders impact/effort/cost badges as text', () => {
    render(<RecommendationPanel profile={mockProfile} onNavigateToProfile={vi.fn()} />);

    // Expand recommendations
    const toggleBtn = screen.getByRole('button', { name: /Show all deterministic actions/i });
    fireEvent.click(toggleBtn);

    expect(screen.getAllByText('High Impact')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Low Effort')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Cost-friendly')[0]).toBeInTheDocument();
  });

  it('renders deterministic reduction only when present', () => {
    render(<RecommendationPanel profile={mockProfile} onNavigateToProfile={vi.fn()} />);

    // Expand recommendations
    const toggleBtn = screen.getByRole('button', { name: /Show all deterministic actions/i });
    fireEvent.click(toggleBtn);

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
