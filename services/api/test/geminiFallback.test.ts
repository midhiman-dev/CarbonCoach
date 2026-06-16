import { describe, it, expect } from 'vitest';
import { withTimeout } from '../src/llm/timeout';

describe('withTimeout wrapper', () => {
  it('should resolve if promise completes before timeout', async () => {
    const p = new Promise<string>((resolve) => {
      setTimeout(() => resolve('success'), 50);
    });

    const res = await withTimeout(p, 200);
    expect(res).toBe('success');
  });

  it('should reject with timeout error if promise exceeds timeout', async () => {
    const p = new Promise<string>((resolve) => {
      setTimeout(() => resolve('success'), 200);
    });

    await expect(withTimeout(p, 50)).rejects.toThrow('Operation timed out');
  });
});
