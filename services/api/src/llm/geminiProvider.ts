import { GoogleGenerativeAI } from '@google/generative-ai';
import type { LlmProvider, LlmGenerationOptions } from './llmProvider';
import { withTimeout } from './timeout';

export class GeminiProvider implements LlmProvider {
  private ai: GoogleGenerativeAI | null = null;
  private modelName: string;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      this.ai = new GoogleGenerativeAI(apiKey);
    }
    this.modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite';
  }

  async generateText(prompt: string, options: LlmGenerationOptions): Promise<string> {
    if (!this.ai) {
      throw new Error('GEMINI_API_KEY is missing');
    }

    const model = this.ai.getGenerativeModel({
      model: this.modelName,
      generationConfig: {
        responseMimeType: 'application/json',
      },
    });

    const apiCall = (async () => {
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      if (!text) {
        throw new Error('Empty response from Gemini API');
      }
      return text;
    })();

    return withTimeout(apiCall, options.timeoutMs, 'Gemini request timed out');
  }

  getActiveModelName(): string {
    return this.modelName;
  }
}
