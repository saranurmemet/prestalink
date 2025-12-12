# PrestaLink Otomatik Deployment Script
# Bu script PrestaLink uygulamasını Vercel (Frontend) ve Render (Backend) üzerine deploy eder

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  PrestaLink Otomatik Deployment" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Renkler
$SUCCESS = "Green"
$ERROR = "Red"
$INFO = "Cyan"
$WARNING = "Yellow"

# Adım 1: Proje yapısını kontrol et
Write-Host "[1/7] Proje yapısı kontrol ediliyor..." -ForegroundColor $INFO
if (!(Test-Path "frontend")) {
    Write-Host "❌ frontend klasörü bulunamadı!" -ForegroundColor $ERROR
    exit 1
}
if (!(Test-Path "backend")) {
    Write-Host "❌ backend klasörü bulunamadı!" -ForegroundColor $ERROR
    exit 1
}
Write-Host "✅ Proje yapısı doğrulandı" -ForegroundColor $SUCCESS
Write-Host ""

# Adım 2: Vercel CLI kontrolü
Write-Host "[2/7] Vercel CLI kontrol ediliyor..." -ForegroundColor $INFO
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue
if (!$vercelInstalled) {
    Write-Host "⚠️  Vercel CLI bulunamadı. Kurulum yapılıyor..." -ForegroundColor $WARNING
    npm install -g vercel
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Vercel CLI kurulumu başarısız!" -ForegroundColor $ERROR
        exit 1
    }
}
Write-Host "✅ Vercel CLI hazır" -ForegroundColor $SUCCESS
Write-Host ""

# Adım 3: Vercel Authentication
Write-Host "[3/7] Vercel Authentication..." -ForegroundColor $INFO
Write-Host "⚠️  Vercel'e giriş yapmanız gerekiyor. Tarayıcı açılacak..." -ForegroundColor $WARNING
cd frontend
vercel login
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Vercel girişi başarısız!" -ForegroundColor $ERROR
    exit 1
}
Write-Host "✅ Vercel girişi başarılı" -ForegroundColor $SUCCESS
Write-Host ""

# Adım 4: Frontend'i Vercel'e deploy et
Write-Host "[4/7] Frontend Vercel'e deploy ediliyor..." -ForegroundColor $INFO
Write-Host "⚠️  Deployment ayarları için sorular sorulacak:" -ForegroundColor $WARNING
Write-Host "   - Project name: prestalink (veya Enter)" -ForegroundColor $WARNING
Write-Host "   - Directory: ./" -ForegroundColor $WARNING
Write-Host "   - Override settings: N" -ForegroundColor $WARNING
Write-Host ""

vercel --yes
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Frontend deployment başarısız!" -ForegroundColor $ERROR
    exit 1
}

# Vercel URL'ini al
$vercelUrl = vercel ls | Select-String "prestalink" | Select-Object -First 1
Write-Host "✅ Frontend deploy edildi!" -ForegroundColor $SUCCESS
Write-Host ""

cd ..

# Adım 5: Render Deployment için talimatlar
Write-Host "[5/7] Render Deployment Hazırlığı..." -ForegroundColor $INFO
Write-Host "⚠️  Render deployment manuel olarak yapılacak:" -ForegroundColor $WARNING
Write-Host ""
Write-Host "1. https://dashboard.render.com adresine gidin" -ForegroundColor $INFO
Write-Host "2. 'New +' butonuna tıklayın ve 'Web Service' seçin" -ForegroundColor $INFO
Write-Host "3. GitHub repo'nuzu bağlayın (veya 'Public Git repository' seçin)" -ForegroundColor $INFO
Write-Host "4. Ayarlar:" -ForegroundColor $INFO
Write-Host "   - Name: prestalink-backend" -ForegroundColor $INFO
Write-Host "   - Root Directory: backend" -ForegroundColor $INFO
Write-Host "   - Build Command: npm install" -ForegroundColor $INFO
Write-Host "   - Start Command: npm start" -ForegroundColor $INFO
Write-Host "   - Environment: Node" -ForegroundColor $INFO
Write-Host ""
Write-Host "5. Environment Variables ekleyin:" -ForegroundColor $INFO
Write-Host "   - MONGO_URI: (MongoDB Atlas connection string)" -ForegroundColor $INFO
Write-Host "   - JWT_SECRET: (Rastgele güvenli string)" -ForegroundColor $INFO
Write-Host "   - PORT: 5000" -ForegroundColor $INFO
Write-Host "   - CLIENT_URL: (Vercel URL'niz)" -ForegroundColor $INFO
Write-Host "   - NODE_ENV: production" -ForegroundColor $INFO
Write-Host ""

# Adım 6: MongoDB Atlas için talimatlar
Write-Host "[6/7] MongoDB Atlas Kurulumu..." -ForegroundColor $INFO
Write-Host "⚠️  MongoDB Atlas cluster oluşturulması gerekiyor:" -ForegroundColor $WARNING
Write-Host ""
Write-Host "1. https://www.mongodb.com/cloud/atlas adresine gidin" -ForegroundColor $INFO
Write-Host "2. Ücretsiz hesap oluşturun" -ForegroundColor $INFO
Write-Host "3. 'Create a Deployment' > 'M0 FREE' seçin" -ForegroundColor $INFO
Write-Host "4. Cluster oluşturulduktan sonra:" -ForegroundColor $INFO
Write-Host "   - 'Connect' > 'Drivers' seçin" -ForegroundColor $INFO
Write-Host "   - Connection string'i kopyalayın" -ForegroundColor $INFO
Write-Host "   - Password'i değiştirin ve connection string'e ekleyin" -ForegroundColor $INFO
Write-Host "   - Network Access'te 'Add IP Address' > 'Allow Access from Anywhere'" -ForegroundColor $INFO
Write-Host ""

# Adım 7: Environment Variables oluşturma scripti
Write-Host "[7/7] Environment Variables hazırlanıyor..." -ForegroundColor $INFO

# JWT_SECRET oluştur
$jwtSecret = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
Write-Host "✅ JWT_SECRET oluşturuldu: $jwtSecret" -ForegroundColor $SUCCESS
Write-Host ""

# Özet
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  DEPLOYMENT ÖZETİ" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Frontend (Vercel): Deploy edildi" -ForegroundColor $SUCCESS
Write-Host "⚠️  Backend (Render): Manuel kurulum gerekli" -ForegroundColor $WARNING
Write-Host "⚠️  MongoDB Atlas: Manuel kurulum gerekli" -ForegroundColor $WARNING
Write-Host ""
Write-Host "Oluşturulan JWT_SECRET: $jwtSecret" -ForegroundColor $INFO
Write-Host "Bu JWT_SECRET'i Render environment variables'a ekleyin!" -ForegroundColor $WARNING
Write-Host ""
Write-Host "Sonraki adımlar:" -ForegroundColor Cyan
Write-Host "1. MongoDB Atlas cluster oluştur" -ForegroundColor $INFO
Write-Host "2. Render'da backend'i deploy et" -ForegroundColor $INFO
Write-Host "3. Vercel'de NEXT_PUBLIC_API_URL environment variable ekle" -ForegroundColor $INFO
Write-Host "4. Render backend URL'ini al ve Vercel'e ekle" -ForegroundColor $INFO
Write-Host ""




