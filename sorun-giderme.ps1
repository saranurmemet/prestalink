# PrestaLink Sorun Giderme Scripti

Write-Host ""
Write-Host "════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "   🔍 PrestaLink Sorun Giderme" -ForegroundColor Yellow
Write-Host "════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

$projectRoot = $PWD
$backendPath = Join-Path $projectRoot "backend"
$frontendPath = Join-Path $projectRoot "frontend"

# 1. Klasör Kontrolü
Write-Host "1. Klasör Kontrolü:" -ForegroundColor Cyan
if (Test-Path $backendPath) {
    Write-Host "   ✓ Backend klasörü mevcut" -ForegroundColor Green
} else {
    Write-Host "   ✗ Backend klasörü bulunamadı!" -ForegroundColor Red
    exit
}

if (Test-Path $frontendPath) {
    Write-Host "   ✓ Frontend klasörü mevcut" -ForegroundColor Green
} else {
    Write-Host "   ✗ Frontend klasörü bulunamadı!" -ForegroundColor Red
    exit
}
Write-Host ""

# 2. Node.js Kontrolü
Write-Host "2. Node.js Kontrolü:" -ForegroundColor Cyan
try {
    $nodeVersion = node -v
    Write-Host "   ✓ Node.js yüklü: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Node.js yüklü değil!" -ForegroundColor Red
    Write-Host "   → Node.js'i yükleyin: https://nodejs.org/" -ForegroundColor Yellow
    exit
}
Write-Host ""

# 3. npm Kontrolü
Write-Host "3. npm Kontrolü:" -ForegroundColor Cyan
try {
    $npmVersion = npm -v
    Write-Host "   ✓ npm yüklü: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "   ✗ npm yüklü değil!" -ForegroundColor Red
    exit
}
Write-Host ""

# 4. Backend Bağımlılıkları
Write-Host "4. Backend Bağımlılıkları:" -ForegroundColor Cyan
$backendNodeModules = Join-Path $backendPath "node_modules"
$backendPackageJson = Join-Path $backendPath "package.json"

if (Test-Path $backendPackageJson) {
    Write-Host "   ✓ package.json mevcut" -ForegroundColor Green
} else {
    Write-Host "   ✗ package.json bulunamadı!" -ForegroundColor Red
    exit
}

if (Test-Path $backendNodeModules) {
    $moduleCount = (Get-ChildItem $backendNodeModules -Directory).Count
    Write-Host "   ✓ node_modules mevcut ($moduleCount modül)" -ForegroundColor Green
} else {
    Write-Host "   ✗ node_modules eksik!" -ForegroundColor Red
    Write-Host "   → Çalıştırın: cd backend && npm install" -ForegroundColor Yellow
}
Write-Host ""

# 5. Frontend Bağımlılıkları
Write-Host "5. Frontend Bağımlılıkları:" -ForegroundColor Cyan
$frontendNodeModules = Join-Path $frontendPath "node_modules"
$frontendPackageJson = Join-Path $frontendPath "package.json"

if (Test-Path $frontendPackageJson) {
    Write-Host "   ✓ package.json mevcut" -ForegroundColor Green
} else {
    Write-Host "   ✗ package.json bulunamadı!" -ForegroundColor Red
    exit
}

if (Test-Path $frontendNodeModules) {
    $moduleCount = (Get-ChildItem $frontendNodeModules -Directory).Count
    Write-Host "   ✓ node_modules mevcut ($moduleCount modül)" -ForegroundColor Green
} else {
    Write-Host "   ✗ node_modules eksik!" -ForegroundColor Red
    Write-Host "   → Çalıştırın: cd frontend && npm install" -ForegroundColor Yellow
}
Write-Host ""

# 6. Environment Dosyaları
Write-Host "6. Environment Dosyaları:" -ForegroundColor Cyan
$backendEnv = Join-Path $backendPath ".env"
$frontendEnv = Join-Path $frontendPath ".env.local"

