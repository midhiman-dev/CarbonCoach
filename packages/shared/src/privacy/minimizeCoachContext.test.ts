import { describe, it, expect } from 'vitest';
import { summarizeFootprintContextForCoach } from './minimizeCoachContext';
import { FootprintEstimate, UserPreference } from '../types/carbon';
import { RankedCarbonAction } from '../types/actions';

describe('minimizeCoachContext', () => {
  const mockFootprint: FootprintEstimate = {
    monthlyTotalKgCO2e: 450,
    topCategory: 'transport',
    confidence: 'medium',
    assumptionNotes: ['Assumed standard diet'],
    categories: [
      {
        category: 'transport',
        monthlyKgCO2e: 200,
        confidence: 'medium',
        factorIds: [],
        assumptionNotes: []
      },
      {
        category: 'food',
        monthlyKgCO2e: 250,
        confidence: 'medium',
        factorIds: [],
        assumptionNotes: []
      }
    ]
  };

  const mockActions: RankedCarbonAction[] = [
    {
      id: 'a1',
      title: 'Take the bus',
      category: 'transport',
      impactBand: 'high',
      effort: 'medium',
      costEffect: 'savesMoney',
      reason: 'Reduces commute footprint',
      assumptionNote: '',
      score: 10,
      fitReasons: [],
      estimatedMonthlyReductionKgCO2e: 50
    }
  ];

  it('minimizes footprint context correctly', () => {
    const preference: UserPreference = 'balanced';
    const result = summarizeFootprintContextForCoach({
      footprint: mockFootprint,
      recommendedActions: mockActions,
      preference
    });

    expect(result.summary.monthlyTotalKgCO2e).toBe(450);
    expect(result.summary.categoryTotals).toEqual({ transport: 200, food: 250 });
    expect(result.summary.topCategory).toBe('transport');
    expect(result.summary.recommendedActionTitles).toContain('Take the bus');
    
    expect(result.allowedNumbers).toContain('450');
    expect(result.allowedNumbers).toContain('200');
    expect(result.allowedNumbers).toContain('250');
    expect(result.allowedNumbers).toContain('50');

    // Make sure allowed numbers are unique strings
    const uniqueAllowed = Array.from(new Set(result.allowedNumbers));
    expect(result.allowedNumbers).toHaveLength(uniqueAllowed.length);

    expect(result.privacy.includedFields).toContain('monthlyTotalKgCO2e');
    expect(result.privacy.excludedFields).toContain('raw CarbonProfile');
  });
});
