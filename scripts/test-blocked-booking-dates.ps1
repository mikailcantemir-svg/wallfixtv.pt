$ErrorActionPreference = "Stop"

function Test-IsBlockedBookingDate([string]$dateString) {
  return $dateString -ge "2026-06-22" -and $dateString -le "2026-06-26"
}

$tests = @(
  @{ Date = "2026-06-21"; Expected = $false; Label = "21/06/2026 disponível" },
  @{ Date = "2026-06-22"; Expected = $true; Label = "22/06/2026 ocupado" },
  @{ Date = "2026-06-23"; Expected = $true; Label = "23/06/2026 ocupado" },
  @{ Date = "2026-06-24"; Expected = $true; Label = "24/06/2026 ocupado" },
  @{ Date = "2026-06-25"; Expected = $true; Label = "25/06/2026 ocupado" },
  @{ Date = "2026-06-26"; Expected = $true; Label = "26/06/2026 ocupado" },
  @{ Date = "2026-06-27"; Expected = $false; Label = "27/06/2026 disponível" },
  @{ Date = "2026-07-22"; Expected = $false; Label = "22/07/2026 disponível" },
  @{ Date = "2026-07-23"; Expected = $false; Label = "23/07/2026 disponível" },
  @{ Date = "2026-07-24"; Expected = $false; Label = "24/07/2026 disponível" },
  @{ Date = "2026-07-25"; Expected = $false; Label = "25/07/2026 disponível" },
  @{ Date = "2026-07-26"; Expected = $false; Label = "26/07/2026 disponível" },
  @{ Date = "2025-06-24"; Expected = $false; Label = "24/06/2025 não bloqueado" },
  @{ Date = "2027-06-24"; Expected = $false; Label = "24/06/2027 não bloqueado" }
)

$passed = 0
foreach ($test in $tests) {
  $result = Test-IsBlockedBookingDate $test.Date
  if ($result -eq $test.Expected) {
    Write-Host "PASS: $($test.Label)"
    $passed += 1
  } else {
    Write-Host "FAIL: $($test.Label) (esperado $($test.Expected), obteve $result)"
  }
}

Write-Host ""
Write-Host "Resultado: $passed/$($tests.Count) testes passaram"
if ($passed -ne $tests.Count) { exit 1 }
