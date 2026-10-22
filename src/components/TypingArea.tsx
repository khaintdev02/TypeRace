import React, { useRef, useEffect, useState } from 'react';
import { processTypingInput } from '../game/textInput';
import { calculateProgress, calculateWpm, calculateAccuracy } from '../game/scoring';
import { sounds } from '../game/soundEffects';

interface TypingAreaProps {
  targetText: string;
  isRacing: boolean;
  raceStartTime: number | null;
  onProgressUpdate: (progress: number, wpm: number, accuracy: number, isFinished: boolean) => void;
  onFinish: (wpm: number, accuracy: number, correctChars: number, totalChars: number, timeMs: number) => void;
}

export const TypingArea: React.FC<TypingAreaProps> = ({
  targetText,
  isRacing,
  raceStartTime,
  onProgressUpdate,
  onFinish
}) => {
  const [typedText, setTypedText] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const finishedRef = useRef(false);

  // Keep focus on input
  useEffect(() => {
    if (isRacing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isRacing]);

  // Handle re-click to focus
  const handleBoxClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const typingState = processTypingInput(targetText, typedText, isComposing);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isRacing || finishedRef.current) return;

    const val = e.target.value;
    setTypedText(val);
    setTotalKeystrokes(prev => prev + 1);

    const state = processTypingInput(targetText, val, isComposing);

    if (state.hasError) {
      sounds.playError();
    } else {
      sounds.playKeyStroke();
    }

    const elapsed = raceStartTime ? Math.max(1, Date.now() - raceStartTime) : 1;
    const progress = calculateProgress(state.correctLength, state.targetText.length);
    const wpm = calculateWpm(state.correctLength, elapsed);
    const accuracy = calculateAccuracy(state.correctLength, Math.max(state.correctLength, totalKeystrokes + 1));

    onProgressUpdate(progress, wpm, accuracy, state.isFinished);

    if (state.isFinished && !finishedRef.current) {
      finishedRef.current = true;
      sounds.playFinish();
      onFinish(wpm, accuracy, state.correctLength, state.targetText.length, elapsed);
    }
  };

  return (
    <div 
      className="typing-box" 
      onClick={handleBoxClick}
      style={{
        cursor: 'text',
        minHeight: '160px',
        position: 'relative',
        boxShadow: typingState.hasError 
          ? '0 0 25px rgba(239, 68, 68, 0.25), inset 0 0 15px rgba(239, 68, 68, 0.15)' 
          : '0 0 25px rgba(0, 240, 255, 0.15), inset 0 0 15px rgba(0, 0, 0, 0.5)',
        borderColor: typingState.hasError ? 'rgba(239, 68, 68, 0.4)' : 'rgba(0, 240, 255, 0.25)'
      }}
    >
      {/* Hidden input catching keystrokes and IME */}
      <input
        ref={inputRef}
        type="text"
        className="typing-input-catcher"
        value={typedText}
        disabled={!isRacing || finishedRef.current}
        onChange={handleInputChange}
        onCompositionStart={() => setIsComposing(true)}
        onCompositionEnd={(e) => {
          setIsComposing(false);
          // Sync after IME ends
          handleInputChange(e as unknown as React.ChangeEvent<HTMLInputElement>);
        }}
        autoFocus
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
      />

      {/* Render text with highlighting */}
      <div>
        {/* Completed text */}
        <span className="char-correct">{typingState.completedText}</span>

        {/* Error characters if any */}
        {typingState.hasError && (
          <span className="char-error">{typingState.errorSegment}</span>
        )}

        {/* Current character with blinking cursor */}
        {!typingState.isFinished && (
          <span className="char-cursor">
            {typingState.currentChar === ' ' ? '␣' : typingState.currentChar}
          </span>
        )}

        {/* Remaining target text */}
        <span className="char-remaining">{typingState.remainingText}</span>
      </div>

      {!isRacing && !finishedRef.current && (
        <div style={{
          position: 'absolute',
          bottom: '10px',
          right: '15px',
          fontSize: '0.8rem',
          color: '#64748b'
        }}>
          Waiting to start race...
        </div>
      )}
    </div>
  );
};
