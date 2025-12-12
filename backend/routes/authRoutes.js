const express = require('express');
const { register, login, me, loginForRole } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware');

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

module.exports = router;
