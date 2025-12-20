# 🔐 GitHub Kimlik Doğrulama Rehberi

## 📋 ADIM 1: Personal Access Token Oluşturma

### 1.1. GitHub'a Giriş
1. https://github.com → **Login** (saranurmemet hesabıyla)
2. Sağ üstte profil fotoğrafı → **Settings**

### 1.2. Developer Settings
1. Sol menüden en alta kaydırın
2. **Developer settings** tıklayın

### 1.3. Personal Access Tokens
1. **Personal access tokens** → **Tokens (classic)**
2. **Generate new token** → **Generate new token (classic)**

### 1.4. Token Ayarları
- **Note:** `prestalink-deploy` (açıklama)
- **Expiration:** `90 days` (veya istediğiniz süre)
- **Scopes:** Aşağıdakileri işaretleyin:
  - ✅ **repo** (tüm repo yetkileri)
    - ✅ repo:status
    - ✅ repo_deployment
    - ✅ public_repo
    - ✅ repo:invite
    - ✅ security_events

### 1.5. Token Oluştur
1. **Generate token** butonuna tıklayın
2. **⚠️ ÖNEMLİ:** Token'ı hemen kopyalayın (bir daha gösterilmez!)
3. Token'ı güvenli bir yere kaydedin

**Token örneği:** `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

---

## 📋 ADIM 2: Windows Credential Manager Temizleme

### 2.1. Credential Manager Açma
1. **Windows tuşu + R**
2. Şunu yazın: `control /name Microsoft.CredentialManager`
3. **Enter**

### 2.2. Eski GitHub Bilgilerini Silme
1. **Windows Credentials** sekmesine gidin
2. **GitHub** ile ilgili kayıtları bulun:
   - `git:https://github.com`
   - `github.com`
3. Her birine tıklayın → **Remove** veya **Delete**
4. Tüm GitHub kayıtlarını silin

---

## 📋 ADIM 3: Git Push Yapma

### 3.1. PowerShell'de Push
```powershell
cd C:\Users\RANDOM\Desktop\prestalink
git push -u origin main
```

### 3.2. Kimlik Doğrulama
Git size soracak:

1. **Username for 'https://github.com':**
   - `saranurmemet` yazın
   - Enter

2. **Password for 'https://saranurmemet@github.com':**
   - ⚠️ **Şifre değil!** Personal Access Token'ı yapıştırın
   - Token'ı kopyalayıp yapıştırın
   - Enter

### 3.3. Başarılı!
Push başarılı olursa:
```
Enumerating objects: ...
Writing objects: 100% ...
To https://github.com/saranurmemet/prestalink.git
 * [new branch]      main -> main
Branch 'main' set up to track 'remote branch 'main' from 'origin'.
```

---

## 🔧 Alternatif: Git Credential Helper

Eğer her seferinde token girmek istemiyorsanız:

```powershell
# Token'ı cache'le (1 saat)
git config --global credential.helper wincred

# Veya süresiz (güvenli değil, sadece kendi bilgisayarınızda)
git config --global credential.helper store
```

---

## ❌ Sorun Giderme

### "Permission denied" hatası
- ✅ Token doğru mu?
- ✅ `repo` scope seçildi mi?
- ✅ Eski credential'lar silindi mi?

### "Authentication failed" hatası
- ✅ Username: `saranurmemet` (doğru mu?)
- ✅ Password: Token (şifre değil!)

### Token çalışmıyor
- ✅ Token'ın süresi dolmuş olabilir
- ✅ Yeni token oluşturun
- ✅ `repo` scope'unu kontrol edin

---

## ✅ Başarı Kontrolü

Push başarılı olduktan sonra:
1. https://github.com/saranurmemet/prestalink adresine gidin
2. Dosyalarınız görünüyor mu? ✅
3. "Initial commit" mesajı görünüyor mu? ✅

**BAŞARILAR!** 🎉


