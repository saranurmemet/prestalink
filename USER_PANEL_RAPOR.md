# User Paneli Kontrol Raporu

**Tarih:** 12 Şubat 2025  
**Kapsam:** `frontend/app/user/*` — tüm kullanıcı sayfaları, navigasyon, çeviriler ve veri akışı.

---

## 1. Sayfa Özeti

| Sayfa | Route | Durum | Not |
|-------|--------|--------|-----|
| Dashboard | `/user/dashboard` | ✅ | Profil tamamlanma, rozetler, CV/başvuru/ilan/bildirim kartları, hızlı aksiyonlar, önerilen işler |
| Profil | `/user/profile` | ✅ | Form, fotoğraf/CV/sertifika yükleme, tamamlanma çubuğu, t() kullanımı |
| CV | `/user/cv` | ✅ | `user.cvContent` / boş durum / indirme; çeviri key'leri kullanılıyor |
| İş İlanları | `/user/jobs` | ✅ | Arama/filtre, `userJobs.clear` çevirisi mevcut |
| İş Detay | `/user/jobs/[id]` | ⚠️ | Bazı sabit Türkçe metinler (aşağıda) |
| Başvurularım | `/user/applications` | ⚠️ | Tarih dil sabit TR; fallback metinler Türkçe |
| Favoriler | `/user/favorites` | ⚠️ | "Detaylar" sabit Türkçe; localStorage tabanlı |
| Mesajlar | `/user/messages` | ⚠️ | Sahte veri; tarih locale sabit TR |
| Bildirimler | `/user/notifications` | ⚠️ | relativeTime metinleri sabit Türkçe; "bildirim" sabit |
| Ayarlar | `/user/settings` | ⚠️ | Birkaç sabit Türkçe (İptal, Değiştiriliyor, test push metni) |
| İstatistikler | `/user/statistics` | ✅ | Dashboard ile aynı 8 alan (profil tamamlanma), t() kullanımı |

---

## 2. Tespit Edilen Eksikler / Tutarsızlıklar

### 2.1 Çeviri / Sabit Metin (i18n)

- **Dashboard** (`dashboard/page.tsx`): Hoş geldin fallback `'Kullanıcı'` sabit — `userDashboard.guest` veya locale'de fallback tanımlanmalı.
- **İş detay** (`jobs/[id]/page.tsx`):
  - `'Gönderiliyor...'`, `'Başvuruldu!'` sabit Türkçe → `jobDetail.sending`, `jobDetail.applied` gibi key'ler eklenmeli.
  - Hata mesajı: `'Başvuru gönderilemedi'` → `jobDetail.applyError` veya `common.error` kullanılmalı.
- **Başvurularım** (`applications/page.tsx`):
  - `'İş Pozisyonu'`, `'Lokasyon bilgisi yok'` sabit → `userApplications.jobTitleFallback`, `userApplications.noLocation` eklenmeli.
  - `formatDate` her zaman `'tr-TR'` kullanıyor — seçili dile göre locale (language) ile formatlanmalı.
- **Favoriler** (`favorites/page.tsx`): "Detaylar" butonu sabit → `userFavorites.details` veya `jobDetail.viewDetails` kullanılmalı.
- **Bildirimler** (`notifications/page.tsx`):
  - relativeTime metinleri sabit Türkçe: `'Az önce'`, `'dakika önce'`, `'saat önce'`, `'gün önce'` — locale'deki `relativeTime` (justNow, minutesAgo, hoursAgo, daysAgo) + dil ile gösterilmeli.
  - `{unreadCount} {t('userNotifications.unread')} bildirim` — "bildirim" sabit; tamamı tek key'de (örn. `unreadBanner`) veya ayrı `userNotifications.notifications` key'i kullanılmalı.
  - Uzun süreler için `toLocaleDateString` hâlâ `'tr-TR'` sabit — dile göre locale kullanılmalı.
- **Ayarlar** (`settings/page.tsx`):
  - `'Değiştiriliyor...'` → `userSettings.account.changing`.
  - `'İptal'` → `userSettings.cancel` veya `userProfile.cancel`.
  - Test push body: `'Test: Uygulama kapalıyken de bu bildirim gelmeli.'` → `userSettings.notifications.pushLive.testBody` gibi key kullanılmalı.
- **Mesajlar** (`messages/page.tsx`): Zaman gösterimi `toLocaleTimeString('tr-TR', ...)` sabit — dil/locale ile yapılmalı.

