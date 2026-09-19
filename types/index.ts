// ─── Core Domain Types ────────────────────────────────────────────────────────

export interface Artist {
  id: string;
  name: string;
  slug: string;
  bio?: string | null;
  imageUrl?: string | null;
  coverUrl?: string | null;
  country?: string | null;
  verified: boolean;
  monthlyListeners: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Album {
  id: string;
  title: string;
  slug: string;
  artistId: string;
  imageUrl?: string | null;
  releaseDate?: Date | null;
  albumType: "ALBUM" | "SINGLE" | "EP" | "COMPILATION";
  description?: string | null;
  totalTracks: number;
  artist?: Artist;
  createdAt: Date;
  updatedAt: Date;
}

export interface Genre {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  color?: string | null;
  imageUrl?: string | null;
}

export interface Track {
  id: string;
  title: string;
  slug: string;
  artistId: string;
  albumId?: string | null;
  duration: number;
  audioUrl?: string | null;
  previewUrl?: string | null;
  imageUrl?: string | null;
  trackNumber?: number | null;
  playCount: number;
  isExplicit: boolean;
  bpm?: number | null;
  energy?: number | null;
  valence?: number | null;
  danceability?: number | null;
  artist?: Artist;
  album?: Album | null;
  genres?: Genre[];
  isLiked?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  userId: string;
  isPublic: boolean;
  isGenerated: boolean;
  mood?: string | null;
  totalTracks: number;
  user?: {
    id: string;
    name?: string | null;
    username?: string | null;
    image?: string | null;
  };
  tracks?: PlaylistTrackItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PlaylistTrackItem {
  id: string;
  position: number;
  addedAt: Date;
  track: Track;
}

// ─── Player Types ─────────────────────────────────────────────────────────────

export type RepeatMode = "off" | "all" | "one";

export interface PlayerState {
  currentTrack: Track | null;
  queue: Track[];
  history: Track[];
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  progress: number; // 0-1
  duration: number; // seconds
  currentTime: number; // seconds
  shuffle: boolean;
  repeat: RepeatMode;
  showQueue: boolean;
  showLyrics: boolean;
  showFullScreen: boolean;
  isLoading: boolean;
}

// ─── API Response Types ───────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

export interface ApiError {
  error: string;
  details?: unknown;
}

// ─── Mood Types ───────────────────────────────────────────────────────────────

export type Mood =
  | "chill"
  | "energetic"
  | "focus"
  | "romantic"
  | "workout"
  | "night"
  | "happy"
  | "road-trip"
  | "rainy"
  | "deep-work";

export interface MoodConfig {
  id: Mood;
  label: string;
  emoji: string;
  description: string;
  gradient: string;
  energy: "low" | "medium" | "high";
}

export const MOOD_CONFIGS: MoodConfig[] = [
  {
    id: "energetic",
    label: "Energetic",
    emoji: "🔥",
    description: "High-energy tracks to fuel your fire",
    gradient: "from-orange-500 to-red-500",
    energy: "high",
  },
  {
    id: "chill",
    label: "Chill",
    emoji: "🌊",
    description: "Relaxed vibes for easy moments",
    gradient: "from-cyan-500 to-blue-500",
    energy: "low",
  },
  {
    id: "focus",
    label: "Focus",
    emoji: "🧠",
    description: "Deep concentration and flow state",
    gradient: "from-purple-500 to-indigo-500",
    energy: "medium",
  },
  {
    id: "romantic",
    label: "Romantic",
    emoji: "💜",
    description: "Heartfelt melodies for special moments",
    gradient: "from-pink-500 to-purple-500",
    energy: "low",
  },
  {
    id: "workout",
    label: "Workout",
    emoji: "🏋",
    description: "Power through your training",
    gradient: "from-lime-500 to-green-500",
    energy: "high",
  },
  {
    id: "night",
    label: "Night",
    emoji: "🌙",
    description: "Late night atmosphere and vibes",
    gradient: "from-slate-700 to-purple-800",
    energy: "low",
  },
  {
    id: "happy",
    label: "Happy",
    emoji: "☀",
    description: "Joyful tracks to brighten your day",
    gradient: "from-yellow-400 to-orange-400",
    energy: "medium",
  },
  {
    id: "road-trip",
    label: "Road Trip",
    emoji: "🚗",
    description: "Perfect company for the open road",
    gradient: "from-blue-400 to-cyan-400",
    energy: "medium",
  },
  {
    id: "rainy",
    label: "Rainy",
    emoji: "🌧",
    description: "Cozy sounds for grey skies",
    gradient: "from-slate-500 to-blue-600",
    energy: "low",
  },
  {
    id: "deep-work",
    label: "Deep Work",
    emoji: "🎧",
    description: "Minimal distraction, maximum output",
    gradient: "from-zinc-600 to-stone-700",
    energy: "medium",
  },
];

// ─── Achievement Types ────────────────────────────────────────────────────────

export interface Achievement {
  id: string;
  key: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  threshold: number;
  earnedAt?: Date;
}

// ─── Analytics Types ──────────────────────────────────────────────────────────

export interface ListeningStats {
  totalMinutes: number;
  totalTracks: number;
  topGenres: { genre: string; count: number; percentage: number }[];
  topArtists: { artist: Artist; playCount: number }[];
  topTracks: { track: Track; playCount: number }[];
  listeningByDay: { day: string; minutes: number }[];
  streak: number;
}

// ─── NeonMix AI Types ─────────────────────────────────────────────────────────

export interface NeonMixMessage {
  role: "user" | "assistant";
  content: string;
  playlist?: Track[];
  timestamp: Date;
}
