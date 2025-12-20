# 🚀 Render Shell'den ZER Company Deploy Komutları

## 📍 Adım 1: Render Shell'e Giriş

1. Render Dashboard'da sol menüden **"💻 Shell ⚡"** seçeneğine tıklayın
2. Terminal penceresi açılacak

## 📝 Adım 2: Komutları Çalıştır

Terminal açıldığında şu komutları sırayla yazın:

```bash
cd backend
```

```bash
node scripts/deploy-zer-company-production.js
```

## ✅ Başarılı Olursa

Şu çıktıyı göreceksiniz:

```
🔌 Production MongoDB bağlanıyor...
✅ Production MongoDB bağlandı

═══════════════════════════════════════════════════════
🏢 ZER COMPANY PRODUCTION DEPLOYMENT
═══════════════════════════════════════════════════════

✅ İşveren profili oluşturuldu!

═══════════════════════════════════════════════════════
✅ PRODUCTION DEPLOYMENT TAMAMLANDI
═══════════════════════════════════════════════════════

📧 Email: zer.company@prestalink.app
🔑 Şifre: zer2024
🏢 Şirket Adı: ZER company
...
```

## ⚠️ Hata Alırsanız

Eğer "MONGO_URI bulunamadı" hatası alırsanız:
1. Sol menüden **"📦 Environment"** sekmesine gidin
2. `MONGO_URI` değişkeninin tanımlı olduğundan emin olun
3. Yoksa ekleyin ve Shell'den tekrar deneyin

