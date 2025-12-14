# 🔧 GitHub Push Sorunu Çözümü

## Sorun
Git eski kullanıcı adı (memetsaranur) ile push yapmaya çalışıyor ama yeni repository saranurmemet kullanıcısına ait.

## Çözüm 1: Windows Credential Manager'dan Eski Bilgileri Silme

1. **Windows Credential Manager'ı açın:**
   - Windows tuşu + R
   - `control /name Microsoft.CredentialManager` yazın
   - Enter

2. **Windows Credentials** sekmesine gidin

3. **GitHub** ile ilgili tüm kayıtları bulun ve silin:
   - `git:https://github.com`
   - `github.com` ile ilgili kayıtlar

4. **Sil** butonuna tıklayın

5. Tekrar push deneyin:
   ```powershell
   git push -u origin main
   ```

6. GitHub kullanıcı adı ve şifre soracak:
   - **Username:** `saranurmemet`
   - **Password:** GitHub Personal Access Token (şifre değil!)

## Çözüm 2: Personal Access Token Oluşturma

Eğer şifre çalışmazsa Personal Access Token kullanın:

1. GitHub → Sağ üstte profil → **Settings**
2. Sol menüden **Developer settings**
3. **Personal access tokens** → **Tokens (classic)**
4. **Generate new token (classic)**
5. **Note:** `prestalink-deploy`
6. **Expiration:** 90 days (veya istediğiniz)
7. **Scopes:** `repo` işaretleyin (tüm repo yetkileri)
8. **Generate token**
9. **Token'ı kopyalayın** (bir daha gösterilmez!)

10. Push yaparken:
    - **Username:** `saranurmemet`
    - **Password:** Kopyaladığınız token'ı yapıştırın

## Çözüm 3: SSH Kullanma (Alternatif)

SSH key kullanarak da yapabilirsiniz, ama şimdilik Personal Access Token daha hızlı.

---

## Hızlı Komut

Credential Manager'dan temizledikten sonra:
```powershell
cd C:\Users\RANDOM\Desktop\prestalink
git push -u origin main
```

GitHub kullanıcı adı ve token soracak.
