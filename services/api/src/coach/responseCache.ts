/**
 * Lightweight in-memory TTL cache for successful coach responses.
 * Reduces redundant Gemini calls for identical requests.
 *
 * Key: stable JSON string of the validated request body.
 * TTL: 10 minutes (configurable).
 * Max entries: 50 (LRU-style eviction of oldest entries).
 */

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

export class CoachResponseCache<T = unknown> {
  private readonly cache = new Map<string, CacheEntry<T>>();
  private readonly ttlMs: number;
  private readonly maxEntries: number;

  constructor(ttlMs = 10 * 60 * 1000, maxEntries = 50) {
    this.ttlMs = ttlMs;
    this.maxEntries = maxEntries;
  }

  /** Get a cached value if it exists and has not expired. */
  get(key: string): T | undefined {
    const entry = this.cache.get(key);
    if (!entry) return undefined;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return undefined;
    }

    return entry.value;
  }

  /** Store a value. Evicts oldest entries if at capacity. */
  set(key: string, value: T): void {
    // Evict expired entries first
    this.evictExpired();

    // If still at capacity, remove the oldest entry (first inserted)
    if (this.cache.size >= this.maxEntries && !this.cache.has(key)) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey !== undefined) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(key, {
      value,
      expiresAt: Date.now() + this.ttlMs,
    });
  }

  /** Number of currently stored entries (including potentially expired ones). */
  get size(): number {
    return this.cache.size;
  }

  /** Clear all entries. */
  clear(): void {
    this.cache.clear();
  }

  /** Build a stable cache key from a request object. */
  static buildKey(obj: unknown): string {
    return JSON.stringify(obj);
  }

  private evictExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }
}
