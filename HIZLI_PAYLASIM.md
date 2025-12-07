# 🚀 PrestaLink'i Arkadaşına Hızlıca Gönderme

## ⚡ EN KOLAY YÖNTEM: Ngrok (2 Dakika)

### Adım 1: Ngrok Kurulumu
1. https://ngrok.com/download → Windows için indir
2. İndirdiğiniz `ngrok.exe` dosyasını `C:\ngrok` klasörüne koyun
3. PowerShell'de:
```powershell
cd C:\ngrok
.\ngrok.exe config add-authtoken YOUR_TOKEN
```
(https://dashboard.ngrok.com/get-started/your-authtoken adresinden token alın)

### Adım 2: Backend'i Başlat
```powershell
cd C:\Users\RANDOM\Desktop\prestalink\backend
npm run dev
```

### Adım 3: Backend için Ngrok
Yeni PowerShell penceresi:
```powershell
cd C:\ngrok
.\ngrok.exe http 5000
```

Çıkan URL'i kopyalayın (örn: `https://abc123.ngrok-free.app`)

### Adım 4: Frontend .env Güncelle
`frontend/.env` dosyasını açın ve:
```
NEXT_PUBLIC_API_URL=https://abc123.ngrok-free.app/api
```
(abc123 yerine ngrok'un verdiği URL'i yazın)

### Adım 5: Frontend'i Başlat
```powershell
cd C:\Users\RANDOM\Desktop\prestalink\frontend
npm run dev
```

### Adım 6: Frontend için Ngrok
Yeni PowerShell penceresi:
```powershell
cd C:\ngrok
.\ngrok.exe http 3000
```

Çıkan URL'i kopyalayın (örn: `https://xyz789.ngrok-free.app`)

### Adım 7: Arkadaşınıza Link Gönderin! 🎉
```
https://xyz789.ngrok-free.app
```

---

## 📱 ALTERNATİF: Aynı WiFi'da (5 Dakika)

### Adım 1: IP Adresinizi Öğrenin
PowerShell:
```powershell
ipconfig
```
`IPv4 Address` bulun (örn: `192.168.1.100`)

### Adım 2: Backend'i Başlat
```powershell
cd backend
npm run dev
```

### Adım 3: Frontend'i Network Modunda Başlat
```powershell
cd frontend
npm run dev:network
```

### Adım 4: Frontend .env Güncelle
`frontend/.env`:
```
NEXT_PUBLIC_API_URL=http://192.168.1.100:5000/api
```
(192.168.1.100 yerine kendi IP'nizi yazın)

### Adım 5: Frontend'i Yeniden Başlat
```powershell
npm run dev:network
```

### Adım 6: Arkadaşınıza Link Gönderin
```
http://192.168.1.100:3000
```
(Arkadaşınız AYNI WiFi'da olmalı!)

---

## 🌐 KALICI ÇÖZÜM: Vercel (10 Dakika)

### Adım 1: Vercel Hesabı
https://vercel.com → GitHub ile giriş

### Adım 2: Vercel CLI
```powershell
npm install -g vercel
```

### Adım 3: Frontend Deploy
```powershell
cd frontend
vercel
```
Soruları `Enter` ile geçin (default değerler yeterli)

### Adım 4: Backend Deploy (Railway.app)
1. https://railway.app → Sign up
2. New Project → Deploy from GitHub
3. Backend klasörünü seç
4. Environment variables ekle (MongoDB URI, JWT_SECRET, vs.)

### Adım 5: Backend URL'ini Frontend'e Ekle
Vercel Dashboard → Settings → Environment Variables:
- `NEXT_PUBLIC_API_URL` = `https://your-backend.railway.app/api`

### Adım 6: Arkadaşınıza Link! 🎉
Vercel size link verir: `https://prestalink.vercel.app`

---

## ⚠️ ÖNEMLİ NOTLAR

### MongoDB:
- Arkadaşınızın da MongoDB'ye ihtiyacı var
- En kolay: MongoDB Atlas (ücretsiz cloud)
- https://www.mongodb.com/cloud/atlas → Free cluster oluştur

### Güvenlik:
- Ngrok: Ücretsiz versiyon 2 saat sonra link değişir
- Vercel: Kalıcı ve ücretsiz
- Aynı WiFi: Sadece aynı ağda çalışır

---

## 🎯 Hangi Yöntem?

| Durum | Yöntem |
|-------|--------|
| Hızlı test (şimdi) | Ngrok |
| Yanınızda test | Aynı WiFi |
| Kalıcı paylaşım | Vercel |

---

**ÖNERİ:** İlk test için **Ngrok**, kalıcı için **Vercel** kullanın! 🚀




