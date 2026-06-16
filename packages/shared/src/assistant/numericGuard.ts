import type { NumericGuardInput, NumericGuardResult } from './coachTypes';

export function normalizeNumberToken(token: string): string {
  let cleaned = token.trim();
  // Remove commas
  cleaned = cleaned.replace(/,/g, '');
  // Remove trailing % or x/X
  if (cleaned.endsWith('%')) {
    cleaned = cleaned.slice(0, -1);
  } else if (cleaned.toLowerCase().endsWith('x')) {
    cleaned = cleaned.slice(0, -1);
  }

  const parsed = Number(cleaned);
  if (!isNaN(parsed)) {
    return parsed.toString();
  }
  return token;
}

export function extractNumberTokens(text: string): string[] {
  // Matches optional negative sign, digits with optional commas and decimals, and optional suffix % or x/X
  const regex = /-?\b\d[\d,]*\.?\d*(?:%|[xX])?(?!\w)/g;
  const matches = text.match(regex) || [];
  return matches.map(normalizeNumberToken);
}

export function validateGeneratedNumbers(input: NumericGuardInput): NumericGuardResult {
  const { allowedNumbers, responseTextFields } = input;
  const normalizedAllowed = new Set(allowedNumbers.map(normalizeNumberToken));

  const generatedNumbersSet = new Set<string>();
  responseTextFields.forEach((field: string) => {
    extractNumberTokens(field).forEach((num) => {
      generatedNumbersSet.add(num);
    });
  });

  const generatedNumbers = Array.from(generatedNumbersSet);
  const unsupportedNumbers: string[] = [];

  generatedNumbers.forEach((num) => {
    if (!normalizedAllowed.has(num)) {
      unsupportedNumbers.push(num);
    }
  });

  return {
    isValid: unsupportedNumbers.length === 0,
    unsupportedNumbers,
    generatedNumbers,
    allowedNumbers,
  };
}
