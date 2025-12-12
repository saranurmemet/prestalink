# PrestaLink Uygulamasını Durdurma Scripti
# Bu script, çalışan backend ve frontend process'lerini sonlandırır

Write-Host ""
Write-Host "════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "   🛑 PrestaLink Durduruluyor..." -ForegroundColor Red
Write-Host "════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

# Job'ları durdur (arka plan için)
$jobsFile = Join-Path $projectRoot "prestalink-jobs.txt"
if (Test-Path $jobsFile) {
    Write-Host "🔍 Arka plan job'ları kontrol ediliyor..." -ForegroundColor Cyan
    $jobs = Get-Content $jobsFile
    foreach ($line in $jobs) {
        if ($line -match "(\w+)=(\d+)") {
            $jobId = $matches[2]
            $job = Get-Job -Id $jobId -ErrorAction SilentlyContinue
            if ($job) {
                Write-Host "   → Job durduruluyor (ID: $jobId)..." -ForegroundColor Yellow
                Stop-Job -Id $jobId -ErrorAction SilentlyContinue
                Remove-Job -Id $jobId -Force -ErrorAction SilentlyContinue
                Write-Host "   ✓ Job durduruldu" -ForegroundColor Green
            }
        }
    }
    Remove-Item $jobsFile -Force -ErrorAction SilentlyContinue
}

# Node.js process'lerini durdur (port bazlı)
Write-Host ""
Write-Host "🔍 Node.js process'leri kontrol ediliyor..." -ForegroundColor Cyan

$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue

if ($nodeProcesses) {
    Write-Host "   → $($nodeProcesses.Count) Node.js process bulundu" -ForegroundColor Yellow
    
    foreach ($proc in $nodeProcesses) {
        try {
            $connections = Get-NetTCPConnection -OwningProcess $proc.Id -ErrorAction SilentlyContinue
            $isBackend = $connections | Where-Object { $_.LocalPort -eq 5000 }
            $isFrontend = $connections | Where-Object { $_.LocalPort -eq 3000 }
            
            if ($isBackend) {
                Write-Host "   → Backend process durduruluyor (PID: $($proc.Id))..." -ForegroundColor Yellow
                Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
                Write-Host "   ✓ Backend durduruldu" -ForegroundColor Green
            } elseif ($isFrontend) {
                Write-Host "   → Frontend process durduruluyor (PID: $($proc.Id))..." -ForegroundColor Yellow
                Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
                Write-Host "   ✓ Frontend durduruldu" -ForegroundColor Green
            }
        } catch {
            # Hata durumunda yine de durdurmayı dene
            Write-Host "   → Process durduruluyor (PID: $($proc.Id))..." -ForegroundColor Yellow
            Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
        }
    }
} else {
    Write-Host "   ✓ Çalışan uygulama bulunamadı" -ForegroundColor Green
}

Write-Host ""
Write-Host "════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "   ✅ Tüm uygulamalar durduruldu!" -ForegroundColor Green
Write-Host "════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "💡 Tekrar başlatmak için:" -ForegroundColor Yellow
Write-Host "   • .\baslat.ps1 (pencerelerle)" -ForegroundColor Gray
Write-Host "   • .\baslat-arkaplan.ps1 (arka planda)`n" -ForegroundColor Gray
Write-Host ""
