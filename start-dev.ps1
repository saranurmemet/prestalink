# PrestaLink Geliştirme Başlatıcı
Write-Host "================================" -ForegroundColor Cyan
Write-Host "PrestaLink Başlatılıyor..." -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# 1. Port Kontrolü ve Temizleme
Write-Host "1. Portlar kontrol ediliyor..." -ForegroundColor Yellow
$ports = @(3000, 5000)

foreach ($port in $ports) {
    $connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($connections) {
        Write-Host "   Port $port kullanımda, temizleniyor..." -ForegroundColor Red
        $connections | ForEach-Object {
            try {
                Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue
                Write-Host "   Port $port temizlendi" -ForegroundColor Green
            } catch {
                Write-Host "   Port $port temizlenemedi (manuel kontrol gerekebilir)" -ForegroundColor Yellow
            }
        }
        Start-Sleep -Seconds 2
    }
}

Write-Host "   Portlar hazır" -ForegroundColor Green
Write-Host ""

# 2. Frontend Cache Temizleme
Write-Host "2. Frontend cache temizleniyor..." -ForegroundColor Yellow
$cachePaths = @(
    ".\frontend\.next",
    ".\frontend\out"
)

foreach ($path in $cachePaths) {
    if (Test-Path $path) {
        try {
            Remove-Item -Path $path -Recurse -Force -ErrorAction Stop
            Write-Host "   $(Split-Path $path -Leaf) temizlendi" -ForegroundColor Green
        } catch {
            Write-Host "   $(Split-Path $path -Leaf) temizlenemedi" -ForegroundColor Yellow
        }
    }
}

Write-Host ""

# 3. Dependencies Kontrolü
Write-Host "3. Dependencies kontrol ediliyor..." -ForegroundColor Yellow

if (-not (Test-Path ".\backend\node_modules")) {
    Write-Host "   Backend dependencies yükleniyor..." -ForegroundColor Yellow
    Set-Location backend
    npm install --loglevel=error
    Set-Location ..
    Write-Host "   Backend dependencies yüklendi" -ForegroundColor Green
}

if (-not (Test-Path ".\frontend\node_modules")) {
    Write-Host "   Frontend dependencies yükleniyor..." -ForegroundColor Yellow
    Set-Location frontend
    npm install --loglevel=error
    Set-Location ..
    Write-Host "   Frontend dependencies yüklendi" -ForegroundColor Green
}

Write-Host "   Dependencies hazır" -ForegroundColor Green
Write-Host ""

# 4. Backend'i Başlat
Write-Host "4. Backend başlatılıyor (Port 5000)..." -ForegroundColor Yellow
$backendPath = Join-Path $PWD "backend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; Write-Host 'Backend çalışıyor...' -ForegroundColor Green; npm run dev"
Write-Host "   Backend başlatıldı, hazır olması bekleniyor..." -ForegroundColor Green
Start-Sleep -Seconds 5
Write-Host ""

# 5. Frontend'i Başlat
Write-Host "5. Frontend başlatılıyor (Port 3000)..." -ForegroundColor Yellow
$frontendPath = Join-Path $PWD "frontend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; Write-Host 'Frontend çalışıyor...' -ForegroundColor Green; npm run dev"
Write-Host "   Frontend başlatıldı" -ForegroundColor Green
Write-Host ""

Write-Host "================================" -ForegroundColor Green
Write-Host "BAŞARILI!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""
Write-Host "Backend:  http://localhost:5000" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Durdurmak için: .\stop-dev.ps1" -ForegroundColor Yellow
Write-Host ""
