# 🌍 Farklı Ülkedeki Arkadaşa Gönderme Rehberi

## 🎯 İki Seçenek Var:

1. **⚡ HIZLI TEST (Ngrok - 2 Dakika)** - Şimdi test etmek için
2. **🌐 KALICI DEPLOYMENT (Vercel + Railway - 15 Dakika)** - Sürekli erişim için

---

## ⚡ SEÇENEK 1: Ngrok ile Hızlı Test (2 Dakika)

### ✅ Ne İşe Yarar:
- Çok hızlı (2 dakika)
- Herkes erişebilir (farklı ülkede bile)
- Ücretsiz
- ⚠️ Link 2 saat sonra değişir (yeni link göndermeniz gerekir)

### 📝 Adım Adım:

#### 1. Ngrok Kurulumu
```powershell
# Ngrok'u indirin
# https://ngrok.com/download → Windows için ZIP indir
# İndirdiğiniz ngrok.exe'yi C:\ngrok klasörüne koyun
```

#### 2. Ngrok Hesabı ve Token
1. https://ngrok.com → Sign up (ücretsiz)
2. Email doğrulayın
3. https://dashboard.ngrok.com/get-started/your-authtoken → Token'ı kopyalayın
4. PowerShell'de:
```powershell
cd C:\ngrok
.\ngrok.exe config add-authtoken YOUR_TOKEN_HERE
```

#### 3. Backend'i Başlat
```powershell
cd C:\Users\RANDOM\Desktop\prestalink\backend
npm run dev
```
Backend çalıştığını doğrulayın: `Server listening on http://0.0.0.0:5000`

#### 4. Backend için Ngrok
**YENİ PowerShell penceresi açın:**
```powershell
cd C:\ngrok
.\ngrok.exe http 5000
```

**Çıkan URL'i kopyalayın:**
```
Forwarding  https://xxxx-xxxx-xxxx.ngrok-free.app -> http://localhost:5000
```
Örnek: `https://abc123def456.ngrok-free.app`

