const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'audio');

// All songs to download/re-download via yt-dlp from YouTube (best quality)
const songs = [
  // ==========================================
  // MURDER 2 (7 songs)
  // ==========================================
  { filename: 'phir-mohabbat', search: 'Phir Mohabbat Murder 2 full song official audio' },
  { filename: 'hale-dil', search: 'Hale Dil Tujhko Sunata Murder 2 full song official audio' },
  { filename: 'aa-zara', search: 'Aa Zara Murder 2 full song official audio' },
  { filename: 'aye-khuda', search: 'Aye Khuda Murder 2 full song official audio' },
  { filename: 'haan-tu-hai', search: 'Haan Tu Hai Murder 2 full song official audio' },
  { filename: 'naina-yeh', search: 'Naina Yeh Murder 2 full song official audio' },
  { filename: 'aa-zara-reloaded', search: 'Aa Zara Reloaded Murder 2 full song official audio' },

  // ==========================================
  // MURDER 3 (6 songs)
  // ==========================================
  { filename: 'suno-na-sangemarmar', search: 'Suno Na Sangemarmar Murder 3 full song official audio' },
  { filename: 'teri-jhuki-nazar', search: 'Teri Jhuki Nazar Murder 3 full song official audio' },
  { filename: 'mat-aazma-re', search: 'Mat Aazma Re Murder 3 KK full song official audio' },
  { filename: 'jaata-hai-tujh-tak', search: 'Jaata Hai Tujh Tak Murder 3 full song official audio' },
  { filename: 'hum-jee-lenge', search: 'Hum Jee Lenge Murder 3 full song official audio' },
  { filename: 'teri-jhuki-nazar-film', search: 'Teri Jhuki Nazar Film Version Murder 3 full song' },
  { filename: 'hum-jee-lenge-rock', search: 'Hum Jee Lenge Rock Version Murder 3 full song' },
  { filename: 'dil-kanch-sa', search: 'Dil Kanch Sa Toota Murder 3 full song official' },

  // ==========================================
  // 1920 EVIL RETURNS (5 songs)
  // ==========================================
  { filename: 'apna-mujhe-tu-lagaa', search: 'Apna Mujhe Tu Lagaa 1920 Evil Returns full song official audio' },
  { filename: 'uska-hi-banana', search: 'Uska Hi Banana 1920 Evil Returns Arijit Singh full song official' },
  { filename: 'jaavedaan-hai', search: 'Jaavedaan Hai 1920 Evil Returns full song official audio' },
  { filename: 'khud-ko-tere', search: 'Khud Ko Tere 1920 Evil Returns full song official audio' },
  { filename: 'majboor-tu-bhi-kahin', search: 'Majboor Tu Bhi Kahin 1920 Evil Returns full song official' },

  // ==========================================
  // 1921 (6 songs)
  // ==========================================
  { filename: 'sunn-le-zara', search: 'Sunn Le Zara 1921 full song official audio' },
  { filename: 'kuch-iss-tarah', search: 'Kuch Iss Tarah 1921 Asees Kaur full song official audio' },
  { filename: 'yaara', search: 'Yaara 1921 Arijit Singh full song official audio' },
  { filename: 'tere-bina', search: 'Tere Bina 1921 Arijit Singh full song official audio' },
  { filename: 'aanewale-kal', search: 'Aanewale Kal 1921 full song official audio' },
  { filename: 'agg-dil-me-lagaye', search: 'Agg Dil Mein Lagaye 1921 full song official audio' },

  // ==========================================
  // AASHIQUI 2 (10 songs)
  // ==========================================
  { filename: 'tum-hi-ho', search: 'Tum Hi Ho Aashiqui 2 Arijit Singh full song official audio' },
  { filename: 'sunn-raha-hai-na-tu', search: 'Sunn Raha Hai Na Tu Aashiqui 2 Arijit Singh full song official audio' },
  { filename: 'chahun-main-ya-naa', search: 'Chahun Main Ya Naa Aashiqui 2 Arijit Singh full song official audio' },
  { filename: 'hum-mar-jayenge', search: 'Hum Mar Jayenge Aashiqui 2 Arijit Singh full song official audio' },
  { filename: 'piya-aaye-na', search: 'Piya Aaye Na Aashiqui 2 KK full song official audio' },
  { filename: 'meri-aashiqui', search: 'Meri Aashiqui Ab Tum Hi Ho Aashiqui 2 Arijit Singh Palak full song official' },
  { filename: 'bhula-dena', search: 'Bhula Dena Aashiqui 2 Mustafa Zahid full song official audio' },
  { filename: 'milne-hai-mujhse-aayi', search: 'Milne Hai Mujhse Aayi Aashiqui 2 Arijit Singh full song official audio' },
  { filename: 'aasan-nahin-yahan', search: 'Aasan Nahin Yahan Aashiqui 2 Arijit Singh full song official audio' },
  { filename: 'tum-hi-ho-reprise', search: 'Tum Hi Ho Reprise Aashiqui 2 Arijit Singh full song official audio' },
];

async function downloadSong(song, index, total) {
  const dest = path.join(OUTPUT_DIR, `${song.filename}.mp3`);
  
  console.log(`\n[${index + 1}/${total}] Downloading: ${song.filename}`);
  console.log(`  Search: "${song.search}"`);

  try {
    // Delete existing file to re-download
    if (fs.existsSync(dest)) {
      fs.unlinkSync(dest);
      console.log(`  Deleted old file.`);
    }

    // Use yt-dlp to search YouTube and download best audio
    const cmd = `yt-dlp -x --audio-format mp3 --audio-quality 0 --embed-thumbnail --add-metadata -o "${dest}" "ytsearch1:${song.search.replace(/"/g, '\\"')}"`;
    
    execSync(cmd, { 
      stdio: ['pipe', 'pipe', 'pipe'], 
      timeout: 120000,
      cwd: OUTPUT_DIR 
    });

    if (fs.existsSync(dest)) {
      const stats = fs.statSync(dest);
      console.log(`  ✅ OK: ${song.filename}.mp3 (${(stats.size / 1024 / 1024).toFixed(1)} MB)`);
      return true;
    } else {
      console.log(`  ❌ FAILED: File not created`);
      return false;
    }
  } catch (err) {
    console.error(`  ❌ ERROR: ${err.message.substring(0, 200)}`);
    return false;
  }
}

async function main() {
  console.log('='.repeat(60));
  console.log('RE-DOWNLOADING ALL SONGS VIA YT-DLP (BEST QUALITY)');
  console.log(`Total: ${songs.length} songs`);
  console.log('='.repeat(60));

  let success = 0;
  let failed = 0;

  for (let i = 0; i < songs.length; i++) {
    const ok = await downloadSong(songs[i], i, songs.length);
    if (ok) success++;
    else failed++;
    
    // Small delay between downloads
    await new Promise(r => setTimeout(r, 300));
  }

  console.log('\n' + '='.repeat(60));
  console.log(`DONE! Success: ${success}, Failed: ${failed}`);
  console.log('='.repeat(60));
}

main().catch(console.error);
