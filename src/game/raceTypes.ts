export interface Vehicle {
  id: string;
  name: string;
  emoji: string;
  icon: string;
  description: string;
}

export interface PlayerColor {
  id: string;
  name: string;
  hex: string;
  glow: string;
  bgGradient: string;
}

export interface Player {
  id: string;
  displayName: string;
  vehicleId: string;
  colorId: string;
  isReady: boolean;
  isHost: boolean;
  isConnected: boolean;
  progress: number; // 0 to 100
  wpm: number;
  accuracy: number;
  finishTime?: number; // milliseconds from race start
  rank?: number;
  lastSeenAt: number;
}

export type RaceMode = 'practice' | 'multiplayer';

export type RaceStatus = 'waiting' | 'countdown' | 'running' | 'finished' | 'cancelled';

export interface RaceSettings {
  language: 'vi' | 'en';
  difficulty: 'easy' | 'medium' | 'hard';
  topic: 'all' | 'technology' | 'life' | 'proverbs' | 'coding';
}

export interface TypingText {
  id: string;
  title: string;
  content: string;
  language: 'vi' | 'en';
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  author?: string;
}

export interface RaceResult {
  playerId: string;
  displayName: string;
  vehicleId: string;
  colorId: string;
  wpm: number;
  accuracy: number;
  correctCharacters: number;
  incorrectCharacters: number;
  totalCharacters: number;
  finishTime: number; // in ms
  rank: number;
  isHost?: boolean;
}

export interface RoomData {
  roomId: string;
  hostPlayerId: string;
  status: RaceStatus;
  settings: RaceSettings;
  raceId: string;
  text: TypingText;
  players: Record<string, Player>;
  countdownStartAt?: number;
  startAt?: number;
  createdAt: number;
  lastActivityAt: number;
}

export const VEHICLES: Vehicle[] = [
  { id: 'f1', name: 'Formula 1', emoji: '🏎️', icon: 'racing-car', description: 'Ultimate Track Velocity' },
  { id: 'supercar', name: 'GT Supercar', emoji: '🚗', icon: 'car', description: 'Precision Handling' },
  { id: 'moto', name: 'Hyperbike', emoji: '🏍️', icon: 'bike', description: 'Agile & Blazing Fast' },
  { id: 'rocket', name: 'Space Rocket', emoji: '🚀', icon: 'rocket', description: 'Cosmic Acceleration' },
  { id: 'ufo', name: 'Alien UFO', emoji: '🛸', icon: 'ufo', description: 'Extraterrestrial Speed' },
  { id: 'speedboat', name: 'Speedboat', emoji: '🚤', icon: 'boat', description: 'Cutting Waves' },
  { id: 'turtle', name: 'Battle Turtle', emoji: '🐢', icon: 'turtle', description: 'Steady & Unstoppable' },
  { id: 'skateboard', name: 'Cyber Board', emoji: '🛹', icon: 'skateboard', description: 'Sleek & Aerodynamic' }
];

export const PLAYER_COLORS: PlayerColor[] = [
  { id: 'cyan', name: 'Neon Cyan', hex: '#00f0ff', glow: 'rgba(0, 240, 255, 0.6)', bgGradient: 'linear-gradient(135deg, #00f0ff, #0284c7)' },
  { id: 'purple', name: 'Hyper Purple', hex: '#a855f7', glow: 'rgba(168, 85, 247, 0.6)', bgGradient: 'linear-gradient(135deg, #a855f7, #6366f1)' },
  { id: 'amber', name: 'Flame Gold', hex: '#f59e0b', glow: 'rgba(245, 158, 11, 0.6)', bgGradient: 'linear-gradient(135deg, #f59e0b, #ea580c)' },
  { id: 'emerald', name: 'Laser Green', hex: '#10b981', glow: 'rgba(16, 185, 129, 0.6)', bgGradient: 'linear-gradient(135deg, #10b981, #059669)' },
  { id: 'rose', name: 'Cyber Pink', hex: '#ec4899', glow: 'rgba(236, 72, 153, 0.6)', bgGradient: 'linear-gradient(135deg, #ec4899, #be185d)' },
  { id: 'crimson', name: 'Inferno Red', hex: '#ef4444', glow: 'rgba(239, 68, 68, 0.6)', bgGradient: 'linear-gradient(135deg, #ef4444, #b91c1c)' }
];
