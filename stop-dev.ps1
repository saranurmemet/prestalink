# PrestaLink Durdurma Scripti
Write-Host "================================" -ForegroundColor Cyan
Write-Host "PrestaLink Durduruluyor..." -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Port 3000 ve 5000'deki process'leri durdur
$ports = @(3000, 5000)
$stopped = $false

foreach ($port in $ports) {
    $connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($connections) {
        $connections | ForEach-Object {
            try {
                Stop-Process -Id $_.OwningProcess -Force -ErrorAction Stop
                Write-Host "Port $port temizlendi" -ForegroundColor Green
                $stopped = $true
            } catch {
                Write-Host "Port $port temizlenemedi" -ForegroundColor Red
            }
        }
    }
}

if (-not $stopped) {
    Write-Host "Aktif servis bulunamadı" -ForegroundColor Gray
}

Write-Host ""
Write-Host "Tamamlandı!" -ForegroundColor Green
