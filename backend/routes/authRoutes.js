const express = require('express');
const { register, login, me, loginForRole, updateProfile, checkUserCV } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware');
const upload = require('../utils/upload');

const router = express.Router();

// REGISTER
router.post('/register', register);

// UNIVERSAL LOGIN (default)
router.post('/login', login);

// ROLE BASED LOGIN
router.post('/user/login', loginForRole('user'));
router.post('/recruiter/login', loginForRole('recruiter'));
router.post('/admin/login', loginForRole('admin'));
router.post('/superadmin/login', loginForRole('superadmin'));

// ME (auth required)
router.get('/me', authMiddleware, me);
router.put('/me', authMiddleware, upload.fields([
  { name: 'profilePhoto', maxCount: 1 },
  { name: 'cv', maxCount: 1 },
  { name: 'certificates', maxCount: 10 }
]), updateProfile);

// CHECK USER CV
router.get('/users/:userId/cv', authMiddleware, checkUserCV);

module.exports = router;
