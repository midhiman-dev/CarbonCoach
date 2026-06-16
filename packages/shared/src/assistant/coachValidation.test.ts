import { describe, it, expect } from 'vitest';
import {
  validateCoachResponse,
  collectCoachResponseTextFields,
  isCoachMode,
} from './coachValidation';
import type { CoachResponse } from './coachTypes';

describe('CoachValidation', () => {
  const validResponse: CoachResponse = {
    mode: 'footprint_coach',
    summary: 'Friendly summary.',
    explanation: 'Detailed explanation.',
    recommendedNextStep: 'Take public transit.',
    weeklyPlan: ['Avoid driving this week', 'Turn off unused lights'],
    numbersUsed: ['120', '50'],
    confidenceNote: 'Medium confidence.',
    disclaimer: 'Estimates are approximate.',
    source: 'gemini',
  };

  describe('isCoachMode', () => {
    it('verifies coach modes correctly', () => {
      expect(isCoachMode('footprint_coach')).toBe(true);
      expect(isCoachMode('choice_coach')).toBe(true);
      expect(isCoachMode('other_coach')).toBe(false);
      expect(isCoachMode(null)).toBe(false);
    });
  });

  describe('validateCoachResponse', () => {
    it('passes for a fully valid coach response', () => {
      const result = validateCoachResponse(validResponse);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.value).toEqual(validResponse);
    });

    it('fails when response is not an object or null', () => {
      expect(validateCoachResponse(null).isValid).toBe(false);
      expect(validateCoachResponse('string').isValid).toBe(false);
    });

    it('fails when required fields are missing or empty', () => {
      const invalid = { ...validResponse, summary: '   ' };
      const result = validateCoachResponse(invalid);
      expect(result.isValid).toBe(false);
      expect(result.errors.some((err) => err.includes('summary'))).toBe(true);
    });

    it('fails when mode is invalid', () => {
      const invalid = { ...validResponse, mode: 'invalid_mode' };
      const result = validateCoachResponse(invalid);
      expect(result.isValid).toBe(false);
      expect(result.errors.some((err) => err.includes('mode'))).toBe(true);
    });

    it('fails when source is invalid', () => {
      const invalid = { ...validResponse, source: 'unsupported' };
      const result = validateCoachResponse(invalid);
      expect(result.isValid).toBe(false);
      expect(result.errors.some((err) => err.includes('source'))).toBe(true);
    });

    it('fails when weeklyPlan is not an array or contains non-string values', () => {
      const invalid1 = { ...validResponse, weeklyPlan: 'not-an-array' };
      const invalid2 = { ...validResponse, weeklyPlan: [123, 'valid-string'] };

      expect(validateCoachResponse(invalid1).isValid).toBe(false);
      expect(validateCoachResponse(invalid2).isValid).toBe(false);
    });

    it('fails when numbersUsed is not an array or contains non-string values', () => {
      const invalid1 = { ...validResponse, numbersUsed: 'not-an-array' };
      const invalid2 = { ...validResponse, numbersUsed: [123, 'valid-string'] };

      expect(validateCoachResponse(invalid1).isValid).toBe(false);
      expect(validateCoachResponse(invalid2).isValid).toBe(false);
    });
  });

  describe('collectCoachResponseTextFields', () => {
    it('collects all user-facing text fields', () => {
      const fields = collectCoachResponseTextFields(validResponse);
      expect(fields).toContain(validResponse.summary);
      expect(fields).toContain(validResponse.explanation);
      expect(fields).toContain(validResponse.recommendedNextStep);
      expect(fields).toContain(validResponse.confidenceNote);
      expect(fields).toContain(validResponse.disclaimer);
      expect(fields).toContain(validResponse.weeklyPlan[0]);
      expect(fields).toContain(validResponse.weeklyPlan[1]);
      // numbersUsed should NOT be included in user-facing texts
      expect(fields).not.toContain(validResponse.numbersUsed[0]);
    });
  });
});
