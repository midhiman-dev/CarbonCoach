import { describe, it, expect } from 'vitest';
import { buildCoachPrompt } from '../src/coach/promptBuilder';
import { FootprintCoachRequest, ChoiceCoachRequest } from '@carboncoach/shared';

describe('promptBuilder', () => {
  it('should build a valid footprint coach prompt with constraints', () => {
    const request: FootprintCoachRequest = {
      mode: 'footprint_coach',
      tone: 'encouraging',
      allowedNumbers: ['250', '80', '15', '2.5'],
      context: {
        monthlyTotalKgCO2e: 250,
        topCategory: 'Transport',
        confidence: 'high',
        categories: [
          { category: 'Transport', monthlyKgCO2e: 150, confidence: 'high' },
          { category: 'Food', monthlyKgCO2e: 100, confidence: 'medium' },
        ],
        recommendedActions: [
          {
            id: 'action_1',
            title: 'Take the subway',
            category: 'Transport',
            impactBand: 'high',
            effort: 'medium',
            costEffect: 'neutral',
            estimatedMonthlyReductionKgCO2e: 80,
            reason: 'High daily commute carbon footprint.',
          },
        ],
        assumptionNotes: ['Based on average passenger vehicle emissions'],
        preference: ' Balanced',
      },
    };

    const prompt = buildCoachPrompt(request);
    expect(prompt).toContain('footprint_coach');
    expect(prompt).toContain('Transport');
    expect(prompt).toContain('Take the subway');
    expect(prompt).toContain('250');
    expect(prompt).toContain('Do not invent');
    expect(prompt).toContain('valid JSON');
  });

  it('should build a valid choice coach prompt with constraints', () => {
    const request: ChoiceCoachRequest = {
      mode: 'choice_coach',
      tone: 'simple',
      allowedNumbers: [],
      context: {
        scenarioId: 'lunch_choice',
        scenarioTitle: 'Lunch Options',
        options: [
          {
            id: 'opt_1',
            label: 'Vegetarian Thali',
            impactBand: 'low',
            reasons: ['No meat products.'],
          },
          {
            id: 'opt_2',
            label: 'Mutton Biryani Meal',
            impactBand: 'high',
            reasons: ['Higher ruminant footprint.'],
          },
        ],
        recommendedOptionId: 'opt_1',
        preference: 'Balanced',
        assumptionNotes: ['Values calculated using generic regional averages.'],
      },
    };

    const prompt = buildCoachPrompt(request);
    expect(prompt).toContain('choice_coach');
    expect(prompt).toContain('Lunch Options');
    expect(prompt).toContain('Vegetarian Thali');
    expect(prompt).toContain('opt_1');
    expect(prompt).toContain('Do not shame, blame, or guilt');
    expect(prompt).toContain('valid JSON');
  });
});
