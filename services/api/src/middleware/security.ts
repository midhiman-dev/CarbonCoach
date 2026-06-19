import type { Request, Response, NextFunction } from 'express';
import { config } from '../config/env';
import { logSafe } from './safeLogging';

/**
 * Middleware to apply security headers without requiring the `helmet` dependency.
 */
export function securityHeaders(_req: Request, res: Response, next: NextFunction) {
  // Prevent MIME-sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Prevent Clickjacking
  res.setHeader('X-Frame-Options', 'DENY');

  // XSS filtering (legacy but still good for defense in depth)
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Strict Transport Security (HSTS) - enforce HTTPS in production
  if (config.nodeEnv === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }

  // Control referrer information
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Restrict powerful browser features
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

  // Basic Content-Security-Policy (CSP)
  // Allows scripts and styles from self, forbids inline execution unless absolutely needed by React/Vite.
  // In production, you might need to adjust this depending on how Vite builds inline styles/scripts.
  // For P3, we keep it safe but permissive enough for a standard React build.
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data: https:; connect-src 'self'",
  );

  next();
}

/**
 * Middleware to enforce strict CORS policy based on configuration.
 */
export function corsMiddleware(req: Request, res: Response, next: NextFunction) {
  const origin = req.headers.origin;
  const host = req.headers.host;
  const isSameOrigin = !!(
    origin &&
    host &&
    (origin === `http://${host}` || origin === `https://${host}`)
  );

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    const isAllowed = !!(origin && (config.corsAllowedOrigins.includes(origin) || isSameOrigin));
    if (isAllowed) {
      res.setHeader('Access-Control-Allow-Origin', origin!);
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours caching for preflight
      res.status(204).end();
      return;
    } else {
      // Deny preflight if origin not allowed
      res.status(403).end();
      return;
    }
  }

  // Handle standard requests
  if (origin) {
    if (config.corsAllowedOrigins.includes(origin) || isSameOrigin) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    } else if (config.nodeEnv === 'production') {
      logSafe(`[Security] Blocked request from disallowed origin: ${origin}`);
      res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Origin not allowed' } });
      return;
    }
  }

  next();
}
