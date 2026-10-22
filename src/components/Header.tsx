import React, { useState } from 'react';
import { Volume2, VolumeX, Trophy, Shield, LogIn, LogOut } from 'lucide-react';
import { type UserProfile, getUserStats } from '../services/storageService';
import { sounds } from '../game/soundEffects';
import { VEHICLES, PLAYER_COLORS } from '../game/raceTypes';
import type { AuthUser } from '../services/authService';

interface HeaderProps {
  profile: UserProfile;
  authUser: AuthUser;
  onOpenProfile: () => void;
  onOpenStats: () => void;
  onOpenAuth: () => void;
  onOpenAdmin: () => void;
  onLogout: () => void;
  currentMode: 'home' | 'practice' | 'room';
  onNavigateHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  authUser,
  onOpenProfile,
  onOpenStats,
  onOpenAuth,
  onOpenAdmin,
  onLogout,
  onNavigateHome
}) => {
  const [soundOn, setSoundOn] = useState<boolean>(sounds.isEnabled());
  const selectedVehicle = VEHICLES.find(v => v.id === profile.vehicleId) || VEHICLES[0];
  const selectedColor = PLAYER_COLORS.find(c => c.id === profile.colorId) || PLAYER_COLORS[0];
  const isAdmin = authUser.role === 'admin';
  const isGuest = authUser.username === 'guest' || authUser.username === 'khach' || authUser.id.startsWith('guest_');
  const stats = getUserStats(isGuest ? 'guest' : authUser.username);

  const handleToggleSound = () => {
    const updated = sounds.toggleSound();
    setSoundOn(updated);
  };

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1rem 1.5rem',
      maxWidth: '1200px',
      margin: '0 auto',
      width: '100%'
    }}>
      {/* Logo */}
      <div 
        onClick={onNavigateHome}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          cursor: 'pointer'
        }}
      >
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #00f0ff 0%, #a855f7 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.4rem',
          boxShadow: '0 0 16px rgba(0, 240, 255, 0.4)'
        }}>
          🏎️
        </div>
        <div>
          <h1 style={{
            fontSize: '1.6rem',
            fontWeight: '900',
            letterSpacing: '-0.03em',
            margin: 0,
            lineHeight: 1
          }}>
            <span style={{ color: '#fff' }}>TYPE</span>
            <span style={{ color: '#00f0ff' }}>RACE</span>
          </h1>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, letterSpacing: '0.05em' }}>
            SPEED TYPING GP
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Stats Pill */}
        <button
          onClick={onOpenStats}
          className="btn-secondary"
          style={{
            padding: '0.5rem 0.9rem',
            borderRadius: '9999px',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
          title="Career Performance Stats"
        >
          <Trophy size={16} color="#f59e0b" />
          <span style={{ fontWeight: 700, color: '#f59e0b' }}>{stats.bestWpm}</span>
          <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>WPM</span>
        </button>

        {/* Admin Dashboard Button (Only for Admin) */}
        {isAdmin && (
          <button
            onClick={onOpenAdmin}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '9999px',
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: '#070a12',
              fontWeight: 800,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 0 16px rgba(245, 158, 11, 0.4)'
            }}
            title="Open System Admin Console"
          >
            <Shield size={15} />
            <span>👑 Admin Console</span>
          </button>
        )}

        {/* Auth / Account Button */}
        {isGuest ? (
          <button
            onClick={onOpenAuth}
            className="btn-secondary"
            style={{
              padding: '0.5rem 0.9rem',
              borderRadius: '9999px',
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
            title="Sign in or register an account / Admin access"
          >
            <LogIn size={15} color="#00f0ff" />
            <span style={{ color: '#00f0ff', fontWeight: 600 }}>Sign In</span>
          </button>
        ) : (
          <button
            onClick={onLogout}
            className="btn-secondary"
            style={{
              padding: '0.5rem 0.75rem',
              borderRadius: '9999px',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
            title={`Signed in as ${authUser.username} (${authUser.role}). Click to sign out`}
          >
            <LogOut size={14} color="#f87171" />
            <span style={{ color: '#f87171', fontSize: '0.75rem' }}>Sign Out</span>
          </button>
        )}

        {/* Sound Toggle */}
        <button
          onClick={handleToggleSound}
          className="btn-secondary"
          style={{
            padding: '0.5rem',
            borderRadius: '50%',
            width: '38px',
            height: '38px'
          }}
          title={soundOn ? "Mute Sound" : "Unmute Sound"}
        >
          {soundOn ? <Volume2 size={18} color="#00f0ff" /> : <VolumeX size={18} color="#64748b" />}
        </button>

        {/* Profile Button */}
        <button
          onClick={onOpenProfile}
          className="btn-secondary"
          style={{
            padding: '0.4rem 0.85rem',
            borderRadius: '9999px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            border: `1px solid ${selectedColor.hex}`
          }}
          title={
            isGuest 
              ? `Guest Racer: ${profile.displayName}. Click to customize loadout or sign in.`
              : `Account: @${authUser.username} (${authUser.role}). Click to view account & edit racer loadout.`
          }
        >
          <span style={{ 
            fontSize: '1.2rem',
            display: 'inline-block',
            transform: selectedVehicle.id === 'rocket' ? 'rotate(45deg)' : 'scaleX(-1)'
          }}>
            {selectedVehicle.emoji}
          </span>
          <span style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem' }}>
            {profile.displayName}
          </span>
          {isAdmin ? (
            <span style={{
              fontSize: '0.65rem',
              padding: '0.1rem 0.4rem',
              borderRadius: '9999px',
              background: '#f59e0b',
              color: '#070a12',
              fontWeight: 800
            }}>
              ADMIN
            </span>
          ) : isGuest ? (
            <span style={{
              fontSize: '0.65rem',
              padding: '0.1rem 0.4rem',
              borderRadius: '9999px',
              background: 'rgba(148, 163, 184, 0.2)',
              color: '#94a3b8',
              fontWeight: 700,
              border: '1px solid rgba(148, 163, 184, 0.3)'
            }}>
              GUEST
            </span>
          ) : (
            <span style={{
              fontSize: '0.65rem',
              padding: '0.1rem 0.4rem',
              borderRadius: '9999px',
              background: 'rgba(0, 240, 255, 0.2)',
              color: '#00f0ff',
              fontWeight: 800
            }}>
              RACER
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
