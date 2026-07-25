/** Format large numbers with locale-aware separators. */
export function formatNumber(n: number): string {
  return n.toLocaleString('en-US');
}

/** Format milliseconds into a human-readable duration string. */
export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ${seconds % 60}s`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ${minutes % 60}m`;
}
