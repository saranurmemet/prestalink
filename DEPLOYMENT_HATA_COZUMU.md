# 🔧 Deployment Hata Çözümü

## ❌ Sorun
10 dakika önce yapılan deploy hata veriyor.

## 🔍 Hangi Deployment'da Hata Var?

### 1. Vercel (Frontend) Hatası mı?
**Kontrol:**
- https://vercel.com/dashboard → `prestalink` projesi
- **Deployments** sekmesi → En son deployment
- **Build Logs** kontrol edin

**Olası Hatalar:**
- Build hatası (TypeScript, syntax)
- Environment variable eksik
- Dependency hatası

### 2. Render (Backend) Hatası mı?
**Kontrol:**
- https://dashboard.render.com → `prestalink-backend` servisi
- **Logs** sekmesi → Son logları kontrol edin

**Olası Hatalar:**
- MongoDB bağlantı hatası
- Environment variable eksik
- Module not found hatası

---

## ✅ Hızlı Çözümler

### Vercel Build Hatası
1. **Deployments** → En son deployment → **Build Logs**
2. Hata mesajını okuyun
3. Genellikle:
   - `NEXT_PUBLIC_API_URL` eksik → Environment variable ekleyin
   - TypeScript hatası → Kod hatasını düzeltin
   - Dependency hatası → `package.json` kontrol edin

### Render Backend Hatası
1. **Logs** sekmesini açın
2. Son logları kontrol edin
3. Genellikle:
   - `Cannot find module` → `package.json` dependencies kontrol
   - `MONGO_URI` hatası → Environment variable kontrol
   - `SyntaxError` → Kod hatası

---

## 🔍 Kontrol Edilecekler

### Backend Dosyaları
- ✅ `backend/utils/roleRestriction.js` - Syntax OK
- ✅ `backend/models/User.js` - Syntax OK  
- ✅ `backend/controllers/authController.js` - Syntax OK

### Frontend Dosyaları
- ✅ Linter hatası yok
- ✅ TypeScript compilation OK

---

## 📋 Adım Adım Çözüm

1. **Hangi deployment'da hata var?** (Vercel mi Render mı?)
2. **Hata mesajını kopyalayın** (Build logs veya Render logs)
3. **Hata tipine göre çözüm:**
   - Module not found → `package.json` dependencies kontrol
   - Environment variable → Vercel/Render'da ekleyin
   - Syntax error → Kod hatasını düzeltin
   - Build timeout → Daha büyük instance kullanın

---

**Hangi deployment'da hata var? Vercel mi Render mı? Hata mesajını paylaşabilir misiniz?**


