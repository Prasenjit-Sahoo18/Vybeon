const fs = require("fs");
const path = require("path");

const raw = fs.readFileSync(path.join(__dirname, "../public/arijit_songs.json"), "utf8");
const cleanRaw = raw.replace(/^\uFEFF/, "");
const songs = JSON.parse(cleanRaw);

const YOUTUBE_IDS = [
  "Umqb9KENgmk", // Tum Hi Ho (4:22)
  "BddP6PYo2gs", // Kesariya (4:28)
  "bzSTpdcs-EI", // Channa Mereya (4:49)
  "ElZfdU54Cp8", // Apna Bana Le (4:21)
  "AEIVhBS6baE", // Gerua (5:45)
  "6FURuLYrR_Q", // Ae Dil Hai Mushkil (4:29)
  "mjBmsn5mJ2o", // Shayad (4:07)
  "sK7riqg2mr4", // Agar Tum Saath Ho (5:41)
  "fdubeMFwuGs", // Ilahi (3:49)
  "VAdGW7QDJUI", // Chaleya (3:20)
  "RLzC55ai0eo", // Heeriye (3:14)
  "hr3laommsTE", // Satranga (4:31)
  "Wdxx15-w79o", // O Maahi (3:53)
  "cYOB941gyXI", // Hawayein (4:50)
  "hoNb6HuNmU0", // Khairiyat (4:40)
  "z-diRzV4vYk", // Raabta (4:03)
  "hhdSyH4QCqA", // Zaalima (4:59)
  "l8Z4e2Jm7rQ", // Muskurane (5:34)
  "VdE3q-vL-Y4", // Suno Na Sangemarmar (3:33)
  "_iktURkExq8", // Phir Bhi Tumko Chaahunga (5:51)
  "EatzcaVJRMs", // Tera Yaar Hoon Main (4:24)
];

const DURATIONS = [
  262, 268, 289, 261, 345, 269, 247, 341, 229, 200, 194, 271, 233, 290, 280, 243, 299, 334, 213, 351, 264
];

const trackItems = songs.map((s, idx) => {
  const id = `trk-as-${idx + 1}`;
  const slug = s.title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

  const ytId = YOUTUBE_IDS[idx] || "Umqb9KENgmk";
  const dur = DURATIONS[idx] || 260;

  return `  {
    id: ${JSON.stringify(id)},
    title: ${JSON.stringify(s.title)},
    slug: ${JSON.stringify(slug)},
    artistId: "art-arijit",
    albumId: "alb-arijit-1",
    duration: ${dur},
    youtubeId: ${JSON.stringify(ytId)},
    audioUrl: ${JSON.stringify(s.previewUrl)},
    previewUrl: ${JSON.stringify(s.previewUrl)},
    imageUrl: ${JSON.stringify(s.artwork)},
    playCount: ${15000000 + (songs.length - idx) * 500000},
    isExplicit: false,
    bpm: 96,
    energy: 0.65,
    valence: 0.65,
    danceability: 0.60,
    artist: DEMO_ARTISTS[0],
    album: DEMO_ALBUMS[0],
    genres: [DEMO_GENRES[0], DEMO_GENRES[1]],
    createdAt: new Date(),
    updatedAt: new Date(),
  }`;
}).join(",\n");

