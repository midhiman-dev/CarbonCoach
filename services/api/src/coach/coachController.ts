import type { Request, Response } from 'express';
import {
  CoachRequest,
  validateCoachResponse,
  validateGeneratedNumbers,
  collectCoachResponseTextFields,
  createFallbackCoachResponse,
} from '@carboncoach/shared';
import { buildCoachPrompt } from './promptBuilder';
import { cleanAndParseJson } from './responseParser';
import { GeminiProvider } from '../llm/geminiProvider';
import { logSafe } from '../middleware/safeLogging';

const provider = new GeminiProvider();

export async function handleCoachRequest(req: Request, res: Response) {
  const coachRequest = req.body as CoachRequest;
  const startTime = Date.now();

  try {
    const prompt = buildCoachPrompt(coachRequest);
    const timeoutMs = process.env.LLM_TIMEOUT_MS ? parseInt(process.env.LLM_TIMEOUT_MS, 10) : 7000;

    // Call LLM provider
    const rawOutput = await provider.generateText(prompt, { timeoutMs });

    // Parse output
    const parsed = cleanAndParseJson(rawOutput);

    // Validate schema
    const validation = validateCoachResponse(parsed);
    if (!validation.isValid || !validation.value) {
      logSafe('Gemini response validation failed', {
        mode: coachRequest.mode,
        fallbackReason: 'validation_failed',
        validationFailureCategory: validation.errors.join(', '),
      });
      return serveFallback(coachRequest, 'validation_failed', startTime, res);
    }

    const coachResponse = validation.value;

    // Ensure mode in response matches request mode
    if (coachResponse.mode !== coachRequest.mode) {
      logSafe('Gemini response mode mismatch', {
        mode: coachRequest.mode,
        fallbackReason: 'mode_mismatch',
      });
      return serveFallback(coachRequest, 'mode_mismatch', startTime, res);
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
        fallbackReason: 'numeric_guard_violation',
        numericGuardRejected: true,
      });
      return serveFallback(coachRequest, 'numeric_guard_violation', startTime, res);
    }

    // Success response
    const durationMs = Date.now() - startTime;
    logSafe('Coach request succeeded', {
      mode: coachRequest.mode,
      durationMs,
    });

    // Normalize source to gemini
    coachResponse.source = 'gemini';

    return res.status(200).json(coachResponse);
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error(String(error));
    const isTimeout = err.message && err.message.includes('timeout');
    const isApiKeyMissing = err.message && err.message.includes('API key');
    const category = isTimeout ? 'timeout' : isApiKeyMissing ? 'api_key_missing' : 'provider_error';

    logSafe(`Llm provider call failed: ${err.message || 'unknown error'}`, {
      mode: coachRequest.mode,
      fallbackReason: category,
      providerUnavailable: isApiKeyMissing || !isTimeout,
    });

    return serveFallback(coachRequest, category, startTime, res);
  }
}

function serveFallback(request: CoachRequest, reason: string, startTime: number, res: Response) {
  const fallbackResponse = createFallbackCoachResponse(request);
  const durationMs = Date.now() - startTime;

  logSafe('Serving fallback response', {
    mode: request.mode,
    fallbackReason: reason,
    durationMs,
  });

  return res.status(200).json(fallbackResponse);
}
