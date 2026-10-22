import React from 'react';
import { type Player, VEHICLES, PLAYER_COLORS } from '../game/raceTypes';
import { Crown, WifiOff } from 'lucide-react';

interface RaceTrackProps {
  players: Player[];
  currentPlayerId: string;
}

export const RaceTrack: React.FC<RaceTrackProps> = ({ players, currentPlayerId }) => {
  return (
    <div className="race-track-container" style={{ padding: '1rem' }}>
      {/* Track Asphalt Ambient Top Line */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: 'linear-gradient(90deg, #00f0ff, #a855f7, #f59e0b)'
      }} />

      {players.map((player) => {
        const vehicle = VEHICLES.find(v => v.id === player.vehicleId) || VEHICLES[0];
        const color = PLAYER_COLORS.find(c => c.id === player.colorId) || PLAYER_COLORS[0];
        const isCurrent = player.id === currentPlayerId;

        // Progress maps from 0 to 92% of the runway width
        const progressClamped = Math.min(100, Math.max(0, player.progress));
        const vehicleLeftPercent = Math.min(91, (progressClamped / 100) * 91);

        return (
          <div 
            key={player.id} 
            style={{
              background: isCurrent ? 'rgba(0, 240, 255, 0.05)' : 'rgba(15, 23, 42, 0.55)',
              border: isCurrent ? '1px solid rgba(0, 240, 255, 0.3)' : '1px solid rgba(255, 255, 255, 0.07)',
              borderRadius: '12px',
              padding: '0.65rem 0.9rem',
              marginBottom: '0.65rem',
              boxShadow: isCurrent ? '0 0 16px rgba(0, 240, 255, 0.12)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            {/* Upper Metadata Row: Name, Crown, Badges, WPM, % */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.45rem',
              gap: '0.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', minWidth: 0 }}>
                {player.isHost && (
                  <span title="Room Host" style={{ display: 'inline-flex', alignItems: 'center' }}>
                    <Crown size={14} color="#f59e0b" />
                  </span>
                )}
                <span style={{
                  color: isCurrent ? '#00f0ff' : '#f8fafc',
                  fontWeight: isCurrent ? 800 : 700,
                  fontSize: '0.88rem',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {player.displayName}
                </span>

                {isCurrent && (
                  <span style={{
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    background: 'rgba(0, 240, 255, 0.18)',
                    color: '#00f0ff',
                    padding: '0.1rem 0.45rem',
                    borderRadius: '9999px',
                    border: '1px solid rgba(0, 240, 255, 0.4)',
                    letterSpacing: '0.04em'
                  }}>
                    YOU
                  </span>
                )}

                {player.rank && (
                  <span style={{
                    padding: '0.12rem 0.5rem',
                    borderRadius: '9999px',
                    background: player.rank === 1 ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'rgba(255, 255, 255, 0.15)',
                    color: '#fff',
                    fontSize: '0.7rem',
                    fontWeight: 800
                  }}>
                    {player.rank === 1 ? '🥇 #1 Champion' : player.rank === 2 ? '🥈 #2 Runner-Up' : `#${player.rank}`}
                  </span>
                )}
              </div>

              {/* Live WPM & Progress */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexShrink: 0 }}>
                {player.wpm > 0 && (
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#00f0ff' }}>
                    {player.wpm} <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>WPM</span>
                  </span>
                )}
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#e2e8f0', minWidth: '38px', textAlign: 'right' }}>
                  {Math.round(progressClamped)}%
                </span>
                {!player.isConnected && (
                  <span title="Disconnected" style={{ color: '#ef4444' }}>
                    <WifiOff size={13} />
                  </span>
                )}
              </div>
            </div>

            {/* Asphalt Track Runway (Dedicated Lane for Vehicle) */}
            <div style={{
              position: 'relative',
              height: '38px',
              background: 'rgba(9, 14, 26, 0.85)',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderLeft: `4px solid ${color.hex}`,
              display: 'flex',
              alignItems: 'center',
              overflow: 'hidden'
            }}>
              {/* Road center dashed line */}
              <div style={{
                position: 'absolute',
                left: 0,
                right: '30px',
                top: '50%',
                height: '2px',
                background: 'repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.12) 0px, rgba(255, 255, 255, 0.12) 10px, transparent 10px, transparent 20px)',
                transform: 'translateY(-50%)'
              }} />

              {/* Progress fill trace line behind vehicle */}
              <div style={{
                position: 'absolute',
                left: 0,
                width: `${vehicleLeftPercent}%`,
                top: '50%',
                height: '3px',
                background: `linear-gradient(90deg, transparent, ${color.hex})`,
                boxShadow: `0 0 10px ${color.hex}`,
                transform: 'translateY(-50%)',
                transition: 'width 0.2s cubic-bezier(0.1, 0.9, 0.2, 1)'
              }} />

              {/* Vehicle Runner */}
              <div 
                style={{
                  position: 'absolute',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  left: `calc(${vehicleLeftPercent}% + 4px)`,
                  transition: 'left 0.2s cubic-bezier(0.1, 0.9, 0.2, 1)',
                  zIndex: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <div 
                  style={{
                    fontSize: '1.75rem',
                    filter: `drop-shadow(0 0 8px ${color.glow})`,
                    userSelect: 'none',
                    lineHeight: 1,
                    display: 'inline-block',
                    transform: vehicle.id === 'rocket'
                      ? (progressClamped > 0 && progressClamped < 100 ? 'rotate(45deg) scale(1.08)' : 'rotate(45deg)')
                      : (progressClamped > 0 && progressClamped < 100 ? 'scaleX(-1) rotate(2deg) scale(1.05)' : 'scaleX(-1)'),
                    transition: 'transform 0.15s ease'
                  }}
                >
                  {vehicle.emoji}
                </div>

                {/* Exhaust particle flare when running */}
                {progressClamped > 0 && progressClamped < 100 && (
                  <div style={{
                    position: 'absolute',
                    left: '-10px',
                    top: '50%',
                    width: '12px',
                    height: '4px',
                    borderRadius: '9999px',
                    background: color.hex,
                    boxShadow: `0 0 8px ${color.hex}`,
                    transform: 'translateY(-50%)',
                    opacity: 0.85
                  }} />
                )}
              </div>

              {/* Checkered Finish Line */}
              <div 
                title="Finish Line" 
                style={{
                  position: 'absolute',
                  right: '6px',
                  top: '3px',
                  bottom: '3px',
                  width: '14px',
                  borderRadius: '2px',
                  background: 'repeating-linear-gradient(45deg, #ffffff, #ffffff 4px, #0f172a 4px, #0f172a 8px)',
                  opacity: 0.8,
                  boxShadow: '0 0 8px rgba(255, 255, 255, 0.3)'
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
