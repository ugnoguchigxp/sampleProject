import { cn } from '../../src/lib/utils';

describe('utils', () => {
  it('joins truthy string values', () => {
    expect(cn('a', 'b', 'c')).toBe('a b c');
  });

  it('filters out falsy values', () => {
    expect(cn('a', false, undefined, null, 'b')).toBe('a b');
  });

  it('returns empty string when no classes provided', () => {
    expect(cn()).toBe('');
  });
});