#### 5. Frontend .env Güncelle
`frontend/.env` dosyasını açın (yoksa oluşturun):
```env
NEXT_PUBLIC_API_URL=https://abc123def456.ngrok-free.app/api
```
(abc123def456 yerine ngrok'un verdiği URL'i yazın - **https://** ve **/api** eklemeyi unutmayın!)

#### 6. Frontend'i Başlat
```powershell
cd C:\Users\RANDOM\Desktop\prestalink\frontend
npm run dev
```

#### 7. Frontend için Ngrok
**YENİ PowerShell penceresi açın:**
```powershell
cd C:\ngrok
.\ngrok.exe http 3000
```

**Çıkan URL'i kopyalayın:**
```
Forwarding  https://yyyy-yyyy-yyyy.ngrok-free.app -> http://localhost:3000
```
Örnek: `https://xyz789uvw012.ngrok-free.app`

#### 8. MongoDB Atlas Kurulumu (Ücretsiz Cloud)
Arkadaşınız da veritabanına erişebilmeli:

1. https://www.mongodb.com/cloud/atlas → Sign up (ücretsiz)
2. **Create a Deployment** → **FREE (M0)**
3. **Create Cluster** (3-5 dakika sürebilir)
4. **Database Access** → **Add New Database User**:
   - Username: `prestalink`
   - Password: Güçlü bir şifre (kaydedin!)
5. **Network Access** → **Add IP Address** → **Allow Access from Anywhere** (0.0.0.0/0)
6. **Database** → **Connect** → **Connect your application**
7. Connection string'i kopyalayın:
   ```
   mongodb+srv://prestalink:ŞİFRENİZ@cluster0.xxxxx.mongodb.net/prestalink?retryWrites=true&w=majority
   ```
   (ŞİFRENİZ yerine oluşturduğunuz şifreyi yazın)

#### 9. Backend .env Güncelle
`backend/.env` dosyasını açın:
```env
MONGO_URI=mongodb+srv://prestalink:ŞİFRENİZ@cluster0.xxxxx.mongodb.net/prestalink?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this
PORT=5000
CLIENT_URL=https://xyz789uvw012.ngrok-free.app
NODE_ENV=development
```

**Backend'i yeniden başlatın:**
```powershell
# Ctrl+C ile durdurun, sonra:
npm run dev
```

#### 10. Arkadaşınıza Link Gönderin! 🎉
```
https://xyz789uvw012.ngrok-free.app
```
Bu linki arkadaşınıza gönderin. Herkes erişebilir!

---

## 🌐 SEÇENEK 2: Kalıcı Deployment (Vercel + Railway)

### ✅ Ne İşe Yarar:
- Kalıcı link (süresiz)
- Herkes erişebilir
- Otomatik HTTPS
- Ücretsiz tier mevcut
- ⏱️ 15 dakika sürer

### 📝 Adım Adım:

#### BÖLÜM A: MongoDB Atlas (Zaten yaptıysanız atlayın)

1. https://www.mongodb.com/cloud/atlas → Sign up
2. Free cluster oluşturun
3. Database user oluşturun
4. Network Access → Allow from anywhere
5. Connection string'i alın

#### BÖLÜM B: Backend Deployment (Railway.app)

1. **Railway Hesabı**
   - https://railway.app → Sign up with GitHub

2. **Yeni Proje**
   - **New Project** → **Deploy from GitHub repo**
   - GitHub repo'nuzu bağlayın
   - Backend klasörünü seçin

3. **Environment Variables Ekle**
   Railway Dashboard → **Variables** sekmesinde:
   ```
   MONGO_URI=mongodb+srv://prestalink:ŞİFRENİZ@cluster0.xxxxx.mongodb.net/prestalink?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   PORT=5000
   CLIENT_URL=https://prestalink.vercel.app
   NODE_ENV=production
   ```

4. **Deploy**
   - Railway otomatik deploy eder
   - **Settings** → **Generate Domain** → Domain'i kopyalayın
   - Örnek: `prestalink-backend-production.up.railway.app`

#### BÖLÜM C: Frontend Deployment (Vercel)

1. **Vercel Hesabı**
   - https://vercel.com → Sign up with GitHub

2. **Vercel CLI Kurulumu**
   ```powershell
   npm install -g vercel
   ```

3. **Frontend Deploy**
   ```powershell
   cd C:\Users\RANDOM\Desktop\prestalink\frontend
   vercel
   ```
   
   Sorular:
   - **Set up and deploy?** → `Y`
   - **Which scope?** → Hesabınızı seçin
   - **Link to existing project?** → `N`
   - **What's your project's name?** → `prestalink` (Enter)
   - **In which directory is your code located?** → `./` (Enter)
   - **Override settings?** → `N` (Enter)

4. **Environment Variables Ekle**
   Vercel Dashboard:
   - Projenize gidin
   - **Settings** → **Environment Variables**
   - Ekle:
     ```
     Key: NEXT_PUBLIC_API_URL
     Value: https://prestalink-backend-production.up.railway.app/api
     ```
   - **Save**

5. **Redeploy**
   Vercel Dashboard → **Deployments** → **Redeploy** (son deployment'ı yeniden deploy et)

6. **Backend CLIENT_URL Güncelle**
   Railway Dashboard → **Variables**:
   ```
   CLIENT_URL=https://prestalink.vercel.app
   ```
   (Vercel'in verdiği gerçek domain'i yazın)

#### 7. Arkadaşınıza Link Gönderin! 🎉
```
https://prestalink.vercel.app
```
Bu link kalıcıdır! İstediği zaman erişebilir.

---

## ⚠️ ÖNEMLİ NOTLAR

### Ngrok için:
- Link 2 saat sonra değişir
- Yeni link almak için ngrok'u yeniden başlatın
- Ücretsiz versiyon günlük limiti var

### MongoDB Atlas için:
- Free tier yeterli (512MB)
- Cluster oluşturma 3-5 dakika sürebilir
- Connection string'i güvenli tutun

### Vercel için:
- Free tier yeterli
- Otomatik HTTPS
- Custom domain ekleyebilirsiniz

### Railway için:
- Free tier: $5 kredi/ay
- Her deploy yeniden başlatır
- Domain otomatik oluşturulur

---

## 🎯 Hangi Yöntemi Seçmeliyim?

| Durum | Önerilen |
|-------|----------|
| Hemen test etmek | **Ngrok** |
| Kalıcı paylaşım | **Vercel + Railway** |
| Sadece demo için | **Ngrok** |
| Gerçek kullanım için | **Vercel + Railway** |

---

## 🚀 Hızlı Başlangıç Özeti

**Ngrok (2 dakika):**
1. Ngrok kur → Token ekle
2. Backend başlat → Ngrok backend (5000)
3. Frontend .env → Backend ngrok URL
4. Frontend başlat → Ngrok frontend (3000)
5. MongoDB Atlas → Connection string
6. Backend .env → MongoDB URI
7. Link gönder! 🎉

**Vercel (15 dakika):**
1. MongoDB Atlas → Cluster oluştur
2. Railway → Backend deploy
3. Vercel → Frontend deploy
4. Environment variables ekle
5. Link gönder! 🎉

---

**ÖNERİ:** İlk test için **Ngrok**, sonra kalıcı için **Vercel + Railway** kullanın! 🚀




