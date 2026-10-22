import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw, ArrowLeft, Bot } from 'lucide-react';
import { type UserProfile, recordRaceStats } from '../../services/storageService';
import { type Player, type TypingText } from '../../game/raceTypes';
import { getRandomText } from '../../data/typingTexts';
import { RaceTrack } from '../../components/RaceTrack';
import { TypingArea } from '../../components/TypingArea';
import { CountdownOverlay } from '../../components/CountdownOverlay';
import { ResultModal } from '../../components/ResultModal';
import { formatTime } from '../../game/scoring';

interface PracticeViewProps {
  profile: UserProfile;
  onBack: () => void;
}

export const PracticeView: React.FC<PracticeViewProps> = ({ profile, onBack }) => {
  const [language, setLanguage] = useState<'vi' | 'en'>('en');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [currentText, setCurrentText] = useState<TypingText>(() => getRandomText('en', 'easy'));
  const [withBot, setWithBot] = useState<boolean>(true);

  const [raceState, setRaceState] = useState<'idle' | 'countdown' | 'running' | 'finished'>('idle');
  const [countdownTarget, setCountdownTarget] = useState<number>(0);
  const [raceStartTime, setRaceStartTime] = useState<number | null>(null);

  const [userWpm, setUserWpm] = useState(0);
  const [userAccuracy, setUserAccuracy] = useState(100);
  const [userProgress, setUserProgress] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);

  const [botProgress, setBotProgress] = useState(0);
  const [botWpm, setBotWpm] = useState(0);

  const [showResult, setShowResult] = useState(false);
  const botIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Re-generate text when lang or difficulty changes
  const handleConfigChange = (lang: 'vi' | 'en', diff: 'easy' | 'medium' | 'hard') => {
    setLanguage(lang);
    setDifficulty(diff);
    setCurrentText(getRandomText(lang, diff));
    resetRace();
  };

  const resetRace = () => {
    setRaceState('idle');
    setUserWpm(0);
    setUserAccuracy(100);
    setUserProgress(0);
    setElapsedMs(0);
    setBotProgress(0);
    setBotWpm(0);
    setShowResult(false);
    if (botIntervalRef.current) clearInterval(botIntervalRef.current);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
  };

  const startCountdown = () => {
    resetRace();
    const target = Date.now() + 3000;
    setCountdownTarget(target);
    setRaceState('countdown');
  };

  const handleCountdownFinished = () => {
    const start = Date.now();
    setRaceStartTime(start);
    setRaceState('running');

    // Run game clock
    timerIntervalRef.current = setInterval(() => {
      setElapsedMs(Date.now() - start);
    }, 100);

    // Run bot simulation if enabled
    if (withBot) {
      // Bot types around 48-60 WPM
      const botTargetWpm = 45 + Math.floor(Math.random() * 20);
      setBotWpm(botTargetWpm);
      const charsPerSec = (botTargetWpm * 5) / 60;
      const totalChars = currentText.content.length;

      let currentBotChars = 0;
      botIntervalRef.current = setInterval(() => {
        currentBotChars += charsPerSec * 0.25;
        const prog = Math.min(100, (currentBotChars / totalChars) * 100);
        setBotProgress(prog);

        if (prog >= 100 && botIntervalRef.current) {
          clearInterval(botIntervalRef.current);
        }
      }, 250);
    }
  };

  const handleProgressUpdate = (progress: number, wpm: number, accuracy: number) => {
    setUserProgress(progress);
    setUserWpm(wpm);
    setUserAccuracy(accuracy);
  };

  const handleFinish = (wpm: number, accuracy: number, correctChars: number, _totalChars: number, _timeMs: number) => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (botIntervalRef.current) clearInterval(botIntervalRef.current);

    setRaceState('finished');
    recordRaceStats(wpm, accuracy, correctChars);
    setTimeout(() => {
      setShowResult(true);
    }, 500);
  };

  useEffect(() => {
    return () => {
      if (botIntervalRef.current) clearInterval(botIntervalRef.current);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  // Build racers list for RaceTrack
  const userRank = raceState === 'finished' ? (botProgress >= 100 && userProgress < 100 ? 2 : 1) : undefined;
  const botRank = raceState === 'finished' ? (userRank === 1 ? 2 : 1) : undefined;

  const players: Player[] = [
    {
      id: 'me',
      displayName: profile.displayName,
      vehicleId: profile.vehicleId,
      colorId: profile.colorId,
      isReady: true,
      isHost: true,
      isConnected: true,
      progress: userProgress,
      wpm: userWpm,
      accuracy: userAccuracy,
      finishTime: raceState === 'finished' ? elapsedMs : undefined,
      rank: userRank,
      lastSeenAt: Date.now()
    }
  ];

  if (withBot) {
    players.push({
      id: 'bot_ai',
      displayName: 'TurboBot [AI]',
      vehicleId: 'rocket',
      colorId: 'rose',
      isReady: true,
      isHost: false,
      isConnected: true,
      progress: botProgress,
      wpm: botWpm,
      accuracy: 98,
      finishTime: botProgress >= 100 ? elapsedMs : undefined,
      rank: botRank,
      lastSeenAt: Date.now()
    });
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '1.5rem' }}>
      {/* Top Header Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        <button
          onClick={onBack}
          className="btn btn-secondary"
          style={{ padding: '0.5rem 0.9rem', fontSize: '0.85rem' }}
        >
          <ArrowLeft size={16} /> Back
        </button>

        {/* Configuration Selectors */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          {/* Language Toggle */}
          <div style={{ display: 'flex', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '10px', padding: '3px' }}>
            <button
              onClick={() => handleConfigChange('en', difficulty)}
              style={{
                padding: '0.35rem 0.75rem',
                border: 'none',
                borderRadius: '8px',
                background: language === 'en' ? '#00f0ff' : 'transparent',
                color: language === 'en' ? '#070a12' : '#94a3b8',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              🇬🇧 English
            </button>
            <button
              onClick={() => handleConfigChange('vi', difficulty)}
              style={{
                padding: '0.35rem 0.75rem',
                border: 'none',
                borderRadius: '8px',
                background: language === 'vi' ? '#00f0ff' : 'transparent',
                color: language === 'vi' ? '#070a12' : '#94a3b8',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              🇻🇳 Vietnamese
            </button>
          </div>

          {/* Difficulty */}
          <div style={{ display: 'flex', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '10px', padding: '3px' }}>
            {(['easy', 'medium', 'hard'] as const).map(diff => (
              <button
                key={diff}
                onClick={() => handleConfigChange(language, diff)}
                style={{
                  padding: '0.35rem 0.75rem',
                  border: 'none',
                  borderRadius: '8px',
                  background: difficulty === diff ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                  color: difficulty === diff ? '#fff' : '#94a3b8',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  textTransform: 'capitalize'
                }}
              >
                {diff === 'easy' ? 'Easy' : diff === 'medium' ? 'Medium' : 'Hard'}
              </button>
            ))}
          </div>

          {/* Bot Toggle */}
          <button
            onClick={() => setWithBot(!withBot)}
            className="btn-secondary"
            style={{
              padding: '0.45rem 0.8rem',
              borderRadius: '10px',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              borderColor: withBot ? '#a855f7' : undefined
            }}
          >
            <Bot size={15} color={withBot ? '#a855f7' : '#94a3b8'} />
            <span style={{ color: withBot ? '#c084fc' : '#94a3b8', fontWeight: 600 }}>
              {withBot ? 'Bot Rival Enabled' : 'Solo Only'}
            </span>
          </button>
        </div>
      </div>

      {/* Live Track Component */}
      <div style={{ marginBottom: '1.5rem' }}>
        <RaceTrack players={players} currentPlayerId="me" />
      </div>

      {/* Live Race Metrics Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.75rem 1.25rem',
        background: 'rgba(15, 23, 42, 0.6)',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        marginBottom: '1rem'
      }}>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Speed</span>
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

        <div>
          {raceState === 'idle' ? (
            <button onClick={startCountdown} className="btn btn-primary" style={{ padding: '0.6rem 1.4rem' }}>
              Start Race!
            </button>
          ) : (
            <button onClick={resetRace} className="btn btn-secondary" style={{ padding: '0.6rem 1rem' }}>
              <RotateCcw size={15} /> Restart
            </button>
          )}
        </div>
      </div>

      {/* Text Passage Title */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '0.5rem',
        padding: '0 0.5rem'
      }}>
        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#e2e8f0' }}>
          📖 {currentText.title}
        </span>
        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
          {currentText.content.length} chars
        </span>
      </div>

      {/* Typing Engine Box */}
      <TypingArea
        key={currentText.id + '_' + raceStartTime}
        targetText={currentText.content}
        isRacing={raceState === 'running'}
        raceStartTime={raceStartTime}
        onProgressUpdate={handleProgressUpdate}
        onFinish={handleFinish}
      />

      {/* Synchronized Countdown Overlay */}
      {raceState === 'countdown' && (
        <CountdownOverlay
          targetStartAt={countdownTarget}
          onCountdownComplete={handleCountdownFinished}
        />
      )}

      {/* Result Modal */}
      <ResultModal
        isOpen={showResult}
        players={players}
        currentPlayerId="me"
        isHost={true}
        onRematch={() => {
          setShowResult(false);
          setCurrentText(getRandomText(language, difficulty));
          setTimeout(startCountdown, 200);
        }}
        onHome={onBack}
      />
    </div>
  );
};
