import type { Request, Response, NextFunction } from 'express';
import { isCoachMode } from '@carboncoach/shared';

export function validateCoachRequest(req: Request, res: Response, next: NextFunction) {
  const { mode, context, allowedNumbers } = req.body;

  if (!mode || !isCoachMode(mode)) {
    return res.status(400).json({
      error: {
        code: 'INVALID_REQUEST',
        message: 'Invalid or missing coach mode. Must be "footprint_coach" or "choice_coach".',
      },
    });
  }

  if (!context || typeof context !== 'object') {
    return res.status(400).json({
      error: {
        code: 'INVALID_REQUEST',
        message: 'Missing or invalid context object.',
      },
    });
  }

  if (!allowedNumbers || !Array.isArray(allowedNumbers)) {
    return res.status(400).json({
      error: {
        code: 'INVALID_REQUEST',
        message: 'Missing or invalid allowedNumbers array.',
      },
    });
  }

  // Validate allowedNumbers contains only strings
  for (const item of allowedNumbers) {
    if (typeof item !== 'string') {
      return res.status(400).json({
        error: {
          code: 'INVALID_REQUEST',
          message: 'All elements in allowedNumbers must be strings.',
        },
      });
    }
  }

  // Basic context structural validation
  if (mode === 'footprint_coach') {
    if (typeof context.monthlyTotalKgCO2e !== 'number' || isNaN(context.monthlyTotalKgCO2e)) {
      return res.status(400).json({
        error: {
          code: 'INVALID_REQUEST',
          message: 'monthlyTotalKgCO2e is required and must be a number.',
        },
      });
    }
    if (!Array.isArray(context.categories)) {
      return res.status(400).json({
        error: {
          code: 'INVALID_REQUEST',
          message: 'categories is required and must be an array.',
        },
      });
    }
    if (!Array.isArray(context.recommendedActions)) {
      return res.status(400).json({
        error: {
          code: 'INVALID_REQUEST',
          message: 'recommendedActions is required and must be an array.',
        },
      });
    }
  } else {
    // choice_coach
    if (typeof context.scenarioId !== 'string' || context.scenarioId.trim() === '') {
      return res.status(400).json({
        error: {
          code: 'INVALID_REQUEST',
          message: 'scenarioId is required and must be a non-empty string.',
        },
      });
    }
    if (!Array.isArray(context.options)) {
      return res.status(400).json({
        error: {
          code: 'INVALID_REQUEST',
          message: 'options is required and must be an array.',
        },
      });
    }
    if (
      typeof context.recommendedOptionId !== 'string' ||
      context.recommendedOptionId.trim() === ''
    ) {
      return res.status(400).json({
        error: {
          code: 'INVALID_REQUEST',
          message: 'recommendedOptionId is required and must be a non-empty string.',
        },
      });
    }
  }

  next();
}
