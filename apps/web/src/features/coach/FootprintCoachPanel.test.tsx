import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FootprintCoachPanel } from './FootprintCoachPanel';
import type { FootprintEstimate, RankedCarbonAction, CoachResponse } from '@carboncoach/shared';

describe('FootprintCoachPanel Component', () => {
  const mockFootprint: FootprintEstimate = {
    monthlyTotalKgCO2e: 450,
    topCategory: 'transport',
    confidence: 'medium',
    categories: [
      {
        category: 'transport',
        monthlyKgCO2e: 300,
        confidence: 'medium',
        factorIds: [],
        assumptionNotes: [],
      },
    ],
    assumptionNotes: [],
  };

  const mockRecommendations: RankedCarbonAction[] = [
    {
      id: 'action-1',
      title: 'Drive Less',
      category: 'transport',
      impactBand: 'high',
      effort: 'medium',
      costEffect: 'savesMoney',
      estimatedMonthlyReductionKgCO2e: 80,
      reason: 'Reduces commute footprint',
      score: 10,
      assumptionNote: '',
      fitReasons: [],
    },
  ];

  const mockResponse: CoachResponse = {
    mode: 'footprint_coach',
    summary: 'Here is your footprint analysis.',
    explanation: 'Your largest contributor is transport at 300 kg CO2e.',
    recommendedNextStep: 'Start driving less to save 80 kg.',
    weeklyPlan: ['Check your commute alternatives', 'Use public transport'],
    numbersUsed: ['450', '300', '80'],
    confidenceNote: 'High confidence based on typical models.',
    disclaimer: 'Estimates are approximate.',
    source: 'gemini',
  };

  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
    vi.spyOn(Storage.prototype, 'getItem');
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('renders message when footprint is null', () => {
    render(<FootprintCoachPanel footprint={null} recommendedActions={[]} />);
    expect(screen.getByText(/Please configure your lifestyle profile first/)).toBeInTheDocument();
  });

  it('does not call /api/coach on initial render and has no fake content', () => {
    render(
      <FootprintCoachPanel footprint={mockFootprint} recommendedActions={mockRecommendations} />,
    );

    expect(screen.getByText('Footprint Coach')).toBeInTheDocument();
    expect(screen.queryByText('Here is your footprint analysis.')).not.toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });

  it('clicking button calls /api/coach, shows loading, and renders success response', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    render(
      <FootprintCoachPanel
        footprint={mockFootprint}
        recommendedActions={mockRecommendations}
        preference="balanced"
      />,
    );

    const button = screen.getByRole('button', { name: 'Ask Footprint Coach' });
    fireEvent.click(button);

    // Check loading text is visible/announced
    expect(screen.getByText('Preparing a safe explanation...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Here is your footprint analysis.')).toBeInTheDocument();
    });

    expect(
      screen.getByText('Your largest contributor is transport at 300 kg CO2e.'),
    ).toBeInTheDocument();
    expect(screen.getByText('Start driving less to save 80 kg.')).toBeInTheDocument();
    expect(screen.getByText('Check your commute alternatives')).toBeInTheDocument();
    expect(screen.getByText('AI Response')).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('renders fallback source badge when source is fallback', async () => {
    const fallbackResponse = { ...mockResponse, source: 'fallback' as const };
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => fallbackResponse,
    } as Response);

    render(
      <FootprintCoachPanel footprint={mockFootprint} recommendedActions={mockRecommendations} />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Ask Footprint Coach' }));

    await waitFor(() => {
      expect(screen.getByText('Deterministic Fallback')).toBeInTheDocument();
    });
  });

  it('renders error message when fetch fails', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 500,
    } as Response);

    render(
      <FootprintCoachPanel footprint={mockFootprint} recommendedActions={mockRecommendations} />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Ask Footprint Coach' }));

    await waitFor(() => {
      expect(
        screen.getByText('The coach could not respond right now. Please try again.'),
      ).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: 'Retry Request' })).toBeInTheDocument();
  });

  it('does not use localStorage', () => {
    render(
      <FootprintCoachPanel footprint={mockFootprint} recommendedActions={mockRecommendations} />,
    );

    expect(Storage.prototype.getItem).not.toHaveBeenCalled();
  });
});
