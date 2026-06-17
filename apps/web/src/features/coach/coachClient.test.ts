import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { requestFootprintCoach } from './coachClient';
import { FootprintCoachRequest, CoachResponse } from '@carboncoach/shared';

describe('coachClient', () => {
  const mockRequest: FootprintCoachRequest = {
    mode: 'footprint_coach',
    tone: 'simple',
    allowedNumbers: ['450', '300'],
    context: {
      monthlyTotalKgCO2e: 450,
      topCategory: 'transport',
      confidence: 'medium',
      categories: [{ category: 'transport', monthlyKgCO2e: 300, confidence: 'medium' }],
      recommendedActions: [],
      assumptionNotes: [],
      preference: 'balanced',
    },
  };

  const mockResponse: CoachResponse = {
    mode: 'footprint_coach',
    summary: 'Mock summary',
    explanation: 'Mock explanation',
    recommendedNextStep: 'Mock next step',
    weeklyPlan: ['Mock weekly plan step'],
    numbersUsed: ['450'],
    confidenceNote: 'Mock confidence note',
    disclaimer: 'Mock disclaimer',
    source: 'gemini',
  };

  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('posts request with correct headers and JSON body', async () => {
    const fetchMock = vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const result = await requestFootprintCoach(mockRequest);

    expect(fetchMock).toHaveBeenCalledWith('/api/coach', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mockRequest),
    });
    expect(result).toEqual(mockResponse);
  });

  it('throws a user-friendly error on non-200 responses', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 500,
    } as Response);

    await expect(requestFootprintCoach(mockRequest)).rejects.toThrow(
      'The coach could not respond right now. Please try again.',
    );
  });

  it('throws a user-friendly error if the response validation fails', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ invalidField: 'yes' }),
    } as Response);

    await expect(requestFootprintCoach(mockRequest)).rejects.toThrow(
      'The coach could not respond right now. Please try again.',
    );
  });
});
