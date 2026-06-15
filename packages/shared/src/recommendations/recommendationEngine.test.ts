import { describe, it, expect } from 'vitest';
import { recommendActions } from './recommendationEngine';
import { createWeeklyActionPlan } from './weeklyPlan';
import { FootprintEstimate, FootprintCategory } from '../types/carbon';

function createFootprint(
  topCategory: FootprintCategory | null,
  total = 200,
  categoryTotal = 60,
): FootprintEstimate {
  return {
    monthlyTotalKgCO2e: total,
    categories: topCategory
      ? [
          {
            category: topCategory,
            monthlyKgCO2e: categoryTotal,
            confidence: 'medium',
            factorIds: [],
            assumptionNotes: [],
          },
        ]
      : [],
    topCategory,
    assumptionNotes: [],
    confidence: 'medium',
  };
}

describe('Recommendation Engine', () => {
  it('prioritizes top contributor category', () => {
    const footprint = createFootprint('food');
    const actions = recommendActions({ footprint, preference: 'balanced' });

    // The top action should target food
    expect(actions.length).toBeGreaterThan(0);
    expect(actions[0].category).toBe('food');
  });

  it('supports balanced preference', () => {
    const footprint = createFootprint('transport');
    const actions = recommendActions({ footprint, preference: 'balanced' });
    expect(actions.length).toBeGreaterThan(0);
  });

  it('supports saveMoney preference', () => {
    const footprint = createFootprint('shopping');
    const actions = recommendActions({ footprint, preference: 'saveMoney' });

    // Check that top actions tend to save money
    expect(actions[0].costEffect).toBe('savesMoney');
  });

  it('supports lowEffort preference', () => {
    const footprint = createFootprint('food');
    const actions = recommendActions({ footprint, preference: 'lowEffort' });

    expect(actions[0].effort).toBe('low');
  });

  it('supports highestImpact preference', () => {
    const footprint = createFootprint('flights');
    const actions = recommendActions({ footprint, preference: 'highestImpact' });

    // Flights actions have high impact
    expect(actions.some((a) => a.category === 'flights' && a.impactBand === 'high')).toBe(true);
    // They should be near the top if preference is highestImpact
    const topAction = actions[0];
    expect(topAction.impactBand).toBe('high');
  });

  it('does not return duplicate actions', () => {
    const footprint = createFootprint('food');
    const actions = recommendActions({ footprint, preference: 'balanced' });

    const ids = new Set(actions.map((a) => a.id));
    expect(ids.size).toBe(actions.length); // no duplicates
  });

  it('respects limit', () => {
    const footprint = createFootprint('transport');
    const actions = recommendActions({ footprint, preference: 'balanced', limit: 2 });
    expect(actions.length).toBe(2);
  });

  it('returns deterministic ordering', () => {
    const footprint = createFootprint('homeEnergy');
    const actions1 = recommendActions({ footprint, preference: 'balanced' });
    const actions2 = recommendActions({ footprint, preference: 'balanced' });

    expect(actions1.map((a) => a.id)).toEqual(actions2.map((a) => a.id));
  });

  it('creates weekly plan with default 3 actions', () => {
    const footprint = createFootprint('food');
    const plan = createWeeklyActionPlan({ footprint, preference: 'balanced' });

    expect(plan.actions.length).toBe(3);
    expect(plan.summary).toContain('food');
  });

  it('weekly plan includes assumption notes', () => {
    const footprint = createFootprint('transport');
    const plan = createWeeklyActionPlan({ footprint, preference: 'balanced' });

    expect(plan.assumptionNotes.length).toBeGreaterThan(0);
  });

  it('handles all-zero footprint gracefully', () => {
    const footprint = createFootprint(null, 0, 0);
    const plan = createWeeklyActionPlan({ footprint, preference: 'balanced' });

    expect(plan.actions.length).toBe(3);
    expect(plan.summary).toContain('low-effort actions');
  });
});