if (Test-Path $backendEnv) {
    Write-Host "   ✓ backend/.env mevcut" -ForegroundColor Green
    # İçeriği kontrol et (hassas bilgi göstermeden)
    $envContent = Get-Content $backendEnv -ErrorAction SilentlyContinue
    $hasMongoUri = $envContent | Select-String "MONGO_URI"
    $hasJwtSecret = $envContent | Select-String "JWT_SECRET"
    if ($hasMongoUri) {
        Write-Host "      ✓ MONGO_URI tanımlı" -ForegroundColor Green
    } else {
        Write-Host "      ✗ MONGO_URI eksik!" -ForegroundColor Red
    }
    if ($hasJwtSecret) {
        Write-Host "      ✓ JWT_SECRET tanımlı" -ForegroundColor Green
    } else {
        Write-Host "      ✗ JWT_SECRET eksik!" -ForegroundColor Red
    }
} else {
    Write-Host "   ✗ backend/.env bulunamadı!" -ForegroundColor Red
    Write-Host "   → backend/.env.example dosyasını .env olarak kopyalayın" -ForegroundColor Yellow
}

if (Test-Path $frontendEnv) {
    Write-Host "   ✓ frontend/.env.local mevcut" -ForegroundColor Green
} else {
    Write-Host "   ⚠ frontend/.env.local bulunamadı (opsiyonel)" -ForegroundColor Yellow
}
Write-Host ""

# 7. MongoDB Kontrolü
Write-Host "7. MongoDB Kontrolü:" -ForegroundColor Cyan
try {
    $mongoService = Get-Service -Name "*mongo*" -ErrorAction SilentlyContinue | Where-Object { $_.Status -eq "Running" }
    if ($mongoService) {
        Write-Host "   ✓ MongoDB servisi çalışıyor" -ForegroundColor Green
        $mongoService | ForEach-Object { Write-Host "      - $($_.Name)" -ForegroundColor Gray }
    } else {
        Write-Host "   ⚠ MongoDB servisi çalışmıyor veya bulunamadı" -ForegroundColor Yellow
        Write-Host "   → MongoDB servisini başlatın veya MongoDB Atlas kullanın" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ⚠ MongoDB kontrol edilemedi" -ForegroundColor Yellow
}
Write-Host ""

# 8. Port Kontrolü
Write-Host "8. Port Kontrolü:" -ForegroundColor Cyan
$port3000 = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
$port5000 = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue

if ($port3000) {
    $process = Get-Process -Id $port3000.OwningProcess -ErrorAction SilentlyContinue
    Write-Host "   ⚠ Port 3000 kullanımda (PID: $($port3000.OwningProcess))" -ForegroundColor Yellow
    if ($process) {
        Write-Host "      Process: $($process.ProcessName)" -ForegroundColor Gray
    }
} else {
    Write-Host "   ✓ Port 3000 boş" -ForegroundColor Green
}

if ($port5000) {
    $process = Get-Process -Id $port5000.OwningProcess -ErrorAction SilentlyContinue
    Write-Host "   ⚠ Port 5000 kullanımda (PID: $($port5000.OwningProcess))" -ForegroundColor Yellow
    if ($process) {
        Write-Host "      Process: $($process.ProcessName)" -ForegroundColor Gray
    }
} else {
    Write-Host "   ✓ Port 5000 boş" -ForegroundColor Green
}
Write-Host ""

# Özet
Write-Host "════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "   📋 Özet" -ForegroundColor Yellow
Write-Host "════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "🔧 Sorun giderme tamamlandı!" -ForegroundColor Green
Write-Host ""
Write-Host "💡 Sonraki Adımlar:" -ForegroundColor Cyan
Write-Host "   1. Eksik bağımlılıklar varsa: npm install" -ForegroundColor White
Write-Host "   2. Environment dosyalarını kontrol edin" -ForegroundColor White
Write-Host "   3. MongoDB'nin çalıştığından emin olun" -ForegroundColor White
Write-Host "   4. Port çakışması varsa çözün" -ForegroundColor White
Write-Host "   5. .\baslat.ps1 ile tekrar deneyin" -ForegroundColor White
Write-Host ""




