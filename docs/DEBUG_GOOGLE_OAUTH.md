# Google OAuth Debug Adımları

## 1. Build Loglarını Kontrol

Vercel Dashboard → Deployments → En son deployment (98a8e35) → Build Logs

Arama yapın:
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
- `Loaded env`
- `Environment variables`

## 2. Browser Console Kontrol

Login sayfasında F12 → Console sekmesi → şunu yazın:
```javascript
console.log(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID)
```

Eğer `undefined` görünüyorsa, environment variable build'e dahil olmamış.

## 3. Network Tab Kontrol

F12 → Network → Google Login butonu render edilirken bir hata var mı kontrol edin.

## 4. Kod Kontrol

`app/login/page.tsx` dosyasında:
- Line 355: `{process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && (`
- Bu kontrol client-side'da yapılıyor, bu doğru.

## 5. AppProviders Kontrol

`components/providers/AppProviders.tsx` dosyasında:
- Line 9: `const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';`
- Line 14: `{GOOGLE_CLIENT_ID ? (`
- Eğer boş string ise, GoogleOAuthProvider render edilmeyecek.

