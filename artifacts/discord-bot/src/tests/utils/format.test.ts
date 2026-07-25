import { formatNumber, formatDuration } from '../../utils/format.js';

describe('formatNumber', () => {
  it('formats small numbers without separators', () => {
    expect(formatNumber(999)).toBe('999');
  });

  it('formats thousands with comma separator', () => {
    expect(formatNumber(1000)).toBe('1,000');
    expect(formatNumber(1_000_000)).toBe('1,000,000');
  });

  it('handles zero', () => {
    expect(formatNumber(0)).toBe('0');
  });
});

describe('formatDuration', () => {
  it('formats seconds only', () => {
    expect(formatDuration(5_000)).toBe('5s');
    expect(formatDuration(59_000)).toBe('59s');
  });

  it('formats minutes and seconds', () => {
    expect(formatDuration(90_000)).toBe('1m 30s');
    expect(formatDuration(60_000)).toBe('1m 0s');
  });

  it('formats hours and minutes', () => {
    expect(formatDuration(3_600_000)).toBe('1h 0m');
    expect(formatDuration(3_660_000)).toBe('1h 1m');
  });
});
