import { initializeApp, getApps, type FirebaseApp } from '@firebase/app';
import { getDatabase, type Database } from '@firebase/database';

export interface FirebaseConfig {
  apiKey: string;
  authDomain?: string;
  databaseURL: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
  measurementId?: string;
}

// User-provided Firebase Configuration
export const DEFAULT_FIREBASE_CONFIG: FirebaseConfig = {
  apiKey: "AIzaSyBgT0ExoL5VRBJ7hdLke_pKnh6R_uxpcz8",
  authDomain: "type-race-2210.firebaseapp.com",
  projectId: "type-race-2210",
  storageBucket: "type-race-2210.firebasestorage.app",
  messagingSenderId: "969965902704",
  appId: "1:969965902704:web:1ff912a1bacd75738f4db5",
  measurementId: "G-X1MG2BNDPK",
  databaseURL: "https://type-race-2210-default-rtdb.asia-southeast1.firebasedatabase.app"
};

let appInstance: FirebaseApp | null = null;
let dbInstance: Database | null = null;

export function initFirebase(): Database | null {
  try {
    if (!getApps().length) {
      appInstance = initializeApp(DEFAULT_FIREBASE_CONFIG);
    } else {
      appInstance = getApps()[0];
    }
    dbInstance = getDatabase(appInstance, DEFAULT_FIREBASE_CONFIG.databaseURL);
    return dbInstance;
  } catch (err) {
    // If Firebase RTDB is not enabled yet in console, fallback to local multi-tab sync
    console.warn('[Firebase] Connecting with fallback to multi-tab sync:', err);
    return null;
  }
}

export function getDb(): Database | null {
  if (!dbInstance) {
    return initFirebase();
  }
  return dbInstance;
}
