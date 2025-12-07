# Vercel Deployment Script
# PowerShell'de çalıştırın: .\vercel-deploy.ps1

Write-Host "`n🚀 PrestaLink Vercel Deployment Başlatılıyor...`n" -ForegroundColor Cyan

# Git kontrolü
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Git bulunamadı!" -ForegroundColor Red
    Write-Host "📥 Git indirin: https://git-scm.com/download/win`n" -ForegroundColor Yellow
    exit
}

Write-Host "✅ Git hazır" -ForegroundColor Green

# Node.js kontrolü
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js bulunamadı!" -ForegroundColor Red
    Write-Host "📥 Node.js indirin: https://nodejs.org`n" -ForegroundColor Yellow
    exit
}

Write-Host "✅ Node.js hazır`n" -ForegroundColor Green

# Vercel CLI kontrolü
if (-not (Get-Command vercel -ErrorAction SilentlyContinue)) {
    Write-Host "📦 Vercel CLI kuruluyor...`n" -ForegroundColor Yellow
    npm install -g vercel
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Vercel CLI kurulumu başarısız!`n" -ForegroundColor Red
        exit
    }
}

Write-Host "✅ Vercel CLI hazır`n" -ForegroundColor Green

# GitHub repo kontrolü
Write-Host "📋 GitHub Repository Kontrolü:`n" -ForegroundColor Yellow
$repoCheck = Read-Host "Projeniz GitHub'da mı? (Y/N)"

if ($repoCheck -eq "N" -or $repoCheck -eq "n") {
    Write-Host "`n📤 GitHub'a yükleme:`n" -ForegroundColor Yellow
    
    $repoUrl = Read-Host "GitHub repository URL'i (örn: https://github.com/kullanici/prestalink.git)"
    
    if ($repoUrl) {
        Write-Host "`n🔧 Git ayarları yapılıyor...`n" -ForegroundColor Cyan
        
        $rootDir = Split-Path -Parent $PSScriptRoot
        
        Push-Location $rootDir
        
        if (-not (Test-Path ".git")) {
            git init
            git add .
            git commit -m "Initial commit"
            git branch -M main
        }
        
        if (-not (git remote get-url origin -ErrorAction SilentlyContinue)) {
            git remote add origin $repoUrl
        }
        
        git push -u origin main
        
        Pop-Location
        
        Write-Host "`n✅ GitHub'a yüklendi!`n" -ForegroundColor Green
    }
}

# Vercel login kontrolü
Write-Host "🔐 Vercel Login Kontrolü:`n" -ForegroundColor Yellow
$loginCheck = vercel whoami 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Vercel'e giriş yapılmamış.`n" -ForegroundColor Yellow
    Write-Host "🔑 Vercel login başlatılıyor...`n" -ForegroundColor Cyan
    vercel login
}

Write-Host "`n✅ Vercel'e giriş yapıldı!`n" -ForegroundColor Green

# Frontend deployment
Write-Host "📱 Frontend Deployment Başlatılıyor...`n" -ForegroundColor Cyan

$frontendDir = Join-Path $PSScriptRoot "frontend"

if (-not (Test-Path $frontendDir)) {
    Write-Host "❌ Frontend klasörü bulunamadı!`n" -ForegroundColor Red
    exit
}

Push-Location $frontendDir

Write-Host "📋 Deployment Ayarları:`n" -ForegroundColor Yellow
Write-Host "Soruları yanıtlayın:`n" -ForegroundColor White

# İlk deploy
vercel

Write-Host "`n✅ İlk deploy tamamlandı!`n" -ForegroundColor Green

# Production deploy
$prodDeploy = Read-Host "Production'a deploy etmek istiyor musunuz? (Y/N)"

if ($prodDeploy -eq "Y" -or $prodDeploy -eq "y") {
    Write-Host "`n🚀 Production deployment başlatılıyor...`n" -ForegroundColor Cyan
    vercel --prod
    Write-Host "`n✅ Production deployment tamamlandı!`n" -ForegroundColor Green
}

Pop-Location

Write-Host "`n🎉 TAMAMLANDI!`n" -ForegroundColor Green
Write-Host "📋 Sonraki Adımlar:`n" -ForegroundColor Yellow
Write-Host "1. Vercel Dashboard'a gidin: https://vercel.com/dashboard" -ForegroundColor White
Write-Host "2. Projenizi seçin" -ForegroundColor White
Write-Host "3. Settings → Environment Variables" -ForegroundColor White
Write-Host "4. NEXT_PUBLIC_API_URL ekleyin (backend deploy ettikten sonra güncelleyin)`n" -ForegroundColor White
Write-Host "📖 Detaylı rehber: VERCEL_DEPLOYMENT_REHBERI.md`n" -ForegroundColor Cyan




