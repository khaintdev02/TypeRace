import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ProfileModal } from './components/ProfileModal';
import { AuthModal } from './components/AuthModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { StatsModal } from './components/StatsModal';
import { DonateQrModal } from './components/DonateQrModal';
import { Coffee } from 'lucide-react';
import { HomeView } from './features/home/HomeView';
import { PracticeView } from './features/practice/PracticeView';
import { RoomLobbyView } from './features/room/RoomLobbyView';
import { MultiplayerRaceView } from './features/race/MultiplayerRaceView';
import { getSavedProfile, saveProfile, getUserStats, type UserProfile } from './services/storageService';
import { getCurrentUser, logoutUser, syncAllUsersToFirebase, updateAuthUserProfile, type AuthUser } from './services/authService';
import { type RoomData, type Player, VEHICLES, PLAYER_COLORS } from './game/raceTypes';
import { createRoom, joinRoom, leaveRoom, subscribeToRoom } from './services/roomService';
import { getRandomText } from './data/typingTexts';

export const App: React.FC = () => {
  const [authUser, setAuthUser] = useState<AuthUser>(() => getCurrentUser());
  const [profile, setProfile] = useState<UserProfile>(() => {
    const current = getCurrentUser();
    if (current.username !== 'guest') {
      return {
        displayName: current.displayName,
        vehicleId: current.avatarVehicle || VEHICLES[0].id,
        colorId: current.avatarColor || PLAYER_COLORS[0].id
      };
    }
    return getSavedProfile('guest');
  });
  const [mode, setMode] = useState<'home' | 'practice' | 'room'>('home');
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);
  const [roomData, setRoomData] = useState<RoomData | null>(null);

  // Modals
  const [profileOpen, setProfileOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);
  const [donateQrOpen, setDonateQrOpen] = useState(false);

  // Session Player ID (stable per browser tab)
  const [playerId] = useState<string>(() => {
    let id = sessionStorage.getItem('typerace_session_player_id');
    if (!id) {
      id = 'racer_' + Math.random().toString(36).substring(2, 9);
      sessionStorage.setItem('typerace_session_player_id', id);
    }
    return id;
  });

  // Sync users to Firebase RTDB and check URL params on initial mount
  useEffect(() => {
    syncAllUsersToFirebase();

    const params = new URLSearchParams(window.location.search);
    const roomParam = params.get('room');
    if (roomParam) {
      handleJoinRoom(roomParam);
    }
  }, []);

  // Room subscription
  useEffect(() => {
    if (!currentRoomId) return;

    const unsubscribe = subscribeToRoom(currentRoomId, (updatedRoom) => {
      if (!updatedRoom) {
        alert('The room does not exist or has been closed.');
        handleLeaveRoom();
      } else {
        setRoomData(updatedRoom);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [currentRoomId]);

  // Synchronize profile state with authUser changes
  useEffect(() => {
    if (authUser.username === 'guest') {
      const guestProf = getSavedProfile('guest');
      setProfile(guestProf);
    } else {
      setProfile({
        displayName: authUser.displayName,
        vehicleId: authUser.avatarVehicle || VEHICLES[0].id,
        colorId: authUser.avatarColor || PLAYER_COLORS[0].id
      });
    }
  }, [authUser]);

  const handleLoginSuccess = (user: AuthUser) => {
    setAuthUser(user);
    const updatedProfile: UserProfile = {
      displayName: user.displayName,
      vehicleId: user.avatarVehicle || profile.vehicleId,
      colorId: user.avatarColor || profile.colorId
    };
    saveProfile(updatedProfile, user.username);
    setProfile(updatedProfile);
  };

  const handleLogout = () => {
    logoutUser();
    const guest = getCurrentUser();
    setAuthUser(guest);
    const guestProfile = getSavedProfile('guest');
    setProfile(guestProfile);
  };

  const handleCreateRoom = async () => {
    const hostPlayer: Player = {
      id: playerId,
      displayName: profile.displayName,
      vehicleId: profile.vehicleId,
      colorId: profile.colorId,
      isReady: true,
      isHost: true,
      isConnected: true,
      progress: 0,
      wpm: 0,
      accuracy: 100,
      lastSeenAt: Date.now()
    };

    const text = getRandomText('en', 'easy');
    const roomId = await createRoom(hostPlayer, { language: 'en', difficulty: 'easy', topic: 'all' }, text);
    setCurrentRoomId(roomId);
    setMode('room');

    // Update URL without full page reload
    const url = new URL(window.location.href);
    url.searchParams.set('room', roomId);
    window.history.pushState({}, '', url);
  };

  const handleJoinRoom = async (code: string) => {
    const player: Player = {
      id: playerId,
      displayName: profile.displayName,
      vehicleId: profile.vehicleId,
      colorId: profile.colorId,
      isReady: false,
      isHost: false,
      isConnected: true,
      progress: 0,
      wpm: 0,
      accuracy: 100,
      lastSeenAt: Date.now()
    };

    const success = await joinRoom(code, player);
    if (success) {
      setCurrentRoomId(code);
      setMode('room');
      const url = new URL(window.location.href);
      url.searchParams.set('room', code);
      window.history.pushState({}, '', url);
    } else {
      alert(`Unable to join room ${code}. Please verify the code or check if the room is full.`);
    }
  };

  const handleLeaveRoom = () => {
    if (currentRoomId) {
      leaveRoom(currentRoomId, playerId);
    }
    setCurrentRoomId(null);
    setRoomData(null);
    setMode('home');

    // Clean URL
    const url = new URL(window.location.href);
    url.searchParams.delete('room');
    window.history.pushState({}, '', url);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Global Header */}
      <Header
        profile={profile}
        authUser={authUser}
        onOpenProfile={() => setProfileOpen(true)}
        onOpenStats={() => setStatsOpen(true)}
        onOpenAuth={() => setAuthOpen(true)}
        onOpenAdmin={() => setAdminOpen(true)}
        onLogout={handleLogout}
        currentMode={mode}
        onNavigateHome={() => {
          if (mode === 'room') {
            if (window.confirm('Are you sure you want to leave the current race room?')) {
              handleLeaveRoom();
            }
          } else {
            setMode('home');
          }
        }}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1 }}>
        {mode === 'home' && (
          <HomeView
            profile={profile}
            onStartPractice={() => setMode('practice')}
            onCreateRoom={handleCreateRoom}
            onJoinRoom={handleJoinRoom}
            onOpenProfile={() => setProfileOpen(true)}
          />
        )}

        {mode === 'practice' && (
          <PracticeView
            profile={profile}
            onBack={() => setMode('home')}
          />
        )}

        {mode === 'room' && roomData && (
          roomData.status === 'waiting' ? (
            <RoomLobbyView
              room={roomData}
              currentPlayerId={playerId}
              onLeave={handleLeaveRoom}
            />
          ) : (
            <MultiplayerRaceView
              room={roomData}
              currentPlayerId={playerId}
              onLeave={handleLeaveRoom}
            />
          )
        )}
      </main>

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '2rem 1.5rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        background: 'rgba(10, 15, 28, 0.7)',
        color: '#94a3b8',
        fontSize: '0.88rem'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.85rem',
          maxWidth: '700px',
          margin: '0 auto'
        }}>
          {/* Main Attribution Text */}
          <div style={{ fontSize: '0.92rem', color: '#cbd5e1' }}>
            Web được phát triển bởi{' '}
            <a
              href="https://www.facebook.com/haki.spiritx2"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#00f0ff',
                fontWeight: 800,
                textDecoration: 'none',
                letterSpacing: '0.02em',
                textShadow: '0 0 12px rgba(0, 240, 255, 0.4)'
              }}
            >
              Haki Spirit
            </a>
          </div>

          {/* Social and Donate QR Buttons */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            flexWrap: 'wrap'
          }}>
            {/* Facebook Link Icon Button */}
            <a
              href="https://www.facebook.com/haki.spiritx2"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
              style={{
                padding: '0.45rem 1.1rem',
                borderRadius: '9999px',
                fontSize: '0.82rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                color: '#38bdf8',
                borderColor: 'rgba(56, 189, 248, 0.3)',
                background: 'rgba(56, 189, 248, 0.08)',
                textDecoration: 'none',
                fontWeight: 700,
                transition: 'all 0.15s ease'
              }}
              title="Facebook: Haki Spirit"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span>Facebook</span>
            </a>

            {/* Support / Coffee QR Button */}
            <button
              onClick={() => setDonateQrOpen(true)}
              className="btn-secondary"
              style={{
                padding: '0.45rem 1.1rem',
                borderRadius: '9999px',
                fontSize: '0.82rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                color: '#f59e0b',
                borderColor: 'rgba(245, 158, 11, 0.4)',
                background: 'rgba(245, 158, 11, 0.12)',
                cursor: 'pointer',
                fontWeight: 700,
                boxShadow: '0 0 16px rgba(245, 158, 11, 0.15)',
                transition: 'all 0.15s ease'
              }}
              title="Click để quét mã QR chuyển tiền ủng hộ cốc cà phê cho Haki Spirit"
            >
              <Coffee size={15} color="#f59e0b" />
              <span>Ủng Hộ Cà Phê ☕</span>
            </button>
          </div>

          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>
            TypeRace — Real-Time Multiplayer Typing Speed Race • High-Performance Engine
          </div>
        </div>
      </footer>

      {/* Profile & Account Setup Modal */}
      <ProfileModal
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
        profile={profile}
        authUser={authUser}
        stats={getUserStats(authUser.username === 'guest' ? 'guest' : authUser.username)}
        onSave={(updated) => {
          setProfile(updated);
          if (authUser.username !== 'guest') {
            updateAuthUserProfile(updated.displayName, updated.vehicleId, updated.colorId);
            setAuthUser(getCurrentUser());
          } else {
            saveProfile(updated, 'guest');
          }
        }}
        onLogout={handleLogout}
        onOpenAuth={() => setAuthOpen(true)}
      />

      {/* Auth Modal (Login / Register / Fixed Admin) */}
      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onSuccess={handleLoginSuccess}
      />

      {/* Admin Dashboard Modal */}
      <AdminDashboardModal
        isOpen={adminOpen}
        onClose={() => setAdminOpen(false)}
      />

      {/* Stats Modal */}
      <StatsModal
        isOpen={statsOpen}
        onClose={() => setStatsOpen(false)}
        authUser={authUser}
      />

      {/* Donate QR Code Modal */}
      <DonateQrModal
        isOpen={donateQrOpen}
        onClose={() => setDonateQrOpen(false)}
      />
    </div>
  );
};

export default App;
