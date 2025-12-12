# PrestaLink 🌐

International Talent Platform for global talent and EU recruiters. A modern hiring, job-matching, and document management platform.

## 📋 Özellikler

- 🌍 **Çoklu Dil Desteği**: Türkçe, İngilizce, Fransızca, Arapça
- 👥 **Çoklu Rol Sistemi**: User, Recruiter, Admin, Superadmin
- 💼 **İş İlanı Yönetimi**: Detaylı iş ilanları oluşturma ve yönetme
- 📝 **Başvuru Sistemi**: CV ve sertifika yükleme
- 🔔 **Bildirim Sistemi**: Gerçek zamanlı bildirimler
- 🔐 **Güvenli Kimlik Doğrulama**: JWT tabanlı authentication
- 📱 **Modern UI/UX**: Responsive ve kullanıcı dostu arayüz

## 🏗️ Teknoloji Stack

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- Multer (File Uploads)
- Bcrypt (Password Hashing)

### Frontend
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Zustand (State Management)
- Axios (HTTP Client)

## 🚀 Hızlı Başlangıç

### Ön Gereksinimler

- Node.js v16+
- npm veya yarn
- MongoDB (yerel veya cloud)

### Kurulum

1. **Backend Kurulumu:**
```bash
cd backend
npm install
cp .env.example .env
# .env dosyasını düzenleyin
npm run dev
```

2. **Frontend Kurulumu:**
```bash
cd frontend
npm install
cp .env.example .env.local
# .env.local dosyasını düzenleyin
npm run dev
```

3. **Veritabanı Seed (İsteğe Bağlı):**
```bash
cd backend
npm run seed
```

## 📁 Proje Yapısı

```
prestalink/
├── backend/                 # Backend API
│   ├── config/             # Konfigürasyon dosyaları
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Auth ve error middleware
│   ├── models/             # Mongoose modelleri
│   ├── routes/             # API routes
│   ├── scripts/            # Utility script'ler
│   ├── uploads/            # Yüklenen dosyalar
│   └── utils/              # Yardımcı fonksiyonlar
├── frontend/               # Frontend uygulaması
│   ├── app/                # Next.js App Router pages
│   ├── components/         # React component'leri
│   ├── services/           # API servisleri
│   ├── store/              # Zustand store'ları
│   └── locales/            # Çeviri dosyaları
└── README.md               # Bu dosya
```

## 🔑 Environment Variables

### Backend (.env)

```env
MONGO_URI=mongodb://localhost:27017/prestalink
JWT_SECRET=your-super-secret-jwt-key
PORT=5000
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 🎯 Kullanım

### Test Kullanıcıları (Seed sonrası)

- **User**: `candidate@prestalink.dev` / `Test123!`
- **Recruiter**: `recruiter@prestalink.dev` / `Test123!`
- **Admin**: `admin@prestalink.dev` / `Test123!`

### API Endpoints

- `GET /api/jobs` - Tüm iş ilanları
- `POST /api/auth/login` - Giriş yap
- `POST /api/auth/register` - Kayıt ol
- `POST /api/applications` - Başvuru gönder
- Daha fazlası için [backend/README.md](./backend/README.md)

## 📚 Dokümantasyon

- [Backend README](./backend/README.md) - Backend API dokümantasyonu

## 🛠️ Geliştirme

### Backend Development

```bash
cd backend
npm run dev      # Development mode (nodemon)
npm start        # Production mode
npm run seed     # Seed database
```

### Frontend Development

```bash
cd frontend
npm run dev      # Development mode
npm run build    # Production build
npm start        # Production mode
npm run lint     # ESLint
```

## 🔒 Güvenlik

- ✅ JWT tabanlı authentication
- ✅ Bcrypt ile şifre hashleme
- ✅ CORS konfigürasyonu
- ✅ File upload validasyonu
- ✅ Environment variables ile güvenli konfigürasyon

## 🌐 Çoklu Dil Desteği

Proje şu dilleri destekler:
- 🇬🇧 English (EN)
- 🇹🇷 Türkçe (TR)
- 🇫🇷 Français (FR)
- 🇸🇦 العربية (AR)

Dil değiştirme header'daki dil switcher ile yapılabilir.

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/AmazingFeature`)
3. Commit edin (`git commit -m 'Add some AmazingFeature'`)
4. Push edin (`git push origin feature/AmazingFeature`)
5. Pull Request açın

## 📝 Lisans

Bu proje ISC lisansı altındadır.

## 👥 Ekip

PrestaLink Development Team

## 📞 İletişim

Sorularınız için issue açabilirsiniz.

---

**Versiyon**: 1.0.0
**Son Güncelleme**: 2024
