export interface LlmGenerationOptions {
  timeoutMs: number;
}

export interface LlmProvider {
  generateText(prompt: string, options: LlmGenerationOptions): Promise<string>;
}
