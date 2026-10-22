import { ref, set, update, onValue, onDisconnect } from '@firebase/database';
import { getDb } from './firebase';
import { type RoomData, type Player, type RaceSettings, type TypingText, VEHICLES, PLAYER_COLORS } from '../game/raceTypes';
import { getRandomText } from '../data/typingTexts';

// BroadcastChannel for instant local multi-tab sync
const localChannel = typeof window !== 'undefined' && 'BroadcastChannel' in window 
  ? new BroadcastChannel('typerace_local_bus') 
  : null;

const LOCAL_STORAGE_PREFIX = 'typerace_room_';

export function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Creates a new room
 */
export async function createRoom(
  hostPlayer: Player,
  settings: RaceSettings,
  text: TypingText
): Promise<string> {
  const roomId = generateRoomCode();
  const db = getDb();

  const roomData: RoomData = {
    roomId,
    hostPlayerId: hostPlayer.id,
    status: 'waiting',
    settings,
    raceId: `race_${Date.now()}`,
    text,
    players: {
      [hostPlayer.id]: {
        ...hostPlayer,
        isHost: true,
        isReady: true,
        progress: 0,
        wpm: 0,
        accuracy: 100,
        lastSeenAt: Date.now()
      }
    },
    createdAt: Date.now(),
    lastActivityAt: Date.now()
  };

  // Immediate local save
  localStorage.setItem(LOCAL_STORAGE_PREFIX + roomId, JSON.stringify(roomData));
  localChannel?.postMessage({ type: 'ROOM_UPDATED', roomId, roomData });

  // Sync to Firebase if available
  if (db) {
    try {
      const roomRef = ref(db, `rooms/${roomId}`);
      set(roomRef, roomData).catch(() => {});
      const hostPlayerRef = ref(db, `rooms/${roomId}/players/${hostPlayer.id}`);
      onDisconnect(hostPlayerRef).update({ isConnected: false }).catch(() => {});
    } catch {
      // Firebase fallback to local bus
    }
  }

  return roomId;
}

/**
 * Joins an existing room
 */
export async function joinRoom(roomId: string, player: Player): Promise<boolean> {
  const code = roomId.toUpperCase().trim();
  const db = getDb();

  // Try local first
  const raw = localStorage.getItem(LOCAL_STORAGE_PREFIX + code);
  let room: RoomData | null = null;
  if (raw) {
    try {
      room = JSON.parse(raw);
    } catch {
      room = null;
    }
  }

  const newPlayer: Player = {
    ...player,
    isHost: false,
    isReady: false,
    progress: 0,
    wpm: 0,
    accuracy: 100,
    isConnected: true,
    lastSeenAt: Date.now()
  };

  if (room) {
    if (Object.keys(room.players).length >= 8) return false;
    room.players[player.id] = newPlayer;
    room.lastActivityAt = Date.now();
    localStorage.setItem(LOCAL_STORAGE_PREFIX + code, JSON.stringify(room));
    localChannel?.postMessage({ type: 'ROOM_UPDATED', roomId: code, roomData: room });
  }

  // Also sync to Firebase
  if (db) {
    try {
      const playerRef = ref(db, `rooms/${code}/players/${player.id}`);
      set(playerRef, newPlayer).catch(() => {});
      onDisconnect(playerRef).update({ isConnected: false }).catch(() => {});
    } catch {
      // Ignore
    }
  }

  return room !== null || db !== null;
}

/**
 * Subscribes to room updates
 */
export function subscribeToRoom(
  roomId: string,
  onUpdate: (room: RoomData | null) => void
): () => void {
  const code = roomId.toUpperCase().trim();
  const db = getDb();

  // 1. Immediate read from local storage
  const readLocal = () => {
    const raw = localStorage.getItem(LOCAL_STORAGE_PREFIX + code);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        onUpdate(parsed);
        return parsed;
      } catch {
        return null;
      }
    }
    return null;
  };

  const initial = readLocal();

  // 2. BroadcastChannel & Local Storage listeners
  const handleMessage = (e: MessageEvent) => {
    if (e.data && e.data.roomId === code) {
      if (e.data.type === 'ROOM_UPDATED') {
        onUpdate(e.data.roomData);
      } else if (e.data.type === 'ROOM_DELETED') {
        onUpdate(null);
      }
    }
  };

  const handleStorage = (e: StorageEvent) => {
    if (e.key === LOCAL_STORAGE_PREFIX + code) {
      readLocal();
    }
  };

  localChannel?.addEventListener('message', handleMessage);
  window.addEventListener('storage', handleStorage);

  // 3. Firebase listener if available
  let unsubscribeFirebase: (() => void) | null = null;
  if (db) {
    try {
      const roomRef = ref(db, `rooms/${code}`);
      unsubscribeFirebase = onValue(roomRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          localStorage.setItem(LOCAL_STORAGE_PREFIX + code, JSON.stringify(data));
          onUpdate(data as RoomData);
        } else if (!initial && !localStorage.getItem(LOCAL_STORAGE_PREFIX + code)) {
          onUpdate(null);
        }
      }, () => {
        // Fallback to local
      });
    } catch {
      // Ignore
    }
  }

  return () => {
    localChannel?.removeEventListener('message', handleMessage);
    window.removeEventListener('storage', handleStorage);
    if (unsubscribeFirebase) {
      unsubscribeFirebase();
    }
  };
}

