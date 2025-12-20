# 🚀 GitHub Push - Basit Çözüm

## ⚠️ Sorun
Cursor'da GitHub bağlı ama Git push için ayrı token gerekiyor.

## ✅ Çözüm: Personal Access Token

### ADIM 1: Token Oluştur (2 dakika)
1. https://github.com → Login (`saranurmemet`)
2. Profil → **Settings**
3. Sol menü → **Developer settings**
4. **Personal access tokens** → **Tokens (classic)**
5. **Generate new token (classic)**
6. **Note:** `prestalink-push`
7. **Expiration:** `90 days`
8. **Scopes:** ✅ **repo** (tüm repo yetkileri)
9. **Generate token**
10. **Token'ı kopyalayın** (bir daha gösterilmez!)

### ADIM 2: Push Yap
PowerShell'de:
```powershell
cd C:\Users\RANDOM\Desktop\prestalink
git push -u origin main
```

**Sorulduğunda:**
- **Username:** `saranurmemet`
- **Password:** Token'ı yapıştırın (şifre değil!)

---

## 🔄 Alternatif: Cursor Git Kullanma

Cursor'da Git panelini kullanabilirsiniz:
1. Cursor'da sol menüden **Source Control** (Git ikonu)
2. **Commit** yapın
3. **Push** butonuna tıklayın
4. Cursor GitHub token'ınızı kullanabilir

---

## ✅ Hızlı Test
Token oluşturduktan sonra push deneyin!


