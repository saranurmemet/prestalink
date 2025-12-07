# 🔧 Login Hatası Çözümü

## ❌ Sorun: "Something went wrong." hatası

### Olası Nedenler:

1. **Backend'de kullanıcı yok**
   - Admin login için: `mehmet@prestalink.app` → `mehmet_admin@prestalink.app` aranıyor
   - Bu kullanıcı veritabanında yoksa hata verir

2. **Backend deploy olmamış**
   - Render'da backend henüz deploy olmamış olabilir
   - API URL yanlış olabilir

3. **CORS sorunu**
   - Vercel frontend → Render backend bağlantısında CORS hatası

## ✅ Çözüm Adımları:

### 1. Backend'de Kullanıcıları Kontrol Et

```bash
cd backend
npm run seed
```

Bu komut tüm test kullanıcılarını oluşturur:
- `mehmet_user@prestalink.app`
- `mehmet_recruiter@prestalink.app`
- `mehmet_admin@prestalink.app`

### 2. Render Backend Deploy Durumunu Kontrol Et

1. Render dashboard'a gidin
2. Prestalink servisinin deploy durumunu kontrol edin
3. Deploy tamamlanana kadar bekleyin

### 3. CORS Ayarlarını Kontrol Et

`backend/server.js` dosyasında Vercel URL'i ekli olmalı:

```javascript
const allowedOrigins = process.env.CLIENT_URL ? 
  process.env.CLIENT_URL.split(',') : 
  [
    'http://localhost:3000',
    'https://frontend-1kz0slpkw-mehmets-projects-bb5aee80.vercel.app',
    'https://prestalink.vercel.app' // Ana domain
  ];
```

### 4. Environment Variables Kontrol Et

**Render'da şu değişkenler olmalı:**
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - JWT secret key
- `CLIENT_URL` - Vercel frontend URL'i (virgülle ayrılmış)
- `NODE_ENV=production`

**Vercel'de şu değişken olmalı:**
- `NEXT_PUBLIC_API_URL=https://prestalink.onrender.com/api`

## 🔍 Test Etmek İçin:

1. **Backend'i test et:**
```bash
curl -X POST https://prestalink.onrender.com/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"mehmet@prestalink.app","password":"mehmet"}'
```

2. **Frontend console'da hata kontrol et:**
- Browser DevTools → Console
- Network tab'da API isteklerini kontrol et

## 📝 Hızlı Çözüm:

1. Render dashboard'da backend deploy'unu kontrol et
2. Render'da `CLIENT_URL` environment variable'ına Vercel URL'ini ekle
3. Backend'i yeniden deploy et
4. Frontend'de tekrar dene

