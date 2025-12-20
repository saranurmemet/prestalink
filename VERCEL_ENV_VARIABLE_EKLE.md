# ⚡ Vercel Environment Variable Ekleme - Hızlı Adımlar

## 🎯 Sorun
Backend çalışıyor ✅ (`https://prestalink-backend.onrender.com`)
Frontend backend'e bağlanamıyor ❌

**Çözüm:** Vercel'de `NEXT_PUBLIC_API_URL` environment variable ekleyin.

---

## 📋 ADIM ADIM (2 Dakika)

### 1. Vercel Dashboard'a Gidin
https://vercel.com/dashboard

### 2. Projeyi Seçin
- `prestalink` veya `prestalink-theta` projesini bulun
- Projeye tıklayın

### 3. Settings'e Gidin
- Sol menüden **Settings** seçin
- **Environment Variables** sekmesine tıklayın

### 4. Yeni Variable Ekleyin
- **Add New** butonuna tıklayın
- **Key:** `NEXT_PUBLIC_API_URL`
- **Value:** `https://prestalink-backend.onrender.com/api`
- **Environments:** 
  - ✅ Production
  - ✅ Preview  
  - ✅ Development
  - (Hepsini seçin)
- **Save** tıklayın

### 5. Redeploy Yapın
- **Deployments** sekmesine gidin
- En son deployment'ı bulun
- **...** (üç nokta) menüsüne tıklayın
- **Redeploy** seçin
- Deployment'ın bitmesini bekleyin (1-2 dakika)

---

## ✅ Test

Deployment bittikten sonra:
1. https://prestalink-theta.vercel.app/login adresine gidin
2. Login deneyin
3. Artık backend'e bağlanabilmeli!

---

## 🔍 Kontrol

Browser console'u açın (F12) ve şunu kontrol edin:
- Network sekmesinde API istekleri görünüyor mu?
- Hata mesajları var mı?

Eğer hala hata varsa, console'daki hata mesajını kontrol edin.


