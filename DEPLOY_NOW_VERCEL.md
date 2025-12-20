# 🎨 ADIM 2: Vercel Frontend Deployment

## 📋 Şimdi Yapılacaklar

### 2.1. Vercel Hesabı
1. Tarayıcıda açın: https://vercel.com
2. **Sign Up** tıklayın
3. **Continue with GitHub** seçin (önerilen)
4. GitHub hesabınızı yetkilendirin (`saranurmemet`)
5. Vercel hesabınız hazır! ✅

### 2.2. Proje Oluşturma
1. Vercel Dashboard → **Add New...** → **Project**
2. **Import Git Repository** sekmesinde
3. GitHub repository'nizi bulun: `prestalink`
4. **Import** butonuna tıklayın

### 2.3. Project Ayarları (ÖNEMLİ!)

**Framework Preset:**
- Otomatik olarak **Next.js** algılanacak ✅

**Root Directory:**
- ⚠️ **ÖNEMLİ:** Varsayılan: `.` (root)
- **Değiştirin:** `frontend` yazın
- Bu çok önemli! Frontend klasörünü seçmek için

**Build Command:**
- Otomatik: `npm run build` ✅

**Output Directory:**
- Otomatik: `.next` ✅

**Install Command:**
- Otomatik: `npm install` ✅

### 2.4. Environment Variables (Geçici)
**Deploy butonuna tıklamadan önce:**

1. **Environment Variables** sekmesine gidin
2. **Add** butonuna tıklayın
3. Şunu ekleyin:
   - **Key:** `NEXT_PUBLIC_API_URL`
   - **Value:** `http://localhost:5000/api` (geçici, sonra güncelleyeceğiz)
   - **Environments:** 
     - ✅ Production
     - ✅ Preview
     - ✅ Development
     - (Hepsini seçin)
4. **Save** tıklayın

### 2.5. Deploy
1. **Deploy** butonuna tıklayın
2. ⏳ Build işlemini bekleyin (1-2 dakika)
3. ✅ Deployment tamamlandığında:
   - **Visit** butonuna tıklayın veya
   - URL'i kopyalayın: `https://prestalink.vercel.app` (veya Vercel'in verdiği domain)
4. **Bu URL'i bir yere kaydedin** (Render'da kullanacağız)

---

## ✅ Kontrol Listesi

- [ ] Vercel hesabı oluşturuldu (GitHub ile)
- [ ] Proje oluşturuldu (`prestalink` repository)
- [ ] Root Directory: `frontend` olarak ayarlandı
- [ ] Environment Variable eklendi: `NEXT_PUBLIC_API_URL` = `http://localhost:5000/api`
- [ ] Deploy başlatıldı
- [ ] Build başarılı
- [ ] Frontend URL kopyalandı

---

## 📝 Notlar

- Root Directory `frontend` olmalı (çok önemli!)
- Build 1-2 dakika sürebilir
- İlk deploy preview'dur, production'a promote edilebilir
- Environment variable geçici, Render deploy'dan sonra güncelleyeceğiz

---

**Frontend URL'i aldıktan sonra bana verin, Render backend deployment'a geçeceğiz!** 🚀


