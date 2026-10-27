const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, '..', 'lib', 'music', 'demo-catalog.ts.bak');
const targetPath = path.join(__dirname, '..', 'lib', 'music', 'demo-catalog.ts');
const raw = fs.readFileSync(srcPath, 'utf8');

// We want to exclude these old compilation albums
const EXCLUDED_ALBUMS = new Set([
  'alb-arijit-1',
  'alb-armaan-1',
  'alb-armaan-2',
  'alb-kk-1'
]);

// Extract DEMO_GENRES block
const genresMatch = raw.match(/export const DEMO_GENRES: Genre\[\] = \[[\s\S]*?\n\];/);
if (!genresMatch) throw new Error('Could not find DEMO_GENRES');
const genresBlock = genresMatch[0];

// Extract DEMO_ARTISTS block
const artistsMatch = raw.match(/export const DEMO_ARTISTS: Artist\[\] = \[[\s\S]*?\n\];/);
if (!artistsMatch) throw new Error('Could not find DEMO_ARTISTS');
const artistsBlock = artistsMatch[0];

// Parse albums from DEMO_ALBUMS
const albumsRegex = /\{[\s\n]*id:\s*"([^"]+)",[\s\S]*?\n\s*\},/g;
const albumsStart = raw.indexOf('export const DEMO_ALBUMS: Album[] = [');
const albumsEnd = raw.indexOf('export const DEMO_TRACKS: Track[] = [');
const albumsSection = raw.substring(albumsStart, albumsEnd);

const albums = [];
let m;
while ((m = albumsRegex.exec(albumsSection)) !== null) {
  const id = m[1];
  if (!EXCLUDED_ALBUMS.has(id)) {
    albums.push({ id, raw: m[0] });
  }
}

console.log('Filtered Albums count:', albums.length);
albums.forEach(a => console.log('  Album:', a.id));

// Parse tracks from DEMO_TRACKS
const tracksSection = raw.substring(albumsEnd);
const tracksRegex = /\{[\s\n]*id:\s*"([^"]+)",[\s\S]*?albumId:\s*"([^"]+)",[\s\S]*?\n\s*\},/g;

const tracks = [];
while ((m = tracksRegex.exec(tracksSection)) !== null) {
  const id = m[1];
  const albumId = m[2];
  if (!EXCLUDED_ALBUMS.has(albumId)) {
    tracks.push({ id, albumId, raw: m[0] });
  }
}

console.log('Filtered Tracks count:', tracks.length);

// Desired priority order for top songs
const TOP_PRIORITY_TRACKS = [
  // Aashiqui 2 hit
  'trk-as-1', // Tum Hi Ho
  // Murder 2 hit
  'trk-m2-4', // Phir Mohabbat
  // Murder 3 hit
  'trk-m3-1', // Teri Jhuki Nazar
  // 1920 Evil Returns hits
  'trk-1920er-1', // Apna Mujhe Tu Lagaa
  'trk-1920er-2', // Uska Hi Banaana
  // 1921 hits
  'trk-1921-1', // Sunn Le Zara
  'trk-1921-2', // Kuch Iss Tarah
  // Aashiqui 2 hits
  'trk-a2-2', // Sunn Raha Hai Na Tu
  'trk-a2-3', // Chahun Main Ya Naa
  // Murder 2 hit
  'trk-m2-1', // Hale Dil
  // Murder 3 hit
  'trk-m3-2', // Mat Aazma Re
  // Half Girlfriend hit
  'trk-hgf-1', // Phir Bhi Tumko Chaahunga
  // Haunted 3D hit
  'trk-haunted-1', // Tera Hi Bas Hona Chaahoon
  // Fashion hit
  'trk-mc-1', // Kuchh Khaas
  // Do Lafzon Ki Kahani hit
  'trk-am-kth', // Kuch To Hai
  // 1921 & 1920 ER
  'trk-1921-3', // Yaara
  'trk-1920er-3', // Jaavedaan Hai
  // Murder 2
  'trk-m2-2', // Aa Zara
  'trk-m2-3', // Aye Khuda
];

// Sort tracks: priority tracks first, then the rest
const priorityMap = new Map();
TOP_PRIORITY_TRACKS.forEach((id, idx) => priorityMap.set(id, idx));

tracks.sort((a, b) => {
  const pA = priorityMap.has(a.id) ? priorityMap.get(a.id) : 999;
  const pB = priorityMap.has(b.id) ? priorityMap.get(b.id) : 999;
  return pA - pB;
});

console.log('Top 10 tracks after sorting:');
tracks.slice(0, 10).forEach((t, i) => console.log(`  ${i+1}. ${t.id} (${t.albumId})`));

// Also order albums so the most popular are first:
const ALBUM_ORDER = [
  'alb-arijit-2', // Aashiqui 2
  'alb-murder-2', // Murder 2
  'alb-murder-3', // Murder 3
  'alb-1920er',   // 1920 Evil Returns
  'alb-1921',     // 1921
  'alb-half-gf',  // Half Girlfriend
  'alb-haunted',  // Haunted - 3D
  'alb-hs2',      // Hate Story 2
  'alb-hs3',      // Hate Story 3
  'alb-hs4',      // Hate Story 4
  'alb-hs1',      // Hate Story
  'alb-fashion',  // Fashion
  'alb-dlkk',     // Do Lafzon Ki Kahani
];

const albumOrderMap = new Map();
ALBUM_ORDER.forEach((id, idx) => albumOrderMap.set(id, idx));

albums.sort((a, b) => {
  const pA = albumOrderMap.has(a.id) ? albumOrderMap.get(a.id) : 999;
  const pB = albumOrderMap.has(b.id) ? albumOrderMap.get(b.id) : 999;
  return pA - pB;
});

// Construct the new clean file
let output = `import { Track, Artist, Album, Genre } from "@/types";\n\n`;
output += genresBlock + '\n\n';
output += artistsBlock + '\n\n';

output += `export const DEMO_ALBUMS: Album[] = [\n`;
for (const a of albums) {
  output += '  ' + a.raw + '\n';
}
output += `];\n\n`;

// Create a lookup map for albums in code so `album: DEMO_ALBUMS[...]` always matches by ID
output += `// Quick lookup map for albums\n`;
output += `const ALBUM_LOOKUP: Record<string, Album> = {};\n`;
output += `DEMO_ALBUMS.forEach((alb) => { ALBUM_LOOKUP[alb.id] = alb; });\n\n`;

output += `export const DEMO_TRACKS: Track[] = [\n`;
for (const t of tracks) {
  // Replace fragile "album: DEMO_ALBUMS[...]" with "album: ALBUM_LOOKUP["${t.albumId}"]"
  const cleanedRaw = t.raw.replace(/album:\s*DEMO_ALBUMS\[\d+\],/, `album: ALBUM_LOOKUP["${t.albumId}"],`);
  output += '  ' + cleanedRaw + '\n';
}
output += `];\n`;

fs.writeFileSync(targetPath, output, 'utf8');
console.log('Successfully wrote new demo-catalog.ts with', tracks.length, 'tracks and', albums.length, 'albums!');
