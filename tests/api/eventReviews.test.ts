import { describe, it, expect } from 'vitest';
import { checkRateLimit } from '@/lib/rate-limit';

describe('rate limiter', () => {
  it('limits repeated calls', () => {
    const key = 'test';
    for (let i = 0; i < 19; i += 1) {
      const result = checkRateLimit(key);
      expect(result.allowed).toBe(true);
    }
    const final = checkRateLimit(key);
    expect(final.allowed).toBe(false);
  });
});
