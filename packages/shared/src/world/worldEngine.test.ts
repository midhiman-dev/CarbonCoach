import { describe, it, expect } from 'vitest';
import { getCarbonWorldStage, createCarbonWorldState } from './worldEngine';

describe('worldEngine', () => {
  describe('getCarbonWorldStage', () => {
    it('should map 0% to seed', () => {
      expect(getCarbonWorldStage(0)).toBe('seed');
    });

    it('should map low progress to sprout', () => {
      expect(getCarbonWorldStage(1)).toBe('sprout');
      expect(getCarbonWorldStage(20)).toBe('sprout');
      expect(getCarbonWorldStage(33)).toBe('sprout');
    });

    it('should map mid progress to garden', () => {
      expect(getCarbonWorldStage(34)).toBe('garden');
      expect(getCarbonWorldStage(50)).toBe('garden');
      expect(getCarbonWorldStage(66)).toBe('garden');
    });

    it('should map high/full progress to grove', () => {
      expect(getCarbonWorldStage(67)).toBe('grove');
      expect(getCarbonWorldStage(90)).toBe('grove');
      expect(getCarbonWorldStage(100)).toBe('grove');
    });

    it('should clamp negative progress to seed', () => {
      expect(getCarbonWorldStage(-10)).toBe('seed');
    });

    it('should clamp above 100 to grove', () => {
      expect(getCarbonWorldStage(150)).toBe('grove');
    });
  });

  describe('createCarbonWorldState', () => {
    it('should handle totalActions = 0 safely', () => {
      const state = createCarbonWorldState({ completedActions: 5, totalActions: 0 });
      expect(state.stage).toBe('seed');
      expect(state.progressPercent).toBe(0);
      expect(state.completedActions).toBe(0);
      expect(state.totalActions).toBe(0);
    });

    it('should calculate progress correctly and clamp completed actions', () => {
      const state = createCarbonWorldState({ completedActions: 2, totalActions: 5 });
      expect(state.progressPercent).toBe(40);
      expect(state.stage).toBe('garden');
      expect(state.completedActions).toBe(2);
      expect(state.totalActions).toBe(5);
    });

    it('should clamp negative completed actions safely', () => {
      const state = createCarbonWorldState({ completedActions: -2, totalActions: 5 });
      expect(state.progressPercent).toBe(0);
      expect(state.stage).toBe('seed');
    });

    it('should clamp completed actions greater than total actions safely', () => {
      const state = createCarbonWorldState({ completedActions: 10, totalActions: 5 });
      expect(state.progressPercent).toBe(100);
      expect(state.stage).toBe('grove');
    });

    it('should not mutate the input object', () => {
      const input = { completedActions: 3, totalActions: 5 };
      const inputCopy = { ...input };
      createCarbonWorldState(input);
      expect(input).toEqual(inputCopy);
    });
  });
});
