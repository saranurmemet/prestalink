# Google OAuth Kurulum Rehberi

## 📋 Adım Adım Kurulum

### 1. Google Cloud Console'da OAuth Consent Screen Ayarları

1. **APIs & Services → OAuth consent screen**'e gidin
2. **User Type**: "External" seçin → "Create"
3. **App bilgilerini doldurun**:
   - App name: `PrestaLink`
   - User support email: Kendi email'inizi seçin
   - Developer contact information: Email adresiniz
4. **Save and Continue** (Scopes kısmını atlayabilirsiniz)
5. **Test users** kısmını atlayın → **Save and Continue**
6. **Summary** → **Back to Dashboard**

### 2. OAuth 2.0 Client ID Oluşturma

1. **APIs & Services → Credentials**'a gidin
2. **+ CREATE CREDENTIALS** → **OAuth client ID** seçin
3. **Application type**: "Web application" seçin
4. **Name**: `PrestaLink Web Client` (veya istediğiniz isim)
5. **Authorized JavaScript origins** bölümüne ekleyin:
   ```
   http://localhost:3000
   https://prestalink.vercel.app
   ```
   (Production domain'inizi de ekleyin)
6. **Authorized redirect URIs**: Şimdilik boş bırakabilirsiniz
7. **CREATE** butonuna tıklayın
8. **Açılan popup'tan Client ID'yi kopyalayın** (Client Secret gerekmez)

### 3. Environment Variables Ayarlama

#### Backend (Render.com)
1. Render Dashboard → Projeniz → **Environment**
2. **Add Environment Variable**:
   - **Key**: `GOOGLE_CLIENT_ID`
   - **Value**: Kopyaladığınız Client ID
   - **Save Changes**

#### Frontend (Vercel)
1. Vercel Dashboard → Projeniz → **Settings** → **Environment Variables**
2. **Add New**:
   - **Key**: `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
   - **Value**: Aynı Client ID (Client ID aynı, Secret değil!)
   - **Environment**: Production, Preview, Development (hepsini işaretleyin)
   - **Save**

### 4. Deploy

Render ve Vercel otomatik olarak yeni environment variable'lar ile deploy edecektir.

### 5. Test

1. Login sayfasına gidin
2. "Google ile devam et" butonunu görmelisiniz
3. Google hesabınızla giriş yapmayı deneyin

## 🔍 Sorun Giderme

### Google butonu görünmüyor
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` environment variable'ının doğru ayarlandığından emin olun
- Frontend'i yeniden deploy edin

### "Invalid client" hatası
- Client ID'nin doğru kopyalandığından emin olun
- Backend'de `GOOGLE_CLIENT_ID` environment variable'ının ayarlandığını kontrol edin

### "Redirect URI mismatch" hatası
- Google Cloud Console'da **Authorized JavaScript origins** listesinde domain'inizin olduğundan emin olun

## 📝 Notlar

- **Client ID** hem frontend hem backend için aynı olmalıdır
- **Client Secret** gerekmez (Google Sign-In için)
- Local development için `http://localhost:3000` mutlaka eklenmelidir
- Production domain'inizi de eklemeyi unutmayın

