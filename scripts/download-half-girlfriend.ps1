$songs = @(
    @{ name="baarish"; query="ytsearch1:Baarish Half Girlfriend Ash King full audio" },
    @{ name="thodi-der"; query="ytsearch1:Thodi Der Half Girlfriend Shreya Ghoshal Farhan Saeed full audio" },
    @{ name="tu-hi-hai"; query="ytsearch1:Tu Hi Hai Half Girlfriend Rahul Mishra full audio" },
    @{ name="phir-bhi-tumko-chaahunga"; query="ytsearch1:Phir Bhi Tumko Chaahunga Half Girlfriend Arijit Singh full audio" },
    @{ name="pal-bhar-chaahunga-reprise"; query="ytsearch1:Pal Bhar Chaahunga Reprise Half Girlfriend Arijit Singh full audio" },
    @{ name="lost-without-you"; query="ytsearch1:Lost Without You Half Girlfriend Ami Mishra full audio" },
    @{ name="stay-a-little-longer"; query="ytsearch1:Stay a Little Longer Half Girlfriend Anushka Shahaney full audio" },
    @{ name="mere-dil-mein"; query="ytsearch1:Mere Dil Mein Half Girlfriend Veronica Mehta Yash Narvekar full audio" },
    @{ name="phir-bhi-tumko-chaahungi-female"; query="ytsearch1:Phir Bhi Tumko Chaahungi Shraddha Kapoor Half Girlfriend full audio" },
    @{ name="tu-hi-hai-female"; query="ytsearch1:Tu Hi Hai Female Version Jyotica Tangri Half Girlfriend full audio" },
    @{ name="baarish-atif-aslam"; query="ytsearch1:Baarish Atif Aslam Half Girlfriend full audio" }
)

$audioDir = "public\audio"
$total = $songs.Count
$count = 0

foreach ($song in $songs) {
    $count++
    $outFile = "$audioDir\$($song.name).mp3"
    if (Test-Path $outFile) {
        Write-Host "[$count/$total] SKIP (exists): $($song.name)"
        continue
    }
    Write-Host "[$count/$total] Downloading: $($song.name)..."
    yt-dlp -x --audio-format mp3 --no-playlist -o "$audioDir\$($song.name).%(ext)s" "$($song.query)" 2>&1 | Out-Null
    if (Test-Path $outFile) {
        Write-Host "  OK: $outFile"
    } else {
        Write-Host "  FAILED: $($song.name)"
    }
}

Write-Host "`nDONE. Downloaded $count Half Girlfriend songs."
