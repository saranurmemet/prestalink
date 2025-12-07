# 🚀 PrestaLink Uygulamasını Arkadaşına Gönderme Rehberi

## 📋 İçindekiler
1. [Yöntem 1: Aynı WiFi'da Test (EN KOLAY - 5 Dakika)](#yöntem-1)
2. [Yöntem 2: Vercel ile Ücretsiz Yayınlama (ÖNERİLEN - 10 Dakika)](#yöntem-2)
3. [Yöntem 3: Ngrok ile Geçici Link (5 Dakika)](#yöntem-3)

---

## <a name="yöntem-1"></a>Yöntem 1: Aynı WiFi'da Test (EN KOLAY - 5 Dakika) ⚡

### ✅ Ne Gerekir:
- Her iki bilgisayar da **aynı WiFi ağında** olmalı
- Backend ve Frontend çalışıyor olmalı

### 📝 Adımlar:

#### 1. Bilgisayarınızın IP Adresini Öğrenin

**Windows (PowerShell):**
```powershell
ipconfig
```
`IPv4 Address` değerini bulun (örnek: `192.168.1.100`)

**Alternatif:**
- Windows Ayarlar → Ağ ve İnternet → WiFi → Özellikler → IPv4 adresi

#### 2. Backend'i Network'te Çalışır Hale Getirin

Backend `package.json`'a bakın:
```json
"dev": "nodemon server.js"
```

Backend'i şu şekilde başlatın:
```powershell
cd backend
$env:PORT=5000
npm run dev
```

Eğer `server.js` dosyasında dinleme ayarı varsa, `0.0.0.0` olmalı (sadece `localhost` değil)

#### 3. Frontend'i Network'te Çalışır Hale Getirin

Frontend klasöründe:
```powershell
cd frontend
npm run dev -- -H 0.0.0.0
```

Veya `package.json`'a ekleyin:
```json
"dev": "next dev -H 0.0.0.0"
```

#### 4. Arkadaşınıza Link Gönderin

Eğer IP adresiniz `192.168.1.100` ise:
```
http://192.168.1.100:3000
```

**ÖNEMLİ:** 
- `frontend/.env` dosyasında `NEXT_PUBLIC_API_URL` değerini değiştirin:
  ```
  NEXT_PUBLIC_API_URL=http://192.168.1.100:5000/api
  ```

---

## <a name="yöntem-2"></a>Yöntem 2: Vercel ile Ücretsiz Yayınlama (ÖNERİLEN) 🌐

### ✅ Avantajlar:
- ✅ Tamamen ücretsiz
- ✅ Herkes erişebilir (WiFi gerekmez)
- ✅ Otomatik HTTPS
- ✅ Hızlı ve kolay
- ✅ Kalıcı link

### 📝 Adımlar:

#### 1. Vercel Hesabı Oluşturun
1. https://vercel.com adresine gidin
2. "Sign Up" → GitHub ile giriş yapın (en kolay)

#### 2. Vercel CLI Kurulumu
```powershell
npm install -g vercel
```

#### 3. Frontend'i Deploy Edin
```powershell
cd frontend
vercel
```

Sorular:
- **Set up and deploy?** → `Y`
- **Which scope?** → Hesabınızı seçin
- **Link to existing project?** → `N`
- **What's your project's name?** → `prestalink` (veya istediğiniz)
- **In which directory is your code located?** → `./` veya `.`
- **Override settings?** → `N`

#### 4. Environment Variables Ekleme
Vercel Dashboard'da:
1. Projenize gidin
2. Settings → Environment Variables
3. Şunu ekleyin:
   - **Key:** `NEXT_PUBLIC_API_URL`
   - **Value:** `http://YOUR_BACKEND_URL:5000/api`

#### 5. Backend'i Deploy Edin

**Seçenek A: Railway.app (Ücretsiz)**
1. https://railway.app → Sign up
2. "New Project" → "Deploy from GitHub repo"
3. Backend klasörünü seçin
4. Environment variables ekleyin:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `PORT`
   - `CLIENT_URL`

**Seçenek B: Render.com (Ücretsiz)**
1. https://render.com → Sign up
2. "New" → "Web Service"
3. GitHub repo'nuzu bağlayın
4. Backend klasörünü seçin

#### 6. Backend URL'ini Frontend'e Ekle
Vercel'de environment variable olarak backend URL'ini ekleyin.

#### 7. Arkadaşınıza Link Gönderin
Vercel size bir link verecek:
```
https://prestalink.vercel.app
```
Bu linki arkadaşınıza gönderin! 🎉

---

## <a name="yöntem-3"></a>Yöntem 3: Ngrok ile Geçici Link (5 Dakika) 🔗

### ✅ Avantajlar:
- ✅ Çok hızlı (2 dakika)
- ✅ Herkes erişebilir
- ✅ Ücretsiz (bazı limitler var)

### 📝 Adımlar:

#### 1. Ngrok Kurulumu
```powershell
# Chocolatey ile (önerilen)
choco install ngrok

# Veya manuel:
# https://ngrok.com/download → Windows indir
```

#### 2. Ngrok Hesabı Oluşturun
1. https://ngrok.com → Sign up (ücretsiz)
2. Auth token'ı alın
3. Terminalde:
```powershell
ngrok config add-authtoken YOUR_AUTH_TOKEN
```

#### 3. Backend'i Ngrok ile Açın
Yeni bir terminal penceresi:
```powershell
cd backend
npm run dev
```

Başka bir terminal:
```powershell
ngrok http 5000
```

Backend URL'i: `https://xxxx-xxx-xxx-xxx.ngrok-free.app`

#### 4. Frontend'i Ngrok ile Açın
Yeni bir terminal:
```powershell
cd frontend
npm run dev
```

Başka bir terminal:
```powershell
ngrok http 3000
```

Frontend URL'i: `https://yyyy-yyy-yyy-yyy.ngrok-free.app`

#### 5. Frontend .env Güncelleme
`frontend/.env` dosyasında:
```
NEXT_PUBLIC_API_URL=https://xxxx-xxx-xxx-xxx.ngrok-free.app/api
```

Frontend'i yeniden başlatın.

#### 6. Arkadaşınıza Link Gönderin
Frontend ngrok linkini gönderin! 🎉

**NOT:** Ücretsiz ngrok linkleri 2 saat sonra değişir. Yeniden ngrok başlatıp yeni link göndermeniz gerekir.

---

## 🎯 Hangi Yöntemi Seçmeliyim?

| Yöntem | Süre | WiFi Gerekli? | Kalıcı? | Zorluk |
|--------|------|---------------|---------|--------|
| **Yöntem 1 (Aynı WiFi)** | 5 dk | ✅ Evet | ❌ Hayır | ⭐ Kolay |
| **Yöntem 2 (Vercel)** | 10 dk | ❌ Hayır | ✅ Evet | ⭐⭐ Orta |
| **Yöntem 3 (Ngrok)** | 5 dk | ❌ Hayır | ❌ Hayır (2 saat) | ⭐ Kolay |

### 🏆 ÖNERİ:
- **Hızlı test için:** Yöntem 3 (Ngrok)
- **Kalıcı paylaşım için:** Yöntem 2 (Vercel)
- **Yanınızda test için:** Yöntem 1 (Aynı WiFi)

---

## ⚠️ ÖNEMLİ NOTLAR

### MongoDB İçin:
Eğer arkadaşınızın da MongoDB'ye erişmesi gerekiyorsa:

**Seçenek 1: MongoDB Atlas (Ücretsiz)**
1. https://www.mongodb.com/cloud/atlas → Sign up
2. Free cluster oluşturun
3. Connection string'i alın
4. `backend/.env` dosyasına ekleyin

**Seçenek 2: MongoDB Yerel Kurulum**
Arkadaşınızın bilgisayarında MongoDB kurması gerekir.

---

## 📞 Sorun Yaşarsanız

### Frontend açılmıyor:
- Port 3000 kullanımda mı kontrol edin
- `npm run dev` hatası var mı bakın

### Backend bağlanmıyor:
- MongoDB çalışıyor mu?
- Port 5000 açık mı?
- `backend/.env` dosyası doğru mu?

### Network'te görünmüyor:
- Firewall ayarlarını kontrol edin
- Windows Defender → İzin verin
- Aynı WiFi ağında olduğunuzdan emin olun

---

## 🎉 HAZIR!

Arkadaşınız artık PrestaLink'i deneyebilir! 🚀



