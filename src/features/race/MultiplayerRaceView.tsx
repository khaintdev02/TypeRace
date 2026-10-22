import React, { useState, useEffect, useRef } from 'react';
import type { RoomData } from '../../game/raceTypes';
import { RaceTrack } from '../../components/RaceTrack';
import { TypingArea } from '../../components/TypingArea';
import { CountdownOverlay } from '../../components/CountdownOverlay';
import { ResultModal } from '../../components/ResultModal';
import { updatePlayerProgress, setRaceRunning, triggerRematch } from '../../services/roomService';
import { formatTime } from '../../game/scoring';
import { recordRaceStats } from '../../services/storageService';

interface MultiplayerRaceViewProps {
  room: RoomData;
  currentPlayerId: string;
  onLeave: () => void;
}

export const MultiplayerRaceView: React.FC<MultiplayerRaceViewProps> = ({
  room,
  currentPlayerId,
  onLeave
}) => {
  const [userWpm, setUserWpm] = useState(0);
  const [userAccuracy, setUserAccuracy] = useState(100);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const lastUpdateRef = useRef<number>(0);
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isHost = room.hostPlayerId === currentPlayerId;
  const isRacing = room.status === 'running';

  // Handle timer
  useEffect(() => {
    if (room.status === 'running' && room.startAt) {
      timerIntervalRef.current = setInterval(() => {
        setElapsedMs(Math.max(0, Date.now() - (room.startAt || Date.now())));
      }, 100);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [room.status, room.startAt]);

  // Check if race finished or user finished
  useEffect(() => {
    const me = room.players[currentPlayerId];
    if (me && me.progress >= 100) {
      setShowResult(true);
    }
  }, [room.players, currentPlayerId]);

  // Throttled progress update to Firebase / Local Bus
  const handleProgressUpdate = (progress: number, wpm: number, accuracy: number, isFinished: boolean) => {
    setUserWpm(wpm);
    setUserAccuracy(accuracy);

    const now = Date.now();
    // Throttle to 300ms unless finished
    if (now - lastUpdateRef.current >= 300 || isFinished) {
      lastUpdateRef.current = now;
      const finishTime = isFinished ? (room.startAt ? now - room.startAt : 0) : undefined;
      
      // Compute rank if finished
      let rank: number | undefined = undefined;
      if (isFinished) {
        const finishedCount = Object.values(room.players).filter(p => p.progress >= 100).length;
        rank = finishedCount + 1;
      }

      updatePlayerProgress(room.roomId, currentPlayerId, progress, wpm, accuracy, finishTime, rank);
    }
  };

  const handleFinish = (wpm: number, accuracy: number, correctChars: number, _totalChars: number, _timeMs: number) => {
    recordRaceStats(wpm, accuracy, correctChars);
    setTimeout(() => {
      setShowResult(true);
    }, 400);
  };

  const handleCountdownComplete = () => {
    if (isHost && room.status === 'countdown') {
      setRaceRunning(room.roomId);
    }
  };

  const handleRematch = () => {
    if (isHost) {
      setShowResult(false);
      triggerRematch(room.roomId);
    }
  };

  const playersList = Object.values(room.players);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '1.5rem' }}>
      {/* Race Top Status Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.75rem 1.25rem',
        background: 'rgba(15, 23, 42, 0.6)',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        marginBottom: '1.25rem'
      }}>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Your Speed</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#00f0ff' }}>
              {userWpm} <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>WPM</span>
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Accuracy</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10b981' }}>
              {userAccuracy}%
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Time</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f59e0b' }}>
              {formatTime(elapsedMs)}
            </div>
          </div>
        </div>

        <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
          Room: <strong style={{ color: '#00f0ff' }}>{room.roomId}</strong>
        </div>
      </div>

      {/* Concurrent Race Track */}
      <div style={{ marginBottom: '1.5rem' }}>
        <RaceTrack players={playersList} currentPlayerId={currentPlayerId} />
      </div>

      {/* Target Passage Title */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '0.5rem',
        padding: '0 0.5rem'
      }}>
        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#e2e8f0' }}>
          📖 {room.text.title}
        </span>
        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
          {room.text.content.length} chars
        </span>
      </div>

      {/* Typing Input Box */}
      <TypingArea
        key={room.raceId}
        targetText={room.text.content}
        isRacing={isRacing}
        raceStartTime={room.startAt || null}
        onProgressUpdate={handleProgressUpdate}
        onFinish={handleFinish}
      />

      {/* Countdown Overlay */}
      {room.status === 'countdown' && room.startAt && (
        <CountdownOverlay
          targetStartAt={room.startAt}
          onCountdownComplete={handleCountdownComplete}
        />
      )}

      {/* Leaderboard Results Modal */}
      <ResultModal
        isOpen={showResult}
        players={playersList}
        currentPlayerId={currentPlayerId}
        isHost={isHost}
        onRematch={handleRematch}
        onHome={onLeave}
      />
    </div>
  );
};
