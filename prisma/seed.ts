import { PrismaClient, AlbumType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// ─── Legal Free Audio URLs (Pixabay / Free Music Archive / ccMixter) ──────────
// All tracks below are royalty-free / Creative Commons licensed demo audio.
// These are placeholder URLs pointing to publicly hosted free audio.
const FREE_AUDIO = [
  "https://cdn.pixabay.com/audio/2024/03/13/audio_7c6ec9cb4c.mp3",
  "https://cdn.pixabay.com/audio/2024/01/08/audio_1f3614a89d.mp3",
  "https://cdn.pixabay.com/audio/2023/12/15/audio_8e69f44be5.mp3",
  "https://cdn.pixabay.com/audio/2024/02/15/audio_d1718ab41b.mp3",
  "https://cdn.pixabay.com/audio/2024/03/01/audio_7b7d93b9e2.mp3",
  "https://cdn.pixabay.com/audio/2023/10/25/audio_c98af39b46.mp3",
  "https://cdn.pixabay.com/audio/2024/01/20/audio_3f4d7a82c1.mp3",
  "https://cdn.pixabay.com/audio/2023/11/05/audio_2a6b4c7d8e.mp3",
  "https://cdn.pixabay.com/audio/2024/02/28/audio_5e6f7a8b9c.mp3",
  "https://cdn.pixabay.com/audio/2023/09/15/audio_1a2b3c4d5e.mp3",
];

function getAudio(index: number) {
  return FREE_AUDIO[index % FREE_AUDIO.length];
}

// Gradient-based placeholder artwork using DiceBear / UI Avatars
function artistImage(name: string) {
  return `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(name)}&backgroundColor=0f0f1a&scale=80`;
}
function albumImage(title: string) {
  return `https://api.dicebear.com/7.x/icons/svg?seed=${encodeURIComponent(title)}&backgroundColor=11111a&scale=70`;
}

async function main() {
  console.log("🌱 Seeding VYBEON database...");

  // ─── Genres ──────────────────────────────────────────────────────────────────
  const genreData = [
    { name: "Pop", slug: "pop", color: "#FF6B9D", description: "Chart-topping pop anthems" },
    { name: "Rock", slug: "rock", color: "#FF4444", description: "Guitar-driven rock classics" },
    { name: "Hip-Hop", slug: "hip-hop", color: "#B8FF00", description: "Rhythmic beats and rhymes" },
    { name: "Electronic", slug: "electronic", color: "#00F5FF", description: "Synthesized futuristic sounds" },
    { name: "Lo-Fi", slug: "lo-fi", color: "#7C3AED", description: "Mellow beats for studying" },
    { name: "R&B", slug: "rnb", color: "#FF8C00", description: "Soulful rhythm and blues" },
    { name: "Jazz", slug: "jazz", color: "#FFD700", description: "Timeless jazz improvisation" },
    { name: "Classical", slug: "classical", color: "#E8E8E8", description: "Orchestral masterpieces" },
    { name: "Indie", slug: "indie", color: "#98D8C8", description: "Independent alternative vibes" },
    { name: "K-Pop", slug: "k-pop", color: "#FF69B4", description: "Korean pop phenomenon" },
    { name: "Bollywood", slug: "bollywood", color: "#FF6600", description: "Vibrant Indian film music" },
    { name: "Ambient", slug: "ambient", color: "#4A9EFF", description: "Atmospheric soundscapes" },
    { name: "Workout", slug: "workout", color: "#00FF88", description: "High-energy fitness tracks" },
    { name: "Chill", slug: "chill", color: "#87CEEB", description: "Relaxed feel-good sounds" },
    { name: "Instrumental", slug: "instrumental", color: "#DDA0DD", description: "Pure music, no lyrics" },
  ];

  const genres = await Promise.all(
    genreData.map((g) =>
      prisma.genre.upsert({
        where: { slug: g.slug },
        update: {},
        create: g,
      })
    )
  );
  console.log(`✅ Created ${genres.length} genres`);

  const genreMap = Object.fromEntries(genres.map((g) => [g.slug, g]));

  // ─── Artists ──────────────────────────────────────────────────────────────────
  const artistData = [
    { name: "Neon Pulse", slug: "neon-pulse", country: "US", bio: "Electronic music pioneer blending synthwave and future bass.", monthlyListeners: 2800000 },
    { name: "Aurora Vex", slug: "aurora-vex", country: "UK", bio: "Indie pop artist known for dreamy vocals and lush production.", monthlyListeners: 1500000 },
    { name: "Cipher MC", slug: "cipher-mc", country: "US", bio: "Lyricist and producer crafting introspective hip-hop.", monthlyListeners: 3200000 },
    { name: "Luna Beats", slug: "luna-beats", country: "KR", bio: "K-Pop producer duo creating genre-defying sonic worlds.", monthlyListeners: 5400000 },
    { name: "Voltage", slug: "voltage", country: "DE", bio: "Techno and EDM artist from Berlin's underground scene.", monthlyListeners: 1900000 },
    { name: "The Silk Road Collective", slug: "silk-road-collective", country: "IN", bio: "World music ensemble fusing classical Indian and electronic.", monthlyListeners: 890000 },
    { name: "Jade Williams", slug: "jade-williams", country: "US", bio: "R&B vocalist with a powerful voice and smooth production.", monthlyListeners: 4100000 },
    { name: "CosmicJazz", slug: "cosmicjazz", country: "FR", bio: "Contemporary jazz trio pushing boundaries with electronic elements.", monthlyListeners: 650000 },
    { name: "Pixel Dreams", slug: "pixel-dreams", country: "JP", bio: "Lo-fi hip-hop producer creating peaceful study beats.", monthlyListeners: 2200000 },
    { name: "Solara", slug: "solara", country: "BR", bio: "Latin-electronic fusion artist bringing tropical energy.", monthlyListeners: 1700000 },
    { name: "Echo Chamber", slug: "echo-chamber", country: "AU", bio: "Rock band from Melbourne blending grunge and indie.", monthlyListeners: 980000 },
    { name: "Quantum Beat", slug: "quantum-beat", country: "US", bio: "Hip-hop producer known for futuristic, science-inspired beats.", monthlyListeners: 2600000 },
    { name: "Sakura Sound", slug: "sakura-sound", country: "JP", bio: "Ambient artist creating serene soundscapes inspired by nature.", monthlyListeners: 730000 },
    { name: "Diamond Flow", slug: "diamond-flow", country: "NG", bio: "Afrobeats artist bringing joy and rhythm to global stages.", monthlyListeners: 3800000 },
    { name: "SYNTHCORE", slug: "synthcore", country: "SE", bio: "Industrial synth-pop duo from Stockholm.", monthlyListeners: 1100000 },
    { name: "Aria Stone", slug: "aria-stone", country: "CA", bio: "Indie folk singer-songwriter with ethereal vocals.", monthlyListeners: 870000 },
    { name: "NightOwl", slug: "nightowl", country: "US", bio: "Chillwave artist known for late-night atmospheric tracks.", monthlyListeners: 1650000 },
    { name: "Bass Theory", slug: "bass-theory", country: "UK", bio: "Drum and bass producer from East London.", monthlyListeners: 1380000 },
    { name: "CloudNine", slug: "cloudnine", country: "US", bio: "Dream pop duo creating hazy, beautiful soundscapes.", monthlyListeners: 1020000 },
    { name: "Rajiv Kumar", slug: "rajiv-kumar", country: "IN", bio: "Bollywood music composer known for soulful film scores.", monthlyListeners: 6200000 },
    { name: "Elara", slug: "elara", country: "US", bio: "Classical crossover pianist bridging baroque and modern.", monthlyListeners: 560000 },
    { name: "Phantom Grove", slug: "phantom-grove", country: "US", bio: "Alternative rock band with dark, moody anthems.", monthlyListeners: 2100000 },
    { name: "Solar Winds", slug: "solar-winds", country: "NO", bio: "Nordic ambient artist creating vast, oceanic soundscapes.", monthlyListeners: 480000 },
    { name: "Cypher State", slug: "cypher-state", country: "US", bio: "East Coast hip-hop collective with conscious lyrics.", monthlyListeners: 1750000 },
    { name: "Vibe Garden", slug: "vibe-garden", country: "US", bio: "Neo-soul collective merging jazz, R&B and electronic.", monthlyListeners: 920000 },
    { name: "Meridian", slug: "meridian", country: "UK", bio: "Progressive electronic artist known for epic builds.", monthlyListeners: 1300000 },
    { name: "Prism", slug: "prism", country: "US", bio: "Pop-electronic duo creating anthemic, euphoric tracks.", monthlyListeners: 3500000 },
    { name: "Hollow Echo", slug: "hollow-echo", country: "US", bio: "Post-rock band crafting instrumental epics.", monthlyListeners: 620000 },
    { name: "Lagos Groove", slug: "lagos-groove", country: "NG", bio: "Afrobeats and highlife fusion from Lagos.", monthlyListeners: 2400000 },
    { name: "Frost Bite", slug: "frost-bite", country: "IS", bio: "Dark electronic artist from Iceland's minimalist tradition.", monthlyListeners: 390000 },
  ];

  const artists = await Promise.all(
    artistData.map((a) =>
      prisma.artist.upsert({
        where: { slug: a.slug },
        update: {},
        create: {
          ...a,
          imageUrl: artistImage(a.name),
          coverUrl: artistImage(a.name + "-cover"),
          verified: a.monthlyListeners > 1000000,
        },
      })
    )
  );
  console.log(`✅ Created ${artists.length} artists`);

  const artistMap = Object.fromEntries(artists.map((a) => [a.slug, a]));

  // ─── Albums ───────────────────────────────────────────────────────────────────
  const albumData = [
    { title: "Radium Dreams", slug: "radium-dreams", artist: "neon-pulse", year: 2024, type: AlbumType.ALBUM, tracks: 10 },
    { title: "Violet Horizons", slug: "violet-horizons", artist: "aurora-vex", year: 2024, type: AlbumType.ALBUM, tracks: 11 },
    { title: "Neural Rhymes", slug: "neural-rhymes", artist: "cipher-mc", year: 2023, type: AlbumType.ALBUM, tracks: 14 },
    { title: "Starfield", slug: "starfield", artist: "luna-beats", year: 2024, type: AlbumType.ALBUM, tracks: 12 },
    { title: "Berlin Underground", slug: "berlin-underground", artist: "voltage", year: 2023, type: AlbumType.ALBUM, tracks: 9 },
    { title: "Raga Electronic", slug: "raga-electronic", artist: "silk-road-collective", year: 2024, type: AlbumType.ALBUM, tracks: 8 },
    { title: "Midnight Soul", slug: "midnight-soul", artist: "jade-williams", year: 2024, type: AlbumType.ALBUM, tracks: 13 },
    { title: "Galaxies", slug: "galaxies", artist: "cosmicjazz", year: 2023, type: AlbumType.ALBUM, tracks: 10 },
    { title: "Study Session Vol.3", slug: "study-session-vol3", artist: "pixel-dreams", year: 2024, type: AlbumType.ALBUM, tracks: 16 },
    { title: "Tropicália 2.0", slug: "tropicalia-20", artist: "solara", year: 2024, type: AlbumType.ALBUM, tracks: 11 },
    { title: "Gravel Road", slug: "gravel-road", artist: "echo-chamber", year: 2023, type: AlbumType.ALBUM, tracks: 12 },
    { title: "Quantum State", slug: "quantum-state", artist: "quantum-beat", year: 2024, type: AlbumType.ALBUM, tracks: 10 },
    { title: "Sakura Rain", slug: "sakura-rain", artist: "sakura-sound", year: 2024, type: AlbumType.ALBUM, tracks: 8 },
    { title: "Lagos Energy", slug: "lagos-energy", artist: "diamond-flow", year: 2024, type: AlbumType.ALBUM, tracks: 14 },
    { title: "Binary Hearts", slug: "binary-hearts", artist: "synthcore", year: 2023, type: AlbumType.ALBUM, tracks: 10 },
    { title: "Wildflower", slug: "wildflower", artist: "aria-stone", year: 2024, type: AlbumType.ALBUM, tracks: 11 },
    { title: "After Hours", slug: "after-hours", artist: "nightowl", year: 2024, type: AlbumType.ALBUM, tracks: 9 },
    { title: "Sub Frequencies", slug: "sub-frequencies", artist: "bass-theory", year: 2023, type: AlbumType.ALBUM, tracks: 12 },
    { title: "Cumulus", slug: "cumulus", artist: "cloudnine", year: 2024, type: AlbumType.ALBUM, tracks: 10 },
    { title: "Dil Se", slug: "dil-se", artist: "rajiv-kumar", year: 2024, type: AlbumType.ALBUM, tracks: 12 },
    { title: "Intersections", slug: "intersections", artist: "prism", year: 2024, type: AlbumType.ALBUM, tracks: 11 },
    { title: "The Long Echo", slug: "the-long-echo", artist: "hollow-echo", year: 2023, type: AlbumType.ALBUM, tracks: 7 },
  ];

  const albums = await Promise.all(
    albumData.map((a) =>
      prisma.album.upsert({
        where: { slug: a.slug },
        update: {},
        create: {
          title: a.title,
          slug: a.slug,
          artistId: artistMap[a.artist].id,
          albumType: a.type,
          totalTracks: a.tracks,
          releaseDate: new Date(`${a.year}-01-01`),
          imageUrl: albumImage(a.title),
          description: `${a.title} by ${artistData.find((ar) => ar.slug === a.artist)?.name}`,
        },
      })
    )
  );
  console.log(`✅ Created ${albums.length} albums`);

  const albumMap = Object.fromEntries(albums.map((a) => [a.slug, a]));

  // ─── Tracks ───────────────────────────────────────────────────────────────────
  let trackIndex = 0;

  interface TrackInput {
    title: string;
    artist: string;
    album?: string;
    duration: number;
    genres: string[];
    energy?: number;
    valence?: number;
    bpm?: number;
    trackNumber?: number;
  }

  const trackData: TrackInput[] = [
    // Neon Pulse - Radium Dreams
    { title: "Radium Pulse", artist: "neon-pulse", album: "radium-dreams", duration: 243, genres: ["electronic"], energy: 0.85, valence: 0.7, bpm: 128, trackNumber: 1 },
    { title: "Neon City Lights", artist: "neon-pulse", album: "radium-dreams", duration: 198, genres: ["electronic", "chill"], energy: 0.65, valence: 0.75, bpm: 110, trackNumber: 2 },
    { title: "Photon Wave", artist: "neon-pulse", album: "radium-dreams", duration: 221, genres: ["electronic"], energy: 0.9, valence: 0.8, bpm: 138, trackNumber: 3 },
    { title: "Signal Lost", artist: "neon-pulse", album: "radium-dreams", duration: 267, genres: ["electronic", "ambient"], energy: 0.45, valence: 0.4, bpm: 90, trackNumber: 4 },
    { title: "Circuit Breaker", artist: "neon-pulse", album: "radium-dreams", duration: 184, genres: ["electronic", "workout"], energy: 0.95, valence: 0.6, bpm: 150, trackNumber: 5 },
    { title: "Quantum Leap", artist: "neon-pulse", album: "radium-dreams", duration: 256, genres: ["electronic"], energy: 0.8, valence: 0.65, bpm: 125, trackNumber: 6 },
    { title: "Static Dreams", artist: "neon-pulse", album: "radium-dreams", duration: 312, genres: ["electronic", "ambient"], energy: 0.35, valence: 0.5, bpm: 80, trackNumber: 7 },
    { title: "Hypervoid", artist: "neon-pulse", album: "radium-dreams", duration: 194, genres: ["electronic", "workout"], energy: 0.92, valence: 0.55, bpm: 145, trackNumber: 8 },
    { title: "Dawn Protocol", artist: "neon-pulse", album: "radium-dreams", duration: 278, genres: ["electronic"], energy: 0.7, valence: 0.8, bpm: 118, trackNumber: 9 },
    { title: "Radium Fade", artist: "neon-pulse", album: "radium-dreams", duration: 341, genres: ["electronic", "ambient"], energy: 0.25, valence: 0.35, bpm: 70, trackNumber: 10 },

    // Aurora Vex - Violet Horizons
    { title: "Violet Sky", artist: "aurora-vex", album: "violet-horizons", duration: 222, genres: ["indie", "pop"], energy: 0.55, valence: 0.75, bpm: 105, trackNumber: 1 },
    { title: "Dreamcatcher", artist: "aurora-vex", album: "violet-horizons", duration: 247, genres: ["indie", "chill"], energy: 0.4, valence: 0.6, bpm: 95, trackNumber: 2 },
    { title: "Stardust Memories", artist: "aurora-vex", album: "violet-horizons", duration: 198, genres: ["indie", "pop"], energy: 0.6, valence: 0.8, bpm: 110, trackNumber: 3 },
    { title: "Northern Lights", artist: "aurora-vex", album: "violet-horizons", duration: 289, genres: ["indie", "ambient"], energy: 0.3, valence: 0.55, bpm: 85, trackNumber: 4 },
    { title: "Golden Hour", artist: "aurora-vex", album: "violet-horizons", duration: 213, genres: ["indie", "pop"], energy: 0.65, valence: 0.85, bpm: 112, trackNumber: 5 },

    // Cipher MC - Neural Rhymes
    { title: "Neural Network", artist: "cipher-mc", album: "neural-rhymes", duration: 198, genres: ["hip-hop"], energy: 0.75, valence: 0.5, bpm: 95, trackNumber: 1 },
    { title: "Street Algorithm", artist: "cipher-mc", album: "neural-rhymes", duration: 232, genres: ["hip-hop"], energy: 0.8, valence: 0.45, bpm: 98, trackNumber: 2 },
    { title: "Data Flow", artist: "cipher-mc", album: "neural-rhymes", duration: 215, genres: ["hip-hop"], energy: 0.7, valence: 0.6, bpm: 92, trackNumber: 3 },
    { title: "Encrypted Thoughts", artist: "cipher-mc", album: "neural-rhymes", duration: 267, genres: ["hip-hop", "lo-fi"], energy: 0.5, valence: 0.4, bpm: 85, trackNumber: 4 },
    { title: "Binary Bars", artist: "cipher-mc", album: "neural-rhymes", duration: 189, genres: ["hip-hop"], energy: 0.85, valence: 0.55, bpm: 100, trackNumber: 5 },

    // Luna Beats - Starfield
    { title: "Galaxy Pop", artist: "luna-beats", album: "starfield", duration: 203, genres: ["k-pop", "pop"], energy: 0.85, valence: 0.9, bpm: 130, trackNumber: 1 },
    { title: "Moonrise", artist: "luna-beats", album: "starfield", duration: 218, genres: ["k-pop"], energy: 0.75, valence: 0.85, bpm: 120, trackNumber: 2 },
    { title: "Starfall", artist: "luna-beats", album: "starfield", duration: 241, genres: ["k-pop", "electronic"], energy: 0.8, valence: 0.75, bpm: 125, trackNumber: 3 },
    { title: "Cosmic Dance", artist: "luna-beats", album: "starfield", duration: 197, genres: ["k-pop"], energy: 0.9, valence: 0.95, bpm: 135, trackNumber: 4 },
    { title: "Neon Sakura", artist: "luna-beats", album: "starfield", duration: 228, genres: ["k-pop", "electronic"], energy: 0.7, valence: 0.8, bpm: 115, trackNumber: 5 },

    // Jade Williams - Midnight Soul
    { title: "Midnight Fire", artist: "jade-williams", album: "midnight-soul", duration: 264, genres: ["rnb"], energy: 0.6, valence: 0.65, bpm: 90, trackNumber: 1 },
    { title: "Smooth Operator", artist: "jade-williams", album: "midnight-soul", duration: 298, genres: ["rnb", "chill"], energy: 0.45, valence: 0.6, bpm: 80, trackNumber: 2 },
    { title: "Love Frequency", artist: "jade-williams", album: "midnight-soul", duration: 237, genres: ["rnb"], energy: 0.55, valence: 0.7, bpm: 88, trackNumber: 3 },
    { title: "Soul Transmission", artist: "jade-williams", album: "midnight-soul", duration: 312, genres: ["rnb", "jazz"], energy: 0.4, valence: 0.55, bpm: 78, trackNumber: 4 },
    { title: "Electric Feel", artist: "jade-williams", album: "midnight-soul", duration: 219, genres: ["rnb", "pop"], energy: 0.7, valence: 0.8, bpm: 100, trackNumber: 5 },

    // Pixel Dreams - Study Session
    { title: "Late Night Coffee", artist: "pixel-dreams", album: "study-session-vol3", duration: 178, genres: ["lo-fi", "chill"], energy: 0.25, valence: 0.5, bpm: 70, trackNumber: 1 },
    { title: "Focus Mode", artist: "pixel-dreams", album: "study-session-vol3", duration: 213, genres: ["lo-fi", "instrumental"], energy: 0.2, valence: 0.45, bpm: 75, trackNumber: 2 },
    { title: "Rainy Window", artist: "pixel-dreams", album: "study-session-vol3", duration: 256, genres: ["lo-fi", "ambient"], energy: 0.15, valence: 0.4, bpm: 65, trackNumber: 3 },
    { title: "Café Vibes", artist: "pixel-dreams", album: "study-session-vol3", duration: 192, genres: ["lo-fi", "jazz"], energy: 0.3, valence: 0.6, bpm: 80, trackNumber: 4 },
    { title: "Morning Pages", artist: "pixel-dreams", album: "study-session-vol3", duration: 234, genres: ["lo-fi", "chill"], energy: 0.2, valence: 0.55, bpm: 72, trackNumber: 5 },
    { title: "Gentle Rain", artist: "pixel-dreams", album: "study-session-vol3", duration: 287, genres: ["lo-fi", "ambient"], energy: 0.1, valence: 0.35, bpm: 60, trackNumber: 6 },

    // CosmicJazz - Galaxies
    { title: "Nebula Suite", artist: "cosmicjazz", album: "galaxies", duration: 412, genres: ["jazz", "instrumental"], energy: 0.5, valence: 0.6, bpm: 88, trackNumber: 1 },
    { title: "Blue Giant", artist: "cosmicjazz", album: "galaxies", duration: 356, genres: ["jazz"], energy: 0.45, valence: 0.55, bpm: 92, trackNumber: 2 },
    { title: "Solar Improv", artist: "cosmicjazz", album: "galaxies", duration: 389, genres: ["jazz", "electronic"], energy: 0.6, valence: 0.65, bpm: 96, trackNumber: 3 },
    { title: "Dark Matter Groove", artist: "cosmicjazz", album: "galaxies", duration: 278, genres: ["jazz"], energy: 0.55, valence: 0.5, bpm: 85, trackNumber: 4 },

    // Echo Chamber - Gravel Road
    { title: "Stone Cold Riff", artist: "echo-chamber", album: "gravel-road", duration: 231, genres: ["rock"], energy: 0.85, valence: 0.5, bpm: 130, trackNumber: 1 },
    { title: "Dust Devil", artist: "echo-chamber", album: "gravel-road", duration: 267, genres: ["rock"], energy: 0.8, valence: 0.45, bpm: 125, trackNumber: 2 },
    { title: "Hollow Ground", artist: "echo-chamber", album: "gravel-road", duration: 312, genres: ["rock", "indie"], energy: 0.65, valence: 0.4, bpm: 115, trackNumber: 3 },
    { title: "Thunder Road", artist: "echo-chamber", album: "gravel-road", duration: 198, genres: ["rock", "workout"], energy: 0.9, valence: 0.55, bpm: 140, trackNumber: 4 },
    { title: "Asphalt Dreams", artist: "echo-chamber", album: "gravel-road", duration: 345, genres: ["rock"], energy: 0.7, valence: 0.35, bpm: 108, trackNumber: 5 },

    // Voltage - Berlin Underground
    { title: "Berliner Strasse", artist: "voltage", album: "berlin-underground", duration: 387, genres: ["electronic", "workout"], energy: 0.95, valence: 0.4, bpm: 140, trackNumber: 1 },
    { title: "Techno Bunker", artist: "voltage", album: "berlin-underground", duration: 426, genres: ["electronic"], energy: 0.92, valence: 0.35, bpm: 138, trackNumber: 2 },
    { title: "Acid Rain", artist: "voltage", album: "berlin-underground", duration: 298, genres: ["electronic"], energy: 0.88, valence: 0.45, bpm: 132, trackNumber: 3 },

    // Diamond Flow - Lagos Energy
    { title: "Lagos Nights", artist: "diamond-flow", album: "lagos-energy", duration: 234, genres: ["pop"], energy: 0.85, valence: 0.9, bpm: 118, trackNumber: 1 },
    { title: "Afro Vibe", artist: "diamond-flow", album: "lagos-energy", duration: 218, genres: ["pop"], energy: 0.9, valence: 0.95, bpm: 125, trackNumber: 2 },
    { title: "Street Party", artist: "diamond-flow", album: "lagos-energy", duration: 197, genres: ["pop", "workout"], energy: 0.92, valence: 0.9, bpm: 128, trackNumber: 3 },
    { title: "Jollof Groove", artist: "diamond-flow", album: "lagos-energy", duration: 245, genres: ["pop"], energy: 0.8, valence: 0.85, bpm: 115, trackNumber: 4 },
    { title: "Naija Pride", artist: "diamond-flow", album: "lagos-energy", duration: 289, genres: ["pop"], energy: 0.75, valence: 0.8, bpm: 110, trackNumber: 5 },

    // Rajiv Kumar - Dil Se
    { title: "Dil Ke Armaan", artist: "rajiv-kumar", album: "dil-se", duration: 287, genres: ["bollywood"], energy: 0.6, valence: 0.75, bpm: 92, trackNumber: 1 },
    { title: "Monsoon Love", artist: "rajiv-kumar", album: "dil-se", duration: 312, genres: ["bollywood"], energy: 0.5, valence: 0.65, bpm: 85, trackNumber: 2 },
    { title: "Chandni Raat", artist: "rajiv-kumar", album: "dil-se", duration: 264, genres: ["bollywood", "classical"], energy: 0.45, valence: 0.7, bpm: 80, trackNumber: 3 },
    { title: "Ek Pal", artist: "rajiv-kumar", album: "dil-se", duration: 234, genres: ["bollywood"], energy: 0.65, valence: 0.8, bpm: 96, trackNumber: 4 },
    { title: "Pyaar Ka Raasta", artist: "rajiv-kumar", album: "dil-se", duration: 298, genres: ["bollywood"], energy: 0.7, valence: 0.85, bpm: 100, trackNumber: 5 },

    // Quantum Beat - Quantum State
    { title: "Superposition", artist: "quantum-beat", album: "quantum-state", duration: 212, genres: ["hip-hop", "electronic"], energy: 0.75, valence: 0.55, bpm: 97, trackNumber: 1 },
    { title: "Wave Function", artist: "quantum-beat", album: "quantum-state", duration: 198, genres: ["hip-hop"], energy: 0.8, valence: 0.5, bpm: 100, trackNumber: 2 },
    { title: "Entanglement", artist: "quantum-beat", album: "quantum-state", duration: 234, genres: ["hip-hop", "lo-fi"], energy: 0.55, valence: 0.45, bpm: 88, trackNumber: 3 },
    { title: "Collapse Theory", artist: "quantum-beat", album: "quantum-state", duration: 267, genres: ["hip-hop"], energy: 0.7, valence: 0.4, bpm: 94, trackNumber: 4 },

    // NightOwl - After Hours
    { title: "3AM Drive", artist: "nightowl", album: "after-hours", duration: 312, genres: ["chill", "electronic"], energy: 0.3, valence: 0.45, bpm: 82, trackNumber: 1 },
    { title: "City Lights Fade", artist: "nightowl", album: "after-hours", duration: 278, genres: ["chill", "ambient"], energy: 0.2, valence: 0.4, bpm: 75, trackNumber: 2 },
    { title: "Insomnia Loop", artist: "nightowl", album: "after-hours", duration: 356, genres: ["chill", "lo-fi"], energy: 0.15, valence: 0.35, bpm: 68, trackNumber: 3 },
    { title: "Night Protocol", artist: "nightowl", album: "after-hours", duration: 287, genres: ["chill", "electronic"], energy: 0.4, valence: 0.5, bpm: 88, trackNumber: 4 },

    // Prism - Intersections
    { title: "Spectrum", artist: "prism", album: "intersections", duration: 213, genres: ["pop", "electronic"], energy: 0.85, valence: 0.9, bpm: 128, trackNumber: 1 },
    { title: "Refraction", artist: "prism", album: "intersections", duration: 198, genres: ["pop", "electronic"], energy: 0.8, valence: 0.85, bpm: 122, trackNumber: 2 },
    { title: "Wavelength", artist: "prism", album: "intersections", duration: 234, genres: ["pop"], energy: 0.75, valence: 0.8, bpm: 118, trackNumber: 3 },
    { title: "Ultraviolet", artist: "prism", album: "intersections", duration: 247, genres: ["pop", "electronic", "workout"], energy: 0.9, valence: 0.75, bpm: 135, trackNumber: 4 },
    { title: "Luminance", artist: "prism", album: "intersections", duration: 189, genres: ["pop"], energy: 0.7, valence: 0.85, bpm: 115, trackNumber: 5 },

    // Solara - Tropicália 2.0
    { title: "Samba Code", artist: "solara", album: "tropicalia-20", duration: 214, genres: ["electronic", "pop"], energy: 0.85, valence: 0.95, bpm: 120, trackNumber: 1 },
    { title: "Favela Bass", artist: "solara", album: "tropicalia-20", duration: 198, genres: ["electronic"], energy: 0.9, valence: 0.85, bpm: 130, trackNumber: 2 },
    { title: "Rio Nights", artist: "solara", album: "tropicalia-20", duration: 234, genres: ["electronic", "chill"], energy: 0.6, valence: 0.8, bpm: 100, trackNumber: 3 },
    { title: "Carnival", artist: "solara", album: "tropicalia-20", duration: 187, genres: ["electronic", "workout"], energy: 0.95, valence: 0.9, bpm: 138, trackNumber: 4 },

    // Aria Stone - Wildflower
    { title: "Mountain Song", artist: "aria-stone", album: "wildflower", duration: 267, genres: ["indie"], energy: 0.45, valence: 0.7, bpm: 90, trackNumber: 1 },
    { title: "Wildflower", artist: "aria-stone", album: "wildflower", duration: 298, genres: ["indie", "pop"], energy: 0.5, valence: 0.75, bpm: 95, trackNumber: 2 },
    { title: "Gentle Tide", artist: "aria-stone", album: "wildflower", duration: 312, genres: ["indie", "ambient"], energy: 0.3, valence: 0.65, bpm: 82, trackNumber: 3 },
    { title: "Firefly", artist: "aria-stone", album: "wildflower", duration: 234, genres: ["indie"], energy: 0.55, valence: 0.8, bpm: 98, trackNumber: 4 },

    // Sakura Sound - Sakura Rain
    { title: "Petal Fall", artist: "sakura-sound", album: "sakura-rain", duration: 312, genres: ["ambient", "instrumental"], energy: 0.15, valence: 0.45, bpm: 60, trackNumber: 1 },
    { title: "Cherry Blossom", artist: "sakura-sound", album: "sakura-rain", duration: 356, genres: ["ambient"], energy: 0.1, valence: 0.5, bpm: 55, trackNumber: 2 },
    { title: "Zen Garden", artist: "sakura-sound", album: "sakura-rain", duration: 423, genres: ["ambient", "classical"], energy: 0.1, valence: 0.4, bpm: 50, trackNumber: 3 },

    // Phantom Grove - dark alternative
    { title: "Shadow Protocol", artist: "phantom-grove", duration: 234, genres: ["rock", "indie"], energy: 0.75, valence: 0.3, bpm: 118, trackNumber: 1 },
    { title: "Haunted Frequency", artist: "phantom-grove", duration: 267, genres: ["rock"], energy: 0.8, valence: 0.25, bpm: 125, trackNumber: 2 },
    { title: "Dark Matter", artist: "phantom-grove", duration: 298, genres: ["rock"], energy: 0.85, valence: 0.2, bpm: 130, trackNumber: 3 },

    // Bass Theory
    { title: "Sub Bass Protocol", artist: "bass-theory", album: "sub-frequencies", duration: 312, genres: ["electronic", "workout"], energy: 0.9, valence: 0.55, bpm: 174, trackNumber: 1 },
    { title: "Jungle Frequency", artist: "bass-theory", album: "sub-frequencies", duration: 287, genres: ["electronic"], energy: 0.88, valence: 0.5, bpm: 170, trackNumber: 2 },

    // Silk Road Collective - Raga Electronic
    { title: "Digital Raga", artist: "silk-road-collective", album: "raga-electronic", duration: 445, genres: ["bollywood", "electronic", "instrumental"], energy: 0.55, valence: 0.65, bpm: 88, trackNumber: 1 },
    { title: "Sitar Dreams", artist: "silk-road-collective", album: "raga-electronic", duration: 387, genres: ["bollywood", "ambient", "instrumental"], energy: 0.3, valence: 0.6, bpm: 75, trackNumber: 2 },

    // SYNTHCORE
    { title: "Cold Steel", artist: "synthcore", album: "binary-hearts", duration: 234, genres: ["electronic", "rock"], energy: 0.85, valence: 0.3, bpm: 130, trackNumber: 1 },
    { title: "Binary Code", artist: "synthcore", album: "binary-hearts", duration: 267, genres: ["electronic"], energy: 0.88, valence: 0.35, bpm: 135, trackNumber: 2 },

    // Elara - classical crossover
    { title: "Baroque Futures", artist: "elara", duration: 312, genres: ["classical", "instrumental"], energy: 0.5, valence: 0.6, bpm: 88, trackNumber: 1 },
    { title: "Moonlight Synthesis", artist: "elara", duration: 267, genres: ["classical", "ambient"], energy: 0.3, valence: 0.55, bpm: 72, trackNumber: 2 },

    // Solar Winds - ambient
    { title: "Arctic Drift", artist: "solar-winds", duration: 412, genres: ["ambient"], energy: 0.1, valence: 0.35, bpm: 55, trackNumber: 1 },
    { title: "Fjord", artist: "solar-winds", duration: 378, genres: ["ambient", "instrumental"], energy: 0.15, valence: 0.4, bpm: 60, trackNumber: 2 },

    // CloudNine - dream pop
    { title: "Cirrus", artist: "cloudnine", album: "cumulus", duration: 234, genres: ["indie", "pop", "chill"], energy: 0.4, valence: 0.7, bpm: 95, trackNumber: 1 },
    { title: "Nimbus", artist: "cloudnine", album: "cumulus", duration: 256, genres: ["indie", "pop"], energy: 0.45, valence: 0.75, bpm: 100, trackNumber: 2 },
    { title: "Stratosphere", artist: "cloudnine", album: "cumulus", duration: 289, genres: ["indie", "ambient"], energy: 0.3, valence: 0.6, bpm: 88, trackNumber: 3 },

    // Vibe Garden - neo-soul
    { title: "Garden State", artist: "vibe-garden", duration: 278, genres: ["rnb", "jazz", "chill"], energy: 0.45, valence: 0.7, bpm: 88, trackNumber: 1 },
    { title: "Neo-Soul Flow", artist: "vibe-garden", duration: 312, genres: ["rnb", "jazz"], energy: 0.5, valence: 0.65, bpm: 92, trackNumber: 2 },

    // Meridian - progressive
    { title: "Event Horizon", artist: "meridian", duration: 398, genres: ["electronic", "instrumental"], energy: 0.75, valence: 0.5, bpm: 115, trackNumber: 1 },
    { title: "Singularity", artist: "meridian", duration: 412, genres: ["electronic"], energy: 0.8, valence: 0.45, bpm: 120, trackNumber: 2 },

    // Hollow Echo - post-rock
    { title: "Infinite Corridor", artist: "hollow-echo", album: "the-long-echo", duration: 478, genres: ["rock", "instrumental", "ambient"], energy: 0.6, valence: 0.4, bpm: 100, trackNumber: 1 },
    { title: "Reverb Trail", artist: "hollow-echo", album: "the-long-echo", duration: 512, genres: ["rock", "instrumental"], energy: 0.65, valence: 0.35, bpm: 105, trackNumber: 2 },

    // Lagos Groove
    { title: "Highlife Remix", artist: "lagos-groove", duration: 234, genres: ["pop"], energy: 0.85, valence: 0.9, bpm: 118, trackNumber: 1 },
    { title: "Afrobeats Anthem", artist: "lagos-groove", duration: 212, genres: ["pop", "workout"], energy: 0.9, valence: 0.92, bpm: 125, trackNumber: 2 },

    // Cypher State - conscious hip-hop
    { title: "Manifesto", artist: "cypher-state", duration: 234, genres: ["hip-hop"], energy: 0.7, valence: 0.4, bpm: 93, trackNumber: 1 },
    { title: "Wordplay Olympics", artist: "cypher-state", duration: 198, genres: ["hip-hop"], energy: 0.75, valence: 0.5, bpm: 96, trackNumber: 2 },

    // Frost Bite - dark electronic
    { title: "Ice Cathedral", artist: "frost-bite", duration: 367, genres: ["electronic", "ambient"], energy: 0.35, valence: 0.2, bpm: 78, trackNumber: 1 },
    { title: "Permafrost", artist: "frost-bite", duration: 412, genres: ["electronic"], energy: 0.4, valence: 0.15, bpm: 82, trackNumber: 2 },
  ];

  let created = 0;
  for (const t of trackData) {
    const artist = artistMap[t.artist];
    if (!artist) continue;

    const album = t.album ? albumMap[t.album] : undefined;
    const slug = `${t.artist}-${t.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

    const track = await prisma.track.upsert({
      where: { slug },
      update: {},
      create: {
        title: t.title,
        slug,
        artistId: artist.id,
        albumId: album?.id ?? null,
        duration: t.duration,
        audioUrl: getAudio(trackIndex),
        previewUrl: getAudio(trackIndex),
        imageUrl: album ? albumImage(album.title) : artistImage(artist.name),
        trackNumber: t.trackNumber ?? 1,
        energy: t.energy ?? 0.5,
        valence: t.valence ?? 0.5,
        bpm: t.bpm ?? 100,
        danceability: (t.energy ?? 0.5) * 0.8,
        playCount: Math.floor(Math.random() * 500000) + 1000,
      },
    });

    // Attach genres
    for (const genreSlug of t.genres) {
      const genre = genreMap[genreSlug];
      if (!genre) continue;
      await prisma.trackGenre.upsert({
        where: { trackId_genreId: { trackId: track.id, genreId: genre.id } },
        update: {},
        create: { trackId: track.id, genreId: genre.id },
      });
    }

    trackIndex++;
    created++;
  }
  console.log(`✅ Created ${created} tracks`);

  // ─── Demo User ────────────────────────────────────────────────────────────────
  const hashedPassword = await bcrypt.hash("demo1234", 10);
  const demoUser = await prisma.user.upsert({
    where: { email: "demo@vybeon.app" },
    update: {},
    create: {
      name: "Demo User",
      username: "vibeon_demo",
      email: "demo@vybeon.app",
      password: hashedPassword,
      bio: "VYBEON demo account. Explore all features!",
      isPublic: true,
    },
  });
  console.log(`✅ Created demo user: demo@vybeon.app / demo1234`);

  // ─── Achievements ─────────────────────────────────────────────────────────────
  const achievementData = [
    { key: "first_play", name: "First Vibe", description: "Play your first track", icon: "▶️", category: "milestone", threshold: 1 },
    { key: "night_owl", name: "Night Owl", description: "Listen after midnight 5 times", icon: "🦉", category: "time", threshold: 5 },
    { key: "genre_explorer", name: "Genre Explorer", description: "Listen to 10 different genres", icon: "🗺️", category: "exploration", threshold: 10 },
    { key: "hundred_songs", name: "100 Songs Club", description: "Listen to 100 unique tracks", icon: "💯", category: "milestone", threshold: 100 },
    { key: "playlist_master", name: "Playlist Master", description: "Create 5 playlists", icon: "📋", category: "creation", threshold: 5 },
    { key: "music_marathon", name: "Music Marathon", description: "Listen for 4 hours in a day", icon: "🎧", category: "time", threshold: 240 },
    { key: "early_bird", name: "Early Bird", description: "Listen before 7AM 5 times", icon: "🐦", category: "time", threshold: 5 },
    { key: "weekend_warrior", name: "Weekend Warrior", description: "Listen all day on weekends 4 times", icon: "⚡", category: "time", threshold: 4 },
    { key: "vibe_engine_user", name: "Vibe Architect", description: "Generate 10 Vibe Engine playlists", icon: "🔮", category: "feature", threshold: 10 },
    { key: "social_butterfly", name: "Social Butterfly", description: "Follow 10 artists", icon: "🦋", category: "social", threshold: 10 },
    { key: "like_master", name: "Heart Collector", description: "Like 50 tracks", icon: "❤️", category: "milestone", threshold: 50 },
    { key: "streak_7", name: "Week Streak", description: "Listen 7 days in a row", icon: "🔥", category: "streak", threshold: 7 },
    { key: "streak_30", name: "Month Streak", description: "Listen 30 days in a row", icon: "⚡", category: "streak", threshold: 30 },
  ];

  await Promise.all(
    achievementData.map((a) =>
      prisma.achievement.upsert({
        where: { key: a.key },
        update: {},
        create: a,
      })
    )
  );
  console.log(`✅ Created ${achievementData.length} achievements`);

  // ─── Demo Playlists ───────────────────────────────────────────────────────────
  const allTracks = await prisma.track.findMany({ take: 20, orderBy: { playCount: "desc" } });

  const demoPlaylist = await prisma.playlist.upsert({
    where: { id: "demo-playlist-1" },
    update: {},
    create: {
      id: "demo-playlist-1",
      name: "Top Vibes 2024",
      description: "The hottest tracks curated by VYBEON",
      userId: demoUser.id,
      isPublic: true,
      totalTracks: Math.min(allTracks.length, 15),
    },
  });

  for (let i = 0; i < Math.min(allTracks.length, 15); i++) {
    await prisma.playlistTrack.upsert({
      where: { playlistId_trackId: { playlistId: demoPlaylist.id, trackId: allTracks[i].id } },
      update: {},
      create: { playlistId: demoPlaylist.id, trackId: allTracks[i].id, position: i + 1 },
    });
  }

  console.log("✅ Created demo playlist");
  console.log("\n🎵 VYBEON database seeded successfully!");
  console.log(`   Demo login: demo@vybeon.app / demo1234`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
