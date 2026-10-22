/**
 * Vietnamese and Multilingual IME Text Processing Engine for TypeRace
 */

export interface TypingState {
  targetText: string;
  typedText: string;
  isComposing: boolean;
  correctLength: number;
  errorLength: number;
  hasError: boolean;
  isFinished: boolean;
  completedText: string;
  errorSegment: string;
  currentChar: string;
  remainingText: string;
}

/**
 * Normalizes string using Unicode Normalization Form C (NFC)
 * Essential for Vietnamese Telex/VNI combining accents.
 */
export function normalizeText(text: string): string {
  if (!text) return '';
  return text.normalize('NFC');
}

/**
 * Validates current typed text against target text with IME awareness
 */
export function processTypingInput(
  targetTextRaw: string,
  typedTextRaw: string,
  isComposing: boolean = false
): TypingState {
  const target = normalizeText(targetTextRaw);
  const typed = normalizeText(typedTextRaw);

  // Find longest common prefix
  let matchIndex = 0;
  const minLen = Math.min(target.length, typed.length);

  while (matchIndex < minLen && target[matchIndex] === typed[matchIndex]) {
    matchIndex++;
  }

  // If typed length matches the common prefix, there are no typing errors currently
  const hasError = typed.length > matchIndex;
  const correctLength = matchIndex;
  const errorLength = typed.length - matchIndex;
  const isFinished = correctLength === target.length && !hasError;

  const completedText = target.slice(0, correctLength);
  const currentChar = matchIndex < target.length ? target[matchIndex] : '';
  const remainingText = matchIndex < target.length ? target.slice(matchIndex + 1) : '';
  const errorSegment = hasError ? typed.slice(matchIndex) : '';

  return {
    targetText: target,
    typedText: typed,
    isComposing,
    correctLength,
    errorLength,
    hasError,
    isFinished,
    completedText,
    errorSegment,
    currentChar,
    remainingText
  };
}