/**
 * Leaves a room
 */
export async function leaveRoom(roomId: string, playerId: string): Promise<void> {
  const code = roomId.toUpperCase().trim();
  const db = getDb();

  // Local update
  const raw = localStorage.getItem(LOCAL_STORAGE_PREFIX + code);
  if (raw) {
    try {
      const room: RoomData = JSON.parse(raw);
      delete room.players[playerId];

      const remaining = Object.values(room.players);
      if (remaining.length === 0) {
        localStorage.removeItem(LOCAL_STORAGE_PREFIX + code);
        localChannel?.postMessage({ type: 'ROOM_DELETED', roomId: code });
      } else {
        if (room.hostPlayerId === playerId) {
          room.hostPlayerId = remaining[0].id;
          room.players[remaining[0].id].isHost = true;
        }
        room.lastActivityAt = Date.now();
        localStorage.setItem(LOCAL_STORAGE_PREFIX + code, JSON.stringify(room));
        localChannel?.postMessage({ type: 'ROOM_UPDATED', roomId: code, roomData: room });
      }
    } catch {
      // Ignore
    }
  }

  // Firebase update
  if (db) {
    try {
      const playerRef = ref(db, `rooms/${code}/players/${playerId}`);
      set(playerRef, null).catch(() => {});
    } catch {
      // Ignore
    }
  }
}

/**
 * Sets player ready state
 */
export async function setPlayerReady(roomId: string, playerId: string, isReady: boolean): Promise<void> {
  const code = roomId.toUpperCase().trim();
  const db = getDb();

  const raw = localStorage.getItem(LOCAL_STORAGE_PREFIX + code);
  if (raw) {
    try {
      const room: RoomData = JSON.parse(raw);
      if (room.players[playerId]) {
        room.players[playerId].isReady = isReady;
        room.players[playerId].lastSeenAt = Date.now();
        localStorage.setItem(LOCAL_STORAGE_PREFIX + code, JSON.stringify(room));
        localChannel?.postMessage({ type: 'ROOM_UPDATED', roomId: code, roomData: room });
      }
    } catch {
      // Ignore
    }
  }

  if (db) {
    try {
      const readyRef = ref(db, `rooms/${code}/players/${playerId}`);
      update(readyRef, { isReady, lastSeenAt: Date.now() }).catch(() => {});
    } catch {
      // Ignore
    }
  }
}

/**
 * Starts race countdown
 */
export async function startRaceCountdown(roomId: string, countdownDurationSec: number = 3): Promise<void> {
  const code = roomId.toUpperCase().trim();
  const db = getDb();
  const now = Date.now();
  const startAt = now + countdownDurationSec * 1000;

  const raw = localStorage.getItem(LOCAL_STORAGE_PREFIX + code);
  if (raw) {
    try {
      const room: RoomData = JSON.parse(raw);
      room.status = 'countdown';
      room.countdownStartAt = now;
      room.startAt = startAt;
      room.lastActivityAt = now;

      Object.keys(room.players).forEach(pId => {
        room.players[pId].progress = 0;
        room.players[pId].wpm = 0;
        room.players[pId].accuracy = 100;
        room.players[pId].finishTime = undefined;
        room.players[pId].rank = undefined;
      });

      localStorage.setItem(LOCAL_STORAGE_PREFIX + code, JSON.stringify(room));
      localChannel?.postMessage({ type: 'ROOM_UPDATED', roomId: code, roomData: room });
    } catch {
      // Ignore
    }
  }

  if (db) {
    try {
      const roomRef = ref(db, `rooms/${code}`);
      update(roomRef, {
        status: 'countdown',
        countdownStartAt: now,
        startAt: startAt,
        lastActivityAt: now
      }).catch(() => {});
    } catch {
      // Ignore
    }
  }
}

/**
 * Switches status to running
 */
export async function setRaceRunning(roomId: string): Promise<void> {
  const code = roomId.toUpperCase().trim();
  const db = getDb();

  const raw = localStorage.getItem(LOCAL_STORAGE_PREFIX + code);
  if (raw) {
    try {
      const room: RoomData = JSON.parse(raw);
      room.status = 'running';
      localStorage.setItem(LOCAL_STORAGE_PREFIX + code, JSON.stringify(room));
      localChannel?.postMessage({ type: 'ROOM_UPDATED', roomId: code, roomData: room });
    } catch {
      // Ignore
    }
  }

  if (db) {
    try {
      const roomRef = ref(db, `rooms/${code}`);
      update(roomRef, { status: 'running' }).catch(() => {});
    } catch {
      // Ignore
    }
  }
}

