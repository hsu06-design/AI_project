$secureKey = Read-Host "Gemini API 키를 붙여넣고 Enter를 누르세요" -AsSecureString
$pointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureKey)

try {
  $plainKey = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($pointer)

  if ([string]::IsNullOrWhiteSpace($plainKey)) {
    throw "API 키가 입력되지 않았습니다."
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
  Write-Host "안전하게 저장했어요. 이 창을 닫아도 됩니다."
} finally {
  if ($pointer -ne [IntPtr]::Zero) {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($pointer)
  }

  $plainKey = $null
}
