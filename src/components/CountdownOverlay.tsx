import React, { useEffect, useState } from 'react';
import { sounds } from '../game/soundEffects';

interface CountdownOverlayProps {
  targetStartAt: number;
  onCountdownComplete: () => void;
}

export const CountdownOverlay: React.FC<CountdownOverlayProps> = ({
  targetStartAt,
  onCountdownComplete
}) => {
  const [secondsLeft, setSecondsLeft] = useState<number>(3);
  const [lastBeepSec, setLastBeepSec] = useState<number>(-1);

  useEffect(() => {
    const interval = setInterval(() => {
      const diffMs = targetStartAt - Date.now();
      const sec = Math.max(0, Math.ceil(diffMs / 1000));
      setSecondsLeft(sec);

      if (sec !== lastBeepSec) {
        setLastBeepSec(sec);
        if (sec > 0) {
          sounds.playCountdown(440 + (3 - sec) * 110, 0.15);
        } else if (sec === 0) {
          sounds.playGo();
          setTimeout(() => {
            onCountdownComplete();
          }, 600);
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [targetStartAt, lastBeepSec, onCountdownComplete]);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(7, 10, 18, 0.8)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 900,
      userSelect: 'none'
    }}>
      <div style={{
        fontSize: '0.9rem',
        color: '#00f0ff',
        textTransform: 'uppercase',
        letterSpacing: '0.25em',
        fontWeight: 800,
        marginBottom: '1rem'
      }}>
        GET READY TO RACE
      </div>

      <div style={{
        fontSize: '8rem',
        fontWeight: 900,
        lineHeight: 1,
        fontFamily: 'var(--font-main)',
        background: secondsLeft > 0 
          ? 'linear-gradient(135deg, #00f0ff, #a855f7)'
          : 'linear-gradient(135deg, #f59e0b, #10b981)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        filter: 'drop-shadow(0 0 40px rgba(0, 240, 255, 0.6))',
        animation: 'pulse 1s ease-in-out infinite'
      }}>
        {secondsLeft > 0 ? secondsLeft : 'GO!'}
      </div>

      <div style={{ color: '#94a3b8', fontSize: '1rem', marginTop: '1.5rem', fontWeight: 600 }}>
        Place your fingers on the home keys and get ready!
      </div>
    </div>
  );
};
