# PrestaLink Geliştirme Başlatıcı
# Düzeltilmiş versiyon - Terminal crash sorunu çözüldü

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

# 2. Dependencies Kontrolü
Write-Host "2. Dependencies kontrol ediliyor..." -ForegroundColor Yellow

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

# 3. Frontend Cache Temizleme
Write-Host "3. Frontend cache temizleniyor..." -ForegroundColor Yellow
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

# 4. Backend'i Başlat (Start-Process ile - daha stabil)
Write-Host "4. Backend başlatılıyor (Port 5000)..." -ForegroundColor Yellow
$backendPath = Resolve-Path ".\backend"
$backendScript = @"
cd '$backendPath'
Write-Host '🚀 Backend başlatılıyor...' -ForegroundColor Green
Write-Host '📁 Dizin: $backendPath' -ForegroundColor Cyan
`$env:NODE_ENV = 'development'
`$env:CLIENT_URL = 'http://localhost:3000'
`$env:MONGO_URI = 'mongodb://localhost:27017/prestalink'
`$env:JWT_SECRET = 'prestalink-local-dev-secret'
node server.js
Write-Host ''
Write-Host 'Backend durduruldu. Bu pencereyi kapatabilirsiniz.' -ForegroundColor Yellow
pause
"@

try {
    Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendScript -ErrorAction Stop
    Write-Host "   ✅ Backend başlatıldı (yeni PowerShell penceresi açıldı)" -ForegroundColor Green
    Start-Sleep -Seconds 3
} catch {
    Write-Host "   ❌ Backend başlatılamadı: $_" -ForegroundColor Red
    exit 1
}

# 5. Frontend'i Başlat (Start-Process ile - daha stabil)
Write-Host "5. Frontend başlatılıyor (Port 3000)..." -ForegroundColor Yellow
$frontendPath = Resolve-Path ".\frontend"
$frontendScript = @"
cd '$frontendPath'
Write-Host '🚀 Frontend başlatılıyor...' -ForegroundColor Green
Write-Host '📁 Dizin: $frontendPath' -ForegroundColor Cyan
`$env:NEXT_PUBLIC_API_URL = 'http://localhost:5000/api'
npm run dev
Write-Host ''
Write-Host 'Frontend durduruldu. Bu pencereyi kapatabilirsiniz.' -ForegroundColor Yellow
pause
"@

try {
    Start-Process powershell -ArgumentList "-NoExit", "-Command", $frontendScript -ErrorAction Stop
    Write-Host "   ✅ Frontend başlatıldı (yeni PowerShell penceresi açıldı)" -ForegroundColor Green
    Start-Sleep -Seconds 3
} catch {
    Write-Host "   ❌ Frontend başlatılamadı: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "================================" -ForegroundColor Green
Write-Host "✅ BAŞARILI!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""
Write-Host "Backend:  http://localhost:5000" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "💡 Her iki sunucu da ayrı PowerShell pencerelerinde çalışıyor." -ForegroundColor Yellow
Write-Host "💡 Durdurmak için: .\stop-dev.ps1" -ForegroundColor Yellow
Write-Host ""
