import { ref, set } from '@firebase/database';
import { getDb } from './firebase';
import { getSavedProfile, saveProfile, resetToGuestProfile } from './storageService';

export type UserRole = 'admin' | 'user';

export interface AuthUser {
  id: string;
  username: string;
  displayName: string;
  role: UserRole;
  avatarVehicle: string;
  avatarColor: string;
  createdAt: number;
}

export interface StoredUserAccount extends AuthUser {
  passwordHash: string;
}

const AUTH_STORAGE_KEY = 'typerace_auth_current_user';
const USERS_DB_KEY = 'typerace_users_database';

// Fixed Admin credentials requested by user
export const FIXED_ADMIN_CREDENTIALS = {
  username: 'khainguyenthe02xx',
  password: 'Thekhai02!',
  displayName: 'Khai Nguyen (Admin)',
  role: 'admin' as UserRole
};

/**
 * Saves or updates user record directly in Firebase Realtime Database
 */
export async function syncUserToFirebase(account: StoredUserAccount | AuthUser): Promise<void> {
  const db = getDb();
  if (!db) return;
  try {
    const userRef = ref(db, `users/${account.username}`);
    await set(userRef, {
      id: account.id,
      username: account.username,
      displayName: account.displayName,
      role: account.role,
      avatarVehicle: account.avatarVehicle,
      avatarColor: account.avatarColor,
      createdAt: account.createdAt,
      lastActiveAt: Date.now()
    });
  } catch (err) {
    console.warn('[Firebase RTDB] Could not sync user:', err);
  }
}

/**
 * Syncs all locally cached accounts to Firebase Realtime Database
 */
export function syncAllUsersToFirebase(): void {
  const db = getDb();
  if (!db) return;
  const users = initUsersDb();
  users.forEach(u => {
    syncUserToFirebase(u);
  });
}

function initUsersDb(): StoredUserAccount[] {
  let users: StoredUserAccount[] = [];
  try {
    const raw = localStorage.getItem(USERS_DB_KEY);
    if (raw) {
      users = JSON.parse(raw);
    }
  } catch {
    users = [];
  }

  // Ensure fixed admin exists and is up to date
  const adminIndex = users.findIndex(u => u.username === FIXED_ADMIN_CREDENTIALS.username);
  const adminAccount: StoredUserAccount = {
    id: 'user_admin_001',
    username: FIXED_ADMIN_CREDENTIALS.username,
    passwordHash: FIXED_ADMIN_CREDENTIALS.password,
    displayName: FIXED_ADMIN_CREDENTIALS.displayName,
    role: 'admin',
    avatarVehicle: 'f1',
    avatarColor: 'amber',
    createdAt: Date.now()
  };

  if (adminIndex >= 0) {
    users[adminIndex] = adminAccount;
  } else {
    // Remove any outdated default admin
    users = users.filter(u => u.username !== 'admin');
    users.unshift(adminAccount);
  }

  localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));

  // Sync admin to Firebase RTDB in background
  syncUserToFirebase(adminAccount);

  return users;
}

export function getCurrentUser(): AuthUser {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.id) {
        // If logged in as admin with old username, update or keep consistent
        if (parsed.role === 'admin' && parsed.username !== FIXED_ADMIN_CREDENTIALS.username) {
          localStorage.removeItem(AUTH_STORAGE_KEY);
        } else {
          if (parsed.role === 'admin' && parsed.displayName !== FIXED_ADMIN_CREDENTIALS.displayName) {
            parsed.displayName = FIXED_ADMIN_CREDENTIALS.displayName;
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(parsed));
          }
          return parsed;
        }
      }
    }
  } catch {
    // Ignore
  }

  // Fallback to guest profile
  const profile = getSavedProfile('guest');
  const guestUser: AuthUser = {
    id: 'guest_session',
    username: 'guest',
    displayName: profile.displayName || 'Guest Racer',
    role: 'user',
    avatarVehicle: profile.vehicleId,
    avatarColor: profile.colorId,
    createdAt: 0
  };
  return guestUser;
}

