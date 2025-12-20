# 🚀 ZER Company Production Deployment - Hızlı Başlangıç

## ⚡ En Hızlı Yöntem: Render/Railway Console

### Adım 1: Render/Railway Dashboard'a Giriş
1. **Render:** https://dashboard.render.com
2. **Railway:** https://railway.app
3. Backend servisinizi seçin

### Adım 2: Shell/Console Aç
1. Servis sayfasında **Shell** veya **Console** sekmesine tıklayın
2. Terminal açılacak

### Adım 3: Script'i Çalıştır
```bash
cd backend
node scripts/deploy-zer-company-production.js
```

**✅ Bitti!** Profil production veritabanına eklendi.

---

## 📋 Profil Bilgileri

Deployment sonrası bu bilgilerle giriş yapabilirsiniz:

- **Email:** zer.company@prestalink.app
- **Şifre:** zer2024
- **Rol:** Recruiter (İşveren)

---

## ✅ Kontrol

Deployment başarılı olduğunda şu mesajı göreceksiniz:

```
✅ PRODUCTION DEPLOYMENT TAMAMLANDI
📧 Email: zer.company@prestalink.app
🔑 Şifre: zer2024
🏢 Şirket Adı: ZER company
📝 Profil Durumu: ✅ Eksiksiz
```

---

## 🔄 Güncelleme

Profil bilgilerini güncellemek için script'i tekrar çalıştırın. Mevcut kullanıcı otomatik olarak güncellenecektir.

---

**Not:** `MONGO_URI` environment variable'ı Render/Railway'de zaten ayarlı olmalı.

