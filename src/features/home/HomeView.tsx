import React, { useState } from 'react';
import { Play, Users, ArrowRight, Zap, ShieldCheck, Globe, Trophy, Sparkles } from 'lucide-react';
import type { UserProfile } from '../../services/storageService';
import { VEHICLES } from '../../game/raceTypes';

interface HomeViewProps {
  profile: UserProfile;
  onStartPractice: () => void;
  onCreateRoom: () => void;
  onJoinRoom: (code: string) => void;
  onOpenProfile: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  profile,
  onStartPractice,
  onCreateRoom,
  onJoinRoom,
  onOpenProfile
}) => {
  const [roomCodeInput, setRoomCodeInput] = useState('');
  const [joinError, setJoinError] = useState<string | null>(null);

  const selectedVehicle = VEHICLES.find(v => v.id === profile.vehicleId) || VEHICLES[0];

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    const code = roomCodeInput.trim().toUpperCase();
    if (!code) {
      setJoinError('Please enter a room code');
      return;
    }
    if (code.length < 4) {
      setJoinError('Invalid room code format');
      return;
    }
    setJoinError(null);
    onJoinRoom(code);
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Hero Header */}
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.4rem 1rem',
          borderRadius: '9999px',
          background: 'rgba(0, 240, 255, 0.1)',
          border: '1px solid rgba(0, 240, 255, 0.25)',
          color: '#00f0ff',
          fontSize: '0.85rem',
          fontWeight: 700,
          marginBottom: '1.25rem'
        }}>
          <Sparkles size={14} />
          Next-Gen Multiplayer Speed Typing Arena
        </div>

        <h1 style={{
          fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
          fontWeight: 900,
          lineHeight: 1.15,
          letterSpacing: '-0.03em',
          marginBottom: '1.25rem'
        }}>
          Type at Light Speed <br />
          <span className="title-gradient">Challenge Every Racer!</span>
        </h1>

        <p style={{
          fontSize: 'clamp(1rem, 2vw, 1.25rem)',
          color: '#94a3b8',
          maxWidth: '680px',
          margin: '0 auto',
          lineHeight: 1.6
        }}>
          Join live multiplayer typing battles with friends using a simple invite link. Curated quotes, real-time vehicle tracks, and precision WPM tracking.
        </p>

        {/* Current racer banner */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.8rem',
          background: 'rgba(15, 23, 42, 0.65)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          padding: '0.5rem 1.2rem',
          borderRadius: '9999px',
          marginTop: '1.75rem',
          cursor: 'pointer'
        }}
        onClick={onOpenProfile}
        title="Click to customize your racer and colors"
        >
          <span style={{ 
            fontSize: '1.4rem',
            display: 'inline-block',
            transform: selectedVehicle.id === 'rocket' ? 'rotate(45deg)' : 'scaleX(-1)'
          }}>
            {selectedVehicle.emoji}
          </span>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem' }}>
            Racing as: <span style={{ color: '#00f0ff' }}>{profile.displayName}</span>
          </span>
          <span style={{ color: '#94a3b8', fontSize: '0.8rem', textDecoration: 'underline' }}>
            Change
          </span>
        </div>
      </div>

      {/* Main Action Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
        marginBottom: '3.5rem'
      }}>
        {/* Practice Mode */}
        <div 
          onClick={onStartPractice}
          className="glass-panel-interactive"
          style={{
            padding: '2rem',
            cursor: 'pointer',
            borderTop: '3px solid #00f0ff',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              background: 'rgba(0, 240, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem'
            }}>
              <Play size={26} color="#00f0ff" />
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Solo Practice
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              Sharpen your typing speed with difficulty presets and optional simulated AI bot competition. Measure your exact WPM and accuracy.
            </p>
          </div>

          <button className="btn btn-primary" style={{ width: '100%' }}>
            Start Practice <ArrowRight size={17} />
          </button>
        </div>

        {/* Create Room */}
        <div 
          onClick={onCreateRoom}
          className="glass-panel-interactive"
          style={{
            padding: '2rem',
            cursor: 'pointer',
            borderTop: '3px solid #a855f7',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              background: 'rgba(168, 85, 247, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem'
            }}>
              <Users size={26} color="#a855f7" />
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Create Race Room
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              Host a live match for 2 to 8 racers. Share your room link via WhatsApp, Discord, or Messenger to battle in real time!
            </p>
          </div>

          <button className="btn btn-purple" style={{ width: '100%' }}>
            Create Room Now <ArrowRight size={17} />
          </button>
        </div>

        {/* Join Room by Code */}
        <div 
          className="glass-panel"
          style={{
            padding: '2rem',
            borderTop: '3px solid #f59e0b',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              background: 'rgba(245, 158, 11, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem'
            }}>
              <Trophy size={26} color="#f59e0b" />
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Join with Code
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '1.2rem' }}>
              Enter the 6-character room code shared by your friend to jump straight onto the track.
            </p>
          </div>

          <form onSubmit={handleJoin}>
            <input
              type="text"
              maxLength={8}
              placeholder="e.g. RACE77"
              value={roomCodeInput}
              onChange={(e) => {
                setRoomCodeInput(e.target.value.toUpperCase());
                setJoinError(null);
              }}
              style={{
                width: '100%',
                padding: '0.8rem',
                borderRadius: '10px',
                background: '#090e1a',
                border: joinError ? '1px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.15)',
                color: '#fff',
                fontFamily: 'var(--font-mono)',
                fontSize: '1.1rem',
                textAlign: 'center',
                letterSpacing: '0.15em',
                fontWeight: 700,
                outline: 'none',
                marginBottom: '0.6rem'
              }}
            />
            {joinError && (
              <p style={{ color: '#ef4444', fontSize: '0.8rem', marginBottom: '0.5rem', textAlign: 'center' }}>
                {joinError}
              </p>
            )}
            <button type="submit" className="btn btn-secondary" style={{ width: '100%' }}>
              Join the Race
            </button>
          </form>
        </div>
      </div>

      {/* Highlights / Features Banner */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.25rem',
        padding: '1.5rem',
        borderRadius: '16px',
        background: 'rgba(15, 23, 42, 0.45)',
        border: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Zap size={22} color="#00f0ff" />
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Real-Time Sync</div>
            <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Vehicles move with every keystroke</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <ShieldCheck size={22} color="#10b981" />
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Precision Engine</div>
            <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Standardized WPM & Accuracy</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Globe size={22} color="#a855f7" />
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>No Account Barrier</div>
            <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Open link and race instantly</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Trophy size={22} color="#f59e0b" />
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Sharable Victory Cards</div>
            <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Flaunt your high scores anywhere</div>
          </div>
        </div>
      </div>
    </div>
  );
};
