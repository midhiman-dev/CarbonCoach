import { describe, it, expect } from 'vitest';
import { buildFootprintCoachRequest } from './coachRequestBuilder';
import type { FootprintEstimate, RankedCarbonAction } from '@carboncoach/shared';

describe('coachRequestBuilder', () => {
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
      {
        category: 'food',
        monthlyKgCO2e: 150,
        confidence: 'high',
        factorIds: [],
        assumptionNotes: [],
      },
    ],
    assumptionNotes: ['Based on average vehicle assumptions'],
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
      assumptionNote: 'Based on average commute distance',
      fitReasons: [],
    },
  ];

  it('builds footprint_coach request with minimized context', () => {
    const result = buildFootprintCoachRequest({
      footprint: mockFootprint,
      recommendedActions: mockRecommendations,
      preference: 'balanced',
      tone: 'encouraging',
    });

    expect(result.mode).toBe('footprint_coach');
    expect(result.tone).toBe('encouraging');
    expect(result.context.monthlyTotalKgCO2e).toBe(450);
    expect(result.context.topCategory).toBe('transport');
    expect(result.context.confidence).toBe('medium');
    expect(result.context.categories).toHaveLength(2);
    expect(result.context.categories[0].category).toBe('transport');
    expect(result.context.categories[0].monthlyKgCO2e).toBe(300);
    expect(result.context.recommendedActions).toHaveLength(1);
    expect(result.context.recommendedActions[0].title).toBe('Drive Less');
    expect(result.context.recommendedActions[0].estimatedMonthlyReductionKgCO2e).toBe(80);
    expect(result.context.assumptionNotes).toEqual(['Based on average vehicle assumptions']);
    expect(result.context.preference).toBe('balanced');
  });

  it('includes allowedNumbers from footprint context', () => {
    const result = buildFootprintCoachRequest({
      footprint: mockFootprint,
      recommendedActions: mockRecommendations,
      preference: 'balanced',
    });

    expect(result.allowedNumbers).toContain('450');
    expect(result.allowedNumbers).toContain('300');
    expect(result.allowedNumbers).toContain('150');
    expect(result.allowedNumbers).toContain('80');
    expect(result.tone).toBe('simple'); // Default tone
  });

  it('does not include raw CarbonProfile fields in context', () => {
    const result = buildFootprintCoachRequest({
      footprint: mockFootprint,
      recommendedActions: mockRecommendations,
      preference: 'balanced',
    });

    // Check that we didn't add any arbitrary fields from the raw profile
    const contextKeys = Object.keys(result.context);
    expect(contextKeys).not.toContain('commuteDistance');
    expect(contextKeys).not.toContain('diet');
  });
});
