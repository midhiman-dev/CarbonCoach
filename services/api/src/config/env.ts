export interface AppConfig {
  port: number;
  nodeEnv: string;
  geminiApiKey?: string;
  geminiModel: string;
  corsAllowedOrigins: string[];
}

export function validateEnvironment(): AppConfig {
  const nodeEnv = process.env.NODE_ENV || 'development';
  const port = parseInt(process.env.PORT || '8080', 10);
  const geminiApiKey = process.env.GEMINI_API_KEY;
  const geminiModel = process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite';

  const corsOriginsRaw = process.env.ALLOWED_ORIGINS;
  let corsAllowedOrigins: string[] = [];

  if (corsOriginsRaw) {
    corsAllowedOrigins = corsOriginsRaw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  } else if (nodeEnv === 'development') {
    // Development default
    corsAllowedOrigins = ['http://localhost:5173', 'http://localhost:8080'];
  }

  // Fail-fast in production if strictly required
  // For this challenge, we allow the app to run without the API key and fallback gracefully.
  // However, we do warn if it is missing in production.
  if (nodeEnv === 'production' && !geminiApiKey) {
    console.warn(
      '[Config] WARNING: GEMINI_API_KEY is missing. App will operate in deterministic fallback mode.',
    );
  }

  if (isNaN(port)) {
    throw new Error('[Config] FATAL: PORT must be a valid number.');
  }

  return {
    port,
    nodeEnv,
    geminiApiKey,
    geminiModel,
    corsAllowedOrigins,
  };
}

// Export a singleton config instance initialized at startup
export const config = validateEnvironment();
