import { describe, it, expect } from 'vitest';
import { createFallbackCoachResponse } from './fallbackCoach';
import type { CoachRequest } from './coachTypes';

describe('createFallbackCoachResponse', () => {
  it('creates footprint fallback response with correct defaults and fields', () => {
    const request: CoachRequest = {
      mode: 'footprint_coach',
      tone: 'simple',
      allowedNumbers: ['240', '100', '80', '60'],
      context: {
        monthlyTotalKgCO2e: 240,
        topCategory: 'transport',
        confidence: 'high',
        categories: [
          { category: 'transport', monthlyKgCO2e: 100, confidence: 'high' },
          { category: 'homeEnergy', monthlyKgCO2e: 80, confidence: 'medium' },
          { category: 'food', monthlyKgCO2e: 60, confidence: 'high' },
        ],
        recommendedActions: [
          {
            id: 'commute_walk',
            title: 'Walk or cycle for short commute trips',
            category: 'transport',
            impactBand: 'medium',
            effort: 'low',
            costEffect: 'savesMoney',
            estimatedMonthlyReductionKgCO2e: 15,
            reason: 'Reduces direct fuel consumption and emissions.',
          },
        ],
        assumptionNotes: ['Based on national average vehicle grid factors.'],
        preference: 'balanced',
      },
    };

    const response = createFallbackCoachResponse(request);

    expect(response.mode).toBe('footprint_coach');
    expect(response.source).toBe('fallback');
    expect(response.summary).toContain('240');
    expect(response.explanation).toContain('transport');
    expect(response.recommendedNextStep).toContain('Walk or cycle');
    expect(response.weeklyPlan).toHaveLength(1);
    expect(response.weeklyPlan[0]).toContain('Walk or cycle');
    expect(response.confidenceNote).toContain('high');
    expect(response.disclaimer).toBeDefined();
    expect(response.numbersUsed).toContain('240');
    expect(response.numbersUsed).toContain('100');
    expect(response.numbersUsed).toContain('15');
  });

  it('creates choice fallback response correctly', () => {
    const request: CoachRequest = {
      mode: 'choice_coach',
      tone: 'simple',
      allowedNumbers: [],
      context: {
        scenarioId: 'lunch_choice',
        scenarioTitle: 'Vegetarian Lunch vs Meat lunch',
        options: [
          {
            id: 'veg',
            label: 'Vegetarian Meal',
            impactBand: 'low',
            reasons: ['Lower agricultural emissions'],
          },
          {
            id: 'meat',
            label: 'Meat-heavy Meal',
            impactBand: 'high',
            reasons: ['High enteric fermentation'],
          },
        ],
        recommendedOptionId: 'veg',
        preference: 'balanced',
        assumptionNotes: [],
      },
    };

    const response = createFallbackCoachResponse(request);

    expect(response.mode).toBe('choice_coach');
    expect(response.source).toBe('fallback');
    expect(response.summary).toContain('Vegetarian Meal');
    expect(response.explanation).toContain('lower carbon impact');
    expect(response.recommendedNextStep).toContain('Vegetarian Meal');
    expect(response.numbersUsed).toHaveLength(0);
  });

  it('handles tone settings correctly (simple, detailed, encouraging)', () => {
    const requestBase: CoachRequest = {
      mode: 'footprint_coach',
      allowedNumbers: ['100'],
      context: {
        monthlyTotalKgCO2e: 100,
        topCategory: 'food',
        confidence: 'medium',
        categories: [{ category: 'food', monthlyKgCO2e: 100, confidence: 'medium' }],
        recommendedActions: [],
        assumptionNotes: [],
        preference: 'balanced',
      },
    };

    const responseSimple = createFallbackCoachResponse({ ...requestBase, tone: 'simple' });
    const responseEncouraging = createFallbackCoachResponse({
      ...requestBase,
      tone: 'encouraging',
    });
    const responseDetailed = createFallbackCoachResponse({ ...requestBase, tone: 'detailed' });

    expect(responseSimple.summary).toContain('100');
    expect(responseEncouraging.summary).toContain('Great job');
    expect(responseDetailed.explanation).toContain('breakdown');
  });

  it('handles empty recommended actions and no top category gracefully', () => {
    const request: CoachRequest = {
      mode: 'footprint_coach',
      allowedNumbers: ['0'],
      context: {
        monthlyTotalKgCO2e: 0,
        topCategory: null,
        confidence: 'low',
        categories: [],
        recommendedActions: [],
        assumptionNotes: [],
        preference: 'balanced',
      },
    };

    const response = createFallbackCoachResponse(request);

    expect(response.mode).toBe('footprint_coach');
    expect(response.explanation).toContain('your daily activities');
    expect(response.recommendedNextStep).toBeDefined();
    expect(response.weeklyPlan.length).toBeGreaterThan(0);
  });
});
