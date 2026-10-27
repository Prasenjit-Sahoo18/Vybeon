const https = require('https');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const songs = [
  // 1920 Evil Returns
  { name: 'apna-mujhe-tu-lagaa', url: 'https://aac.saavncdn.com/256/9b5c14f7b8991fc298578a2767093bbd_320.mp4' },
  { name: 'uska-hi-banana', url: 'https://aac.saavncdn.com/256/a574d8f7763495c42979a64bb75dae34_320.mp4' },
  { name: 'jaavedaan-hai', url: 'https://aac.saavncdn.com/256/5d4916c59bb5ef1777153cf8148a445c_320.mp4' },
  { name: 'khud-ko-tere', url: 'https://aac.saavncdn.com/256/fd4fa75fc3bc1c32ca26668ae65c4054_320.mp4' },
  { name: 'majboor-tu-bhi-kahin', url: 'https://aac.saavncdn.com/256/f47e7b59cdf0f404b72cf289143aa04c_320.mp4' },

  // 1921
  { name: 'sunn-le-zara', url: 'https://aac.saavncdn.com/812/f7504934b93d1e4eeb7b7088821bf303_320.mp4' },
  { name: 'kuch-iss-tarah', url: 'https://aac.saavncdn.com/812/0714fab552d3c848385da7582c4c6c9b_320.mp4' },
  { name: 'yaara', url: 'https://aac.saavncdn.com/812/48d15f6940ce7c9f70c3bd9bb99fef97_320.mp4' },
  { name: 'tere-bina', url: 'https://aac.saavncdn.com/812/91ee6991830b4e24c3b9a5177fcf2fbc_320.mp4' },
  { name: 'aanewale-kal', url: 'https://aac.saavncdn.com/812/b0769fc2d39ef7ee4543aa3443ba9d75_320.mp4' },
  { name: 'agg-dil-me-lagaye', url: 'https://aac.saavncdn.com/091/c9b18799f8f4228db588baae4ec72b0a_320.mp4' }
];

const audioDir = path.join(__dirname, '..', 'public', 'audio');

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': '*/*',
        'Referer': 'https://www.jiosaavn.com/'
      }
    };
    https.get(url, options, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed with status ${res.statusCode}`));
        return;
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function run() {
  console.log(`Starting direct CDN download for ${songs.length} songs...`);
  for (let i = 0; i < songs.length; i++) {
    const s = songs[i];
    const mp3Path = path.join(audioDir, `${s.name}.mp3`);
    const tempMp4 = path.join(audioDir, `${s.name}-temp.mp4`);

    console.log(`[${i + 1}/${songs.length}] Downloading: ${s.name} from JioSaavn CDN (320kbps)...`);
    try {
      await downloadFile(s.url, tempMp4);
      console.log(`  Converting to 320kbps MP3: ${s.name}...`);
      execSync(`ffmpeg -y -i "${tempMp4}" -b:a 320k "${mp3Path}" 2>NUL`);
      fs.unlinkSync(tempMp4);
      console.log(`  OK: ${s.name}.mp3 (${fs.statSync(mp3Path).size} bytes)`);
    } catch (err) {
      console.error(`  FAILED: ${s.name}`, err.message);
    }
  }
  console.log('All 1920 Evil Returns and 1921 songs downloaded in 320kbps best quality!');
}

run();
