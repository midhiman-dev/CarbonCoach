import { describe, it, expect } from 'vitest';
import {
  normalizeNumberToken,
  extractNumberTokens,
  validateGeneratedNumbers,
} from './numericGuard';

describe('NumericGuard', () => {
  describe('normalizeNumberToken', () => {
    it('normalizes whole numbers, decimals, comma separators, percentages, and multipliers', () => {
      expect(normalizeNumberToken('12')).toBe('12');
      expect(normalizeNumberToken('12.0')).toBe('12');
      expect(normalizeNumberToken('1,200')).toBe('1200');
      expect(normalizeNumberToken('12%')).toBe('12');
      expect(normalizeNumberToken('3x')).toBe('3');
      expect(normalizeNumberToken('3X')).toBe('3');
      expect(normalizeNumberToken('-4')).toBe('-4');
      expect(normalizeNumberToken('abc')).toBe('abc');
    });
  });

  describe('extractNumberTokens', () => {
    it('extracts and normalizes numbers from free-text strings', () => {
      const text =
        'Your footprint has decreased by -4% from 1,200.0 kg CO2e, representing a 3x change or a 12% improvement.';
      const tokens = extractNumberTokens(text);
      expect(tokens).toContain('-4');
      expect(tokens).toContain('1200');
      expect(tokens).toContain('3');
      expect(tokens).toContain('12');
    });
  });

  describe('validateGeneratedNumbers', () => {
    it('passes when allowed whole numbers are present', () => {
      const result = validateGeneratedNumbers({
        allowedNumbers: ['12', '100'],
        responseTextFields: ['The value is 12 and another is 100.'],
      });
      expect(result.isValid).toBe(true);
      expect(result.unsupportedNumbers).toHaveLength(0);
    });

    it('passes when allowed decimals are present with normalization matching', () => {
      const result = validateGeneratedNumbers({
        allowedNumbers: ['12'],
        responseTextFields: ['The value is 12.0.'],
      });
      expect(result.isValid).toBe(true);
    });

    it('passes when comma-separated numbers are normalizable to allowed ones', () => {
      const result = validateGeneratedNumbers({
        allowedNumbers: ['1200'],
        responseTextFields: ['The footprint is 1,200.'],
      });
      expect(result.isValid).toBe(true);
    });

    it('passes when percentage values are normalizable to allowed ones', () => {
      const result = validateGeneratedNumbers({
        allowedNumbers: ['12'],
        responseTextFields: ['There is a 12% reduction.'],
      });
      expect(result.isValid).toBe(true);
    });

    it('passes when multiplier values are normalizable to allowed ones', () => {
      const result = validateGeneratedNumbers({
        allowedNumbers: ['3'],
        responseTextFields: ['We noticed a 3x difference.'],
      });
      expect(result.isValid).toBe(true);
    });

    it('fails when unsupported whole number is generated', () => {
      const result = validateGeneratedNumbers({
        allowedNumbers: ['12'],
        responseTextFields: ['The value is 15.'],
      });
      expect(result.isValid).toBe(false);
      expect(result.unsupportedNumbers).toContain('15');
    });

    it('fails when unsupported percentage is generated', () => {
      const result = validateGeneratedNumbers({
        allowedNumbers: ['12'],
        responseTextFields: ['The value is 15%.'],
      });
      expect(result.isValid).toBe(false);
      expect(result.unsupportedNumbers).toContain('15');
    });

    it('fails when unsupported multiplier is generated', () => {
      const result = validateGeneratedNumbers({
        allowedNumbers: ['3'],
        responseTextFields: ['The multiplier is 4x.'],
      });
      expect(result.isValid).toBe(false);
      expect(result.unsupportedNumbers).toContain('4');
    });

    it('passes when no-number response is provided', () => {
      const result = validateGeneratedNumbers({
        allowedNumbers: ['12'],
        responseTextFields: ['No numbers in here.'],
      });
      expect(result.isValid).toBe(true);
      expect(result.unsupportedNumbers).toHaveLength(0);
    });

    it('fails on mixed allowed and unsupported numbers', () => {
      const result = validateGeneratedNumbers({
        allowedNumbers: ['12', '100'],
        responseTextFields: ['The values are 12, 100, and 99.'],
      });
      expect(result.isValid).toBe(false);
      expect(result.unsupportedNumbers).toContain('99');
      expect(result.unsupportedNumbers).not.toContain('12');
    });

    it('fails when empty allowedNumbers is given with a generated number', () => {
      const result = validateGeneratedNumbers({
        allowedNumbers: [],
        responseTextFields: ['We found 10.'],
      });
      expect(result.isValid).toBe(false);
      expect(result.unsupportedNumbers).toContain('10');
    });
  });
});
