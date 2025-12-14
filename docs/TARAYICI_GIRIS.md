# 🌐 Tarayıcıda Giriş Yapma - Sara Kullanıcısı

## ✅ Sistem Hazır!

- ✅ **Backend:** Çalışıyor (Port 5000)
- ✅ **Frontend:** Çalışıyor (Port 3000, Network modu)
- ✅ **Sara Kullanıcıları:** Tüm rollerde mevcut

---

## 🚀 Tarayıcıda Açın

### Yerel Bilgisayar:
```
http://localhost:3000
```

### Network IP (Diğer cihazlardan):
```
http://192.168.1.14:3000
```

---

## 🔐 Sara ile Giriş Yapma

### Adım 1: Login Sayfasına Gidin
Tarayıcıda yukarıdaki URL'lerden birini açın.

### Adım 2: Rol Seçin
Üç karttan birini seçin:

1. **User (İş Arayan)** - 🔵 Mavi kart
   - İş arayanlar için
   - Dashboard: `/user/dashboard`

2. **Recruiter (İşveren)** - 🟠 Turuncu kart
   - İşverenler için
   - Dashboard: `/employer/dashboard`

3. **Admin (Yönetici)** - 🟣 Mor kart
   - Yöneticiler için
   - Dashboard: `/admin/dashboard`

### Adım 3: Giriş Bilgileri
Her rol için aynı bilgileri kullanın:

- **Email:** `sara@prestalink.app`
- **Şifre:** `sara`

**Not:** Sistem otomatik olarak seçtiğiniz role göre email'i dönüştürür:
- User seçerseniz → `sara_user@prestalink.app` aranır
- Recruiter seçerseniz → `sara_recruiter@prestalink.app` aranır
- Admin seçerseniz → `sara_admin@prestalink.app` aranır

### Adım 4: Giriş Yap
"Giriş Yap" butonuna tıklayın.

---

## ✅ Başarı Kontrolü

Giriş başarılı olduğunda:
- ✅ İlgili dashboard sayfasına yönlendirilirsiniz
- ✅ Üst menüde kullanıcı adınız görünür
- ✅ Rolünüze uygun menü seçenekleri görünür

---

## 🧪 Test Sonuçları

Otomatik test sonuçları:
- ✅ **User rolü:** Başarılı
- ✅ **Recruiter rolü:** Başarılı
- ✅ **Admin rolü:** Başarılı

Tüm rollerde giriş yapılabilir! 🎉

---

## 🐛 Sorun Giderme

### "Backend'e bağlanılamıyor" Hatası
1. Backend çalışıyor mu? Terminal'de kontrol edin
2. `frontend/.env` dosyasında IP doğru mu?

### "Invalid credentials" Hatası
1. Email: `sara@prestalink.app` (rol seçimine göre otomatik dönüşür)
2. Şifre: `sara`
3. Doğru rolü seçtiğinizden emin olun

### Sayfa açılmıyor
1. Frontend çalışıyor mu? Terminal'de kontrol edin
2. Port 3000 kullanımda mı?
3. Firewall port 3000'i engelliyor olabilir

---

## 📱 Mobil Cihazdan Erişim

Aynı WiFi ağındaki telefon veya tablet'ten:
```
http://192.168.1.14:3000
```

---

**Başarılar! 🎉**