### 2.2 Tarih / Zaman Formatı

- **Applications:** `formatDate` → `toLocaleDateString(localeForLanguage(language), { year, month, day })`.
- **Notifications:** relativeTime metinleri için `language` kullanılıp `t('relativeTime.justNow')`, `t('relativeTime.minutesAgo', { count })` vb. kullanılmalı; 7 günden büyük için tarih yine dile göre locale ile.
- **Messages:** Zaman için `language` veya locale'e göre `toLocaleTimeString` / `toLocaleDateString`.

### 2.3 Veri / API

- **CV sayfası:** `user.cvContent` kullanılıyor. Backend'de kullanıcı objesinde `cvContent` dönmüyorsa sayfa boş kalır; metin CV profil yüklemesinden geliyorsa backend ile uyum kontrol edilmeli.
- **User type** (`services/types.ts`): `country`, `city`, `experienceLevel`, `cvContent` tanımlı değil; kod `(user as any)` kullanıyor. Tip güncellenirse bakım kolaylaşır.
- **Favoriler:** Sadece `localStorage` + `fetchJobs()` ile filtreleniyor; sunucu tarafı favori listesi yok. Silinen veya kapatılan ilanlar listede kalabilir.

### 2.4 UX / Küçük İyileştirmeler

- **Profil CV yükleme:** `accept=".pdf"` — `.doc`, `.docx` eklenirse daha fazla kullanıcı uyumlu olur (backend destekliyorsa).
- **İş detay:** Başvuru hatası `alert()` ile gösteriliyor; sayfa içi toast/banner tercih edilebilir.
- **Messages:** Gerçek API bağlantısı yok; "Simulated messages" ile placeholder içerik.

### 2.5 Koruma ve Erişim

- **ProtectedPage:** Çoğu sayfada `roles={['user']}` kullanılıyor.
- **Messages** ve **Favorites:** `ProtectedPage`'de role filtresi yok (`<ProtectedPage>{content}</ProtectedPage>`). İstenirse `roles={['user']}` eklenebilir (tutarlılık için).

---

## 3. Locale Dosyaları

- **en, tr, fr, ar:** `userCv`, `jobDetail.notFound`, `userJobs.clear`, `userSettings.notifications.pushLive`, `relativeTime` (FR’de mevcut) yapısı var.
- Eksik/eklenmesi faydalı key'ler (yukarıdaki maddelere göre):
  - `userDashboard.guest` veya welcome fallback
  - `jobDetail.sending`, `jobDetail.applied`, `jobDetail.applyError`
  - `userApplications.jobTitleFallback`, `userApplications.noLocation`
  - `userFavorites.details`
  - `userNotifications.unreadBanner` (veya `notifications` kelimesi için ayrı key)
  - `userSettings.account.changing`, `userSettings.cancel`, `userSettings.notifications.pushLive.testBody`
  - Tüm dillerde `relativeTime` (justNow, minutesAgo, hoursAgo, daysAgo) dil bazlı kullanılacak şekilde doldurulmalı.

---

## 4. Özet

| Kategori | Durum |
|----------|--------|
| Sayfa yapısı ve navigasyon | ✅ Tam |
| CV / İstatistik / Dashboard veri mantığı | ✅ Uyumlu |
| Çeviri (i18n) | ⚠️ Birçok sayfada sabit TR metin ve tarih locale’i |
| Tarih/zaman formatı | ⚠️ Applications, Notifications, Messages dil/locale’e göre güncellenmeli |
| Tip tanımları (User) | ⚠️ Opsiyonel alanlar type’a eklenebilir |
| Favoriler | ⚠️ Sadece localStorage; "Detaylar" çevirisi eksik |
| Mesajlar | ⚠️ Sahte veri; gerçek API yok |

**Öncelikli düzeltmeler (sadece user tarafı):**  
1) Tüm sabit Türkçe metinleri locale key’leriyle değiştirmek.  
2) Tarih/zaman gösterimlerini seçili dile göre (relativeTime + locale) yapmak.  
3) İsteğe bağlı: User tipine `country`, `city`, `experienceLevel`, `cvContent` eklemek; Favoriler’de "Detaylar" çevirisi ve Messages’ta ileride API entegrasyonu.

Bu rapor yalnızca kontrol amaçlıdır; kod değişikliği yapılmamıştır.