export function loginUser(usernameRaw: string, passwordRaw: string): { success: boolean; user?: AuthUser; error?: string } {
  const username = usernameRaw.trim();
  const password = passwordRaw.trim();

  // Check admin credentials
  if (username === FIXED_ADMIN_CREDENTIALS.username && password === FIXED_ADMIN_CREDENTIALS.password) {
    const adminUser: AuthUser = {
      id: 'user_admin_001',
      username: FIXED_ADMIN_CREDENTIALS.username,
      displayName: FIXED_ADMIN_CREDENTIALS.displayName,
      role: 'admin',
      avatarVehicle: 'f1',
      avatarColor: 'amber',
      createdAt: Date.now()
    };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(adminUser));
    saveProfile({
      displayName: adminUser.displayName,
      vehicleId: adminUser.avatarVehicle,
      colorId: adminUser.avatarColor
    }, adminUser.username);
    syncUserToFirebase(adminUser);
    return { success: true, user: adminUser };
  }

  const users = initUsersDb();
  const found = users.find(u => u.username.toLowerCase() === username.toLowerCase() && u.passwordHash === password);
  if (!found) {
    return { success: false, error: 'Invalid username or password.' };
  }

  const authUser: AuthUser = {
    id: found.id,
    username: found.username,
    displayName: found.displayName,
    role: found.role,
    avatarVehicle: found.avatarVehicle,
    avatarColor: found.avatarColor,
    createdAt: found.createdAt
  };

  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
  saveProfile({
    displayName: authUser.displayName,
    vehicleId: authUser.avatarVehicle,
    colorId: authUser.avatarColor
  }, authUser.username);
  syncUserToFirebase(found);
  return { success: true, user: authUser };
}

export function registerUser(
  usernameRaw: string,
  passwordRaw: string,
  displayNameRaw: string
): { success: boolean; user?: AuthUser; error?: string } {
  const username = usernameRaw.trim();
  const password = passwordRaw.trim();
  const displayName = displayNameRaw.trim();

  if (!username || username.length < 3) {
    return { success: false, error: 'Username must be at least 3 characters.' };
  }
  if (!password || password.length < 4) {
    return { success: false, error: 'Password must be at least 4 characters.' };
  }
  if (!displayName) {
    return { success: false, error: 'Display name cannot be empty.' };
  }

  const users = initUsersDb();
  if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
    return { success: false, error: 'This username is already taken.' };
  }

  const profile = getSavedProfile();
  const newUser: StoredUserAccount = {
    id: 'user_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    username,
    passwordHash: password,
    displayName,
    role: 'user',
    avatarVehicle: profile.vehicleId,
    avatarColor: profile.colorId,
    createdAt: Date.now()
  };

  users.push(newUser);
  localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));

  const authUser: AuthUser = {
    id: newUser.id,
    username: newUser.username,
    displayName: newUser.displayName,
    role: newUser.role,
    avatarVehicle: newUser.avatarVehicle,
    avatarColor: newUser.avatarColor,
    createdAt: newUser.createdAt
  };

  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
  saveProfile({
    displayName: authUser.displayName,
    vehicleId: authUser.avatarVehicle,
    colorId: authUser.avatarColor
  }, authUser.username);

  // Sync newly registered user to Firebase RTDB
  syncUserToFirebase(newUser);

  return { success: true, user: authUser };
}

export function logoutUser(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  resetToGuestProfile();
}

export function updateAuthUserProfile(displayName: string, vehicleId: string, colorId: string): void {
  const current = getCurrentUser();
  current.displayName = displayName;
  current.avatarVehicle = vehicleId;
  current.avatarColor = colorId;

  if (current.username !== 'guest') {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(current));
    saveProfile({ displayName, vehicleId, colorId }, current.username);
    const users = initUsersDb();
    const idx = users.findIndex(u => u.username === current.username);
    if (idx >= 0) {
      users[idx].displayName = displayName;
      users[idx].avatarVehicle = vehicleId;
      users[idx].avatarColor = colorId;
      localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
    }
    syncUserToFirebase(current);
  } else {
    saveProfile({ displayName, vehicleId, colorId }, 'guest');
  }
}

export function getAllUsers(): StoredUserAccount[] {
  return initUsersDb();
}
