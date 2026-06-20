import type { RedactionMatch, RedactionResult } from '../types/privacy';

// Very basic deterministic regexes. Not a comprehensive PII scanner, just a guard rail.
const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
// Basic phone regex: + followed by digits, spaces, dashes, parens
const phoneRegex = /(?:\+?\d{1,3}[\s-]?)?(?:\(?\d{2,4}\)?[\s-]?)?\d{3,4}[\s-]?\d{3,4}\b/g;
// Basic address approximation: digits followed by some words like "Street", "Ave", etc.
const addressRegex =
  /\b\d{1,5}\s(?:[A-Za-z0-9#]+\s){1,5}(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Lane|Ln|Drive|Dr|Court|Ct|Way|Square|Sq)\b/gi;

export function redactSensitiveText(input: string): RedactionResult {
  if (!input) {
    return { text: input, matches: [] };
  }

  let text = input;
  const matches: RedactionMatch[] = [];

  // Redact Emails
  text = text.replace(emailRegex, (match) => {
    matches.push({ kind: 'email', token: match, replacement: '[redacted-email]' });
    return '[redacted-email]';
  });

  // Redact Phones
  // To avoid matching generic numbers (like footprint values), we enforce some length/structure constraints
  text = text.replace(phoneRegex, (match) => {
    // Only redact if it contains some common phone characters besides just digits, or is long enough.
    // Clean match of digits
    const digitsOnly = match.replace(/\D/g, '');
    if (digitsOnly.length >= 10 && digitsOnly.length <= 15) {
      matches.push({ kind: 'phone', token: match, replacement: '[redacted-phone]' });
      return '[redacted-phone]';
    }
    return match;
  });

  // Redact Addresses
  text = text.replace(addressRegex, (match) => {
    matches.push({ kind: 'possibleAddress', token: match, replacement: '[redacted-address]' });
    return '[redacted-address]';
  });

  // Redact Tokens (simple heuristic for long strings that might be keys)
  // E.g., strings over 30 chars with mix of letters and numbers
  const longTokenRegex = /\b[a-zA-Z0-9_.-]{32,}\b/g;
  text = text.replace(longTokenRegex, (match) => {
    matches.push({
      kind: 'sensitiveToken',
      token: match,
      replacement: '[redacted-sensitive-token]',
    });
    return '[redacted-sensitive-token]';
  });

  return {
    text,
    matches,
  };
}

export function hasPotentialSensitiveText(input: string): boolean {
  if (!input) return false;
  const result = redactSensitiveText(input);
  return result.matches.length > 0;
}
