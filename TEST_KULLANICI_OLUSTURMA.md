# 👤 Test Kullanıcısı Oluşturma

## ✅ Script Oluşturuldu ve Deploy Edildi

**Script:** `backend/scripts/create-algerian-user.js`

## 📋 Kullanıcı Bilgileri

- **Email:** `amina.benali@prestalink.app`
- **Şifre:** `amina2024`
- **İsim:** Amina Benali
- **Ülke:** Algeria
- **Şehir:** Algiers
- **Cinsiyet:** Kadın
- **Meslek:** Textile Worker
- **Deneyim:** 3-5 years
- **Diller:** Arabic (Native), French (Fluent), English (Intermediate)
- **Sertifikalar:** 3 adet
- **CV:** Eksiksiz CV içeriği mevcut

---

## 🚀 Render'da Çalıştırma

### Yöntem 1: Render Shell (Önerilen)

1. **Render Dashboard:** https://dashboard.render.com
2. `prestalink-backend` servisini bulun
3. **Shell** sekmesine tıklayın
4. Şu komutu çalıştırın:
   ```bash
   node scripts/create-algerian-user.js
   ```

### Yöntem 2: Local'de Çalıştırma (MONGO_URI gerekli)

Eğer local'de çalıştırmak isterseniz:

1. `backend/.env` dosyasında `MONGO_URI` tanımlı olmalı
2. Komut:
   ```bash
   cd backend
   node scripts/create-algerian-user.js
   ```

---

## ✅ Script Özellikleri

- ✅ Kullanıcı zaten varsa günceller
- ✅ Kullanıcı yoksa oluşturur
- ✅ Eksiksiz profil bilgileri
- ✅ CV içeriği
- ✅ Sertifikalar
- ✅ Profil fotoğrafı

---

## 📝 Not

Script commit edildi ve GitHub'a push edildi. Render'da Shell'den çalıştırabilirsiniz.


