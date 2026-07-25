import { ok, err } from '../../types/common.js';

describe('Result helpers', () => {
  describe('ok', () => {
    it('creates a successful result', () => {
      const result = ok(42);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toBe(42);
      }
    });

    it('works with object values', () => {
      const result = ok({ id: 'user_123', name: 'Hero' });
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.id).toBe('user_123');
      }
    });
  });

  describe('err', () => {
    it('creates a failed result', () => {
      const error = new Error('Something went wrong');
      const result = err(error);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.message).toBe('Something went wrong');
      }
    });
  });
});
