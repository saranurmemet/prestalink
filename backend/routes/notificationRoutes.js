const express = require('express');
const { getNotifications, markRead } = require('../controllers/notificationController');
const { authMiddleware } = require('../middleware/authMiddleware');
const {
  getVapidPublicKey,
  getMyPushStatus,
  subscribe,
  unsubscribe,
  sendTestToMe,
} = require('../controllers/pushController');

const router = express.Router();

router.get('/', authMiddleware, getNotifications);
router.put('/mark-read', authMiddleware, markRead);

// Push notifications
router.get('/push/public-key', getVapidPublicKey);
router.get('/push/status', authMiddleware, getMyPushStatus);
router.post('/push/subscribe', authMiddleware, subscribe);
router.post('/push/unsubscribe', authMiddleware, unsubscribe);
router.post('/push/test-me', authMiddleware, sendTestToMe);

module.exports = router;