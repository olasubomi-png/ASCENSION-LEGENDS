import { sleep, withTimeout } from '../../utils/async.js';

describe('sleep', () => {
  it('resolves after the specified ms', async () => {
    const start = Date.now();
    await sleep(50);
    expect(Date.now() - start).toBeGreaterThanOrEqual(45);
  });
});

describe('withTimeout', () => {
  it('resolves when the promise completes before the timeout', async () => {
    const result = await withTimeout(Promise.resolve(42), 500);
    expect(result).toBe(42);
  });

  it('rejects with a timeout error when the promise is too slow', async () => {
    const slow = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('done')), 10_000),
    );
    await expect(withTimeout(slow, 50, 'TestOp')).rejects.toThrow('TestOp timed out after 50ms');
  });
});
