import express from 'express';
import path from 'path';
import { coachRouter } from './coach/coachRoutes';
import { config } from './config/env';
import { securityHeaders, corsMiddleware } from './middleware/security';
import { globalErrorHandler, methodNotAllowedHandler } from './middleware/errorHandler';

export const app = express();

// Apply security headers
app.use(securityHeaders);

// Apply CORS policy
app.use(corsMiddleware);

// Limit payloads to protect against large context inputs
app.use(express.json({ limit: '10kb' }));

// API Health Check
app.get('/health', (_req, res) => {
  // Do not expose secrets or internal config values
  const providerConfigured = !!config.geminiApiKey;
  const coachMode = providerConfigured ? 'gemini' : 'fallback';

  res.json({
    status: 'ok',
    service: 'carboncoach-api',
    providerConfigured,
    coachMode,
  });
});

// API Routes
app.use('/api', coachRouter);

// Catch unsupported methods on /api
app.use('/api', methodNotAllowedHandler);

// Serve Static Frontend (React/Vite)
// In production, the build outputs are expected to be at apps/web/dist
// The path resolves relative to __dirname which will be `services/api/dist` after tsc build.
const frontendPath = path.join(__dirname, '../../../apps/web/dist');
app.use(express.static(frontendPath));

// Fallback all other GET requests to the React index.html for client-side routing
app.get('*', (req, res, next) => {
  if (req.method === 'GET') {
    res.sendFile(path.join(frontendPath, 'index.html'), (err) => {
      if (err) {
        next(err);
      }
    });
  } else {
    next();
  }
});

// Global Error Handler
app.use(globalErrorHandler);

if (require.main === module) {
  app.listen(config.port, () => {
    console.log(`[CarbonCoach] Server listening on port ${config.port} in ${config.nodeEnv} mode`);
  });
}
