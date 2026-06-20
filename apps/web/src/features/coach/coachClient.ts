import type {
  CoachResponse,
  FootprintCoachRequest,
  ChoiceCoachRequest} from '@carboncoach/shared';
import {
  validateCoachResponse,
} from '@carboncoach/shared';

/**
 * Sends a FootprintCoachRequest to /api/coach and returns a validated CoachResponse.
 * Throws a user-friendly error if the request fails or response schema is invalid.
 */
export async function requestFootprintCoach(
  request: FootprintCoachRequest,
): Promise<CoachResponse> {
  const response = await fetch('/api/coach', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    let errMsg = 'The coach could not respond right now. Please try again.';
    try {
      const errorData = await response.json();
      if (errorData?.error?.message) {
        errMsg = errorData.error.message;
      }
    } catch {
      // ignore JSON parse error, use default
    }
    throw new Error(errMsg);
  }

  const data = await response.json();

  const validation = validateCoachResponse(data);
  if (!validation.isValid || !validation.value) {
    throw new Error('The coach could not respond right now. Please try again.');
  }

  return validation.value;
}

/**
 * Sends a ChoiceCoachRequest to /api/coach and returns a validated CoachResponse.
 * Throws a user-friendly error if the request fails or response schema is invalid.
 */
export async function requestChoiceCoach(request: ChoiceCoachRequest): Promise<CoachResponse> {
  const response = await fetch('/api/coach', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    let errMsg = 'The Choice Coach could not respond right now. Please try again.';
    try {
      const errorData = await response.json();
      if (errorData?.error?.message) {
        errMsg = errorData.error.message;
      }
    } catch {
      // ignore JSON parse error, use default
    }
    throw new Error(errMsg);
  }

  const data = await response.json();

  const validation = validateCoachResponse(data);
  if (!validation.isValid || !validation.value) {
    throw new Error('The Choice Coach could not respond right now. Please try again.');
  }

  return validation.value;
}
