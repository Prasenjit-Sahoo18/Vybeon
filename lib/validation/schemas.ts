import { z } from "zod";

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters").max(50),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(30)
      .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, _ and -"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Music schemas
export const trackQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  genre: z.string().optional(),
  artist: z.string().optional(),
  album: z.string().optional(),
  sort: z
    .enum(["createdAt", "playCount", "title"])
    .optional()
    .default("createdAt"),
  order: z.enum(["asc", "desc"]).optional().default("desc"),
});

export const searchQuerySchema = z.object({
  q: z.string().min(1, "Query required"),
  type: z.enum(["all", "tracks", "artists", "albums", "playlists"]).default("all"),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(10),
});

export const createPlaylistSchema = z.object({
  name: z.string().min(1, "Name required").max(100),
  description: z.string().max(500).optional(),
  isPublic: z.boolean().default(true),
});

export const updatePlaylistSchema = createPlaylistSchema.partial();

export const addToPlaylistSchema = z.object({
  trackId: z.string().cuid(),
});

export const vibeEngineSchema = z.object({
  mood: z.enum(["chill", "energetic", "focus", "romantic", "workout", "night", "happy", "road-trip", "rainy", "deep-work"]),
  energy: z.enum(["low", "medium", "high"]),
  genre: z.string().optional(),
  durationMinutes: z.coerce.number().min(5).max(180).default(30),
});

export const neonMixSchema = z.object({
  prompt: z.string().min(1).max(500),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_-]+$/).optional(),
  bio: z.string().max(300).optional(),
  isPublic: z.boolean().optional(),
});

export const historySchema = z.object({
  trackId: z.string().cuid(),
  artistId: z.string().cuid(),
  durationMs: z.number().min(0),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type TrackQuery = z.infer<typeof trackQuerySchema>;
export type SearchQuery = z.infer<typeof searchQuerySchema>;
export type CreatePlaylistInput = z.infer<typeof createPlaylistSchema>;
export type VibeEngineInput = z.infer<typeof vibeEngineSchema>;
export type NeonMixInput = z.infer<typeof neonMixSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type HistoryInput = z.infer<typeof historySchema>;
