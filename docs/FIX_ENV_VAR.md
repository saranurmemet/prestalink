# Environment Variable Sorun Giderme

## Sorun: `GOOGLE_CLIENT_ID: ❌ NOT SET`

Environment variable Vercel'de var gibi görünüyor ama build zamanında yüklenmiyor.

## Çözüm Adımları:

### 1. Vercel'de Environment Variable'ı Kontrol ve Yeniden Ekle

1. Vercel Dashboard → Projeniz → **Settings** → **Environment Variables**
2. `NEXT_PUBLIC_GOOGLE_CLIENT_ID` değişkenini bulun
3. **Silin** (Delete butonuna tıklayın)
4. **Yeniden ekleyin:**
   - Key: `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
   - Value: `982228234850-4g4pm60faau0gkpsg9ovt3221elrtj98.apps.googleusercontent.com`
   - **Environments: Production, Preview, Development** (HEPSİNİ işaretleyin!)
   - Save

### 2. Scope Kontrolü

Environment variable'ın **Production, Preview, ve Development** için hepsinde aktif olduğundan emin olun.

### 3. Yeniden Deploy

Environment variable'ı yeniden ekledikten sonra mutlaka yeni bir deployment başlatın:
- Boş commit push edin
- Veya Vercel Dashboard → Deployments → Redeploy
