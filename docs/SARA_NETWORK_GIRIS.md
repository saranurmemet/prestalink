# 🌐 Network IP'den Sara ile Giriş - Hızlı Başlangıç

## ✅ Hazırlıklar Tamamlandı!

- ✅ **IP Adresi:** `192.168.1.14`
- ✅ **Sara Kullanıcıları:** Tüm rollerde mevcut
- ✅ **Frontend .env:** Network IP ile yapılandırıldı
- ✅ **Backend CORS:** Network IP eklendi

---

## 🚀 Şimdi Yapmanız Gerekenler

### 1. Backend'i Başlatın (Terminal 1)

```powershell
cd backend
npm run dev
```

**Beklenen çıktı:**
```
Server listening on 0.0.0.0:5000
MongoDB connected: ...
```

### 2. Frontend'i Network Modunda Başlatın (Terminal 2)

```powershell
cd frontend
npm run dev:network
```

**Beklenen çıktı:**
```
- ready started server on 0.0.0.0:3000
- Local:        http://localhost:3000
```

### 3. Tarayıcıda Açın

Network'teki herhangi bir cihazdan (aynı WiFi ağında):

```
http://192.168.1.14:3000
```

---

## 🔐 Sara ile Giriş Yapma

### User (İş Arayan) Rolü:

1. `http://192.168.1.14:3000/login` adresine gidin
2. **User (İş Arayan)** kartına tıklayın (mavi kart)
3. **Email:** `sara@prestalink.app`
4. **Şifre:** `sara`
5. **Giriş Yap** butonuna tıklayın

✅ Sistem otomatik olarak `sara_user@prestalink.app` kullanıcısını arar ve giriş yapar.

### Recruiter (İşveren) Rolü:

1. `http://192.168.1.14:3000/login` adresine gidin
2. **Recruiter (İşveren)** kartına tıklayın (turuncu kart)
3. **Email:** `sara@prestalink.app`
4. **Şifre:** `sara`
5. **Giriş Yap** butonuna tıklayın

✅ Sistem otomatik olarak `sara_recruiter@prestalink.app` kullanıcısını arar ve giriş yapar.

### Admin (Yönetici) Rolü:

1. `http://192.168.1.14:3000/login` adresine gidin
2. **Admin (Yönetici)** kartına tıklayın (mor kart)
3. **Email:** `sara@prestalink.app`
4. **Şifre:** `sara`
5. **Giriş Yap** butonuna tıklayın

✅ Sistem otomatik olarak `sara_admin@prestalink.app` kullanıcısını arar ve giriş yapar.

---

## 📋 Sara Kullanıcı Bilgileri

| Rol | Email (Giriş) | Gerçek Email | Şifre |
|-----|--------------|--------------|-------|
| User | `sara@prestalink.app` | `sara_user@prestalink.app` | `sara` |
| Recruiter | `sara@prestalink.app` | `sara_recruiter@prestalink.app` | `sara` |
| Admin | `sara@prestalink.app` | `sara_admin@prestalink.app` | `sara` |

**Not:** Giriş yaparken sadece `sara@prestalink.app` yazın, sistem otomatik olarak seçtiğiniz role göre doğru email'i arar.

---

## ⚠️ Önemli Notlar

1. **Firewall:** Windows Firewall port 3000 ve 5000'i engelliyor olabilir. İlk bağlantıda Windows size izin soracaktır - "Allow access" seçin.

2. **Aynı Network:** Bağlanmak istediğiniz cihaz aynı WiFi ağında olmalı.

3. **IP Değişebilir:** WiFi'ye yeniden bağlandığınızda IP adresiniz değişebilir. Yeni IP'yi öğrenmek için:
   ```powershell
   ipconfig | findstr IPv4
   ```

4. **Backend Yeniden Başlatma:** `.env` dosyasını değiştirdikten sonra backend'i yeniden başlatmanız gerekebilir.

---

## 🐛 Sorun Giderme

### "Backend'e bağlanılamıyor" Hatası

1. Backend çalışıyor mu kontrol edin: Terminal'de "Server listening" mesajı görünmeli
2. `frontend/.env` dosyasında IP adresi doğru mu? (`192.168.1.14`)
3. Firewall port 5000'i engelliyor olabilir

### "CORS Error" Hatası

1. `backend/.env` dosyasında `CLIENT_URL` doğru mu?
2. Backend'i yeniden başlatın

### "Invalid credentials" Hatası

1. Email: `sara@prestalink.app` (rol seçimine göre otomatik dönüşür)
2. Şifre: `sara`
3. Doğru rolü seçtiğinizden emin olun

---

## 📱 Mobil Cihazdan Erişim

Aynı WiFi ağındaki telefon veya tablet'ten:

1. Tarayıcıyı açın
2. `http://192.168.1.14:3000` adresine gidin
3. Sara ile giriş yapın

---

## ✅ Başarı Kontrolü

Her rol için giriş yaptığınızda şu sayfalara yönlendirilmelisiniz:

- **User:** `/user/dashboard`
- **Recruiter:** `/employer/dashboard`
- **Admin:** `/admin/dashboard`

---

**Başarılar! 🎉**













