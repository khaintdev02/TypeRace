import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Share2, RotateCcw, Home, Check } from 'lucide-react';
import { type Player, VEHICLES } from '../game/raceTypes';
import { formatTime } from '../game/scoring';

interface ResultModalProps {
  isOpen: boolean;
  players: Player[];
  currentPlayerId: string;
  isHost: boolean;
  onRematch: () => void;
  onHome: () => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({
  isOpen,
  players,
  currentPlayerId,
  isHost,
  onRematch,
  onHome
}) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Confetti burst
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Sort players by rank or progress
  const sorted = [...players].sort((a, b) => {
    if (a.rank && b.rank) return a.rank - b.rank;
    if (a.rank) return -1;
    if (b.rank) return 1;
    return b.progress - a.progress;
  });

  const me = players.find(p => p.id === currentPlayerId);
  const myRank = me?.rank || (sorted.findIndex(p => p.id === currentPlayerId) + 1);
  const myVehicle = VEHICLES.find(v => v.id === me?.vehicleId) || VEHICLES[0];

  const handleShare = () => {
    const text = `🏁 I just completed a TypeRace match!\n🏎️ Vehicle: ${myVehicle.name} ${myVehicle.emoji}\n⚡ Speed: ${me?.wpm || 0} WPM\n🎯 Accuracy: ${me?.accuracy || 100}%\n🏆 Finish Rank: #${myRank}\n👉 Test your typing speed on TypeRace now!`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(5, 8, 15, 0.9)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div 
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '580px',
          padding: '2.25rem',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(245, 158, 11, 0.15)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.25rem' }}>
            {myRank === 1 ? '🏆' : myRank === 2 ? '🥈' : '🎖️'}
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 900 }}>
            {myRank === 1 ? (
              <span className="title-gold">TRACK CHAMPION!</span>
            ) : (
              <span className="title-gradient">RACE FINISHED!</span>
            )}
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
            {myRank === 1 ? 'You took first place with blazing speed!' : `You crossed the finish line in #${myRank} place!`}
          </p>
        </div>

        {/* My Stats Highlight */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '0.75rem',
          marginBottom: '1.75rem'
        }}>
          <div className="stat-badge">
            <span className="stat-badge-value" style={{ color: '#00f0ff' }}>
              {me?.wpm || 0}
            </span>
            <span className="stat-badge-label">Speed</span>
          </div>

          <div className="stat-badge">
            <span className="stat-badge-value" style={{ color: '#10b981' }}>
              {me?.accuracy || 100}%
            </span>
            <span className="stat-badge-label">Accuracy</span>
          </div>

          <div className="stat-badge">
            <span className="stat-badge-value" style={{ color: '#f59e0b' }}>
              #{myRank}
            </span>
            <span className="stat-badge-label">Rank</span>
          </div>

          <div className="stat-badge">
            <span className="stat-badge-value" style={{ color: '#a855f7' }}>
              {me?.finishTime ? formatTime(me.finishTime) : '—'}
            </span>
            <span className="stat-badge-label">Time</span>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.6)',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          overflow: 'hidden',
          marginBottom: '1.75rem'
        }}>
          <div style={{
            padding: '0.6rem 1rem',
            background: 'rgba(255, 255, 255, 0.04)',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: '#94a3b8',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            display: 'grid',
            gridTemplateColumns: '50px 1fr 90px 90px'
          }}>
            <span>Rank</span>
            <span>Racer</span>
            <span style={{ textAlign: 'right' }}>Speed</span>
            <span style={{ textAlign: 'right' }}>Time</span>
          </div>

          <div style={{ maxHeight: '180px', overflowY: 'auto' }}>
            {sorted.map((player, idx) => {
              const rank = player.rank || (idx + 1);
              const vehicle = VEHICLES.find(v => v.id === player.vehicleId) || VEHICLES[0];
              const isMe = player.id === currentPlayerId;

              return (
                <div 
                  key={player.id}
                  style={{
                    padding: '0.65rem 1rem',
                    display: 'grid',
                    gridTemplateColumns: '50px 1fr 90px 90px',
                    alignItems: 'center',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                    background: isMe ? 'rgba(0, 240, 255, 0.08)' : 'transparent'
                  }}
                >
                  <span style={{
                    fontWeight: 800,
                    color: rank === 1 ? '#f59e0b' : rank === 2 ? '#e2e8f0' : rank === 3 ? '#d97706' : '#94a3b8'
                  }}>
                    #{rank}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span>{vehicle.emoji}</span>
                    <span style={{ fontWeight: isMe ? 800 : 600, color: isMe ? '#00f0ff' : '#fff', fontSize: '0.9rem' }}>
                      {player.displayName} {isMe && '(You)'}
                    </span>
                  </div>
                  <span style={{ textAlign: 'right', fontWeight: 700, color: '#00f0ff' }}>
                    {player.wpm} WPM
                  </span>
                  <span style={{ textAlign: 'right', color: '#94a3b8', fontSize: '0.85rem' }}>
                    {player.finishTime ? formatTime(player.finishTime) : '—'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={onHome}
            className="btn btn-secondary"
            style={{ flex: 1 }}
          >
            <Home size={17} />
            Home
          </button>

          <button
            onClick={handleShare}
            className="btn btn-secondary"
            style={{ flex: 1, borderColor: copied ? '#10b981' : undefined }}
          >
            {copied ? <Check size={17} color="#10b981" /> : <Share2 size={17} />}
            {copied ? 'Copied Card!' : 'Share Card'}
          </button>

          {isHost && (
            <button
              onClick={onRematch}
              className="btn btn-primary"
              style={{ flex: 1.3 }}
            >
              <RotateCcw size={17} />
              Rematch
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
