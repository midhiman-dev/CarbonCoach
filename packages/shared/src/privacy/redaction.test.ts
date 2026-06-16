import { describe, it, expect } from 'vitest';
import { redactSensitiveText, hasPotentialSensitiveText } from './redaction';

describe('Redaction Utilities', () => {
  it('returns empty string unchanged without errors', () => {
    const result = redactSensitiveText('');
    expect(result.text).toBe('');
    expect(result.matches).toHaveLength(0);
    expect(hasPotentialSensitiveText('')).toBe(false);
  });

  it('returns safe text unchanged', () => {
    const safeText = 'This footprint calculation is roughly 250 kg.';
    const result = redactSensitiveText(safeText);
    expect(result.text).toBe(safeText);
    expect(result.matches).toHaveLength(0);
    expect(hasPotentialSensitiveText(safeText)).toBe(false);
  });

  it('redacts email addresses', () => {
    const input = 'Contact me at user@example.com for details.';
    const result = redactSensitiveText(input);
    expect(result.text).toBe('Contact me at [redacted-email] for details.');
    expect(result.matches).toHaveLength(1);
    expect(result.matches[0].kind).toBe('email');
    expect(hasPotentialSensitiveText(input)).toBe(true);
  });

  it('redacts phone numbers while preserving short numeric values', () => {
    const input = 'My footprint is 1234 kg. Call me at 555-123-4567 or +1 (555) 987-6543.';
    const result = redactSensitiveText(input);
    expect(result.text).toBe(
      'My footprint is 1234 kg. Call me at [redacted-phone] or [redacted-phone].',
    );
    expect(result.matches).toHaveLength(2);
    expect(result.matches[0].kind).toBe('phone');
    expect(hasPotentialSensitiveText(input)).toBe(true);
  });

  it('redacts possible addresses', () => {
    const input = 'I live at 123 Main Street in the city.';
    const result = redactSensitiveText(input);
    expect(result.text).toBe('I live at [redacted-address] in the city.');
    expect(result.matches).toHaveLength(1);
    expect(result.matches[0].kind).toBe('possibleAddress');
  });

  it('redacts sensitive tokens', () => {
    const input =
      'My token is Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.';
    const result = redactSensitiveText(input);
    expect(result.text).toContain('[redacted-sensitive-token]');
    expect(result.matches).toHaveLength(1);
  });
});
