const express = require('express');
const { register, login, me, loginForRole, updateProfile, changePassword, googleAuth } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware');
const upload = require('../utils/upload');
const { registerLimiter, loginLimiter, googleAuthLimiter, changePasswordLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// REGISTER - Rate limited: 5 kayıt/saat/IP
router.post('/register', registerLimiter, register);

// GOOGLE OAUTH - Rate limited: 20 deneme/15 dakika/IP
router.post('/google', googleAuthLimiter, googleAuth);

// UNIVERSAL LOGIN (default) - Rate limited: 10 deneme/15 dakika/IP
router.post('/login', loginLimiter, login);

// ROLE BASED LOGIN - Rate limited: 10 deneme/15 dakika/IP
router.post('/user/login', loginLimiter, loginForRole('user'));
router.post('/recruiter/login', loginLimiter, loginForRole('recruiter'));
router.post('/admin/login', loginLimiter, loginForRole('admin'));
router.post('/superadmin/login', loginLimiter, loginForRole('superadmin'));

// ME (auth required)
router.get('/me', authMiddleware, me);

// UPDATE PROFILE (auth required) - with file uploads
router.put('/me', 
  authMiddleware,
  upload.fields([
    { name: 'profilePhoto', maxCount: 1 },
    { name: 'cv', maxCount: 1 },
    { name: 'certificates', maxCount: 10 }
  ]),
  updateProfile
);

// CHANGE PASSWORD (auth required) - Rate limited: 5 deneme/saat/IP
router.post('/change-password', authMiddleware, changePasswordLimiter, changePassword);

module.exports = router;
