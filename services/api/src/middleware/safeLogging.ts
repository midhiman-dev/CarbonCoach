export interface SafeLogData {
  mode?: string;
  durationMs?: number;
  fallbackReason?: string;
  validationFailureCategory?: string;
  providerUnavailable?: boolean;
  numericGuardRejected?: boolean;
  error?: string;
  providerStatusCode?: number;
  safeErrorCategory?: string;
  modelIdentifier?: string;
  guardPassed?: boolean;
  fallbackUsed?: boolean;
}

export function logSafe(message: string, data?: SafeLogData) {
  // Avoid logging any full prompts, raw responses, contexts, keys, or stack traces
  const logPayload: Record<string, unknown> = {};
  if (data) {
    if (data.mode) logPayload.mode = data.mode;
    if (data.durationMs !== undefined) logPayload.durationMs = data.durationMs;
    if (data.fallbackReason) logPayload.fallbackReason = data.fallbackReason;
    if (data.validationFailureCategory)
      logPayload.validationFailureCategory = data.validationFailureCategory;
    if (data.providerUnavailable !== undefined)
      logPayload.providerUnavailable = data.providerUnavailable;
    if (data.numericGuardRejected !== undefined)
      logPayload.numericGuardRejected = data.numericGuardRejected;
    if (data.error) logPayload.error = data.error;
    if (data.providerStatusCode !== undefined)
      logPayload.providerStatusCode = data.providerStatusCode;
    if (data.safeErrorCategory) logPayload.safeErrorCategory = data.safeErrorCategory;
    if (data.modelIdentifier) logPayload.modelIdentifier = data.modelIdentifier;
    if (data.guardPassed !== undefined) logPayload.guardPassed = data.guardPassed;
    if (data.fallbackUsed !== undefined) logPayload.fallbackUsed = data.fallbackUsed;
  }

  console.log(
    `[CarbonCoach-SafeLog] ${message}`,
    Object.keys(logPayload).length ? JSON.stringify(logPayload) : '',
  );
}
