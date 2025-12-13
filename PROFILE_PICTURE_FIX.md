# Profil Resmi Yükleme Özelliği Çözümü

## Problem (Sorun)

Uygulama kullanıcıların profil resmi yüklemesi için frontend arayüzüne sahip olmasına rağmen, bu işlemi gerçekleştirmek için gerekli backend API endpointine sahip değildi.

- ✅ **Frontend**: Profil sayfasında resim yükleme butonu mevcut
- ❌ **Backend**: Profile güncelleme için API endpoint yoktu
- 📄 **Multer**: Dosya yükleme altyapısı konfigüre edilmişti ama kullanılmıyordu

## Çözüm (Solution)

### 1. Backend Controller (`authController.js`)
**Yeni fonksiyon eklendi**: `updateProfile()`

```javascript
exports.updateProfile = asyncHandler(async (req, res) => {
  // Kullanıcı profil bilgilerini günceller:
  // - Kişisel bilgiler (ad, telefon, ülke, deneyim seviyesi, bio)
  // - Diller (multiple)
  // - Şirket bilgileri (recruiter için)
  // - Dosyalar (profil resmi, CV, sertifikalar)
});
```

**Desteklenen alanlar:**
- `name` - Kullanıcı adı
- `phone` - Telefon numarası
- `country` - Ülke
- `experienceLevel` - Deneyim seviyesi
- `bio` - Biyografi
- `languages[]` - Diller (array)
- `profilePhoto` - Profil resmi (dosya)
- `cv` - CV/Resume (dosya)
- `certificates[]` - Sertifikalar (dosyalar)
- `companyName` - Şirket adı (recruiter)
- `companyDescription` - Şirket açıklaması
- `industry` - Sektör
- `city` - Şehir

### 2. Backend Route (`authRoutes.js`)
**Yeni endpoint eklendi**: `PUT /api/auth/me`

```javascript
router.put('/me', 
  authMiddleware,  // Sadece oturum açmış kullanıcılar
  upload.fields([  // Multer konfigürasyonu
    { name: 'profilePhoto', maxCount: 1 },
    { name: 'cv', maxCount: 1 },
    { name: 'certificates', maxCount: 10 }
  ]),
  updateProfile  // Controller
);
```

**Dosya yükleme özellikleri:**
- Profil Resmi: 1 dosya, sadece PNG/JPG/JPEG
- CV: 1 dosya, sadece PDF/DOCX/DOC
- Sertifikalar: 10 dosyaya kadar, PDF/DOCX/DOC
- Maksimum dosya boyutu: 5MB
- Klasör yapısı:
  - Profil resimleri: `/uploads/profilePhotos/`
  - CVler: `/uploads/cvs/`
  - Sertifikalar: `/uploads/certificates/`

### 3. Multer Konfigürasyonu (`upload.js`)
**Değişiklik:**
- Sertifikalar fieldname: `certificate` → `certificates`
- Export metodu: `module.exports = upload` (önceki applicationRoutes ile uyumlu)

## Frontend Entegrasyonu

Frontend `/frontend/app/user/profile/page.tsx` ve `/frontend/app/employer/profile/page.tsx` sayfaları zaten doğru şekilde yapılandırılmıştır:

```typescript
// Profil resmi
const [profilePhoto, setProfilePhoto] = useState<File | null>(null);

// Form gönderimi
const submitData = new FormData();
if (profilePhoto) submitData.append('profilePhoto', profilePhoto);
// ... diğer alanlar
await updateProfile(submitData);
```

Frontend API servisinde de `updateProfile` fonksiyonu mevcut:
```typescript
export const updateProfile = (data: FormData) =>
  api.put<{ user: User }>(API_ROUTES.auth.me, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
```

## API Testi

### cURL ile test:
```bash
curl -X PUT http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "name=John Doe" \
  -F "profilePhoto=@/path/to/photo.jpg" \
  -F "bio=My bio" \
  -F "languages[]=EN" \
  -F "languages[]=TR"
```

### Postman ile test:
1. Request Type: `PUT`
2. URL: `http://localhost:5000/api/auth/me`
3. Headers: `Authorization: Bearer YOUR_TOKEN`
4. Body: 
   - Form-data seçin
   - `profilePhoto` → File seçin
   - `name` → Metin
   - `languages[]` → Metin (repeatable)
   - Diğer alanları gerektiği gibi doldur

## Cevap Örneği (Response)

```json
{
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "country": "Turkey",
    "profilePhoto": "/uploads/profilePhotos/1702511234567-photo.jpg",
    "bio": "My bio",
    "languages": ["EN", "TR"],
    "experienceLevel": "Senior",
    "cvUrl": "/uploads/cvs/1702511234567-cv.pdf",
    "certificates": [
      "/uploads/certificates/1702511234567-cert1.pdf"
    ],
    "createdAt": "2023-12-13T10:00:00.000Z",
    "updatedAt": "2023-12-13T10:05:00.000Z"
  },
  "message": "Profile updated successfully"
}
```

## Değişiklik Yapılan Dosyalar

1. **`backend/controllers/authController.js`**
   - ✅ `exports.updateProfile` fonksiyonu eklendi

2. **`backend/routes/authRoutes.js`**
   - ✅ `updateProfile` import edildi
   - ✅ `upload` import edildi
   - ✅ `router.put('/me', ...)` route eklendi

3. **`backend/utils/upload.js`**
   - ✅ `fileFilter` içinde `'certificate'` → `'certificates'` değiştirildi (consistency)

## Nasıl Çalışıyor?

### Akış:
```
Kullanıcı profil sayfasında resim seçer
        ↓
Frontend FormData oluşturur ve PUT /api/auth/me gönderir
        ↓
Backend authMiddleware kullanıcıyı doğrular
        ↓
Multer dosyaları /uploads/profilePhotos/ klasörüne kaydeder
        ↓
updateProfile controller dosya yollarını veritabanına kaydeder
        ↓
Frontend kullanıcı datasını günceller ve resim gösterilir
```

### Profil Resmi Görüntüleme:
Frontend dashboard ve profil sayfasında kullanıcı resmi gösterilir:

```jsx
<img
  src={user?.profilePhoto || 'https://i.pravatar.cc/150?img=12'}
  alt={user?.name || 'Profile'}
  className="w-24 h-24 rounded-full"
/>
```

- Eğer `profilePhoto` varsa: `/uploads/profilePhotos/timestamp-filename.jpg` 
- Yoksa: Placeholder gravatar resmi

## Ek Notlar

- ✅ Token-based authentication (JWT) ile korumalı
- ✅ Role-based access control (authenticated users only)
- ✅ Dosya boyutu ve tip validasyonu
- ✅ Multer error handling
- ✅ Veritabanı senkronizasyonu
- ✅ Statik dosya servisi (express.static) konfigüre
- ✅ CORS ve multipart/form-data desteği

## Sonraki Adımlar

1. **Production deployment** için:
   - CDN/Cloud Storage (AWS S3, Google Cloud Storage) entegrasyonu düşünün
   - Yerel dosya yükleme (current) production'da sorunlar yaşayabilir

2. **Optimizasyonlar**:
   - Resim sıkıştırma/resize
   - Thumbnail oluşturma
   - Cache headers ayarlama

3. **İlave özellikler**:
   - Profil resmi kırpma (crop)
   - Multiple profil resmi
   - Resim silme/değiştirme
