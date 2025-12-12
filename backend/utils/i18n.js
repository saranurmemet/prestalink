// Backend i18n helper - API hata mesajlarını çevirir
const translations = {
  en: {
    unauthorized: 'Unauthorized',
    forbidden: 'Forbidden - Insufficient permissions',
    userNotFound: 'User not found',
    invalidToken: 'Invalid or expired token',
    invalidCredentials: 'Invalid email or password',
    emailExists: 'Email already exists',
    serverError: 'Server error occurred',
    validationError: 'Validation error',
    notFound: 'Resource not found',
    fileTypeError: 'Invalid file type',
    fileSizeError: 'File size exceeds limit'
  },
  tr: {
    unauthorized: 'Yetkisiz erişim',
    forbidden: 'Yasak - Yetersiz izinler',
    userNotFound: 'Kullanıcı bulunamadı',
    invalidToken: 'Geçersiz veya süresi dolmuş token',
    invalidCredentials: 'Geçersiz e-posta veya şifre',
    emailExists: 'E-posta zaten kayıtlı',
    serverError: 'Sunucu hatası oluştu',
    validationError: 'Doğrulama hatası',
    notFound: 'Kaynak bulunamadı',
    fileTypeError: 'Geçersiz dosya türü',
    fileSizeError: 'Dosya boyutu limiti aşıyor'
  },
  fr: {
    unauthorized: 'Non autorisé',
    forbidden: 'Interdit - Autorisations insuffisantes',
    userNotFound: 'Utilisateur non trouvé',
    invalidToken: 'Jeton invalide ou expiré',
    invalidCredentials: 'E-mail ou mot de passe invalide',
    emailExists: 'E-mail déjà enregistré',
    serverError: 'Erreur serveur',
    validationError: 'Erreur de validation',
    notFound: 'Ressource non trouvée',
    fileTypeError: 'Type de fichier invalide',
    fileSizeError: 'Taille de fichier dépasse la limite'
  },
  ar: {
    unauthorized: 'غير مصرح',
    forbidden: 'محظور - أذونات غير كافية',
    userNotFound: 'المستخدم غير موجود',
    invalidToken: 'رمز غير صالح أو منتهي الصلاحية',
    invalidCredentials: 'بريد إلكتروني أو كلمة مرور غير صالحة',
    emailExists: 'البريد الإلكتروني مسجل بالفعل',
    serverError: 'حدث خطأ في الخادم',
    validationError: 'خطأ في التحقق',
    notFound: 'المورد غير موجود',
    fileTypeError: 'نوع ملف غير صالح',
    fileSizeError: 'حجم الملف يتجاوز الحد'
  }
};

/**
 * Accept-Language header'dan dil çıkarır
 * Örnek: "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7" -> "tr"
 */
const getLanguageFromHeader = (acceptLanguageHeader) => {
  if (!acceptLanguageHeader) return 'en';
  
  const firstLang = acceptLanguageHeader.split(',')[0];
  const lang = firstLang.split('-')[0].toLowerCase();
  
  return ['en', 'tr', 'fr', 'ar'].includes(lang) ? lang : 'en';
};

/**
 * Çeviri anahtarına göre mesaj döndürür
 */
const translate = (key, req) => {
  const lang = getLanguageFromHeader(req.headers['accept-language']);
  return translations[lang]?.[key] || translations.en[key] || key;
};

module.exports = {
  translate,
  getLanguageFromHeader,
  translations
};
