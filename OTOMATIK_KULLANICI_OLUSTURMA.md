# 🤖 Otomatik Test Kullanıcısı Oluşturma

## ✅ Endpoint Eklendi ve Deploy Edildi

**Endpoint:** `POST /api/admin/create-algerian-user`

## 🚀 Otomatik Çalıştırma

### Yöntem 1: API Endpoint (Önerilen - Otomatik)

Backend deploy olduktan sonra (1-2 dakika), tarayıcıda veya Postman'de:

**URL:** `https://prestalink-backend.onrender.com/api/admin/create-algerian-user`

**Method:** `POST`

**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Body:** (Boş olabilir)

**Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "user": {
    "id": "...",
    "name": "Amina Benali",
    "email": "amina.benali@prestalink.app",
    "country": "Algeria",
    "city": "Algiers",
    "profession": "Textile Worker"
  }
}
```

### Yöntem 2: cURL (Terminal)

```bash
curl -X POST https://prestalink-backend.onrender.com/api/admin/create-algerian-user \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json"
```

### Yöntem 3: Render Shell

1. Render Dashboard → `prestalink-backend` → **Shell**
2. Komut:
   ```bash
   node scripts/create-algerian-user.js
   ```

---

## 📋 Oluşturulacak Kullanıcı

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
- **CV:** Eksiksiz CV içeriği

---

## ✅ Özellikler

- ✅ Kullanıcı zaten varsa günceller
- ✅ Kullanıcı yoksa oluşturur
- ✅ Eksiksiz profil bilgileri
- ✅ CV içeriği
- ✅ Sertifikalar
- ✅ Profil fotoğrafı
- ✅ Admin yetkisi gerekli

---

## 🔐 Güvenlik

- ✅ Sadece admin/superadmin kullanıcıları erişebilir
- ✅ Authentication token gerekli
- ✅ Database bağlantı kontrolü var

---

**Deploy edildi! Backend restart olduktan sonra (1-2 dakika) endpoint kullanılabilir.**

