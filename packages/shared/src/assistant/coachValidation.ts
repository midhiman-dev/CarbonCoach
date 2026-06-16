import type { CoachResponse, CoachMode } from './coachTypes';

export function isCoachMode(value: unknown): value is CoachMode {
  return value === 'footprint_coach' || value === 'choice_coach';
}

export function validateCoachResponse(response: unknown): {
  isValid: boolean;
  errors: string[];
  value?: CoachResponse;
} {
  const errors: string[] = [];

  if (!response || typeof response !== 'object') {
    return { isValid: false, errors: ['Response must be a non-null object.'] };
  }

  const res = response as Record<string, unknown>;

  // Check mode
  if (!isCoachMode(res.mode)) {
    errors.push(`Invalid or missing mode: ${res.mode}`);
  }

  // Check required string fields
  const stringFields = [
    'summary',
    'explanation',
    'recommendedNextStep',
    'confidenceNote',
    'disclaimer',
  ];
  for (const field of stringFields) {
    if (typeof res[field] !== 'string') {
      errors.push(`Field '${field}' must be a string.`);
    } else if (res[field].trim() === '') {
      errors.push(`Field '${field}' cannot be empty.`);
    }
  }

  // Check source
  if (res.source !== 'gemini' && res.source !== 'fallback') {
    errors.push("Field 'source' must be either 'gemini' or 'fallback'.");
  }

  // Check weeklyPlan
  if (!Array.isArray(res.weeklyPlan)) {
    errors.push("Field 'weeklyPlan' must be an array.");
  } else {
    res.weeklyPlan.forEach((item, index) => {
      if (typeof item !== 'string') {
        errors.push(`weeklyPlan[${index}] must be a string.`);
      }
    });
  }

  // Check numbersUsed
  if (!Array.isArray(res.numbersUsed)) {
    errors.push("Field 'numbersUsed' must be an array.");
  } else {
    res.numbersUsed.forEach((item, index) => {
      if (typeof item !== 'string') {
        errors.push(`numbersUsed[${index}] must be a string.`);
      }
    });
  }

  if (errors.length > 0) {
    return { isValid: false, errors };
  }

  return {
    isValid: true,
    errors: [],
    value: response as CoachResponse,
  };
}

export function collectCoachResponseTextFields(response: CoachResponse): string[] {
  const fields = [
    response.summary,
    response.explanation,
    response.recommendedNextStep,
    response.confidenceNote,
    response.disclaimer,
  ];

  if (response.weeklyPlan) {
    fields.push(...response.weeklyPlan);
  }

  return fields;
}
