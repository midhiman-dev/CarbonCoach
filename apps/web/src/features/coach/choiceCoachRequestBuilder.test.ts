import { describe, it, expect } from 'vitest';
import { buildChoiceCoachRequest } from './choiceCoachRequestBuilder';
import { ChoiceScenario } from '@carboncoach/shared';

describe('choiceCoachRequestBuilder', () => {
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

  const qualitativeScenario: ChoiceScenario = {
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
      {
        id: 'replace',
        label: 'Replace Laptop',
        description: 'Buy new model',
        impactBand: 'high',
        reasons: ['Embodied manufacturing footprint'],
      },
    ],
  };

  it('builds choice_coach request with correct mode and preserves tone', () => {
    const result = buildChoiceCoachRequest({
      scenario: mockScenario,
      preference: 'balanced',
      tone: 'detailed',
    });

    expect(result.mode).toBe('choice_coach');
    expect(result.tone).toBe('detailed');
  });

  it('includes selected scenario id, title, options, recommendedOptionId, and assumptions', () => {
    const result = buildChoiceCoachRequest({
      scenario: mockScenario,
      preference: 'balanced',
    });

    expect(result.context.scenarioId).toBe('cab-vs-metro');
    expect(result.context.scenarioTitle).toBe('Cab vs Metro Commute');
    expect(result.context.recommendedOptionId).toBe('metro');
    expect(result.context.assumptionNotes).toContain('Assumes 15km single trip.');

    expect(result.context.options).toHaveLength(2);
    expect(result.context.options[0].id).toBe('cab');
    expect(result.context.options[0].label).toBe('Cab');
    expect(result.context.options[0].impactBand).toBe('high');
    expect(result.context.options[0].reasons).toContain('High emissions');
  });

  it('uses empty allowedNumbers for qualitative-only scenario', () => {
    const result = buildChoiceCoachRequest({
      scenario: qualitativeScenario,
      preference: 'balanced',
    });

    expect(result.allowedNumbers).toEqual([]);
  });

  it('includes deterministic scenario numbers when present', () => {
    const result = buildChoiceCoachRequest({
      scenario: mockScenario,
      preference: 'balanced',
    });

    expect(result.allowedNumbers).toContain('4.5');
    expect(result.allowedNumbers).toContain('0.3');
  });

  it('does not include raw CarbonProfile or extra keys in context', () => {
    const result = buildChoiceCoachRequest({
      scenario: mockScenario,
      preference: 'saveMoney',
    });

    const contextKeys = Object.keys(result.context);
    expect(contextKeys).not.toContain('commuteDistance');
    expect(contextKeys).not.toContain('dietPattern');
  });
});
