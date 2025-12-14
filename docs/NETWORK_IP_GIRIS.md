# 🌐 Network IP'den Giriş Rehberi - Sara Kullanıcısı

Bu rehber, local olmayan bir IP'den (network IP) uygulamayı açıp Sara kullanıcısı ile tüm rollere giriş yapmak için hazırlanmıştır.

---

## 🚀 HIZLI BAŞLANGIÇ

### Adım 1: IP Adresinizi Öğrenin

PowerShell'de:
```powershell
ipconfig | findstr IPv4
```

Veya daha detaylı:
```powershell
ipconfig
```

`IPv4 Address` değerini bulun (örnek: `192.168.1.100`)

### Adım 2: Sara Kullanıcılarını Oluşturun

```powershell
cd backend
node scripts/add-missing-users.js
```

Bu komut Sara için tüm rollerde kullanıcı oluşturur:
- `sara_user@prestalink.app` (User rolü)
- `sara_recruiter@prestalink.app` (Recruiter rolü)
- `sara_admin@prestalink.app` (Admin rolü)

**Şifre:** `sara` (tüm roller için aynı)

### Adım 3: Backend'i Başlatın

```powershell
cd backend
npm run dev
```

Backend zaten `0.0.0.0` adresinde dinliyor, bu yüzden network'ten erişilebilir olacak.

### Adım 4: Frontend .env Dosyasını Güncelleyin

`frontend/.env` dosyasını oluşturun veya güncelleyin:

```env
NEXT_PUBLIC_API_URL=http://192.168.1.100:5000/api
```

**ÖNEMLİ:** `192.168.1.100` yerine kendi IP adresinizi yazın!

### Adım 5: Backend CORS Ayarlarını Güncelleyin

`backend/.env` dosyasına ekleyin:

```env
CLIENT_URL=http://localhost:3000,http://192.168.1.100:3000
```

**ÖNEMLİ:** `192.168.1.100` yerine kendi IP adresinizi yazın!

### Adım 6: Frontend'i Network Modunda Başlatın

```powershell
cd frontend
npm run dev:network
```

Bu komut frontend'i `0.0.0.0` adresinde başlatır, böylece network'ten erişilebilir olur.

### Adım 7: Tarayıcıda Açın

Network'teki başka bir cihazdan veya aynı bilgisayardan:

```
http://192.168.1.100:3000
```

**ÖNEMLİ:** `192.168.1.100` yerine kendi IP adresinizi yazın!

---

## 🔐 Sara ile Giriş Yapma

### User (İş Arayan) Rolü:

1. Login sayfasına gidin: `http://192.168.1.100:3000/login`
2. **User** (İş Arayan) kartına tıklayın
3. **Email:** `sara@prestalink.app`
4. **Şifre:** `sara`
5. **Giriş Yap** butonuna tıklayın

Sistem otomatik olarak `sara_user@prestalink.app` kullanıcısını arar.

### Recruiter (İşveren) Rolü:

1. Login sayfasına gidin: `http://192.168.1.100:3000/login`
2. **Recruiter** (İşveren) kartına tıklayın
3. **Email:** `sara@prestalink.app`
4. **Şifre:** `sara`
5. **Giriş Yap** butonuna tıklayın

Sistem otomatik olarak `sara_recruiter@prestalink.app` kullanıcısını arar.

### Admin (Yönetici) Rolü:

1. Login sayfasına gidin: `http://192.168.1.100:3000/login`
2. **Admin** (Yönetici) kartına tıklayın
3. **Email:** `sara@prestalink.app`
4. **Şifre:** `sara`
5. **Giriş Yap** butonuna tıklayın

Sistem otomatik olarak `sara_admin@prestalink.app` kullanıcısını arar.

---

## ⚠️ ÖNEMLİ NOTLAR

1. **Firewall:** Windows Firewall port 3000 ve 5000'i engelliyor olabilir. İzin vermeniz gerekebilir.

2. **Aynı Network:** Bağlanmak istediğiniz cihaz aynı WiFi ağında olmalı.

3. **IP Değişebilir:** WiFi'ye yeniden bağlandığınızda IP adresiniz değişebilir. Her seferinde kontrol edin.

4. **Backend Yeniden Başlatma:** `.env` dosyasını değiştirdikten sonra backend'i yeniden başlatmanız gerekebilir.

---

## 🐛 Sorun Giderme

### "Backend'e bağlanılamıyor" Hatası

1. Backend çalışıyor mu kontrol edin: `cd backend && npm run dev`
2. `frontend/.env` dosyasında IP adresi doğru mu?
3. Firewall port 5000'i engelliyor olabilir

### "CORS Error" Hatası

1. `backend/.env` dosyasında `CLIENT_URL` doğru mu?
2. Backend'i yeniden başlatın

### "Invalid credentials" Hatası

1. Sara kullanıcıları oluşturuldu mu? `node scripts/add-missing-users.js`
2. Email: `sara@prestalink.app` (rol seçimine göre otomatik dönüşür)
3. Şifre: `sara`

---

## 📋 Hızlı Kontrol Listesi

- [ ] IP adresi öğrenildi (`ipconfig`)
- [ ] Sara kullanıcıları oluşturuldu (`node scripts/add-missing-users.js`)
- [ ] Backend çalışıyor (`npm run dev`)
- [ ] `frontend/.env` dosyası oluşturuldu ve IP ile güncellendi
- [ ] `backend/.env` dosyasında `CLIENT_URL` network IP ile güncellendi
- [ ] Frontend network modunda başlatıldı (`npm run dev:network`)
- [ ] Firewall portları açık (3000 ve 5000)
- [ ] Tarayıcıda `http://[IP]:3000` açılıyor

---

**Başarılar! 🎉**











