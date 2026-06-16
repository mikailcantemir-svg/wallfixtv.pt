$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Add-Type -AssemblyName System.Drawing

function Ensure-Dir($path) {
  if (-not (Test-Path $path)) { New-Item -ItemType Directory -Path $path -Force | Out-Null }
}

function Save-Jpeg($sourcePath, $destPath, $maxWidth, $quality) {
  $img = [System.Drawing.Image]::FromFile($sourcePath)
  try {
    $ratio = [Math]::Min(1, $maxWidth / $img.Width)
    $w = [int][Math]::Round($img.Width * $ratio)
    $h = [int][Math]::Round($img.Height * $ratio)
    $bmp = New-Object System.Drawing.Bitmap $w, $h
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    try {
      $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
      $g.DrawImage($img, 0, 0, $w, $h)
    } finally { $g.Dispose() }

    $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
    $encoder = [System.Drawing.Imaging.Encoder]::Quality
    $params = New-Object System.Drawing.Imaging.EncoderParameters 1
    $params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter($encoder, [long]$quality)
    $bmp.Save($destPath, $codec, $params)
    $params.Dispose()
    $bmp.Dispose()
  } finally {
    $img.Dispose()
  }
}

function Save-PngResized($sourcePath, $destPath, $maxWidth) {
  $img = [System.Drawing.Image]::FromFile($sourcePath)
  try {
    $ratio = [Math]::Min(1, $maxWidth / $img.Width)
    $w = [int][Math]::Round($img.Width * $ratio)
    $h = [int][Math]::Round($img.Height * $ratio)
    $bmp = New-Object System.Drawing.Bitmap $w, $h
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    try {
      $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
      $g.DrawImage($img, 0, 0, $w, $h)
    } finally { $g.Dispose() }
    $bmp.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
  } finally {
    $img.Dispose()
  }
}

$imagesDir = Join-Path $Root "assets\images"
$iconsDir = Join-Path $Root "assets\icons"
$logosDir = Join-Path $Root "assets\logos"
$toolsDir = Join-Path $Root "scripts\tools"
Ensure-Dir $imagesDir
Ensure-Dir $iconsDir
Ensure-Dir $logosDir
Ensure-Dir $toolsDir

$cwebp = Join-Path $toolsDir "cwebp.exe"
if (-not (Test-Path $cwebp)) {
  $zip = Join-Path $toolsDir "libwebp.zip"
  $url = "https://storage.googleapis.com/downloads.webmproject.org/releases/webp/libwebp-1.4.0-windows-x64.zip"
  Invoke-WebRequest -Uri $url -OutFile $zip -UseBasicParsing
  Expand-Archive -Path $zip -DestinationPath $toolsDir -Force
  Copy-Item (Join-Path $toolsDir "libwebp-1.4.0-windows-x64\bin\cwebp.exe") $cwebp -Force
}

function Convert-WebP($sourcePath, $destPath, $quality, $maxWidth = 0) {
  $args = @("-q", $quality)
  if ($maxWidth -gt 0) { $args += @("-resize", $maxWidth, "0") }
  $args += @($sourcePath, "-o", $destPath)
  & $cwebp @args | Out-Null
  if ($LASTEXITCODE -ne 0) { throw "cwebp failed for $sourcePath" }
}

$assets = Join-Path $Root "assets"

# Hero
$heroSrc = Join-Path $assets "hero-tv-wall.png"
if (Test-Path $heroSrc) {
  Convert-WebP $heroSrc (Join-Path $imagesDir "hero-tv-wall.webp") 82 1400
}

# Gallery
1..5 | ForEach-Object {
  $src = Join-Path $assets "trabalho-tv-$_.png"
  if (Test-Path $src) {
    Convert-WebP $src (Join-Path $imagesDir "trabalho-tv-$_.webp") 80 900
  }
}

# OG image (JPEG, 1200px wide)
$ogPath = Join-Path $imagesDir "og-wallfixtv.jpg"
if (Test-Path $heroSrc) {
  Save-Jpeg $heroSrc $ogPath 1200 82
}

# Logo optimized PNG
$logoSrc = Join-Path $assets "wallfixtv-logo.png"
if (-not (Test-Path $logoSrc)) { $logoSrc = Join-Path $logosDir "wallfixtv-logo.png" }
if (Test-Path $logoSrc) {
  Save-PngResized $logoSrc (Join-Path $logosDir "wallfixtv-logo.png") 400
}

# Move icons (keep PNG)
$iconMap = @{
  "service-montagem-tv.png" = "service-montagem-tv.png"
  "service-suporte-tv.png" = "service-suporte-tv.png"
  "service-cabos-tv.png" = "service-cabos-tv.png"
  "service-espacos-tv.png" = "service-parede.png"
  "icon-whatsapp-processo.png" = "icon-whatsapp-processo.png"
  "icon-calendario.png" = "icon-calendario.png"
  "icon-berbequim.png" = "icon-berbequim.png"
}
foreach ($entry in $iconMap.GetEnumerator()) {
  $src = Join-Path $assets $entry.Key
  if (Test-Path $src) {
    Copy-Item $src (Join-Path $iconsDir $entry.Value) -Force
  }
}

Write-Host "Asset optimization complete."
