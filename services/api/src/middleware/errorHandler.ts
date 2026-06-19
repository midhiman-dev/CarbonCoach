import type { Request, Response, NextFunction } from 'express';
import { logSafe } from './safeLogging';

/**
 * Custom error handler to prevent stack traces from leaking and handle malformed JSON correctly.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function globalErrorHandler(err: any, _req: Request, res: Response, next: NextFunction) {
  // If headers are already sent, delegate to default Express handler
  if (res.headersSent) {
    return next(err);
  }

  // Handle JSON parsing errors (e.g., from express.json())
  if (err instanceof SyntaxError && 'status' in err && err.status === 400 && 'body' in err) {
    logSafe('Malformed JSON payload received', { 
      safeErrorCategory: 'malformed_json',
      providerStatusCode: 400 
    });
    
    res.status(400).json({
      error: {
        code: 'BAD_REQUEST',
        message: 'Invalid JSON payload format.',
      },
    });
    return;
  }

  // Handle payload too large errors
  if (err.type === 'entity.too.large') {
    logSafe('Payload too large', { 
      safeErrorCategory: 'payload_too_large',
      providerStatusCode: 413 
    });

    res.status(413).json({
      error: {
        code: 'PAYLOAD_TOO_LARGE',
        message: 'Request payload exceeds size limits.',
      },
    });
    return;
  }

  // Handle all other unexpected errors safely
  logSafe('Unexpected server error', {
    safeErrorCategory: 'internal_server_error',
    error: err.message, // Log message internally, but don't leak it to the client
  });

  res.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred.',
    },
  });
}

/**
 * Middleware to handle unsupported HTTP methods (e.g. PUT, DELETE) 
 * preventing unexpected route resolution behavior.
 */
export function methodNotAllowedHandler(_req: Request, res: Response) {
  res.status(405).json({
    error: {
      code: 'METHOD_NOT_ALLOWED',
      message: 'This HTTP method is not supported on this endpoint.',
    },
  });
}
