export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function formatLabel(seconds: number): string {
  if (seconds < 60) return `${seconds} secondes`;
  if (seconds === 60) return '1 minute';
  if (seconds % 60 === 0) return `${seconds / 60} minutes`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m} min ${s}`;
}
