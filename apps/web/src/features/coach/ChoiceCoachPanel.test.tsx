import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChoiceCoachPanel } from './ChoiceCoachPanel';
import { ChoiceScenario, CoachResponse } from '@carboncoach/shared';

describe('ChoiceCoachPanel Component', () => {
  const mockScenario: ChoiceScenario = {
    id: 'cab-vs-metro',
    title: 'Cab vs Metro Commute',
    category: 'transport',
    description: 'Deciding between taking a private cab or riding the metro train.',
    assumptionNote: 'Assumes 15km single trip.',
    recommendedOptionId: 'metro',
    options: [
      {
        id: 'cab',
        label: 'Cab',
        description: 'Single passenger ride',
        impactBand: 'high',
        reasons: ['High emissions'],
        estimatedKgCO2e: 4.5,
      },
      {
        id: 'metro',
        label: 'Metro',
        description: 'Electric transit',
        impactBand: 'low',
        reasons: ['Efficient sharing'],
        estimatedKgCO2e: 0.3,
      },
    ],
  };

  const alternativeScenario: ChoiceScenario = {
    id: 'repair-vs-replace',
    title: 'Repair vs Replace Laptop',
    category: 'shopping',
    description: 'Deciding whether to repair a broken screen or buy a brand new laptop.',
    assumptionNote: 'Assumes repair saves manufacturing impact.',
    recommendedOptionId: 'repair',
    options: [
      {
        id: 'repair',
        label: 'Repair Screen',
        description: 'Fix the current model',
        impactBand: 'low',
        reasons: ['Extends lifecycle'],
      },
    ],
  };

  const mockResponse: CoachResponse = {
    mode: 'choice_coach',
    summary: 'Here is your choice analysis.',
    explanation: 'Taking the metro is far more efficient than a private cab.',
    recommendedNextStep: 'Choose the Metro option when commuting.',
    weeklyPlan: ['Check your commute alternatives', 'Use public transit'],
    numbersUsed: ['4.5', '0.3'],
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

  it('renders correctly', () => {
    render(<ChoiceCoachPanel scenario={mockScenario} />);
    expect(screen.getByText('Choice Coach')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Ask CarbonCoach to explain this deterministic choice comparison in plain language.',
      ),
    ).toBeInTheDocument();
  });

  it('does not call /api/coach on initial render and has no fake content', () => {
    render(<ChoiceCoachPanel scenario={mockScenario} />);
    expect(screen.queryByText('Here is your choice analysis.')).not.toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });

  it('clicking button calls /api/coach, shows loading, and renders success response', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    render(<ChoiceCoachPanel scenario={mockScenario} preference="balanced" />);

    const button = screen.getByRole('button', { name: 'Ask Choice Coach' });
    fireEvent.click(button);

    expect(screen.getByText('Preparing a safe choice explanation...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Here is your choice analysis.')).toBeInTheDocument();
    });

    expect(
      screen.getByText('Taking the metro is far more efficient than a private cab.'),
    ).toBeInTheDocument();
    expect(screen.getByText('AI Response')).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('renders fallback source badge when source is fallback', async () => {
    const fallbackResponse = { ...mockResponse, source: 'fallback' as const };
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => fallbackResponse,
    } as Response);

    render(<ChoiceCoachPanel scenario={mockScenario} />);

    fireEvent.click(screen.getByRole('button', { name: 'Ask Choice Coach' }));

    await waitFor(() => {
      expect(screen.getByText('Deterministic Fallback')).toBeInTheDocument();
    });
  });

  it('renders error message when fetch fails and allows retry', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 500,
    } as Response);

    render(<ChoiceCoachPanel scenario={mockScenario} />);

    fireEvent.click(screen.getByRole('button', { name: 'Ask Choice Coach' }));

    await waitFor(() => {
      expect(
        screen.getByText('The Choice Coach could not respond right now. Please try again.'),
      ).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: 'Retry Request' })).toBeInTheDocument();
  });

  it('clears response when scenario changes and does not call coach automatically', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const { rerender } = render(<ChoiceCoachPanel scenario={mockScenario} />);

    fireEvent.click(screen.getByRole('button', { name: 'Ask Choice Coach' }));

    await waitFor(() => {
      expect(screen.getByText('Here is your choice analysis.')).toBeInTheDocument();
    });

    // Rerender with alternative scenario
    rerender(<ChoiceCoachPanel scenario={alternativeScenario} />);

    // Response should be cleared
    expect(screen.queryByText('Here is your choice analysis.')).not.toBeInTheDocument();
    // Fetch should not have been called again automatically
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('does not use localStorage or sessionStorage', () => {
    render(<ChoiceCoachPanel scenario={mockScenario} />);
    expect(Storage.prototype.getItem).not.toHaveBeenCalled();
  });
});
