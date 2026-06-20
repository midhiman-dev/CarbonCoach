import type { Request, Response } from 'express';
import type { CoachRequest } from '@carboncoach/shared';
import {
  validateCoachResponse,
  validateGeneratedNumbers,
  collectCoachResponseTextFields,
  createFallbackCoachResponse,
} from '@carboncoach/shared';
import { buildCoachPrompt } from './promptBuilder';
import { cleanAndParseJson } from './responseParser';
import { GeminiProvider } from '../llm/geminiProvider';
import { logSafe } from '../middleware/safeLogging';
import { CoachResponseCache } from './responseCache';

// Singleton cache: 10-minute TTL, max 50 entries
const coachCache = new CoachResponseCache(10 * 60 * 1000, 50);

/** Clear the coach response cache. Exported for test isolation. */
export function clearCoachCache(): void {
  coachCache.clear();
}

export async function handleCoachRequest(req: Request, res: Response) {
  const coachRequest = req.body as CoachRequest;
  const startTime = Date.now();
  const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite';

  // Check cache before calling Gemini
  const cacheKey = CoachResponseCache.buildKey(coachRequest);
  const cached = coachCache.get(cacheKey);
  if (cached) {
    logSafe('Coach cache hit', {
      mode: coachRequest.mode,
      durationMs: Date.now() - startTime,
      modelIdentifier: modelName,
      guardPassed: true,
      fallbackUsed: false,
    });
    return res.status(200).json(cached);
  }

  // Check if API key is missing
  if (!process.env.GEMINI_API_KEY) {
    const isDev = process.env.NODE_ENV === 'development';
    const message = isDev
      ? 'Coach is not configured for this local environment.'
      : 'Coach is temporarily unavailable. Please retry in a moment.';

    logSafe('Coach request failed: missing API key', {
      mode: coachRequest.mode,
      safeErrorCategory: 'missing_configuration',
      providerStatusCode: 400,
      durationMs: Date.now() - startTime,
      modelIdentifier: modelName,
      guardPassed: false,
      fallbackUsed: false,
    });

    return res.status(400).json({
      error: {
        code: 'missing_configuration',
        message,
      },
    });
  }

  const provider = new GeminiProvider();

  try {
    const prompt = buildCoachPrompt(coachRequest);
    const timeoutMs = process.env.LLM_TIMEOUT_MS ? parseInt(process.env.LLM_TIMEOUT_MS, 10) : 7000;

    // Call LLM provider
    const rawOutput = await provider.generateText(prompt, { timeoutMs });

    // Parse output
    let parsed;
    try {
      parsed = cleanAndParseJson(rawOutput);
    } catch {
      logSafe('Failed to parse Gemini response as JSON', {
        mode: coachRequest.mode,
        fallbackReason: 'invalid_provider_response',
        safeErrorCategory: 'invalid_provider_response',
        durationMs: Date.now() - startTime,
        modelIdentifier: modelName,
        guardPassed: false,
        fallbackUsed: true,
      });
      return serveFallback(coachRequest, 'invalid_provider_response', startTime, res);
    }

    // Validate schema
    const validation = validateCoachResponse(parsed);
    if (!validation.isValid || !validation.value) {
      logSafe('Gemini response validation failed', {
        mode: coachRequest.mode,
        fallbackReason: 'invalid_provider_response',
        safeErrorCategory: 'invalid_provider_response',
        validationFailureCategory: validation.errors.join(', '),
        durationMs: Date.now() - startTime,
        modelIdentifier: modelName,
        guardPassed: false,
        fallbackUsed: true,
      });
      return serveFallback(coachRequest, 'invalid_provider_response', startTime, res);
    }

    const coachResponse = validation.value;

    // Ensure mode in response matches request mode
    if (coachResponse.mode !== coachRequest.mode) {
      logSafe('Gemini response mode mismatch', {
        mode: coachRequest.mode,
        fallbackReason: 'invalid_provider_response',
        safeErrorCategory: 'invalid_provider_response',
        durationMs: Date.now() - startTime,
        modelIdentifier: modelName,
        guardPassed: false,
        fallbackUsed: true,
      });
      return serveFallback(coachRequest, 'invalid_provider_response', startTime, res);
    }

    // Enforce Numeric Invention Guard
    const responseTextFields = collectCoachResponseTextFields(coachResponse);
    const guardResult = validateGeneratedNumbers({
      allowedNumbers: coachRequest.allowedNumbers,
      responseTextFields,
    });

    if (!guardResult.isValid) {
      logSafe('Numeric Invention Guard rejected response', {
        mode: coachRequest.mode,
        fallbackReason: 'numeric_guard_rejected',
        safeErrorCategory: 'numeric_guard_rejected',
        numericGuardRejected: true,
        durationMs: Date.now() - startTime,
        modelIdentifier: modelName,
        guardPassed: false,
        fallbackUsed: true,
      });
      return serveFallback(coachRequest, 'numeric_guard_rejected', startTime, res);
    }

    // Success response
    const durationMs = Date.now() - startTime;
    logSafe('Coach request succeeded', {
      mode: coachRequest.mode,
      durationMs,
      modelIdentifier: modelName,
      guardPassed: true,
      fallbackUsed: false,
    });

    // Normalize source to gemini
    coachResponse.source = 'gemini';

    // Cache successful response
    coachCache.set(cacheKey, coachResponse);

    return res.status(200).json(coachResponse);
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error(String(error));
    const msg = err.message || '';

    // Classify error
    let category = 'unexpected_provider_error';
    let statusCode = 500;
    let fallbackUsed = true;

    const errWithStatus = err as { status?: number };
    if (
      msg.includes('API key') ||
      msg.includes('API_KEY_INVALID') ||
      msg.includes('403') ||
      errWithStatus.status === 403 ||
      errWithStatus.status === 401
    ) {
      category = 'authentication_or_permission';
      statusCode = 403;
      fallbackUsed = false; // Do not silently pretend Gemini worked on invalid key
    } else if (
      msg.includes('429') ||
      msg.includes('quota') ||
      msg.includes('Quota') ||
      msg.includes('rate limit') ||
      errWithStatus.status === 429
    ) {
      category = 'quota_or_rate_limit';
      statusCode = 429;
    } else if (msg.toLowerCase().includes('timeout') || errWithStatus.status === 504) {
      category = 'provider_timeout';
      statusCode = 504;
    } else if (msg.includes('503') || msg.includes('unavailable') || errWithStatus.status === 503) {
      category = 'provider_unavailable';
      statusCode = 503;
    }

    logSafe(`Llm provider call failed: ${err.message || 'unknown error'}`, {
      mode: coachRequest.mode,
      fallbackReason: category,
      safeErrorCategory: category,
      providerStatusCode: statusCode,
      durationMs: Date.now() - startTime,
      modelIdentifier: modelName,
      guardPassed: false,
      fallbackUsed,
    });

    if (fallbackUsed) {
      return serveFallback(coachRequest, category, startTime, res);
    } else {
      const isDev = process.env.NODE_ENV === 'development';
      const message = isDev
        ? 'Coach is not configured for this local environment.'
        : 'Coach is temporarily unavailable. Please retry in a moment.';

      return res.status(statusCode).json({
        error: {
          code: category,
          message,
        },
      });
    }
  }
}

function serveFallback(request: CoachRequest, reason: string, startTime: number, res: Response) {
  const fallbackResponse = createFallbackCoachResponse(request);
  const durationMs = Date.now() - startTime;
  const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite';

  logSafe('Serving fallback response', {
    mode: request.mode,
    fallbackReason: reason,
    durationMs,
    safeErrorCategory: reason,
    modelIdentifier: modelName,
    guardPassed: false,
    fallbackUsed: true,
  });

  return res.status(200).json(fallbackResponse);
}
