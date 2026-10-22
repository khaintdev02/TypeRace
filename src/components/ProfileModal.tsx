import React, { useState, useEffect } from 'react';
import { X, Check, Sparkles, Shield, User, LogOut, LogIn, Trophy } from 'lucide-react';
import { type UserProfile, type UserStats, saveProfile, getRandomDefaultName } from '../services/storageService';
import { VEHICLES, PLAYER_COLORS } from '../game/raceTypes';
import type { AuthUser } from '../services/authService';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  authUser: AuthUser;
  stats: UserStats;
  onSave: (updated: UserProfile) => void;
  onLogout: () => void;
  onOpenAuth: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  authUser,
  stats,
  onSave,
  onLogout,
  onOpenAuth
}) => {
  const [name, setName] = useState(profile.displayName);
  const [vehicleId, setVehicleId] = useState(profile.vehicleId);
  const [colorId, setColorId] = useState(profile.colorId);
  const [error, setError] = useState<string | null>(null);

  // Sync internal form state whenever modal is opened or profile / authUser changes
  useEffect(() => {
    if (isOpen) {
      setName(profile.displayName);
      setVehicleId(profile.vehicleId);
      setColorId(profile.colorId);
      setError(null);
    }
  }, [isOpen, profile, authUser]);

  if (!isOpen) return null;

  const isGuest = authUser.username === 'guest' || authUser.id.startsWith('guest_');
  const isAdmin = authUser.role === 'admin';

  const handleRandomName = () => {
    setName(getRandomDefaultName());
    setError(null);
  };

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Racer name cannot be empty');
      return;
    }
    if (trimmed.length < 2 || trimmed.length > 24) {
      setError('Name must be between 2 and 24 characters');
      return;
    }

    const updated: UserProfile = {
      displayName: trimmed,
      vehicleId,
      colorId
    };
    saveProfile(updated, isGuest ? 'guest' : authUser.username);
    onSave(updated);
    onClose();
  };

  const currentVehicle = VEHICLES.find(v => v.id === vehicleId) || VEHICLES[0];
  const currentColor = PLAYER_COLORS.find(c => c.id === colorId) || PLAYER_COLORS[0];

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
          maxWidth: '540px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '2rem',
          position: 'relative',
          border: '1px solid rgba(0, 240, 255, 0.25)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(0, 240, 255, 0.15)'
        }}
      >
        {/* Close Button */}
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

        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>
          {isGuest ? (
            <>Racer <span className="title-gradient">Loadout</span></>
          ) : (
            <>Account &amp; <span className="title-gradient">Profile</span></>
          )}
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
          {isGuest
            ? 'Customize your track appearance and signature colors'
            : `Managing account records and track loadout for @${authUser.username}`}
        </p>

        {/* Account Info / Status Card */}
        <div style={{
          background: isGuest ? 'rgba(15, 23, 42, 0.6)' : 'rgba(10, 25, 47, 0.7)',
          border: isGuest ? '1px solid rgba(255, 255, 255, 0.1)' : (isAdmin ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid rgba(0, 240, 255, 0.4)'),
          borderRadius: '12px',
          padding: '1rem 1.2rem',
          marginBottom: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              {isAdmin ? (
                <Shield size={18} color="#f59e0b" />
              ) : isGuest ? (
                <User size={18} color="#94a3b8" />
              ) : (
                <User size={18} color="#00f0ff" />
              )}
              <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>
                {isGuest ? 'Guest Mode (Temporary)' : `@${authUser.username}`}
              </span>
              <span style={{
                fontSize: '0.68rem',
                padding: '0.15rem 0.5rem',
                borderRadius: '9999px',
                fontWeight: 800,
                background: isAdmin ? '#f59e0b' : (isGuest ? 'rgba(148, 163, 184, 0.2)' : 'rgba(0, 240, 255, 0.2)'),
                color: isAdmin ? '#070a12' : (isGuest ? '#cbd5e1' : '#00f0ff'),
                border: isGuest ? '1px solid rgba(148, 163, 184, 0.3)' : 'none'
              }}>
                {isAdmin ? 'ADMIN' : (isGuest ? 'GUEST' : 'RACER')}
              </span>
            </div>

            {/* Quick Action in Card */}
            {isGuest ? (
              <button
                onClick={() => {
                  onClose();
                  onOpenAuth();
                }}
                className="btn-secondary"
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: '9999px',
                  fontSize: '0.78rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  color: '#00f0ff',
                  borderColor: 'rgba(0, 240, 255, 0.4)'
                }}
              >
                <LogIn size={13} />
                <span>Sign In</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="btn-secondary"
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: '9999px',
                  fontSize: '0.78rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  color: '#f87171',
                  borderColor: 'rgba(239, 68, 68, 0.3)'
                }}
                title="Sign out of current account"
              >
                <LogOut size={13} />
                <span>Sign Out</span>
              </button>
            )}
          </div>

          {/* Subtitle / Stat Bar */}
          {isGuest ? (
            <p style={{ margin: 0, fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.4 }}>
              Racing as a guest racer. Sign in or register to keep your speed records and customized vehicle permanently.
            </p>
          ) : (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.25rem',
              fontSize: '0.78rem',
              color: '#94a3b8',
              paddingTop: '0.2rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.06)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Trophy size={13} color="#f59e0b" />
                <span>Best: <strong style={{ color: '#f59e0b' }}>{stats.bestWpm} WPM</strong></span>
              </div>
              <div>Races: <strong style={{ color: '#fff' }}>{stats.totalRaces}</strong></div>
              <div>Accuracy: <strong style={{ color: '#10b981' }}>{stats.avgAccuracy}%</strong></div>
            </div>
          )}
        </div>

        {/* Live Preview Card */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.6)',
          border: `1px solid ${currentColor.hex}`,
          boxShadow: `0 0 20px ${currentColor.glow}`,
          borderRadius: '14px',
          padding: '1.2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1.2rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{
            fontSize: '3rem',
            lineHeight: 1,
            filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.5))',
            display: 'inline-block',
            transform: currentVehicle.id === 'rocket' ? 'rotate(45deg)' : 'scaleX(-1)'
          }}>
            {currentVehicle.emoji}
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Live Track Preview
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: currentColor.hex }}>
              {name.trim() || 'Unnamed Racer'}
            </div>
            <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
              {currentVehicle.name} • {currentColor.name}
            </div>
          </div>
        </div>

        {/* Nickname / Display Name Input */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f8fafc' }}>
              {isGuest ? 'Guest Racer Handle (2–24 characters)' : 'Display Name in Game (2–24 characters)'}
            </label>
            <button
              type="button"
              onClick={handleRandomName}
              style={{
                background: 'none',
                border: 'none',
                color: '#00f0ff',
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}
            >
              <Sparkles size={13} />
              Randomize
            </button>
          </div>
          <input
            type="text"
            value={name}
            maxLength={24}
            onChange={(e) => {
              setName(e.target.value);
              setError(null);
            }}
            placeholder="Enter racer handle..."
            style={{
              width: '100%',
              padding: '0.8rem 1rem',
              borderRadius: '10px',
              border: error ? '1px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.15)',
              background: '#090e1a',
              color: '#fff',
              fontSize: '1rem',
              fontFamily: 'var(--font-main)',
              outline: 'none'
            }}
          />
          {error && (
            <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.4rem' }}>{error}</p>
          )}
        </div>

        {/* Vehicle Selection Grid */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f8fafc', display: 'block', marginBottom: '0.5rem' }}>
            Choose Your Vehicle
          </label>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '0.5rem'
          }}>
            {VEHICLES.map((v) => {
              const isSelected = v.id === vehicleId;
              return (
                <button
                  type="button"
                  key={v.id}
                  onClick={() => setVehicleId(v.id)}
                  style={{
                    padding: '0.75rem 0.5rem',
                    background: isSelected ? 'rgba(0, 240, 255, 0.15)' : 'rgba(15, 23, 42, 0.5)',
                    border: isSelected ? '2px solid #00f0ff' : '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.3rem',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span style={{ 
                    fontSize: '1.65rem',
                    display: 'inline-block',
                    transform: v.id === 'rocket' ? 'rotate(45deg)' : 'scaleX(-1)'
                  }}>
                    {v.emoji}
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: isSelected ? '#00f0ff' : '#94a3b8' }}>
                    {v.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Color Selection */}
        <div style={{ marginBottom: '2rem' }}>
          <label style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f8fafc', display: 'block', marginBottom: '0.5rem' }}>
            Signature Color
          </label>
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            {PLAYER_COLORS.map((c) => {
              const isSelected = c.id === colorId;
              return (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => setColorId(c.id)}
                  style={{
                    flex: 1,
                    height: '40px',
                    borderRadius: '10px',
                    background: c.bgGradient,
                    border: isSelected ? '2px solid #ffffff' : 'none',
                    boxShadow: isSelected ? `0 0 16px ${c.glow}` : 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: isSelected ? 'scale(1.08)' : 'scale(1)',
                    transition: 'all 0.15s ease'
                  }}
                  title={c.name}
                >
                  {isSelected && <Check size={18} color="#ffffff" strokeWidth={3} />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary"
            style={{ flex: 1 }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="btn btn-primary"
            style={{ flex: 2 }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
