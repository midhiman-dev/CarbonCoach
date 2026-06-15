import { describe, it, expect } from 'vitest';
import { carbonCoachProductName } from '../src/index';

describe('Shared Package', () => {
  it('exports correct product name', () => {
    expect(carbonCoachProductName).toBe('CarbonCoach');
  });
});
