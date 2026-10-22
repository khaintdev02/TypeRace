import React from 'react';
import { X, Flame, Target, Award, Zap } from 'lucide-react';
import { getUserStats } from '../services/storageService';

import type { AuthUser } from '../services/authService';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  authUser?: AuthUser;
}

export const StatsModal: React.FC<StatsModalProps> = ({ isOpen, onClose, authUser }) => {
  if (!isOpen) return null;
  const username = authUser ? (authUser.username === 'guest' ? 'guest' : authUser.username) : undefined;
  const stats = getUserStats(username);

  const getRankTitle = (wpm: number) => {
    if (wpm >= 100) return { title: 'Speed God', color: '#f59e0b', desc: 'Top 1% fastest typists in the world!' };
    if (wpm >= 75) return { title: 'F1 Demon', color: '#a855f7', desc: 'Incredible reflex and keyboard velocity!' };
    if (wpm >= 50) return { title: 'Pro Racer', color: '#00f0ff', desc: 'Smooth, consistent speed and rhythm.' };
    if (wpm >= 30) return { title: 'Track Rookie', color: '#10b981', desc: 'Steadily improving each race.' };
    return { title: 'Novice Typist', color: '#94a3b8', desc: 'Keep practicing every day to level up!' };
  };

  const rankInfo = getRankTitle(stats.bestWpm);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(5, 8, 15, 0.85)',
      backdropFilter: 'blur(10px)',
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
          maxWidth: '460px',
          padding: '2rem',
          position: 'relative',
          border: '1px solid rgba(245, 158, 11, 0.3)'
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer'
          }}
        >
          <X size={20} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.25rem' }}>🏆</div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 900 }}>
            Career <span className="title-gold">Records</span>
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            {authUser && authUser.username !== 'guest' 
              ? `Career racing records for @${authUser.username}` 
              : 'Temporary guest session statistics'}
          </p>
        </div>

        {/* Current Rank Badge */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.7)',
          borderRadius: '14px',
          border: `1px solid ${rankInfo.color}`,
          padding: '1rem',
          textAlign: 'center',
          marginBottom: '1.5rem'
        }}>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Current Speed Tier
          </div>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: rankInfo.color, marginTop: '0.2rem' }}>
            {rankInfo.title}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '0.2rem' }}>
            {rankInfo.desc}
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '0.75rem',
          marginBottom: '1.5rem'
        }}>
          <div className="stat-badge" style={{ padding: '1rem' }}>
            <Zap size={20} color="#00f0ff" style={{ marginBottom: '0.25rem' }} />
            <span className="stat-badge-value" style={{ color: '#00f0ff' }}>
              {stats.bestWpm}
            </span>
            <span className="stat-badge-label">Peak WPM</span>
          </div>

          <div className="stat-badge" style={{ padding: '1rem' }}>
            <Award size={20} color="#f59e0b" style={{ marginBottom: '0.25rem' }} />
            <span className="stat-badge-value" style={{ color: '#f59e0b' }}>
              {stats.totalRaces}
            </span>
            <span className="stat-badge-label">Races Finished</span>
          </div>

          <div className="stat-badge" style={{ padding: '1rem' }}>
            <Target size={20} color="#10b981" style={{ marginBottom: '0.25rem' }} />
            <span className="stat-badge-value" style={{ color: '#10b981' }}>
              {stats.avgAccuracy}%
            </span>
            <span className="stat-badge-label">Avg Accuracy</span>
          </div>

          <div className="stat-badge" style={{ padding: '1rem' }}>
            <Flame size={20} color="#ec4899" style={{ marginBottom: '0.25rem' }} />
            <span className="stat-badge-value" style={{ color: '#ec4899' }}>
              {stats.totalWords}
            </span>
            <span className="stat-badge-label">Words Typed</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="btn btn-primary"
          style={{ width: '100%' }}
        >
          Close
        </button>
      </div>
    </div>
  );
};
