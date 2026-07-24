$publicKey = Read-Host "Paste your new Langfuse public key, then press Enter"
$secureSecret = Read-Host "Paste your new Langfuse secret key, then press Enter" -AsSecureString
$pointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureSecret)

try {
  $secretKey = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($pointer)

  if ([string]::IsNullOrWhiteSpace($publicKey) -or [string]::IsNullOrWhiteSpace($secretKey)) {
    throw "Both Langfuse keys are required."
  }

  $projectRoot = Split-Path $PSScriptRoot -Parent
  $envPath = Join-Path $projectRoot ".env.local"
  $existingLines = @()

  if (Test-Path $envPath) {
    $existingLines = [System.IO.File]::ReadAllLines($envPath) | Where-Object {
      $_ -notlike "LANGFUSE_PUBLIC_KEY=*" -and
      $_ -notlike "LANGFUSE_SECRET_KEY=*" -and
      $_ -notlike "LANGFUSE_BASE_URL=*"
    }
  }

  $newLines = @(
    $existingLines
    "LANGFUSE_PUBLIC_KEY=$($publicKey.Trim())"
    "LANGFUSE_SECRET_KEY=$($secretKey.Trim())"
    "LANGFUSE_BASE_URL=https://us.cloud.langfuse.com"
  ) | Where-Object { -not [string]::IsNullOrWhiteSpace($_) }

  $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
  [System.IO.File]::WriteAllLines($envPath, $newLines, $utf8NoBom)

  Write-Host ""
  Write-Host "Saved securely. You can close this window."
} finally {
  if ($pointer -ne [IntPtr]::Zero) {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($pointer)
  }

  $secretKey = $null
}
