# 📱 PWA Cache Temizleme Rehberi

## 🔄 Telefonda Güncellemeleri Görmek İçin

Uygulama telefonunuza PWA olarak yüklendiyse ve yeni değişiklikleri görmüyorsanız, aşağıdaki adımları izleyin:

### ✅ Yöntem 1: Uygulamayı Yeniden Yükle (Önerilen)

1. **Telefonunuzda uygulamayı açın**
2. **Tarayıcı menüsünü açın** (3 nokta veya menü butonu)
3. **"Uygulamayı Kaldır"** veya **"Uninstall"** seçeneğini bulun
4. Uygulamayı kaldırın
5. **Tarayıcıdan tekrar açın**: `http://192.168.1.14:3000` veya Vercel URL'i
6. **"Ana Ekrana Ekle"** veya **"Add to Home Screen"** seçeneğini tekrar kullanın

### ✅ Yöntem 2: Cache'i Manuel Temizle

#### Android (Chrome):
1. Chrome'u açın
2. **Ayarlar** → **Gizlilik ve Güvenlik** → **Site Ayarları**
3. **"Depolama"** veya **"Storage"** seçeneğine gidin
4. **"Verileri Temizle"** veya **"Clear Data"** butonuna tıklayın
5. Uygulamayı yeniden açın

#### iOS (Safari):
1. **Ayarlar** → **Safari**
2. **"Web Sitesi Verilerini Temizle"** veya **"Clear Website Data"**
3. Uygulamayı yeniden açın

### ✅ Yöntem 3: Service Worker'ı Devre Dışı Bırak

1. Uygulamayı tarayıcıdan açın (PWA değil, normal web sitesi olarak)
2. **F12** veya **Developer Tools** açın
3. **Application** sekmesine gidin
4. Sol menüden **Service Workers** seçin
5. **Unregister** butonuna tıklayın
6. **Clear Storage** → **Clear site data** yapın
7. Sayfayı yenileyin (Ctrl+F5 veya Cmd+Shift+R)

### ✅ Yöntem 4: Hard Refresh (Geçici Çözüm)

- **Android**: Uzun basın → **"Sayfayı Yenile"** veya **"Reload"**
- **iOS**: Uzun basın → **"Reload"**

### 🔧 Otomatik Güncelleme

Uygulama artık otomatik olarak yeni versiyonları kontrol ediyor. Yeni bir güncelleme olduğunda:
- Uygulama açıldığında **"Yeni versiyon mevcut!"** bildirimi göreceksiniz
- **"Yenile"** butonuna tıklayarak güncelleyebilirsiniz

## 📝 Notlar

- **Development modunda** PWA devre dışıdır (cache yok)
- **Production build**'de PWA aktif olur
- Her yeni deploy'da `manifest.json` versiyonu güncellenir
- Service worker otomatik olarak güncellenir

## 🚀 Yeni Deploy Sonrası

1. Vercel'de yeni deploy tamamlandıktan sonra
2. Telefonunuzda uygulamayı açın
3. Otomatik güncelleme bildirimi gelecektir
4. Veya uygulamayı kaldırıp yeniden yükleyin

---

**Son Güncelleme**: Service worker güncelleme mekanizması eklendi (v2.0.0)

