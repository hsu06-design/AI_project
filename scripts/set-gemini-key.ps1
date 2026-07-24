$secureKey = Read-Host "Paste your Gemini API key, then press Enter" -AsSecureString
$pointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureKey)

try {
  $plainKey = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($pointer)

  if ([string]::IsNullOrWhiteSpace($plainKey)) {
    throw "No API key was entered."
  }

  $projectRoot = Split-Path $PSScriptRoot -Parent
  $envPath = Join-Path $projectRoot ".env.local"
  $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
  [System.IO.File]::WriteAllText(
    $envPath,
    "GEMINI_API_KEY=$plainKey`n",
    $utf8NoBom
  )

  Write-Host ""
  Write-Host "Saved securely. You can close this window."
} finally {
  if ($pointer -ne [IntPtr]::Zero) {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($pointer)
  }

  $plainKey = $null
}