const catalogCode = `import { Track, Artist, Album, Genre } from "@/types";

export const DEMO_GENRES: Genre[] = [
  { id: "g-bolly", name: "Bollywood", slug: "bollywood", color: "#FF3366", description: "Soulful, grand cinematic Indian melodies" },
  { id: "g-romance", name: "Romantic", slug: "romantic", color: "#FF6B9D", description: "Deep love ballads and heartfelt frequencies" },
  { id: "g-1", name: "Pop", slug: "pop", color: "#FF6B9D", description: "Chart-topping pop anthems" },
  { id: "g-2", name: "Rock", slug: "rock", color: "#FF4444", description: "Guitar-driven rock classics" },
  { id: "g-3", name: "Hip-Hop", slug: "hip-hop", color: "#B8FF00", description: "Rhythmic beats and rhymes" },
  { id: "g-4", name: "Electronic", slug: "electronic", color: "#00F5FF", description: "Synthesized futuristic sounds" },
  { id: "g-5", name: "Lo-Fi", slug: "lo-fi", color: "#7C3AED", description: "Mellow beats for studying" },
  { id: "g-6", name: "R&B", slug: "rnb", color: "#FF8C00", description: "Soulful rhythm and blues" },
  { id: "g-7", name: "Jazz", slug: "jazz", color: "#FFD700", description: "Timeless jazz improvisation" },
  { id: "g-8", name: "Ambient", slug: "ambient", color: "#4A9EFF", description: "Atmospheric soundscapes" },
  { id: "g-9", name: "Workout", slug: "workout", color: "#00FF88", description: "High-energy fitness tracks" },
  { id: "g-10", name: "Chill", slug: "chill", color: "#87CEEB", description: "Relaxed feel-good sounds" },
];

export const DEMO_ARTISTS: Artist[] = [
  {
    id: "art-arijit",
    name: "Arijit Singh",
    slug: "arijit-singh",
    country: "IN",
    verified: true,
    monthlyListeners: 45800000,
    imageUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/bb/23/ee/bb23eeed-0c35-4f1d-2b11-485622777ae4/8902894353007_cover.jpg/600x600bb.jpg",
    bio: "India's undisputed king of playback singing and soulful melodies. The voice behind Tum Hi Ho, Kesariya, Channa Mereya, and countless iconic Bollywood anthems.",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "art-1",
    name: "Neon Pulse",
    slug: "neon-pulse",
    country: "US",
    verified: true,
    monthlyListeners: 2800000,
    imageUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=Neon%20Pulse&backgroundColor=0f0f1a&scale=80",
    bio: "Electronic music pioneer blending synthwave, cyberpunk beats, and future bass.",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "art-2",
    name: "Aurora Vex",
    slug: "aurora-vex",
    country: "UK",
    verified: true,
    monthlyListeners: 1500000,
    imageUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=Aurora%20Vex&backgroundColor=0f0f1a&scale=80",
    bio: "Indie pop artist known for dreamy vocals, lush acoustic guitars, and neon production.",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const DEMO_ALBUMS: Album[] = [
  {
    id: "alb-arijit-1",
    title: "Arijit Singh: Ultimate Bollywood Masterpieces",
    slug: "arijit-singh-ultimate-masterpieces",
    artistId: "art-arijit",
    imageUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/bb/23/ee/bb23eeed-0c35-4f1d-2b11-485622777ae4/8902894353007_cover.jpg/600x600bb.jpg",
    releaseDate: new Date("2023-11-15"),
    albumType: "COMPILATION",
    description: "The definitive original studio collection of timeless romantic, melancholic, and energetic Bollywood hits by Arijit Singh.",
    totalTracks: ${songs.length},
    artist: DEMO_ARTISTS[0],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "alb-arijit-2",
    title: "Aashiqui 2 (Original Soundtrack)",
    slug: "aashiqui-2-soundtrack",
    artistId: "art-arijit",
    imageUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/bb/23/ee/bb23eeed-0c35-4f1d-2b11-485622777ae4/8902894353007_cover.jpg/600x600bb.jpg",
    releaseDate: new Date("2013-04-08"),
    albumType: "ALBUM",
    description: "The monumental soundtrack that catapulted Arijit Singh into global stardom.",
    totalTracks: 8,
    artist: DEMO_ARTISTS[0],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const DEMO_TRACKS: Track[] = [
${trackItems}
];
`;

fs.writeFileSync(path.join(__dirname, "../lib/music/demo-catalog.ts"), catalogCode, "utf8");
console.log("Successfully regenerated demo-catalog.ts with full-length YouTube IDs and durations!");
