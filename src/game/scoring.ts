/**
 * Pure scoring calculation functions according to TypeRace specifications
 */

export function calculateProgress(correctChars: number, totalChars: number): number {
  if (totalChars <= 0) return 0;
  const progress = (correctChars / totalChars) * 100;
  return Math.min(100, Math.max(0, parseFloat(progress.toFixed(1))));
}

export function calculateWpm(correctChars: number, elapsedMilliseconds: number): number {
  if (elapsedMilliseconds <= 500) return 0;
  const elapsedMinutes = elapsedMilliseconds / 60000;
  // Standard calculation: 5 characters = 1 word
  const words = correctChars / 5;
  const wpm = words / elapsedMinutes;
  return Math.max(0, Math.round(wpm));
}

export function calculateAccuracy(correctChars: number, totalTyped: number): number {
  if (totalTyped <= 0) return 100;
  if (correctChars >= totalTyped) return 100;
  const acc = (correctChars / totalTyped) * 100;
  return Math.max(0, Math.min(100, Math.round(acc)));
}

export function formatTime(milliseconds: number): string {
  if (milliseconds < 0) milliseconds = 0;
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const tenths = Math.floor((milliseconds % 1000) / 100);
  
  const pad = (n: number) => n.toString().padStart(2, '0');
  if (minutes > 0) {
    return `${minutes}:${pad(seconds)}.${tenths}s`;
  }
  return `${seconds}.${tenths}s`;
}
