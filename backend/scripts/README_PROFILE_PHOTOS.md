# 🔒 PROFİL FOTOĞRAFLARI KİLİTLİDİR

## ⚠️ ÖNEMLİ UYARI

Bu klasördeki `lock-profile-photos.js` script'i demo kullanıcılarının profil fotoğraflarını **kalıcı olarak kilitler**.

## 🚫 DEĞİŞTİRİLEMEZ KURAL

**Profil fotoğrafları `backend/uploads/profile-photos/` klasöründen çağrılır.**
**Bu bir kuraldır ve HİÇ DEĞİŞMEZ!**

Aşağıdaki dosyalar **DEĞİŞTİRİLEMEZ**:

- `lock-profile-photos.js` - Profil fotoğraflarını kilitleyen script
- `setup-demo-profiles.js` - İçindeki profil fotoğrafı yolları
- `backend/uploads/profile-photos/` - Profil fotoğrafları klasörü

## 📋 KİLİTLİ PROFİL FOTOĞRAFLARI

| Kullanıcı | Email | Profil Fotoğrafı Dosyası |
|-----------|-------|--------------------------|
| Mehmet Demir | mehmet@prestalink.app | `backend/uploads/profile-photos/mehmet.png` |
| Ahmet Suriye | ahmet@prestalink.app | `backend/uploads/profile-photos/ahmet.png` |
| Sara Soley | sara@prestalink.app | `backend/uploads/profile-photos/sara.png` |
| Sarad Kaşgarlı | sarad@prestalink.app | `backend/uploads/profile-photos/sarad.png` |

## 📁 DOSYA YAPISI

```
backend/
  uploads/
    profile-photos/
      mehmet.png
      ahmet.png
      sara.png
      sarad.png
```

## 🔧 KULLANIM

Profil fotoğraflarını geri getirmek için:

```bash
cd backend
npm run lock-photos
```

veya

```bash
cd backend
node scripts/lock-profile-photos.js
```

## ⚙️ OTOMATIK KORUMA

`setup-demo-profiles.js` script'i her çalıştığında profil fotoğrafları otomatik olarak korunur.

## 🛡️ KORUMA MEKANİZMASI

1. `lock-profile-photos.js` script'i her çalıştığında fotoğrafları kontrol eder
2. Eğer fotoğraflar değişmişse, otomatik olarak orijinal fotoğraflara geri döndürür
3. `markModified()` kullanılarak MongoDB'de zorla kaydedilir
4. Fotoğraflar **YEREL DOSYALAR** olarak `backend/uploads/profile-photos/` klasöründen çağrılır

## 📝 NOT

- Bu dosyaları değiştirmek **YASAKTIR**
- Profil fotoğrafları demo kullanıcıları için kritik öneme sahiptir
- Fotoğraflar **YEREL DOSYALAR** olarak saklanır, harici URL'ler kullanılmaz
- Bu bir **KURALDIR** ve **HİÇ DEĞİŞMEZ**

