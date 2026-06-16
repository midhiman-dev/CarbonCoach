import { GoogleGenerativeAI } from '@google/generative-ai';
import { LlmProvider, LlmGenerationOptions } from './llmProvider';
import { withTimeout } from './timeout';

export class GeminiProvider implements LlmProvider {
  private ai: GoogleGenerativeAI | null = null;
  private modelName = 'gemini-1.5-flash';

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      this.ai = new GoogleGenerativeAI(apiKey);
    }
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
}
