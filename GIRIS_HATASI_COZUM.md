# ❌ Giriş Hatası Çözümü - 401 Unauthorized

## 🔍 Sorun Tespiti

Console'da **401 Unauthorized** hatası görünüyor. Bu, kullanılan email veya şifrenin yanlış olduğunu gösterir.

**Görünen Email:** `amina.bensaid@test.com` ❌ (Bu email sistemde kayıtlı değil!)

## ✅ Doğru Giriş Bilgileri

### Test Kullanıcısı (Aday) ile Giriş:
1. Login sayfasında **"İş Arayan (Aday)"** kartını seçin
2. **Email:** `sara@prestalink.app`
3. **Şifre:** `sara`
4. **Giriş Yap** butonuna tıklayın

### İşveren ile Giriş:
1. Login sayfasında **"İşveren (Recruiter)"** kartını seçin
2. **Email:** `zer.company@prestalink.app`
3. **Şifre:** `zer2024`
4. **Giriş Yap** butonuna tıklayın

## 📋 Tüm Test Kullanıcıları

### 1. Sara Soley (Aday)
- **Email:** `sara@prestalink.app`
- **Şifre:** `sara`

### 2. Ahmet Suriye (Aday)
- **Email:** `ahmet@prestalink.app`
- **Şifre:** `ahmet`

### 3. Mehmet Demir (Aday)
- **Email:** `mehmet@prestalink.app`
- **Şifre:** `mehmet`

### 4. Amina Benali (Aday)
- **Email:** `amina.benali@prestalink.app`
- **Şifre:** `amina2024`

### 5. ZER Company (İşveren)
- **Email:** `zer.company@prestalink.app`
- **Şifre:** `zer2024`

## ⚠️ Önemli Notlar

1. **Email formatı:** `@prestalink.app` ile bitmeli
2. **Şifreler:** Büyük/küçük harf duyarlı
3. **Rol seçimi:** Doğru rolü seçtiğinizden emin olun (Aday veya İşveren)

## 🔧 Hala Çalışmıyorsa

### 1. Browser Console'u Temizle
- F12 > Console sekmesi
- Sağ tık > "Clear console"
- Tekrar deneyin

### 2. Backend Kontrolü
Backend çalışıyor mu kontrol edin:
```powershell
cd backend
npm run dev
```

### 3. Network Tab Kontrolü
- F12 > Network sekmesi
- Login butonuna tıklayın
- `/api/auth/user/login` isteğini kontrol edin
- Status code'u kontrol edin:
  - **200:** Başarılı ✅
  - **401:** Email/şifre yanlış ❌
  - **500:** Backend hatası ❌

## 🎯 Hızlı Test

En kolay test için:
1. Email alanını temizleyin
2. `sara@prestalink.app` yazın
3. Şifre: `sara`
4. **İş Arayan (Aday)** kartını seçtiğinizden emin olun
5. Giriş yapın

---

**Not:** `amina.bensaid@test.com` email'i sistemde kayıtlı değil. Yukarıdaki test kullanıcılarından birini kullanın.

