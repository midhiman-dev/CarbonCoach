import { describe, it, expect } from 'vitest';
import { app } from '../src/server';

describe('API Server', () => {
  it('exports an express app', () => {
    expect(app).toBeDefined();
    expect(typeof app.listen).toBe('function');
  });
});
