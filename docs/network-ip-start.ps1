# Network IP'den Başlatma Script'i
# Bu script network IP'den erişim için gerekli ayarları yapar

Write-Host "🌐 Network IP'den Erişim Ayarları" -ForegroundColor Cyan
Write-Host "=" * 50 -ForegroundColor Cyan

# IP adresini bul
Write-Host "`n📡 IP adresi bulunuyor..." -ForegroundColor Yellow
$ipAddress = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -like "192.168.*" -or $_.IPAddress -like "10.*" -or $_.IPAddress -like "172.*" } | Select-Object -First 1).IPAddress

if (-not $ipAddress) {
    Write-Host "❌ Network IP adresi bulunamadı!" -ForegroundColor Red
    Write-Host "Manuel olarak IP adresinizi öğrenmek için: ipconfig" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ IP adresi bulundu: $ipAddress" -ForegroundColor Green

# Frontend .env dosyasını oluştur/güncelle
Write-Host "`n📝 Frontend .env dosyası güncelleniyor..." -ForegroundColor Yellow
$frontendEnvPath = "frontend\.env"
$frontendEnvContent = "NEXT_PUBLIC_API_URL=http://$ipAddress`:5000/api"

if (Test-Path $frontendEnvPath) {
    $existing = Get-Content $frontendEnvPath
    if ($existing -match "NEXT_PUBLIC_API_URL") {
        $existing = $existing -replace "NEXT_PUBLIC_API_URL=.*", $frontendEnvContent
        Set-Content -Path $frontendEnvPath -Value $existing
        Write-Host "✅ Frontend .env güncellendi" -ForegroundColor Green
    } else {
        Add-Content -Path $frontendEnvPath -Value $frontendEnvContent
        Write-Host "✅ Frontend .env'e eklendi" -ForegroundColor Green
    }
} else {
    Set-Content -Path $frontendEnvPath -Value $frontendEnvContent
    Write-Host "✅ Frontend .env oluşturuldu" -ForegroundColor Green
}

# Backend .env dosyasını oluştur/güncelle
Write-Host "`n📝 Backend .env dosyası güncelleniyor..." -ForegroundColor Yellow
$backendEnvPath = "backend\.env"

if (Test-Path $backendEnvPath) {
    $existing = Get-Content $backendEnvPath
    $clientUrlLine = "CLIENT_URL=http://localhost:3000,http://$ipAddress`:3000"
    
    if ($existing -match "CLIENT_URL=") {
        $existing = $existing -replace "CLIENT_URL=.*", $clientUrlLine
        Set-Content -Path $backendEnvPath -Value $existing
        Write-Host "✅ Backend .env güncellendi (CLIENT_URL)" -ForegroundColor Green
    } else {
        Add-Content -Path $backendEnvPath -Value $clientUrlLine
        Write-Host "✅ Backend .env'e CLIENT_URL eklendi" -ForegroundColor Green
    }
} else {
    Write-Host "⚠️  Backend .env dosyası bulunamadı. Lütfen manuel olarak oluşturun." -ForegroundColor Yellow
    Write-Host "   CLIENT_URL=http://localhost:3000,http://$ipAddress`:3000" -ForegroundColor Yellow
}

# Sara kullanıcılarını kontrol et
Write-Host "`n👤 Sara kullanıcıları kontrol ediliyor..." -ForegroundColor Yellow
Write-Host "   Komut: cd backend; node scripts/add-missing-users.js" -ForegroundColor Gray

# Özet
Write-Host "`n📋 ÖZET" -ForegroundColor Cyan
Write-Host "=" * 50 -ForegroundColor Cyan
Write-Host "IP Adresi: $ipAddress" -ForegroundColor Green
Write-Host "Frontend URL: http://$ipAddress`:3000" -ForegroundColor Green
Write-Host "Backend URL: http://$ipAddress`:5000" -ForegroundColor Green

Write-Host "`n🚀 SONRAKI ADIMLAR:" -ForegroundColor Yellow
Write-Host "1. Sara kullanıcılarını oluşturun:" -ForegroundColor White
Write-Host "   cd backend" -ForegroundColor Gray
Write-Host "   node scripts/add-missing-users.js" -ForegroundColor Gray

Write-Host "`n2. Backend'i başlatın (Terminal 1):" -ForegroundColor White
Write-Host "   cd backend" -ForegroundColor Gray
Write-Host "   npm run dev" -ForegroundColor Gray

Write-Host "`n3. Frontend'i network modunda başlatın (Terminal 2):" -ForegroundColor White
Write-Host "   cd frontend" -ForegroundColor Gray
Write-Host "   npm run dev:network" -ForegroundColor Gray

Write-Host "`n4. Tarayıcıda açın:" -ForegroundColor White
Write-Host "   http://$ipAddress`:3000" -ForegroundColor Cyan

Write-Host "`n5. Sara ile giriş yapın:" -ForegroundColor White
Write-Host "   Email: sara@prestalink.app" -ForegroundColor Gray
Write-Host "   Şifre: sara" -ForegroundColor Gray
Write-Host "   (Her rol için aynı bilgileri kullanın)" -ForegroundColor Gray

Write-Host "`n✅ Hazır! Network'teki diğer cihazlardan erişebilirsiniz." -ForegroundColor Green

