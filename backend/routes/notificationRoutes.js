const express = require('express');
const { getNotifications, markRead } = require('../controllers/notificationController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, getNotifications);
router.put('/mark-read', authMiddleware, markRead);

module.exports = router;