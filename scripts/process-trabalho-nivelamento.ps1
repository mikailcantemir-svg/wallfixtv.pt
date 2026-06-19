$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Add-Type -AssemblyName System.Drawing

function Ensure-Dir($path) {
  if (-not (Test-Path $path)) { New-Item -ItemType Directory -Path $path -Force | Out-Null }
}

function Save-Jpeg($bitmap, $destPath, $quality) {
  $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
  $encoder = [System.Drawing.Imaging.Encoder]::Quality
  $params = New-Object System.Drawing.Imaging.EncoderParameters 1
  $params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter($encoder, [long]$quality)
  $bitmap.Save($destPath, $codec, $params)
  $params.Dispose()
}

function Apply-RegionBlur($bitmap, $x, $y, $w, $h, $factor) {
  if ($w -le 0 -or $h -le 0) { return }
  $rect = New-Object System.Drawing.Rectangle $x, $y, $w, $h
  $region = $bitmap.Clone($rect, $bitmap.PixelFormat)
  $smallW = [Math]::Max(1, [int][Math]::Floor($w / $factor))
  $smallH = [Math]::Max(1, [int][Math]::Floor($h / $factor))
  $small = New-Object System.Drawing.Bitmap $smallW, $smallH
  $g1 = [System.Drawing.Graphics]::FromImage($small)
  try {
    $g1.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBilinear
    $g1.DrawImage($region, 0, 0, $smallW, $smallH)
  } finally {
    $g1.Dispose()
    $region.Dispose()
  }

  $g2 = [System.Drawing.Graphics]::FromImage($bitmap)
  try {
    $g2.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBilinear
    $g2.CompositingMode = [System.Drawing.Drawing2D.CompositingMode]::SourceCopy
    $g2.DrawImage($small, $x, $y, $w, $h)
  } finally {
    $g2.Dispose()
    $small.Dispose()
  }
}

function Process-FinalPhoto($sourcePath, $destPath) {
  $img = [System.Drawing.Image]::FromFile($sourcePath)
  try {
    $cropRightRatio = 0.22
    $cropW = [int][Math]::Round($img.Width * (1 - $cropRightRatio))
    $cropH = $img.Height
    $bmp = New-Object System.Drawing.Bitmap $cropW, $cropH
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    try {
      $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
      $g.DrawImage($img, 0, 0, (New-Object System.Drawing.Rectangle 0, 0, $cropW, $cropH), [System.Drawing.GraphicsUnit]::Pixel)
    } finally {
      $g.Dispose()
    }

    $screenX = [int][Math]::Round($cropW * 0.12)
    $screenY = [int][Math]::Round($cropH * 0.08)
    $screenW = [int][Math]::Round($cropW * 0.76)
    $screenH = [int][Math]::Round($cropH * 0.42)
    Apply-RegionBlur $bmp $screenX $screenY $screenW $screenH 5

    Save-Jpeg $bmp $destPath 85
    return @{ Width = $bmp.Width; Height = $bmp.Height }
  } finally {
    $img.Dispose()
  }
}

function Process-LevelPhoto($sourcePath, $destPath) {
  $img = [System.Drawing.Image]::FromFile($sourcePath)
  try {
    $bmp = New-Object System.Drawing.Bitmap $img.Width, $img.Height
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    try {
      $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
      $g.DrawImage($img, 0, 0, $img.Width, $img.Height)
    } finally {
      $g.Dispose()
    }

    Save-Jpeg $bmp $destPath 85
    return @{ Width = $bmp.Width; Height = $bmp.Height }
  } finally {
    $img.Dispose()
  }
}

$imagesDir = Join-Path $Root "assets\images"
$originalsDir = Join-Path $imagesDir "originais"
$toolsDir = Join-Path $Root "scripts\tools"
Ensure-Dir $imagesDir
Ensure-Dir $originalsDir
Ensure-Dir $toolsDir

