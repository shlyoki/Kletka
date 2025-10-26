import { describe, expect, it } from 'vitest';
import { hashPassword, verifyPassword } from '@/lib/user-store';

describe('user-store password helpers', () => {
  it('hashes passwords with random salt', () => {
    const first = hashPassword('example-pass');
    const second = hashPassword('example-pass');
    expect(first).not.toEqual(second);
    expect(first).toMatch(/^[a-f0-9]+:[a-f0-9]+$/);
  });

  it('verifies hashed passwords correctly', () => {
    const hashed = hashPassword('secret-value');
    expect(verifyPassword('secret-value', hashed)).toBe(true);
    expect(verifyPassword('wrong', hashed)).toBe(false);
  });
});
