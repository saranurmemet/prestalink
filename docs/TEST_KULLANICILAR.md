# 🧪 Test Kullanıcıları

## 📋 Oluşturulan Kullanıcılar

Her kullanıcı **3 farklı role** ile oluşturulmuştur. Aynı email ve şifre ile tüm rollere giriş yapabilirsiniz!

### 🎯 Giriş Yöntemi:

1. Login sayfasına gidin
2. **Rol seçin** (User / Recruiter / Admin)
3. **Email ve şifre girin** (aynı email, şifre = isim)
4. Seçtiğiniz role göre ilgili dashboard'a yönlendirilirsiniz

---

## 👥 Test Kullanıcıları

### 1. Ahmet
- **Email:** `ahmet@prestalink.app`
- **Şifre:** `ahmet`
- **Roller:** 
  - ✅ User (Aday)
  - ✅ Recruiter (İşveren)
  - ✅ Admin (Yönetici)

### 2. Sara
- **Email:** `sara@prestalink.app`
- **Şifre:** `sara`
- **Roller:** 
  - ✅ User (Aday)
  - ✅ Recruiter (İşveren) - Demo iş ilanları mevcut
  - ✅ Admin (Yönetici)

### 3. Sarad
- **Email:** `sarad@prestalink.app`
- **Şifre:** `sarad`
- **Roller:** 
  - ✅ User (Aday)
  - ✅ Recruiter (İşveren)
  - ✅ Admin (Yönetici)

### 4. Mehmet
- **Email:** `mehmet@prestalink.app`
- **Şifre:** `mehmet`
- **Roller:** 
  - ✅ User (Aday)
  - ✅ Recruiter (İşveren)
  - ✅ Admin (Yönetici)

---

## 🚀 Seed Script Çalıştırma

### Local Development:
```powershell
cd backend
npm run seed
```

Bu script her kullanıcı için 3 farklı role'de hesap oluşturur:
- `ahmet_user@prestalink.app`
- `ahmet_recruiter@prestalink.app`
- `ahmet_admin@prestalink.app`

**Ancak giriş yaparken sadece `ahmet@prestalink.app` yazmanız yeterli!**
Sistem otomatik olarak seçtiğiniz role göre doğru email'i bulur.

---

## 📝 Giriş Örneği

### Örnek 1: Ahmet ile User olarak giriş
1. Login sayfası → **User** rolünü seç
2. Email: `ahmet@prestalink.app`
3. Şifre: `ahmet`
4. ✅ `/user/dashboard` sayfasına yönlendirilirsiniz

### Örnek 2: Aynı Ahmet ile Recruiter olarak giriş
1. Login sayfası → **Recruiter** rolünü seç
2. Email: `ahmet@prestalink.app` (aynı email!)
3. Şifre: `ahmet` (aynı şifre!)
4. ✅ `/recruiter/dashboard` sayfasına yönlendirilirsiniz

### Örnek 3: Aynı Ahmet ile Admin olarak giriş
1. Login sayfası → **Admin** rolünü seç
2. Email: `ahmet@prestalink.app` (aynı email!)
3. Şifre: `ahmet` (aynı şifre!)
4. ✅ `/admin/dashboard` sayfasına yönlendirilirsiniz

---

## 🎯 Test Senaryoları

### Senaryo 1: Aday (User) Olarak Test
1. `ahmet@prestalink.app` / `ahmet` ile User role'ünde giriş
2. İş başvuruları yapın
3. CV yükleyin
4. Başvuruları takip edin

### Senaryo 2: İşveren (Recruiter) Olarak Test
1. `sara@prestalink.app` / `sara` ile Recruiter role'ünde giriş
2. Demo iş ilanları görünür (4 adet)
3. Yeni iş ilanı oluşturun
4. Başvuruları görüntüleyin

### Senaryo 3: Yönetici (Admin) Olarak Test
1. `sarad@prestalink.app` / `sarad` ile Admin role'ünde giriş
2. Sistem yönetimi yapın
3. Kullanıcıları görüntüleyin
4. Platform ayarlarını kontrol edin

---

## ⚠️ Önemli Notlar

- ✅ **Aynı email ve şifre** ile tüm rollere giriş yapabilirsiniz
- ✅ **Rol seçimi önemli!** Login sayfasında doğru rolü seçmelisiniz
- ✅ Sistem otomatik olarak seçtiğiniz role göre doğru hesabı bulur
- ✅ Her kullanıcı için 3 farklı dashboard'a erişim var
- ✅ Şifreler otomatik hash'lenir (güvenli)

---

## 🔄 Seed Script Güncelleme

Yeni kullanıcı eklemek için `backend/scripts/seed.js` dosyasındaki `testUsers` array'ine ekleyin:

```javascript
const testUsers = [
  { name: 'YeniKullanici', email: 'yenikullanici@prestalink.app', password: 'yenikullanici', ... },
];
```

Her kullanıcı için otomatik olarak 3 role'de hesap oluşturulur.

---

**Oluşturma Tarihi:** 2024
