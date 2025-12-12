# 🚀 Otomatik Giriş Talimatları

## Yöntem 1: Tarayıcı Console'unda Script Çalıştırma

1. Tarayıcıda **F12** tuşuna basın (Developer Tools)
2. **Console** sekmesine gidin
3. Aşağıdaki kodu yapıştırın ve **Enter** tuşuna basın:

```javascript
// Admin rolünü seç
const adminButton = Array.from(document.querySelectorAll('button')).find(btn => 
  btn.textContent.toLowerCase().includes('admin') || btn.textContent.toLowerCase().includes('yönetici')
);

if (adminButton) {
  adminButton.click();
  setTimeout(() => {
    const emailInput = document.querySelector('input[name="email"]');
    const passwordInput = document.querySelector('input[name="password"]');
    const submitButton = document.querySelector('button[type="submit"]');
    
    if (emailInput && passwordInput) {
      emailInput.value = 'sara@prestalink.app';
      passwordInput.value = 'sara';
      emailInput.dispatchEvent(new Event('input', { bubbles: true }));
      passwordInput.dispatchEvent(new Event('input', { bubbles: true }));
      
      setTimeout(() => submitButton?.click(), 500);
      console.log('✅ Giriş yapıldı!');
    }
  }, 1000);
}
```

## Yöntem 2: Manuel Giriş (Daha Kolay)

1. Login sayfasında **Admin** kartına tıklayın
2. Email: `sara@prestalink.app`
3. Şifre: `sara`
4. **Giriş Yap** butonuna tıklayın

## Giriş Bilgileri

- **Email:** `sara@prestalink.app`
- **Şifre:** `sara`
- **Rol:** Admin

