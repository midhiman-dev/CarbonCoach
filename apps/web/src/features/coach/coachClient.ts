import { CoachResponse, FootprintCoachRequest, validateCoachResponse } from '@carboncoach/shared';

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
    throw new Error('The coach could not respond right now. Please try again.');
  }

  const data = await response.json();

  const validation = validateCoachResponse(data);
  if (!validation.isValid || !validation.value) {
    throw new Error('The coach could not respond right now. Please try again.');
  }

  return validation.value;
}
