import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FootprintSummary } from './FootprintSummary';
import type { CarbonProfile } from '@carboncoach/shared';

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

describe('FootprintSummary', () => {
  it('renders empty state when no profile exists', () => {
    const mockNavigate = vi.fn();
    render(<FootprintSummary profile={null} onNavigateToProfile={mockNavigate} />);

    expect(screen.getByText('Profile Not Set Up')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Set up your profile' })).toBeInTheDocument();
  });

  it('renders the deterministic footprint total in the hero card', () => {
    render(<FootprintSummary profile={mockProfile} />);

    // Hero snapshot section is visible
    expect(screen.getByRole('region', { name: 'Footprint snapshot' })).toBeInTheDocument();

    // Numeric total renders (data-testid)
    const totalEl = screen.getByTestId('footprint-total');
    expect(totalEl).toBeInTheDocument();
    expect(totalEl.textContent).toMatch(/\d+ kg CO2e/);
  });

  it('renders the approximate estimate badge', () => {
    render(<FootprintSummary profile={mockProfile} />);
    expect(screen.getByText('Approximate estimate')).toBeInTheDocument();
  });

  it('renders top contributor from deterministic data', () => {
    render(<FootprintSummary profile={mockProfile} />);

    const name = screen.getByTestId('top-contributor-name');
    expect(name).toBeInTheDocument();
    // name must be one of the known categories
    expect(['Food', 'Transport', 'Home Energy', 'Shopping', 'Flights']).toContain(name.textContent);

    const share = screen.getByTestId('top-contributor-share');
    expect(share.textContent).toMatch(/\d+% of your approximate estimate/);
  });

  it('renders all category labels in the visual breakdown', () => {
    render(<FootprintSummary profile={mockProfile} />);

    expect(screen.getAllByText('Transport')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Food')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Home Energy')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Shopping')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Flights')[0]).toBeInTheDocument();
  });

  it('labels category share as "share of estimate"', () => {
    render(<FootprintSummary profile={mockProfile} />);

    // All five categories have a share label
    const shareLabels = screen.getAllByText(/% share of estimate/);
    expect(shareLabels.length).toBeGreaterThanOrEqual(5);
  });

  it('renders the recommendations CTA button', () => {
    const mockNav = vi.fn();
    render(<FootprintSummary profile={mockProfile} onNavigateToRecommendations={mockNav} />);

    const cta = screen.getByRole('button', { name: /actions/i });
    expect(cta).toBeInTheDocument();
    fireEvent.click(cta);
    expect(mockNav).toHaveBeenCalledTimes(1);
  });

  it('collapses the methodology disclosure by default', () => {
    render(<FootprintSummary profile={mockProfile} />);

    const toggle = screen.getByRole('button', { name: /how this estimate works/i });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');

    // The region is rendered but hidden — JSDOM treats the `hidden` attr as a DOM property
    const detail = document.getElementById('methodology-detail');
    expect(detail).not.toBeNull();
    expect((detail as HTMLElement).hidden).toBe(true);
  });

  it('expands the methodology disclosure on click and updates aria-expanded', () => {
    render(<FootprintSummary profile={mockProfile} />);

    const toggle = screen.getByRole('button', { name: /how this estimate works/i });
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');

    const detail = screen.getByRole('region', { name: 'Estimate methodology details' });
    expect(detail).not.toHaveAttribute('hidden');
  });

  it('renders assumptions navigation link when onNavigateToAssumptions is provided', () => {
    const mockAssumptions = vi.fn();
    render(<FootprintSummary profile={mockProfile} onNavigateToAssumptions={mockAssumptions} />);

    // Open the methodology panel first
    fireEvent.click(screen.getByRole('button', { name: /how this estimate works/i }));

    const link = screen.getByRole('button', { name: /view estimates and assumptions/i });
    expect(link).toBeInTheDocument();
    fireEvent.click(link);
    expect(mockAssumptions).toHaveBeenCalledTimes(1);
  });

  it('does not make network requests or access localStorage', () => {
    const fetchSpy = vi.spyOn(global, 'fetch');
    const getStorageSpy = vi.spyOn(Storage.prototype, 'getItem');

    render(<FootprintSummary profile={mockProfile} />);

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(getStorageSpy).not.toHaveBeenCalled();

    fetchSpy.mockRestore();
    getStorageSpy.mockRestore();
  });

  it('renders an accessible breakdown list with sr-only summary text', () => {
    render(<FootprintSummary profile={mockProfile} />);

    const list = screen.getByRole('list', { name: /category breakdown list/i });
    expect(list).toBeInTheDocument();

    // The sr-only paragraph inside the breakdown section contains the accessible summary
    // (distinguish from sr-only spans inside StatusBadge by checking for the breakdown text)
    const srOnlyElements = document.querySelectorAll('.sr-only');
    const breakdownSummary = Array.from(srOnlyElements).find((el) =>
      el.textContent?.includes('Approximate footprint breakdown'),
    );
    expect(breakdownSummary).toBeDefined();
  });
});
