import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { requestFootprintCoach, requestChoiceCoach } from './coachClient';
import { FootprintCoachRequest, ChoiceCoachRequest, CoachResponse } from '@carboncoach/shared';

describe('coachClient', () => {
  const mockFootprintRequest: FootprintCoachRequest = {
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

  const mockChoiceRequest: ChoiceCoachRequest = {
    mode: 'choice_coach',
    tone: 'simple',
    allowedNumbers: ['4.5', '0.3'],
    context: {
      scenarioId: 'cab-vs-metro',
      scenarioTitle: 'Cab vs Metro Commute',
      options: [
        { id: 'cab', label: 'Cab', impactBand: 'high', reasons: ['High emissions'] },
        { id: 'metro', label: 'Metro', impactBand: 'low', reasons: ['Efficient sharing'] },
      ],
      recommendedOptionId: 'metro',
      preference: 'balanced',
      assumptionNotes: ['Assumes 15km single trip.'],
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

  describe('requestFootprintCoach', () => {
    it('posts request with correct headers and JSON body', async () => {
      const fetchMock = vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await requestFootprintCoach(mockFootprintRequest);

      expect(fetchMock).toHaveBeenCalledWith('/api/coach', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockFootprintRequest),
      });
      expect(result).toEqual(mockResponse);
    });

    it('throws a user-friendly error on non-200 responses', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 500,
      } as Response);

      await expect(requestFootprintCoach(mockFootprintRequest)).rejects.toThrow(
        'The coach could not respond right now. Please try again.',
      );
    });

    it('throws a user-friendly error if the response validation fails', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => ({ invalidField: 'yes' }),
      } as Response);

      await expect(requestFootprintCoach(mockFootprintRequest)).rejects.toThrow(
        'The coach could not respond right now. Please try again.',
      );
    });
  });

  describe('requestChoiceCoach', () => {
    const choiceResponse: CoachResponse = {
      ...mockResponse,
      mode: 'choice_coach',
    };

    it('posts request with correct headers and JSON body', async () => {
      const fetchMock = vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => choiceResponse,
      } as Response);

      const result = await requestChoiceCoach(mockChoiceRequest);

      expect(fetchMock).toHaveBeenCalledWith('/api/coach', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockChoiceRequest),
      });
      expect(result).toEqual(choiceResponse);
    });

    it('throws a user-friendly error on non-200 responses', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 500,
      } as Response);

      await expect(requestChoiceCoach(mockChoiceRequest)).rejects.toThrow(
        'The Choice Coach could not respond right now. Please try again.',
      );
    });

    it('throws a user-friendly error if the response validation fails', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => ({ invalidField: 'yes' }),
      } as Response);

      await expect(requestChoiceCoach(mockChoiceRequest)).rejects.toThrow(
        'The Choice Coach could not respond right now. Please try again.',
      );
    });
  });
});
