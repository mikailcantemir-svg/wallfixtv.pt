Add-Type -AssemblyName System.Drawing
$src = "c:\Users\Mikail\Documents\wallfixtv.pt\assets\wallfixtv-logo.png"
$dest = "c:\Users\Mikail\Documents\wallfixtv.pt\assets\logos\wallfixtv-logo.png"
$maxWidth = 400
$img = [System.Drawing.Image]::FromFile($src)
try {
  $w = [Math]::Min($maxWidth, $img.Width)
  $h = [int][Math]::Round($img.Height * ($w / $img.Width))
  if ($h -lt 1) { $h = 1 }
  $bmp = New-Object System.Drawing.Bitmap($w, $h)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  try {
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.Clear([System.Drawing.Color]::Transparent)
    $g.DrawImage($img, 0, 0, $w, $h)
  } finally { $g.Dispose() }
  $bmp.Save($dest, [System.Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose()
  Write-Host "Saved $dest ($w x $h)"
} finally {
  $img.Dispose()
}
