# Environment Variable Kontrolü

## Vercel'de Kontrol Edin:

1. Vercel Dashboard → Projeniz → **Settings** → **Environment Variables**

2. `NEXT_PUBLIC_GOOGLE_CLIENT_ID` değişkeninin:
   - ✅ Key: `NEXT_PUBLIC_GOOGLE_CLIENT_ID` (tam olarak böyle)
   - ✅ Value: `982228234850-4g4pm60faau0gkpsg9ovt3221elrtj98.apps.googleusercontent.com`
   - ✅ Environments: **Production, Preview, Development** (üçü de işaretli olmalı)

3. Eğer sadece "Production" işaretliyse, Preview ve Development'a da ekleyin.

## Build Loglarında Arama:

Build loglarında şunları arayın:
- `NEXT_PUBLIC`
- `GOOGLE_CLIENT_ID`
- `Loaded env`
- `Environment variables`

## Eğer Environment Variable Yoksa:

1. Vercel Dashboard → Settings → Environment Variables
2. "Add New" ile ekleyin
3. **Yeniden deploy** yapın (boş commit push edin)
