# 🗄️ ADIM 1: MongoDB Atlas Kurulumu

## 📋 Şimdi Yapılacaklar

### 1.1. MongoDB Atlas Hesabı Oluşturma
1. Tarayıcıda açın: https://www.mongodb.com/cloud/atlas
2. **Try Free** butonuna tıklayın
3. **Sign Up** ile hesap oluşturun:
   - Google ile hızlı giriş (önerilen)
   - Veya email ile kayıt

### 1.2. Free Cluster Oluşturma
1. **Create a Deployment** butonuna tıklayın
2. **M0 FREE** seçeneğini seçin (512MB, ücretsiz)
3. **Provider:** AWS (veya istediğiniz)
4. **Region:** Frankfurt (veya size en yakın bölge)
5. **Cluster Name:** `prestalink-cluster` (veya istediğiniz)
6. **Create Deployment** tıklayın
7. ⏳ **3-5 dakika bekleyin** (cluster oluşturuluyor)

### 1.3. Database User Oluşturma
1. Sol menüden **Database Access** → **Add New Database User**
2. **Authentication Method:** Password
3. **Username:** `prestalink`
4. **Password:** Güçlü bir şifre oluşturun
   - Örnek: `PrestaLink2024!Secure`
   - **⚠️ Bu şifreyi kaydedin!** (bir daha gösterilmez)
5. **Database User Privileges:** Atlas admin (varsayılan)
6. **Add User** tıklayın

### 1.4. Network Access (ÖNEMLİ!)
1. Sol menüden **Network Access** → **Add IP Address**
2. **Add Current IP Address** tıklayın (kendi IP'niz için)
3. **Add IP Address** → **Allow Access from Anywhere**
   - IP Address: `0.0.0.0/0`
   - Comment: `Allow all IPs for Render`
4. **Confirm** tıklayın

### 1.5. Connection String Alma
1. Sol menüden **Database** → Cluster'ınıza tıklayın
2. **Connect** butonuna tıklayın
3. **Connect your application** seçeneğini seçin
4. **Driver:** Node.js, **Version:** 5.5 or later
5. Connection string'i kopyalayın:
   ```
   mongodb+srv://prestalink:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. **ÖNEMLİ:** `<password>` yerine 1.3'te oluşturduğunuz şifreyi yazın
7. Sonuna database adını ekleyin: `...mongodb.net/prestalink?retryWrites=true&w=majority`
8. **Tam connection string örneği:**
   ```
   mongodb+srv://prestalink:PrestaLink2024!Secure@cluster0.xxxxx.mongodb.net/prestalink?retryWrites=true&w=majority
   ```
9. **Bu string'i bir yere kaydedin** (Render'da kullanacağız)

---

## ✅ Kontrol Listesi

- [ ] MongoDB Atlas hesabı oluşturuldu
- [ ] M0 FREE cluster oluşturuldu (3-5 dakika beklendi)
- [ ] Database user oluşturuldu (username: `prestalink`)
- [ ] Network Access: `0.0.0.0/0` eklendi
- [ ] Connection string kopyalandı ve şifre ile dolduruldu

---

## 📝 Notlar

- Cluster oluşturma 3-5 dakika sürebilir
- Connection string'deki `<password>` mutlaka değiştirin
- Network Access `0.0.0.0/0` olmalı (Render için gerekli)

---

**Connection string'i aldıktan sonra bana verin, Vercel deployment'a geçeceğiz!** 🚀