/**
 * Updates player progress
 */
export async function updatePlayerProgress(
  roomId: string,
  playerId: string,
  progress: number,
  wpm: number,
  accuracy: number,
  finishTime?: number,
  rank?: number
): Promise<void> {
  const code = roomId.toUpperCase().trim();
  const db = getDb();

  const updateData: Partial<Player> = {
    progress,
    wpm,
    accuracy,
    lastSeenAt: Date.now()
  };
  if (finishTime !== undefined) updateData.finishTime = finishTime;
  if (rank !== undefined) updateData.rank = rank;

  const raw = localStorage.getItem(LOCAL_STORAGE_PREFIX + code);
  if (raw) {
    try {
      const room: RoomData = JSON.parse(raw);
      if (room.players[playerId]) {
        Object.assign(room.players[playerId], updateData);
        
        const allPlayers = Object.values(room.players);
        const allFinished = allPlayers.length > 0 && allPlayers.every(p => p.progress >= 100);
        if (allFinished && room.status === 'running') {
          room.status = 'finished';
        }

        localStorage.setItem(LOCAL_STORAGE_PREFIX + code, JSON.stringify(room));
        localChannel?.postMessage({ type: 'ROOM_UPDATED', roomId: code, roomData: room });
      }
    } catch {
      // Ignore
    }
  }

  if (db) {
    try {
      const playerRef = ref(db, `rooms/${code}/players/${playerId}`);
      update(playerRef, updateData).catch(() => {});
    } catch {
      // Ignore
    }
  }
}

/**
 * Triggers Rematch
 */
export async function triggerRematch(roomId: string): Promise<void> {
  const code = roomId.toUpperCase().trim();
  const db = getDb();
  const newText = getRandomText('en');

  const raw = localStorage.getItem(LOCAL_STORAGE_PREFIX + code);
  if (raw) {
    try {
      const room: RoomData = JSON.parse(raw);
      room.status = 'waiting';
      room.raceId = `race_${Date.now()}`;
      room.text = newText;
      room.countdownStartAt = undefined;
      room.startAt = undefined;
      room.lastActivityAt = Date.now();

      Object.keys(room.players).forEach(pId => {
        const p = room.players[pId];
        p.progress = 0;
        p.wpm = 0;
        p.accuracy = 100;
        p.finishTime = undefined;
        p.rank = undefined;
        p.isReady = p.isHost;
      });

      localStorage.setItem(LOCAL_STORAGE_PREFIX + code, JSON.stringify(room));
      localChannel?.postMessage({ type: 'ROOM_UPDATED', roomId: code, roomData: room });
    } catch {
      // Ignore
    }
  }

  if (db) {
    try {
      const roomRef = ref(db, `rooms/${code}`);
      update(roomRef, {
        status: 'waiting',
        raceId: `race_${Date.now()}`,
        text: newText,
        countdownStartAt: null,
        startAt: null,
        lastActivityAt: Date.now()
      }).catch(() => {});
    } catch {
      // Ignore
    }
  }
}

/**
 * Adds an AI bot to the room
 */
export async function addBotRacer(roomId: string): Promise<void> {
  const code = roomId.toUpperCase().trim();
  const botNames = ['CyberBot 3000', 'TurboAI', 'RoboSpeed', 'PixelRider', 'AlphaTypist'];
  const botVehicles = VEHICLES.filter(v => v.id !== 'f1');
  const botColors = PLAYER_COLORS;

  const botId = `bot_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  const botName = botNames[Math.floor(Math.random() * botNames.length)];
  const botVehicle = botVehicles[Math.floor(Math.random() * botVehicles.length)].id;
  const botColor = botColors[Math.floor(Math.random() * botColors.length)].id;

  const botPlayer: Player = {
    id: botId,
    displayName: `${botName} [BOT]`,
    vehicleId: botVehicle,
    colorId: botColor,
    isReady: true,
    isHost: false,
    isConnected: true,
    progress: 0,
    wpm: 0,
    accuracy: 98,
    lastSeenAt: Date.now()
  };

  const raw = localStorage.getItem(LOCAL_STORAGE_PREFIX + code);
  if (raw) {
    try {
      const room: RoomData = JSON.parse(raw);
      if (Object.keys(room.players).length < 8) {
        room.players[botId] = botPlayer;
        localStorage.setItem(LOCAL_STORAGE_PREFIX + code, JSON.stringify(room));
        localChannel?.postMessage({ type: 'ROOM_UPDATED', roomId: code, roomData: room });
      }
    } catch {
      // Ignore
    }
  }

  const db = getDb();
  if (db) {
    try {
      const botRef = ref(db, `rooms/${code}/players/${botId}`);
      set(botRef, botPlayer).catch(() => {});
    } catch {
      // Ignore
    }
  }
}
