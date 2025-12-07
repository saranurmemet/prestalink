const express = require('express');
const router = express.Router();
const { trackPWAInstall, pwaHeartbeat, getAnalytics } = require('../controllers/analyticsController');
const { authMiddleware } = require('../middleware/authMiddleware');

// PWA yükleme takibi (herkes erişebilir)
router.post('/pwa/install', trackPWAInstall);

// PWA heartbeat (aktif kullanıcı takibi)
router.post('/pwa/heartbeat', pwaHeartbeat);

// İstatistikler (sadece admin)
router.get('/stats', authMiddleware, getAnalytics);

module.exports = router;

