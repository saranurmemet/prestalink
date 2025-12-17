const express = require('express');
const { register, login, me, loginForRole, updateProfile, googleAuth } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware');
const upload = require('../utils/upload');

const router = express.Router();

// REGISTER
router.post('/register', register);

// GOOGLE OAUTH
router.post('/google', googleAuth);

// UNIVERSAL LOGIN (default)
router.post('/login', login);

// ROLE BASED LOGIN
router.post('/user/login', loginForRole('user'));
router.post('/recruiter/login', loginForRole('recruiter'));
router.post('/admin/login', loginForRole('admin'));
router.post('/superadmin/login', loginForRole('superadmin'));

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

module.exports = router;
