import { describe, it, expect } from 'vitest';
import { getChoiceScenarios, getChoiceScenarioById, compareChoiceScenario } from './choiceEngine';

describe('choiceEngine', () => {
  it('returns scenario catalog', () => {
    const scenarios = getChoiceScenarios();
    expect(scenarios.length).toBeGreaterThan(0);
    expect(scenarios[0].id).toBeDefined();
    expect(scenarios[0].options.length).toBeGreaterThan(0);
  });

  it('finds scenario by id', () => {
    const scenario = getChoiceScenarioById('commute-choice');
    expect(scenario).toBeDefined();
    expect(scenario?.id).toBe('commute-choice');
    expect(scenario?.title).toBe('Daily Commute to Office');

    const notFound = getChoiceScenarioById('non-existent');
    expect(notFound).toBeUndefined();
  });

  it('compares valid scenario and returns deterministic recommended option', () => {
    const result = compareChoiceScenario('commute-choice');
    expect(result.scenario.id).toBe('commute-choice');
    expect(result.recommendedOption.id).toBe('metro');
    expect(result.explanation).toContain('metro');
    expect(result.explanation).toContain('low-impact');
  });

  it('handles unknown scenario safely by throwing', () => {
    expect(() => compareChoiceScenario('non-existent')).toThrow();
  });

  it('does not mutate scenario catalog', () => {
    const scenarios1 = getChoiceScenarios();
    const originalLength = scenarios1.length;
    scenarios1.pop();
    const scenarios2 = getChoiceScenarios();
    expect(scenarios2.length).toBe(originalLength);
  });

  it('adapts explanation based on user preference', () => {
    const resultMoney = compareChoiceScenario('commute-choice', 'saveMoney');
    expect(resultMoney.explanation).toContain('saving costs');

    const resultEffort = compareChoiceScenario('commute-choice', 'lowEffort');
    expect(resultEffort.explanation).toContain('minimal shift');
  });
});
