import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import { app } from '../src/server';
import { GeminiProvider } from '../src/llm/geminiProvider';

const { mockGenerateText } = vi.hoisted(() => {
  return {
    mockGenerateText: vi.fn(),
  };
});

vi.mock('../src/llm/geminiProvider', () => {
  return {
    GeminiProvider: vi.fn().mockImplementation(() => {
      return {
        generateText: mockGenerateText,
        getActiveModelName: () => process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite',
      };
    }),
  };
});

describe('Gemini Configuration & Model resolution', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('resolves default model to gemini-2.5-flash-lite', () => {
    delete process.env.GEMINI_MODEL;
    const provider = new GeminiProvider();
    expect(provider.getActiveModelName()).toBe('gemini-2.5-flash-lite');
  });

  it('overrides default model when GEMINI_MODEL is set', () => {
    process.env.GEMINI_MODEL = 'gemini-custom';
    const provider = new GeminiProvider();
    expect(provider.getActiveModelName()).toBe('gemini-custom');
  });
});

describe('Coach API End-to-End Error Classification & Fallback', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    process.env.GEMINI_API_KEY = 'mock-key';
    vi.clearAllMocks();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  const validFootprintBody = {
    mode: 'footprint_coach',
    tone: 'simple',
    allowedNumbers: ['250', '80'],
    context: {
      monthlyTotalKgCO2e: 250,
      topCategory: 'Transport',
      confidence: 'high',
      categories: [{ category: 'Transport', monthlyKgCO2e: 150, confidence: 'high' }],
      recommendedActions: [
        {
          id: 'act1',
          title: 'Ride bike',
          category: 'Transport',
          impactBand: 'high',
          effort: 'medium',
          costEffect: 'neutral',
          estimatedMonthlyReductionKgCO2e: 80,
          reason: 'Reason 1',
        },
      ],
      assumptionNotes: [],
      preference: 'Balanced',
    },
  };

  const validChoiceBody = {
    mode: 'choice_coach',
    tone: 'simple',
    allowedNumbers: [],
    context: {
      scenarioId: 'choice1',
      scenarioTitle: 'Scenario 1',
      options: [{ id: 'o1', label: 'Option 1', impactBand: 'low', reasons: [] }],
      recommendedOptionId: 'o1',
      preference: 'Balanced',
      assumptionNotes: [],
    },
  };

  it('returns HTTP 400 when GEMINI_API_KEY is missing', async () => {
    delete process.env.GEMINI_API_KEY;
    process.env.NODE_ENV = 'development';

    const res = await request(app).post('/api/coach').send(validChoiceBody);

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('missing_configuration');
    expect(res.body.error.message).toBe('Coach is not configured for this local environment.');
  });

  it('returns HTTP 400 when GEMINI_API_KEY is missing in non-development mode', async () => {
    delete process.env.GEMINI_API_KEY;
    process.env.NODE_ENV = 'production';

    const res = await request(app).post('/api/coach').send(validChoiceBody);

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('missing_configuration');
    expect(res.body.error.message).toBe(
      'Coach is temporarily unavailable. Please retry in a moment.',
    );
  });

  it('returns HTTP 403 and error message on invalid key / auth failure', async () => {
    mockGenerateText.mockRejectedValue(new Error('API_KEY_INVALID: API key is invalid.'));

    const res = await request(app).post('/api/coach').send(validChoiceBody);

    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe('authentication_or_permission');
  });

  it('returns fallback with source fallback on quota / rate limit failure', async () => {
    mockGenerateText.mockRejectedValue(new Error('429 Too Many Requests: quota exceeded.'));

    const res = await request(app).post('/api/coach').send(validFootprintBody);

    expect(res.status).toBe(200);
    expect(res.body.source).toBe('fallback');
  });

  it('returns fallback with source fallback on provider timeout failure', async () => {
    mockGenerateText.mockRejectedValue(new Error('Gemini request timed out'));

    const res = await request(app).post('/api/coach').send(validFootprintBody);

    expect(res.status).toBe(200);
    expect(res.body.source).toBe('fallback');
  });

  it('returns fallback with source fallback on invalid provider response', async () => {
    mockGenerateText.mockResolvedValue('invalid-non-json-output');

    const res = await request(app).post('/api/coach').send(validFootprintBody);

    expect(res.status).toBe(200);
    expect(res.body.source).toBe('fallback');
  });

  it('returns fallback with source fallback on Numeric Guard rejection', async () => {
    const geminiResponseObj = {
      mode: 'footprint_coach',
      summary: 'Your monthly carbon footprint is 9999 kg CO2e.', // 9999 is not in allowedNumbers
      explanation: 'Your top contributor is Transport.',
      recommendedNextStep: 'Try to ride a bike more often.',
      weeklyPlan: ['Action: Ride bike (high impact)'],
      numbersUsed: ['250', '80', '9999'],
      confidenceNote: 'High confidence.',
      disclaimer: 'Estimates are approximate.',
      source: 'gemini',
    };

    mockGenerateText.mockResolvedValue(JSON.stringify(geminiResponseObj));

    const res = await request(app).post('/api/coach').send(validFootprintBody);

    expect(res.status).toBe(200);
    expect(res.body.source).toBe('fallback');
    expect(res.body.summary).not.toContain('9999');
  });
});
