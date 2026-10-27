$songs = @(
    # Murder 2
    @{ name="hale-dil"; query="ytsearch1:Hale Dil Murder 2 Harshit Saxena full audio" },
    @{ name="aa-zara"; query="ytsearch1:Aa Zara Murder 2 Sunidhi Chauhan full audio" },
    @{ name="aye-khuda"; query="ytsearch1:Aye Khuda Murder 2 Mithoon Kshitij Tarey full audio" },
    @{ name="phir-mohabbat"; query="ytsearch1:Phir Mohabbat Murder 2 Arijit Singh Mohd Irfan full audio" },
    @{ name="tujhko-bhulaana"; query="ytsearch1:Tujhko Bhulaana Murder 2 Sangeet Haldipur full audio" },
    @{ name="hale-dil-acoustic"; query="ytsearch1:Hale Dil Acoustic Murder 2 Harshit Saxena full audio" },
    @{ name="aa-zara-reloaded"; query="ytsearch1:Aa Zara Reloaded Murder 2 Sunidhi Chauhan full audio" },

    # Murder 3
    @{ name="teri-jhuki-nazar"; query="ytsearch1:Teri Jhuki Nazar Murder 3 Shafqat Amanat Ali full audio" },
    @{ name="mat-aazma-re"; query="ytsearch1:Mat Aazma Re Murder 3 KK full audio" },
    @{ name="jaata-hai-tujh-tak"; query="ytsearch1:Jaata Hai Tujh Tak Murder 3 Nikhil DSouza full audio" },
    @{ name="hum-jee-lenge"; query="ytsearch1:Hum Jee Lenge Murder 3 Mustafa Zahid Roxen full audio" },
    @{ name="teri-jhuki-nazar-film"; query="ytsearch1:Teri Jhuki Nazar Film Version Murder 3 full audio" },
    @{ name="hum-jee-lenge-rock"; query="ytsearch1:Hum Jee Lenge Rock Version Murder 3 Mustafa Zahid full audio" }
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
    yt-dlp -f bestaudio -x --audio-format mp3 --audio-quality 0 --no-playlist -o "$audioDir\$($song.name).%(ext)s" "$($song.query)" 2>&1 | Out-Null
    if (Test-Path $outFile) {
        Write-Host "  OK: $outFile"
    } else {
        Write-Host "  FAILED: $($song.name)"
    }
}

Write-Host "`nDONE. Downloaded $count Murder songs."
