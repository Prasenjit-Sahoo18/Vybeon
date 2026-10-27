$songs = @(
    @{ name="kuch-to-hai"; query="ytsearch1:Kuch To Hai Do Lafzon Ki Kahani Armaan Malik full audio" },
    @{ name="mahe-jaan"; query="ytsearch1:Mahe Jaan Hate Story Harshit Saxena full audio" },
    @{ name="dil-kanch-sa"; query="ytsearch1:Dil Kanch Sa Hate Story Krishna Beura full audio" },
    @{ name="raat"; query="ytsearch1:Raat Hate Story Sunidhi Chauhan full audio" },
    @{ name="aaj-phir"; query="ytsearch1:Aaj Phir Hate Story 2 Arijit Singh full audio" },
    @{ name="pink-lips"; query="ytsearch1:Pink Lips Hate Story 2 full audio" },
    @{ name="hai-dil-ye-mera"; query="ytsearch1:Hai Dil Ye Mera Hate Story 2 Arijit Singh full audio" },
    @{ name="kabhi-aayine-pe"; query="ytsearch1:Kabhi Aayine Pe Likha Tujhe Hate Story 2 KK full audio" },
    @{ name="tumhe-apna-banane-ka"; query="ytsearch1:Tumhe Apna Banane Ka Hate Story 3 Armaan Malik full audio" },
    @{ name="tu-isaq-mera"; query="ytsearch1:Tu Isaq Mera Hate Story 3 Meet Bros Neha Kakkar full audio" },
    @{ name="wajah-tum-ho"; query="ytsearch1:Wajah Tum Ho Hate Story 3 Armaan Malik full audio" },
    @{ name="neendein-khul-jaati-hain"; query="ytsearch1:Neendein Khul Jaati Hain Hate Story 3 Mika Singh full audio" },
    @{ name="aashiq-banaya-aapne"; query="ytsearch1:Aashiq Banaya Aapne Hate Story IV Himesh Reshammiya Neha Kakkar full audio" },
    @{ name="boond-boond"; query="ytsearch1:Boond Boond Hate Story IV Jubin Nautiyal full audio" },
    @{ name="tum-mere-ho"; query="ytsearch1:Tum Mere Ho Hate Story IV Jubin Nautiyal full audio" },
    @{ name="badnaamiyan"; query="ytsearch1:Badnaamiyan Hate Story IV Armaan Malik full audio" },
    @{ name="naam-hai-mera"; query="ytsearch1:Naam Hai Mera Hate Story IV Neeti Mohan full audio" },
    @{ name="mohabbat-nasha-hai"; query="ytsearch1:Mohabbat Nasha Hai Hate Story IV Tony Kakkar Neha Kakkar full audio" },
    @{ name="love-to-hate-you"; query="ytsearch1:Love To Hate You Hate Story 3 full audio" }
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

Write-Host "`nDONE. Downloaded $count songs."
