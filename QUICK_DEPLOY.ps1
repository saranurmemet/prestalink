# PrestaLink Hızlı Deployment Script
# Bu script Vercel deployment'ını başlatır

param(
    [switch]$SkipAuth = $false
)

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  PrestaLink Hızlı Deployment" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Vercel deployment
Write-Host "[1/3] Frontend (Vercel) deployment başlatılıyor..." -ForegroundColor Cyan
Write-Host ""

cd frontend

if (!$SkipAuth) {
    Write-Host "Vercel'e giriş yapmanız gerekiyor..." -ForegroundColor Yellow
    Write-Host "Tarayıcı otomatik açılacak, lütfen giriş yapın." -ForegroundColor Yellow
    Write-Host ""
    vercel login
}

Write-Host ""
Write-Host "Deployment başlatılıyor..." -ForegroundColor Cyan
Write-Host "Not: İlk deployment için birkaç soru sorulacak:" -ForegroundColor Yellow
Write-Host "  - Project name: prestalink (veya Enter)" -ForegroundColor Yellow
Write-Host "  - Directory: ./ (Enter)" -ForegroundColor Yellow
Write-Host "  - Override settings: N" -ForegroundColor Yellow
Write-Host ""

# Deployment başlat
vercel --yes --prod

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Frontend deployment başarılı!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Şimdi Vercel URL'inizi alın:" -ForegroundColor Cyan
    vercel ls | Select-String "prestalink" | Select-Object -First 1
    Write-Host ""
    Write-Host "Sonraki adımlar:" -ForegroundColor Cyan
    Write-Host "1. Vercel Dashboard'da Environment Variables ekleyin:" -ForegroundColor Yellow
    Write-Host "   NEXT_PUBLIC_API_URL = https://YOUR-BACKEND-URL.onrender.com/api" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "2. DEPLOYMENT_GUIDE.md dosyasını okuyun (backend ve MongoDB için)" -ForegroundColor Yellow
} else {
    Write-Host "❌ Deployment sırasında hata oluştu!" -ForegroundColor Red
    exit 1
}

cd ..



