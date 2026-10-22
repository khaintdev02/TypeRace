import { VEHICLES, PLAYER_COLORS } from '../game/raceTypes';

export interface UserProfile {
  displayName: string;
  vehicleId: string;
  colorId: string;
}

export interface UserStats {
  bestWpm: number;
  totalRaces: number;
  avgAccuracy: number;
  totalWords: number;
}

const GUEST_PROFILE_KEY = 'typerace_guest_profile';
const GUEST_STATS_KEY = 'typerace_guest_stats';
const LEGACY_PROFILE_KEY = 'typerace_user_profile';
const LEGACY_STATS_KEY = 'typerace_user_stats';

const DEFAULT_GUEST_NAMES = [
  'Speed Racer', 'Hyper Sonic', 'Phantom Drift', 'Thunder Bolt',
  'Shadow Racer', 'Cyber Knight', 'Vortex Prime', 'Blaze Runner',
  'Neon Turbo', 'Apex Velocity', 'Quantum Pulse', 'Silver Arrow'
];

export function getRandomDefaultName(): string {
  const name = DEFAULT_GUEST_NAMES[Math.floor(Math.random() * DEFAULT_GUEST_NAMES.length)];
  const num = Math.floor(10 + Math.random() * 90);
  return `${name} ${num}`;
}

function getActiveAuthUsername(): string | null {
  try {
    const raw = localStorage.getItem('typerace_auth_current_user');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.username && parsed.username !== 'guest') {
        return parsed.username;
      }
    }
  } catch {
    // Ignore
  }
  return null;
}

export function getSavedProfile(username?: string): UserProfile {
  const targetUser = username || getActiveAuthUsername();

  // If authenticated user
  if (targetUser && targetUser !== 'guest') {
    try {
      const userKey = `typerace_profile_${targetUser}`;
      const raw = localStorage.getItem(userKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.displayName) return parsed;
      }
      // Check from user account record
      const usersRaw = localStorage.getItem('typerace_users_db');
      if (usersRaw) {
        const users = JSON.parse(usersRaw);
        const found = users.find((u: any) => u.username === targetUser);
        if (found) {
          const profile: UserProfile = {
            displayName: found.displayName || targetUser,
            vehicleId: found.avatarVehicle || VEHICLES[0].id,
            colorId: found.avatarColor || PLAYER_COLORS[0].id
          };
          localStorage.setItem(userKey, JSON.stringify(profile));
          return profile;
        }
      }
    } catch {
      // Ignore
    }
  }

  // Guest profile
  try {
    const raw = localStorage.getItem(GUEST_PROFILE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.displayName) {
        return parsed;
      }
    }
  } catch {
    // Ignore
  }

  // Create clean guest profile
  return resetToGuestProfile();
}

export function resetToGuestProfile(): UserProfile {
  const guest: UserProfile = {
    displayName: getRandomDefaultName(),
    vehicleId: VEHICLES[0].id,
    colorId: PLAYER_COLORS[0].id
  };
  try {
    localStorage.setItem(GUEST_PROFILE_KEY, JSON.stringify(guest));
    localStorage.setItem(LEGACY_PROFILE_KEY, JSON.stringify(guest));
  } catch {
    // Ignore
  }
  return guest;
}

export function saveProfile(profile: UserProfile, username?: string): void {
  const targetUser = username || getActiveAuthUsername();
  try {
    if (targetUser && targetUser !== 'guest') {
      localStorage.setItem(`typerace_profile_${targetUser}`, JSON.stringify(profile));
    } else {
      localStorage.setItem(GUEST_PROFILE_KEY, JSON.stringify(profile));
    }
    localStorage.setItem(LEGACY_PROFILE_KEY, JSON.stringify(profile));
  } catch {
    // Ignore
  }
}

export function getUserStats(username?: string): UserStats {
  const targetUser = username || getActiveAuthUsername();
  const statsKey = targetUser && targetUser !== 'guest' 
    ? `typerace_user_stats_${targetUser}` 
    : GUEST_STATS_KEY;

  try {
    const raw = localStorage.getItem(statsKey);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // Ignore
  }

  return {
    bestWpm: 0,
    totalRaces: 0,
    avgAccuracy: 100,
    totalWords: 0
  };
}

export function recordRaceStats(wpm: number, accuracy: number, chars: number, username?: string): UserStats {
  const targetUser = username || getActiveAuthUsername();
  const statsKey = targetUser && targetUser !== 'guest' 
    ? `typerace_user_stats_${targetUser}` 
    : GUEST_STATS_KEY;

  const current = getUserStats(targetUser || undefined);
  const words = Math.round(chars / 5);
  const newTotalRaces = current.totalRaces + 1;
  const newBestWpm = Math.max(current.bestWpm, wpm);
  const newAvgAccuracy = Math.round(
    (current.avgAccuracy * current.totalRaces + accuracy) / newTotalRaces
  );
  const newTotalWords = current.totalWords + words;

  const updated: UserStats = {
    bestWpm: newBestWpm,
    totalRaces: newTotalRaces,
    avgAccuracy: newAvgAccuracy,
    totalWords: newTotalWords
  };

  try {
    localStorage.setItem(statsKey, JSON.stringify(updated));
    localStorage.setItem(LEGACY_STATS_KEY, JSON.stringify(updated));
  } catch {
    // Ignore
  }

  return updated;
}
