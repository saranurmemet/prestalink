# PrestaLink Auto-Test Başlatıcı
# Frontend hazır olduğunda otomatik test başlatır

Write-Host "`n🚀 PRESTALINK AUTO-TEST BAŞLATICI" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Cyan

# Backend kontrolü
Write-Host "`n🔍 Backend kontrol ediliyor..." -ForegroundColor Yellow
$backend = try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000" -TimeoutSec 3 -UseBasicParsing
    $response.StatusCode
} catch {
    $null
}

if ($backend -eq 200) {
    Write-Host "✅ Backend hazır (localhost:5000)" -ForegroundColor Green
} else {
    Write-Host "❌ Backend hazır değil!" -ForegroundColor Red
    Write-Host "   Lütfen başlatın: cd backend; node server.js" -ForegroundColor Yellow
    exit 1
}

# Frontend kontrolü ve bekleme
Write-Host "`n🔍 Frontend kontrol ediliyor..." -ForegroundColor Yellow
$maxAttempts = 30
$attempt = 0
$frontendReady = $false

while ($attempt -lt $maxAttempts -and -not $frontendReady) {
    $frontend = try {
        $response = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 3 -UseBasicParsing
        $response.StatusCode
    } catch {
        $null
    }
    
    if ($frontend -eq 200) {
        $frontendReady = $true
        Write-Host "✅ Frontend hazır (localhost:3000)" -ForegroundColor Green
    } else {
        $attempt++
        Write-Host "   Deneme $attempt/$maxAttempts - Frontend bekleniyor..." -ForegroundColor Yellow
        Start-Sleep -Seconds 2
    }
}

if (-not $frontendReady) {
    Write-Host "`n❌ Frontend hazır değil!" -ForegroundColor Red
    Write-Host "   Lütfen manuel olarak başlatın:" -ForegroundColor Yellow
    Write-Host "   cd frontend" -ForegroundColor White
    Write-Host "   npm run dev" -ForegroundColor White
    Write-Host "`n   Sonra test script'ini çalıştırın:" -ForegroundColor Yellow
    Write-Host "   node scripts/comprehensive-test.js" -ForegroundColor White
    exit 1
}

# Test başlat
Write-Host "`n🚀 Test başlatılıyor..." -ForegroundColor Green
Write-Host "🌐 Tarayıcı otomatik açılacak..." -ForegroundColor Cyan
Write-Host "`n📋 Test Edilecekler:" -ForegroundColor Yellow
Write-Host "   - Tüm sayfalar" -ForegroundColor White
Write-Host "   - Authentication (Login/Register)" -ForegroundColor White
Write-Host "   - Dil değiştirme" -ForegroundColor White
Write-Host "   - PWA testleri" -ForegroundColor White
Write-Host "   - API endpoints" -ForegroundColor White
Write-Host "   - Dashboard sayfaları" -ForegroundColor White
Write-Host "   - Broken links" -ForegroundColor White
Write-Host "   - Console errors" -ForegroundColor White
Write-Host "   - Responsive design" -ForegroundColor White
Write-Host "`n⏳ Test çalışıyor, lütfen bekleyin..." -ForegroundColor Yellow
Write-Host ""

# Test script'ini çalıştır
node scripts/comprehensive-test.js

Write-Host "`n✅ Test tamamlandı!" -ForegroundColor Green
Write-Host "📊 Rapor: TEST_REPORT.md" -ForegroundColor Cyan

