# PrestaLink Kurulum Script'i
# Bu script projeyi otomatik olarak kurar

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  PrestaLink Kurulum Başlatılıyor" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Node.js kontrolü
Write-Host "[1/6] Node.js kontrol ediliyor..." -ForegroundColor Yellow
$nodeVersion = node --version
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Node.js bulundu: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "✗ Node.js bulunamadı! Lütfen Node.js'i yükleyin." -ForegroundColor Red
    exit 1
}

# npm kontrolü
Write-Host "[2/6] npm kontrol ediliyor..." -ForegroundColor Yellow
$npmVersion = npm --version
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ npm bulundu: $npmVersion" -ForegroundColor Green
} else {
    Write-Host "✗ npm bulunamadı!" -ForegroundColor Red
    exit 1
}

# Backend .env dosyası oluşturma
Write-Host "[3/6] Backend .env dosyası oluşturuluyor..." -ForegroundColor Yellow
if (Test-Path "backend\.env.example") {
    if (-not (Test-Path "backend\.env")) {
        Copy-Item "backend\.env.example" "backend\.env"
        Write-Host "✓ Backend .env dosyası oluşturuldu" -ForegroundColor Green
        Write-Host "  ⚠ Lütfen backend\.env dosyasını düzenleyin!" -ForegroundColor Yellow
    } else {
        Write-Host "✓ Backend .env dosyası zaten mevcut" -ForegroundColor Green
    }
} else {
    Write-Host "✗ backend\.env.example dosyası bulunamadı!" -ForegroundColor Red
}

# Frontend .env.local dosyası oluşturma
Write-Host "[4/6] Frontend .env.local dosyası oluşturuluyor..." -ForegroundColor Yellow
if (Test-Path "frontend\.env.example") {
    if (-not (Test-Path "frontend\.env.local")) {
        Copy-Item "frontend\.env.example" "frontend\.env.local"
        Write-Host "✓ Frontend .env.local dosyası oluşturuldu" -ForegroundColor Green
        Write-Host "  ⚠ Lütfen frontend\.env.local dosyasını düzenleyin!" -ForegroundColor Yellow
    } else {
        Write-Host "✓ Frontend .env.local dosyası zaten mevcut" -ForegroundColor Green
    }
} else {
    Write-Host "✗ frontend\.env.example dosyası bulunamadı!" -ForegroundColor Red
}

# Backend dependencies kurulumu
Write-Host "[5/6] Backend dependencies kuruluyor..." -ForegroundColor Yellow
Set-Location backend
if (Test-Path "node_modules") {
    Write-Host "✓ Backend node_modules zaten mevcut" -ForegroundColor Green
    Write-Host "  Güncellemek için: cd backend && npm install" -ForegroundColor Gray
} else {
    Write-Host "  npm install çalıştırılıyor (bu biraz zaman alabilir)..." -ForegroundColor Gray
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Backend dependencies kuruldu" -ForegroundColor Green
    } else {
        Write-Host "✗ Backend dependencies kurulumunda hata!" -ForegroundColor Red
    }
}
Set-Location ..

# Frontend dependencies kurulumu
Write-Host "[6/6] Frontend dependencies kuruluyor..." -ForegroundColor Yellow
Set-Location frontend
if (Test-Path "node_modules") {
    Write-Host "✓ Frontend node_modules zaten mevcut" -ForegroundColor Green
    Write-Host "  Güncellemek için: cd frontend && npm install" -ForegroundColor Gray
} else {
    Write-Host "  npm install çalıştırılıyor (bu biraz zaman alabilir)..." -ForegroundColor Gray
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Frontend dependencies kuruldu" -ForegroundColor Green
    } else {
        Write-Host "✗ Frontend dependencies kurulumunda hata!" -ForegroundColor Red
    }
}
Set-Location ..

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  Kurulum Tamamlandı!" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Sonraki Adımlar:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Environment dosyalarını düzenleyin:" -ForegroundColor White
Write-Host "   - backend\.env" -ForegroundColor Gray
Write-Host "   - frontend\.env.local" -ForegroundColor Gray
Write-Host ""
Write-Host "2. MongoDB'yi başlatın" -ForegroundColor White
Write-Host ""
Write-Host "3. Backend'i başlatın:" -ForegroundColor White
Write-Host "   cd backend" -ForegroundColor Gray
Write-Host "   npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Frontend'i başlatın (yeni terminal):" -ForegroundColor White
Write-Host "   cd frontend" -ForegroundColor Gray
Write-Host "   npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "5. (İsteğe bağlı) Test verileri için:" -ForegroundColor White
Write-Host "   cd backend" -ForegroundColor Gray
Write-Host "   npm run seed" -ForegroundColor Gray
Write-Host ""
Write-Host "Detaylı bilgi için KURULUM_REHBERI.md dosyasına bakın." -ForegroundColor Cyan
Write-Host ""
