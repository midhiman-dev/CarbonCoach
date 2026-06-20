import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import { app } from '../src/server';
import { clearCoachCache } from '../src/coach/coachController';

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
      };
    }),
  };
});

describe('GET /health', () => {
  it('should return 200 ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.service).toBe('carboncoach-api');
  });
});

describe('POST /api/coach', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv, GEMINI_API_KEY: 'mock-key' };
    vi.clearAllMocks();
    clearCoachCache();
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

  it('should return 400 when body structure is invalid', async () => {
    const res = await request(app).post('/api/coach').send({ mode: 'invalid_mode' });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('INVALID_REQUEST');
  });

  it('should return valid Gemini response when Gemini API succeeds', async () => {
    const geminiResponseObj = {
      mode: 'footprint_coach',
      summary: 'Your estimated monthly carbon footprint is 250 kg CO2e.',
      explanation: 'Your top contributor is Transport.',
      recommendedNextStep: 'Try to ride a bike more often.',
      weeklyPlan: ['Action: Ride bike (high impact)'],
      numbersUsed: ['250', '80'],
      confidenceNote: 'High confidence.',
      disclaimer: 'Estimates are approximate.',
      source: 'gemini',
    };

    mockGenerateText.mockResolvedValue(JSON.stringify(geminiResponseObj));

    const res = await request(app).post('/api/coach').send(validFootprintBody);

    expect(res.status).toBe(200);
    expect(res.body.source).toBe('gemini');
    expect(res.body.summary).toContain('250 kg CO2e');
    expect(res.body.numbersUsed).toContain('250');
  });

  it('should handle markdown fenced JSON outputs correctly', async () => {
    const geminiResponseObj = {
      mode: 'footprint_coach',
      summary: 'Your estimated monthly carbon footprint is 250 kg CO2e.',
      explanation: 'Your top contributor is Transport.',
      recommendedNextStep: 'Try to ride a bike more often.',
      weeklyPlan: ['Action: Ride bike (high impact)'],
      numbersUsed: ['250', '80'],
      confidenceNote: 'High confidence.',
      disclaimer: 'Estimates are approximate.',
      source: 'gemini',
    };

    mockGenerateText.mockResolvedValue(`\`\`\`json
${JSON.stringify(geminiResponseObj)}
\`\`\``);

    const res = await request(app).post('/api/coach').send(validFootprintBody);

    expect(res.status).toBe(200);
    expect(res.body.source).toBe('gemini');
    expect(res.body.summary).toContain('250 kg CO2e');
  });

  it('should fallback to rule-based response when Gemini returns invalid mode', async () => {
    const geminiResponseObj = {
      mode: 'choice_coach', // Mismatched mode (request is footprint_coach)
      summary: 'Your estimated monthly carbon footprint is 250 kg CO2e.',
      explanation: 'Your top contributor is Transport.',
      recommendedNextStep: 'Try to ride a bike more often.',
      weeklyPlan: ['Action: Ride bike (high impact)'],
      numbersUsed: ['250', '80'],
      confidenceNote: 'High confidence.',
      disclaimer: 'Estimates are approximate.',
      source: 'gemini',
    };

    mockGenerateText.mockResolvedValue(JSON.stringify(geminiResponseObj));

    const res = await request(app).post('/api/coach').send(validFootprintBody);

    expect(res.status).toBe(200);
    expect(res.body.source).toBe('fallback');
  });

  it('should fallback to rule-based response when Gemini fails with timeout', async () => {
    mockGenerateText.mockRejectedValue(new Error('Gemini request timed out'));

    const res = await request(app).post('/api/coach').send(validFootprintBody);

    expect(res.status).toBe(200);
    expect(res.body.source).toBe('fallback');
    expect(res.body.summary).toContain('Your estimated monthly carbon footprint is 250 kg CO2e');
  });

  it('should fallback to rule-based response when Gemini API key is missing', async () => {
    mockGenerateText.mockRejectedValue(new Error('GEMINI_API_KEY is missing'));

    const res = await request(app).post('/api/coach').send(validFootprintBody);

    expect(res.status).toBe(200);
    expect(res.body.source).toBe('fallback');
  });

  it('should fallback to rule-based response when Gemini invents unsupported numbers', async () => {
    const geminiResponseObj = {
      mode: 'footprint_coach',
      summary: 'Your estimated monthly carbon footprint is 9999 kg CO2e.', // '9999' is not allowed and is in a text field
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
  });

  it('should accept valid choice request and return gemini response on success', async () => {
    const geminiResponseObj = {
      mode: 'choice_coach',
      summary: 'For Scenario One, Option One is recommended.',
      explanation: 'Option One has lower carbon impact.',
      recommendedNextStep: 'Choose Option One.',
      weeklyPlan: ['Practice Option One.'],
      numbersUsed: [],
      confidenceNote: 'Typical impact band based.',
      disclaimer: 'Estimates are approximate.',
      source: 'gemini',
    };

    mockGenerateText.mockResolvedValue(JSON.stringify(geminiResponseObj));

    const res = await request(app).post('/api/coach').send(validChoiceBody);

    expect(res.status).toBe(200);
    expect(res.body.source).toBe('gemini');
    expect(res.body.summary).toContain('Option One is recommended');
  });

  it('should return 400 when required fields are missing in the context', async () => {
    const payload = {
      mode: 'footprint_coach',
      tone: 'simple',
      allowedNumbers: [],
      // Missing context entirely
    };
    const res = await request(app).post('/api/coach').send(payload);
    expect(res.status).toBe(400);
  });

  it('should return 200 fallback when an unsupported category is passed', async () => {
    const payload = {
      mode: 'footprint_coach',
      tone: 'simple',
      allowedNumbers: [],
      context: {
        ...validFootprintBody.context,
        topCategory: 'SpaceTravel', // Invalid category
      },
    };
    const res = await request(app).post('/api/coach').send(payload);
    expect(res.status).toBe(200);
    expect(res.body.source).toBe('fallback');
  });

  it('should return 413 or 400 when the payload is oversized (e.g. extremely large arrays)', async () => {
    const largeArray = new Array(5000).fill('100');
    const payload = {
      ...validFootprintBody,
      allowedNumbers: largeArray,
    };
    // The validation middleware should reject arrays that are too large, or we simulate a large payload
    const res = await request(app).post('/api/coach').send(payload);
    expect([400, 413]).toContain(res.status);
  });

  it('should return 400 for malformed JSON request bodies', async () => {
    const res = await request(app)
      .post('/api/coach')
      .set('Content-Type', 'application/json')
      .send('{"mode": "footprint_coach", "context": { malformed JSON ');
    expect(res.status).toBe(400);
  });
});
