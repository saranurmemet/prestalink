# Ngrok Hızlı Başlangıç Scripti
# PowerShell'de çalıştırın

Write-Host "`n🚀 PrestaLink Ngrok Deployment Başlatılıyor...`n" -ForegroundColor Cyan

# Ngrok kontrolü
if (-not (Test-Path "C:\ngrok\ngrok.exe")) {
    Write-Host "❌ Ngrok bulunamadı!" -ForegroundColor Red
    Write-Host "`n📥 Ngrok Kurulumu:" -ForegroundColor Yellow
    Write-Host "1. https://ngrok.com/download adresinden Windows için indirin" -ForegroundColor White
    Write-Host "2. ngrok.exe'yi C:\ngrok klasörüne koyun" -ForegroundColor White
    Write-Host "3. https://dashboard.ngrok.com/get-started/your-authtoken adresinden token alın" -ForegroundColor White
    Write-Host "4. Scripti tekrar çalıştırın`n" -ForegroundColor White
    exit
}

# Token kontrolü
$tokenFile = "$env:USERPROFILE\.ngrok2\ngrok.yml"
if (-not (Test-Path $tokenFile)) {
    Write-Host "❌ Ngrok token bulunamadı!" -ForegroundColor Red
    Write-Host "`n🔑 Token eklemek için:" -ForegroundColor Yellow
    Write-Host "C:\ngrok\ngrok.exe config add-authtoken YOUR_TOKEN`n" -ForegroundColor White
    $token = Read-Host "Token'ınızı girin"
    if ($token) {
        & C:\ngrok\ngrok.exe config add-authtoken $token
        Write-Host "✅ Token eklendi!`n" -ForegroundColor Green
    } else {
        Write-Host "❌ Token gerekli!" -ForegroundColor Red
        exit
    }
}

Write-Host "✅ Ngrok hazır!`n" -ForegroundColor Green

# MongoDB Atlas kontrolü
Write-Host "📊 MongoDB Atlas için:" -ForegroundColor Yellow
Write-Host "1. https://www.mongodb.com/cloud/atlas → Sign up" -ForegroundColor White
Write-Host "2. Free cluster oluşturun (3-5 dakika)" -ForegroundColor White
Write-Host "3. Database user oluşturun" -ForegroundColor White
Write-Host "4. Network Access → Allow from anywhere" -ForegroundColor White
Write-Host "5. Connection string'i alın`n" -ForegroundColor White

$mongoUri = Read-Host "MongoDB Connection String girin (veya Enter'a basıp sonra backend/.env'de düzenleyin)"

# Backend başlatma
Write-Host "`n🔧 Backend başlatılıyor...`n" -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; npm run dev"

Start-Sleep -Seconds 3

# Backend için Ngrok
Write-Host "🌐 Backend için Ngrok başlatılıyor...`n" -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd C:\ngrok; .\ngrok.exe http 5000"

Start-Sleep -Seconds 3

Write-Host "✅ Backend Ngrok penceresinden URL'i kopyalayın (örn: https://abc123.ngrok-free.app)" -ForegroundColor Yellow
$backendUrl = Read-Host "Backend Ngrok URL'i (https:// ile başlamalı)"

if ($backendUrl) {
    # Frontend .env güncelle
    $frontendEnv = "$PSScriptRoot\frontend\.env"
    $apiUrl = "$backendUrl/api"
    
    if (Test-Path $frontendEnv) {
        $content = Get-Content $frontendEnv -Raw
        if ($content -match "NEXT_PUBLIC_API_URL=") {
            $content = $content -replace "NEXT_PUBLIC_API_URL=.*", "NEXT_PUBLIC_API_URL=$apiUrl"
        } else {
            $content += "`nNEXT_PUBLIC_API_URL=$apiUrl"
        }
        Set-Content $frontendEnv -Value $content
    } else {
        "NEXT_PUBLIC_API_URL=$apiUrl" | Out-File $frontendEnv -Encoding utf8
    }
    
    Write-Host "✅ Frontend .env güncellendi: $apiUrl" -ForegroundColor Green
}

# Backend .env güncelle (eğer MongoDB URI verildiyse)
if ($mongoUri) {
    $backendEnv = "$PSScriptRoot\backend\.env"
    if (Test-Path $backendEnv) {
        $content = Get-Content $backendEnv -Raw
        if ($content -match "MONGO_URI=") {
            $content = $content -replace "MONGO_URI=.*", "MONGO_URI=$mongoUri"
        } else {
            $content += "`nMONGO_URI=$mongoUri"
        }
        Set-Content $backendEnv -Value $content
        Write-Host "✅ Backend .env güncellendi" -ForegroundColor Green
    }
}

Write-Host "`n📱 Frontend başlatılıyor...`n" -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; npm run dev"

Start-Sleep -Seconds 3

# Frontend için Ngrok
Write-Host "🌐 Frontend için Ngrok başlatılıyor...`n" -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd C:\ngrok; .\ngrok.exe http 3000"

Write-Host "`n✅ TAMAMLANDI!`n" -ForegroundColor Green
Write-Host "📋 Sonraki Adımlar:" -ForegroundColor Yellow
Write-Host "1. Frontend Ngrok penceresinden URL'i kopyalayın" -ForegroundColor White
Write-Host "2. Bu URL'i arkadaşınıza gönderin! 🎉`n" -ForegroundColor White
Write-Host "⚠️  NOT: Ngrok linkleri 2 saat sonra değişir. Yeni link için ngrok'u yeniden başlatın.`n" -ForegroundColor Yellow




