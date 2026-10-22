import React, { useState } from 'react';
import { Copy, Check, Users, Crown, Bot, Play, LogOut } from 'lucide-react';
import { type RoomData, VEHICLES, PLAYER_COLORS } from '../../game/raceTypes';
import { setPlayerReady, startRaceCountdown, addBotRacer } from '../../services/roomService';

interface RoomLobbyViewProps {
  room: RoomData;
  currentPlayerId: string;
  onLeave: () => void;
}

export const RoomLobbyView: React.FC<RoomLobbyViewProps> = ({
  room,
  currentPlayerId,
  onLeave
}) => {
  const [copied, setCopied] = useState(false);
  const playersList = Object.values(room.players);
  const me = room.players[currentPlayerId];
  const isHost = room.hostPlayerId === currentPlayerId;

  const handleCopyLink = () => {
    const url = `${window.location.origin}${window.location.pathname}?room=${room.roomId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleToggleReady = () => {
    if (!me) return;
    setPlayerReady(room.roomId, currentPlayerId, !me.isReady);
  };

  const handleStartRace = () => {
    if (!isHost) return;
    startRaceCountdown(room.roomId, 3);
  };

  const handleAddBot = () => {
    addBotRacer(room.roomId);
  };

  const canStart = isHost && playersList.length >= 1 && playersList.every(p => p.isReady);

  return (
    <div style={{ maxWidth: '880px', margin: '0 auto', padding: '1.5rem' }}>
      {/* Lobby Header Card */}
      <div 
        className="glass-panel"
        style={{
          padding: '2rem',
          textAlign: 'center',
          marginBottom: '2rem',
          border: '1px solid rgba(0, 240, 255, 0.25)',
          position: 'relative'
        }}
      >
        <button
          onClick={onLeave}
          className="btn btn-secondary"
          style={{
            position: 'absolute',
            top: '1.25rem',
            left: '1.25rem',
            padding: '0.45rem 0.8rem',
            fontSize: '0.8rem'
          }}
        >
          <LogOut size={15} /> Leave Room
        </button>

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.3rem 0.8rem',
          borderRadius: '9999px',
          background: 'rgba(0, 240, 255, 0.1)',
          color: '#00f0ff',
          fontSize: '0.8rem',
          fontWeight: 700,
          marginBottom: '0.75rem'
        }}>
          <Users size={14} />
          Online Multiplayer Room
        </div>

        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
          Room Code: <span className="title-gradient" style={{ letterSpacing: '0.1em' }}>{room.roomId}</span>
        </h1>

        <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Share this room code or invite link to challenge friends in a real-time typing speed showdown!
        </p>

        {/* Copy Link Action Button */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={handleCopyLink}
            className="btn btn-primary"
            style={{ padding: '0.65rem 1.5rem' }}
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
            {copied ? 'Link Copied!' : 'Copy Invite Link'}
          </button>

          {isHost && playersList.length < 8 && (
            <button
              onClick={handleAddBot}
              className="btn btn-secondary"
              style={{ padding: '0.65rem 1.25rem' }}
              title="Add simulated AI bot racer"
            >
              <Bot size={18} color="#a855f7" />
              Add AI Racer
            </button>
          )}
        </div>
      </div>

      {/* Players in Room List */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
            Racer Roster ({playersList.length}/8)
          </h2>
          <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
            {isHost ? 'You are Host' : 'Waiting for host to launch...'}
          </span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '1rem'
        }}>
          {playersList.map((player) => {
            const vehicle = VEHICLES.find(v => v.id === player.vehicleId) || VEHICLES[0];
            const color = PLAYER_COLORS.find(c => c.id === player.colorId) || PLAYER_COLORS[0];
            const isMe = player.id === currentPlayerId;

            return (
              <div 
                key={player.id}
                className="glass-panel"
                style={{
                  padding: '1.2rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  border: isMe ? `1px solid ${color.hex}` : '1px solid rgba(255, 255, 255, 0.08)',
                  boxShadow: isMe ? `0 0 20px ${color.glow}` : 'none'
                }}
              >
                <div style={{
                  fontSize: '2.4rem',
                  filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.5))'
                }}>
                  {vehicle.emoji}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                    {player.isHost && <Crown size={14} color="#f59e0b" />}
                    <div style={{
                      fontWeight: 800,
                      color: isMe ? '#00f0ff' : '#fff',
                      fontSize: '0.95rem',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {player.displayName} {isMe && '(You)'}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{
                      fontSize: '0.75rem',
                      padding: '0.15rem 0.6rem',
                      borderRadius: '9999px',
                      background: player.isReady ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                      color: player.isReady ? '#34d399' : '#f87171',
                      fontWeight: 700
                    }}>
                      {player.isReady ? '✓ Ready' : 'Waiting...'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Passage Preview */}
      <div 
        className="glass-panel"
        style={{
          padding: '1.25rem 1.5rem',
          marginBottom: '2rem',
          background: 'rgba(15, 23, 42, 0.5)'
        }}
      >
        <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
          Race Passage: <strong style={{ color: '#00f0ff' }}>{room.text.title}</strong>
        </div>
        <div style={{
          color: '#cbd5e1',
          fontSize: '0.95rem',
          lineHeight: 1.5,
          fontStyle: 'italic'
        }}>
          "{room.text.content}"
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '1rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        paddingTop: '1.5rem'
      }}>
        {!isHost && (
          <button
            onClick={handleToggleReady}
            className={me?.isReady ? 'btn btn-secondary' : 'btn btn-primary'}
            style={{ padding: '0.8rem 2.5rem', fontSize: '1.05rem' }}
          >
            {me?.isReady ? 'Cancel Ready' : 'I am Ready!'}
          </button>
        )}

        {isHost && (
          <button
            onClick={handleStartRace}
            disabled={!canStart}
            className="btn btn-primary"
            style={{
              padding: '0.85rem 3rem',
              fontSize: '1.1rem',
              opacity: canStart ? 1 : 0.5,
              cursor: canStart ? 'pointer' : 'not-allowed'
            }}
          >
            <Play size={20} /> Launch Race!
          </button>
        )}
      </div>
    </div>
  );
};
