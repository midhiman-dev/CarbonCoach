import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FootprintSummary } from './FootprintSummary';
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
  preference: 'balanced',
};

describe('FootprintSummary Component', () => {
  it('renders empty state when no profile exists', () => {
    const mockNavigate = vi.fn();
    render(<FootprintSummary profile={null} onNavigateToProfile={mockNavigate} />);

    expect(screen.getByText('Set up your carbon profile first')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Configure Profile' })).toBeInTheDocument();
  });

  it('renders calculated total, top contributor, breakdowns and assumptions when profile exists', () => {
    render(<FootprintSummary profile={mockProfile} />);

    // Check approximate estimate badge
    expect(screen.getByText('Approximate Estimate')).toBeInTheDocument();

    // Check monthly total text
    expect(screen.getByText(/Monthly Total Carbon Footprint/)).toBeInTheDocument();

    // Top contributor
    expect(screen.getByText('Top Contributor Analysis')).toBeInTheDocument();

    // Categories
    expect(screen.getAllByText('Transport')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Food')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Home Energy')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Shopping')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Flights')[0]).toBeInTheDocument();

    // Assumptions
    expect(screen.getByText('Calculated Science Assumptions')).toBeInTheDocument();
  });

  it('does not render AI coach content, call API or use localStorage', () => {
    const fetchSpy = vi.spyOn(global, 'fetch');
    const getStorageSpy = vi.spyOn(Storage.prototype, 'getItem');

    render(<FootprintSummary profile={mockProfile} />);

    // AI Coach UI should not show real responses/actions, only the placeholder
    expect(screen.getByText('AI Coach & Recommendations Coming Soon')).toBeInTheDocument();
    expect(screen.queryByText('Based on your Gemini suggestions')).not.toBeInTheDocument();

    // No network requests should have been made
    expect(fetchSpy).not.toHaveBeenCalled();

    // LocalStorage should not be accessed
    expect(getStorageSpy).not.toHaveBeenCalled();

    fetchSpy.mockRestore();
    getStorageSpy.mockRestore();
  });
});
