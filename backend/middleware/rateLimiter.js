const rateLimit = require('express-rate-limit');

// IP adresini almak için helper fonksiyon
const getIP = (req) => {
  return (
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.headers['x-real-ip'] ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    req.ip ||
    'unknown'
  );
};

// Genel API rate limiter (tüm endpoint'ler için)
// Development modunda limit'leri gevşet
const isDevelopment = process.env.NODE_ENV === 'development';
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: isDevelopment ? 1000 : 100, // Development: 1000, Production: 100
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true, // Rate limit bilgilerini header'larda döndür
  legacyHeaders: false,
  handler: (req, res) => {
    const ip = getIP(req);
    console.warn(`⚠️  [RATE_LIMIT] Too many requests from IP: ${ip}`);
    res.status(429).json({
      error: 'Too many requests from this IP, please try again later.',
      retryAfter: '15 minutes'
    });
  }
});

// Kayıt (Register) için sıkı rate limiter
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 saat
  max: 5, // Her IP'den 1 saatte maksimum 5 kayıt
  message: {
    error: 'Too many registration attempts from this IP, please try again after an hour.',
    retryAfter: '1 hour'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false, // Başarılı kayıtları da say
  handler: (req, res) => {
    const ip = getIP(req);
    console.warn(`⚠️  [RATE_LIMIT] Too many registration attempts from IP: ${ip}`);
    res.status(429).json({
      error: 'Too many registration attempts from this IP. Please try again after an hour.',
      retryAfter: '1 hour'
    });
  }
});

// Giriş (Login) için rate limiter (brute force koruması)
// Development modunda limit'leri gevşet
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: isDevelopment ? 100 : 10, // Development: 100, Production: 10
  message: {
    error: 'Too many login attempts from this IP, please try again after 15 minutes.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Başarılı girişleri sayma
  handler: (req, res) => {
    const ip = getIP(req);
    console.warn(`⚠️  [RATE_LIMIT] Too many login attempts from IP: ${ip}`);
    res.status(429).json({
      error: 'Too many login attempts from this IP. Please try again after 15 minutes.',
      retryAfter: '15 minutes'
    });
  }
});

// Google OAuth için rate limiter
const googleAuthLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 20, // Her IP'den 15 dakikada maksimum 20 Google auth denemesi
  message: {
    error: 'Too many Google authentication attempts, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    const ip = getIP(req);
    console.warn(`⚠️  [RATE_LIMIT] Too many Google auth attempts from IP: ${ip}`);
    res.status(429).json({
      error: 'Too many Google authentication attempts. Please try again after 15 minutes.',
      retryAfter: '15 minutes'
    });
  }
});

// Şifre değiştirme için rate limiter
const changePasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 saat
  max: 5, // Her IP'den 1 saatte maksimum 5 şifre değiştirme denemesi
  message: {
    error: 'Too many password change attempts, please try again after an hour.',
    retryAfter: '1 hour'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    const ip = getIP(req);
    console.warn(`⚠️  [RATE_LIMIT] Too many password change attempts from IP: ${ip}`);
    res.status(429).json({
      error: 'Too many password change attempts. Please try again after an hour.',
      retryAfter: '1 hour'
    });
  }
});

module.exports = {
  generalLimiter,
  registerLimiter,
  loginLimiter,
  googleAuthLimiter,
  changePasswordLimiter,
};

