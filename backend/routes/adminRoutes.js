const express = require('express');
const {
  getStats,
  getUsers,
  updateUserRole,
  markPWAInstalled,
} = require('../controllers/adminController');
const { authMiddleware, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

// PWA installation tracking (can be called by any authenticated user)
router.post('/pwa-install', authMiddleware, markPWAInstalled);

// All other admin routes require authentication and admin role
router.use(authMiddleware);
router.use(authorizeRoles('admin', 'superadmin'));

// Statistics
router.get('/stats', getStats);

// User management
router.get('/users', getUsers);
router.put('/users/:userId/role', updateUserRole);

module.exports = router;