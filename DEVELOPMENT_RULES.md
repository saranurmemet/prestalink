# 🔒 PRESTALINK DEVELOPMENT KURALLARI

**Son Güncelleme:** 2025-01-09  
**Durum:** ✅ AKTİF

---

## 📋 GENEL KURALLAR

### 1. ❌ OTOMATİK DEPLOY YOK
- Yapılan hiçbir değişiklik otomatik olarak deploy EDİLMEYECEK
- Sadece kullanıcı "Deploy et" dedikten sonra deploy yapılacak

### 2. 🏠 SADECE LOCAL ORTAM
- **Frontend:** `npm run dev` → `http://localhost:3000`
- **Backend:** `node server.js` → `http://localhost:5000`
- Tüm değişiklikler local ortamda test edilecek

### 3. 📍 URL BİLDİRİMİ
Her değişiklikten sonra kullanıcıya açması gereken URL'ler gösterilecek:
- `http://localhost:3000`
- `http://localhost:3000/login`
- `http://localhost:3000/admin/dashboard`
- İlgili diğer sayfalar/route'lar

### 4. 🚫 GITHUB PUSH YOK (ONAY OLMADAN)
- Yerel ortamda çalıştırmadan GitHub'a push YAPILMAYACAK
- Kullanıcı onay vermeden commit/push YOK

### 5. ✅ OTOMATİK KONTROLLER
Her değişiklikten sonra şu kontroller yapılacak:
- ✅ Kod derleniyor mu?
- ✅ API bağlantısı çalışıyor mu?
- ✅ Login / Admin paneli çalışıyor mu?
- ✅ Service worker çakışması var mı?
- ✅ Dil dosyaları hatasız mı?
- ✅ Konsol hatası var mı?

### 6. 📊 TEST RAPORU VE ONAY
- Tüm test sonuçları raporlanacak
- "Deploy için onaylıyor musun?" sorusu sorulacak
- Kullanıcı onay vermeden hiçbir deploy işlemi yapılmayacak

### 7. 🚀 DEPLOY İŞLEMLERİ (SADECE ONAY SONRASI)
Kullanıcı "Deploy et" dedikten sonra:
- ✅ GitHub push yapılacak
- ✅ Vercel frontend deploy edilecek
- ✅ Render backend deploy edilecek
- ✅ Son durum raporlanacak

---

## ⚠️ ÖNEMLİ NOTLAR

### Korunacak Dosyalar
- ✅ PrestaLink APP dosyalarına ZARAR VERİLMEYECEK
- ✅ Sadece istenen değişiklikler yapılacak
- ✅ Landing page, demo site veya diğer ek klasörlere DOKUNULMAYACAK (sadece kullanıcı isterse)

### Test Süreci
1. Değişiklik yap
2. Local'de test et
3. Kontrolleri yap
4. Rapor oluştur
5. Onay iste
6. Onay gelirse deploy et

---

## 📝 WORKFLOW

```
1. Kullanıcı değişiklik ister
   ↓
2. Değişiklik yapılır (LOCAL)
   ↓
3. Otomatik kontroller yapılır
   ↓
4. Test raporu oluşturulur
   ↓
5. URL'ler gösterilir
   ↓
6. "Deploy için onaylıyor musun?" sorulur
   ↓
7. Kullanıcı onay verirse → Deploy
   Kullanıcı onay vermezse → Bekle
```

---

**Bu kurallar tüm PrestaLink projesi için geçerlidir!**


