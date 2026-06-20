import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CoachResponseCache } from '../src/coach/responseCache';

describe('CoachResponseCache', () => {
  let cache: CoachResponseCache<{ summary: string }>;

  beforeEach(() => {
    cache = new CoachResponseCache<{ summary: string }>(1000, 3); // 1s TTL, max 3
  });

  it('returns undefined for unknown keys', () => {
    expect(cache.get('unknown')).toBeUndefined();
  });

  it('stores and retrieves a value', () => {
    cache.set('key1', { summary: 'test' });
    expect(cache.get('key1')).toEqual({ summary: 'test' });
  });

  it('expires entries after TTL', () => {
    vi.useFakeTimers();
    try {
      cache.set('key1', { summary: 'test' });
      expect(cache.get('key1')).toEqual({ summary: 'test' });

      vi.advanceTimersByTime(1001);
      expect(cache.get('key1')).toBeUndefined();
    } finally {
      vi.useRealTimers();
    }
  });

  it('evicts oldest entry when at capacity', () => {
    cache.set('a', { summary: 'first' });
    cache.set('b', { summary: 'second' });
    cache.set('c', { summary: 'third' });

    // At capacity (3). Adding a 4th should evict 'a'.
    cache.set('d', { summary: 'fourth' });

    expect(cache.get('a')).toBeUndefined();
    expect(cache.get('b')).toEqual({ summary: 'second' });
    expect(cache.get('d')).toEqual({ summary: 'fourth' });
    expect(cache.size).toBe(3);
  });

  it('does not evict when overwriting an existing key', () => {
    cache.set('a', { summary: 'first' });
    cache.set('b', { summary: 'second' });
    cache.set('c', { summary: 'third' });

    // Overwriting 'a' should not evict anything
    cache.set('a', { summary: 'updated' });

    expect(cache.get('a')).toEqual({ summary: 'updated' });
    expect(cache.get('b')).toEqual({ summary: 'second' });
    expect(cache.get('c')).toEqual({ summary: 'third' });
    expect(cache.size).toBe(3);
  });

  it('clears all entries', () => {
    cache.set('a', { summary: 'first' });
    cache.set('b', { summary: 'second' });
    cache.clear();
    expect(cache.size).toBe(0);
    expect(cache.get('a')).toBeUndefined();
  });

  it('builds a stable cache key from an object', () => {
    const obj = { mode: 'footprint_coach', context: { total: 250 } };
    const key1 = CoachResponseCache.buildKey(obj);
    const key2 = CoachResponseCache.buildKey(obj);
    expect(key1).toBe(key2);
    expect(typeof key1).toBe('string');
  });

  it('evicts expired entries before checking capacity', () => {
    vi.useFakeTimers();
    try {
      cache.set('a', { summary: 'first' });
      cache.set('b', { summary: 'second' });
      cache.set('c', { summary: 'third' });

      // Expire all
      vi.advanceTimersByTime(1001);

      // Adding new entry should evict expired ones, not just the oldest
      cache.set('d', { summary: 'fourth' });
      expect(cache.size).toBe(1);
      expect(cache.get('d')).toEqual({ summary: 'fourth' });
    } finally {
      vi.useRealTimers();
    }
  });
});
