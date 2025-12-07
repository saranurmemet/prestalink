# 🌐 Production'da Test Kullanıcıları Oluşturma

## 📋 Railway'de Seed Script Çalıştırma

Railway'de seed script'i çalıştırmak için birkaç yöntem var:

---

## 🚀 YÖNTEM 1: Railway CLI ile (Önerilen)

### 1. Railway CLI Kurulumu
```powershell
npm install -g @railway/cli
```

### 2. Railway'e Login
```powershell
railway login
```

### 3. Projeyi Link Et
```powershell
cd backend
railway link
```
Projenizi seçin.

### 4. Seed Script Çalıştır
```powershell
railway run node scripts/seed.js
```

✅ Kullanıcılar oluşturuldu!

---

## 🚀 YÖNTEM 2: Railway Dashboard'dan (Manuel)

### 1. Railway Dashboard'a Gidin
https://railway.app/dashboard

### 2. Projenizi Seçin

### 3. Deployments → Son Deployment'a Tıklayın

### 4. Shell Sekmesi
- **Shell** sekmesine gidin
- Terminal açılacak

### 5. Seed Script Çalıştır
```bash
cd backend
node scripts/seed.js
```

✅ Kullanıcılar oluşturuldu!

---

## 🚀 YÖNTEM 3: Otomatik Seed (Startup Hook)

Backend başlatılırken otomatik seed için:

### 1. `backend/package.json` güncelleyin:
```json
{
  "scripts": {
    "start": "node -e \"require('./scripts/seed.js').then(() => require('./server.js'))\""
  }
}
```

**VEYA**

### 2. `backend/server.js` dosyasına ekleyin (dosyanın başına):
```javascript
// Auto-seed on startup (only if users don't exist)
if (process.env.NODE_ENV === 'production' && process.env.AUTO_SEED === 'true') {
  const seed = require('./scripts/seed');
  seed().catch(console.error);
}
```

### 3. Railway Variables'a ekleyin:
```
AUTO_SEED=true
```

⚠️ **DİKKAT:** Bu yöntem her deploy'da çalışır. Sadece ilk deploy için kullanın!

---

## 🎯 Test Kullanıcıları

Seed script çalıştıktan sonra bu kullanıcılar hazır olacak:

| Email | Şifre | Rol | Dashboard |
|-------|-------|-----|-----------|
| ahmet@prestalink.app | ahmet | user | /user/dashboard |
| sara@prestalink.app | sara | recruiter | /recruiter/dashboard |
| sarad@prestalink.app | sarad | admin | /admin/dashboard |
| mehmet@prestalink.app | mehmet | user | /user/dashboard |

---

## ✅ Doğrulama

Seed script çalıştıktan sonra:

1. Vercel'deki uygulamanıza gidin
2. Login sayfasına gidin
3. Rol seçin (User/Recruiter/Admin)
4. Yukarıdaki email ve şifrelerle giriş yapın
5. İlgili dashboard'a yönlendirilmelisiniz

---

## 🔧 Sorun Giderme

### Seed script çalışmıyor:
- ✅ MongoDB bağlantısı kontrol edin (Railway Variables → MONGO_URI)
- ✅ Railway Shell'de `node scripts/seed.js` manuel çalıştırın
- ✅ Logları kontrol edin (Railway → Deployments → Logs)

### Kullanıcılar oluşmadı:
- ✅ MongoDB Atlas'da collection'ı kontrol edin
- ✅ Seed script loglarını inceleyin
- ✅ Email'ler zaten varsa, script skip eder (normal davranış)

---

**Hazır!** 🎉