$sourceFinal = "C:\Users\Mikail\.cursor\projects\c-Users-Mikail-Documents-wallfixtv-pt\assets\c__Users_Mikail_AppData_Roaming_Cursor_User_workspaceStorage_7906335baee1308f6ca0f64f495e419c_images_WhatsApp_Image_2026-06-19_at_22.42.46-5eb9615c-d878-4665-8c4e-c07f7e46df59.png"
$sourceDigital = "C:\Users\Mikail\.cursor\projects\c-Users-Mikail-Documents-wallfixtv-pt\assets\c__Users_Mikail_AppData_Roaming_Cursor_User_workspaceStorage_7906335baee1308f6ca0f64f495e419c_images_WhatsApp_Image_2026-06-19_at_22.42.46__2_-1116e8e7-63b8-4f79-a2b6-ce9ad57e5995.png"
$sourceBubble = "C:\Users\Mikail\.cursor\projects\c-Users-Mikail-Documents-wallfixtv-pt\assets\c__Users_Mikail_AppData_Roaming_Cursor_User_workspaceStorage_7906335baee1308f6ca0f64f495e419c_images_WhatsApp_Image_2026-06-19_at_22.42.46__4_-dc4ae099-cb96-41df-8b96-f1daf9b6245a.png"

foreach ($pair in @(
  @{ Source = $sourceFinal; Name = "trabalho-tv-nivelamento-final-original.png" },
  @{ Source = $sourceDigital; Name = "trabalho-tv-nivel-digital-original.png" },
  @{ Source = $sourceBubble; Name = "trabalho-tv-nivel-bolha-original.png" }
)) {
  if (-not (Test-Path $pair.Source)) { throw "Missing source image: $($pair.Source)" }
  Copy-Item $pair.Source (Join-Path $originalsDir $pair.Name) -Force
}

$cwebp = Join-Path $toolsDir "cwebp.exe"
if (-not (Test-Path $cwebp)) {
  $zip = Join-Path $toolsDir "libwebp.zip"
  $url = "https://storage.googleapis.com/downloads.webmproject.org/releases/webp/libwebp-1.4.0-windows-x64.zip"
  Invoke-WebRequest -Uri $url -OutFile $zip -UseBasicParsing
  Expand-Archive -Path $zip -DestinationPath $toolsDir -Force
  Copy-Item (Join-Path $toolsDir "libwebp-1.4.0-windows-x64\bin\cwebp.exe") $cwebp -Force
}

$outputs = @{}

$finalJpg = Join-Path $imagesDir "trabalho-tv-nivelamento-final.jpg"
$outputs.final = Process-FinalPhoto $sourceFinal $finalJpg

$digitalJpg = Join-Path $imagesDir "trabalho-tv-nivel-digital.jpg"
$outputs.digital = Process-LevelPhoto $sourceDigital $digitalJpg

$bubbleJpg = Join-Path $imagesDir "trabalho-tv-nivel-bolha.jpg"
$outputs.bubble = Process-LevelPhoto $sourceBubble $bubbleJpg

$webpFiles = @(
  @{ Jpg = $finalJpg; Webp = (Join-Path $imagesDir "trabalho-tv-nivelamento-final.webp") },
  @{ Jpg = $digitalJpg; Webp = (Join-Path $imagesDir "trabalho-tv-nivel-digital.webp") },
  @{ Jpg = $bubbleJpg; Webp = (Join-Path $imagesDir "trabalho-tv-nivel-bolha.webp") }
)

foreach ($item in $webpFiles) {
  & $cwebp -q 82 $item.Jpg -o $item.Webp | Out-Null
  if ($LASTEXITCODE -ne 0) { throw "cwebp failed for $($item.Jpg)" }
}

Write-Host "Processed dimensions:"
Write-Host "  final: $($outputs.final.Width)x$($outputs.final.Height)"
Write-Host "  digital: $($outputs.digital.Width)x$($outputs.digital.Height)"
Write-Host "  bubble: $($outputs.bubble.Width)x$($outputs.bubble.Height)"

Write-Host "File sizes (bytes):"
$allFiles = @($finalJpg, $digitalJpg, $bubbleJpg) + ($webpFiles | ForEach-Object { $_.Webp })
Get-ChildItem -Path $allFiles | ForEach-Object {
  Write-Host "  $($_.Name): $($_.Length)"
}
