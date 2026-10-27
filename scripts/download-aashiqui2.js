const https = require('https');
const { execSync } = require('child_process');
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'audio');

// JioSaavn DES-ECB decryption key
const SAAVN_KEY = '38346591';

function decryptUrl(encUrl) {
  const decipher = crypto.createDecipheriv('des-ecb', Buffer.from(SAAVN_KEY), null);
  decipher.setAutoPadding(true);
  let dec = decipher.update(encUrl, 'base64', 'utf8');
  dec += decipher.final('utf8');
  // Replace quality to get 320kbps
  return dec.replace(/_96\.mp4/, '_320.mp4').replace(/_160\.mp4/, '_320.mp4');
}

function searchSong(query) {
  return new Promise((resolve, reject) => {
    const url = `https://www.jiosaavn.com/api.php?__call=search.getResults&_format=json&_marker=0&ctx=web6dot0&api_version=4&q=${encodeURIComponent(query)}&n=5&p=1`;
    https.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' }
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.results && json.results.length > 0) {
            // Find the result from Aashiqui 2
            const match = json.results.find(r =>
              r.more_info && r.more_info.album &&
              r.more_info.album.toLowerCase().includes('aashiqui')
            ) || json.results[0];
            resolve(match);
          } else {
            reject(new Error('No results'));
          }
        } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const tmpDest = dest + '.tmp.mp4';
    const cmd = `curl.exe -s -L -o "${tmpDest}" -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" "${url}"`;
    try {
      execSync(cmd, { stdio: 'pipe', timeout: 60000 });
      // Convert AAC to MP3 320kbps
      execSync(`ffmpeg -y -i "${tmpDest}" -b:a 320k "${dest}"`, { stdio: 'pipe', timeout: 60000 });
      fs.unlinkSync(tmpDest);
      const stats = fs.statSync(dest);
      resolve(stats.size);
    } catch (e) {
      reject(e);
    }
  });
}

const songs = [
  { query: 'Sunn Raha Hai Na Tu Aashiqui 2', filename: 'sunn-raha-hai-na-tu' },
  { query: 'Chahun Main Ya Naa Aashiqui 2', filename: 'chahun-main-ya-naa' },
  { query: 'Hum Mar Jayenge Aashiqui 2', filename: 'hum-mar-jayenge' },
  { query: 'Meri Aashiqui Ab Tum Hi Ho Aashiqui 2', filename: 'meri-aashiqui' },
  { query: 'Bhula Dena Mujhe Aashiqui 2', filename: 'bhula-dena' },
  { query: 'Milne Hai Mujhse Aayi Aashiqui 2', filename: 'milne-hai-mujhse-aayi' },
  { query: 'Aasan Nahin Yahan Aashiqui 2', filename: 'aasan-nahin-yahan' },
];

async function main() {
  console.log(`Downloading ${songs.length} Aashiqui 2 songs from JioSaavn CDN (320kbps)...\n`);

  for (let i = 0; i < songs.length; i++) {
    const song = songs[i];
    const dest = path.join(OUTPUT_DIR, `${song.filename}.mp3`);

    // Skip if already exists
    if (fs.existsSync(dest) && fs.statSync(dest).size > 500000) {
      console.log(`[${i+1}/${songs.length}] SKIP (already exists): ${song.filename}.mp3`);
      continue;
    }

    console.log(`[${i+1}/${songs.length}] Searching: ${song.query}...`);
    try {
      const result = await searchSong(song.query);
      if (!result.more_info || !result.more_info.encrypted_media_url) {
        console.log(`  WARN: No encrypted URL for ${song.filename}, skipping`);
        continue;
      }
      const cdnUrl = decryptUrl(result.more_info.encrypted_media_url);
      console.log(`  Downloading: ${song.filename} (${result.title} by ${result.more_info.artistMap ? Object.keys(result.more_info.artistMap).join(', ') : 'unknown'})...`);
      console.log(`  Duration: ${result.more_info.duration}s`);

      const size = await downloadFile(cdnUrl, dest);
      console.log(`  OK: ${song.filename}.mp3 (${size} bytes)\n`);
    } catch (err) {
      console.error(`  ERROR downloading ${song.filename}: ${err.message}\n`);
    }

    // Small delay between requests
    await new Promise(r => setTimeout(r, 500));
  }

  console.log('All Aashiqui 2 songs downloaded!');
}

main().catch(console.error);
