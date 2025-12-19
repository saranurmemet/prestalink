const express = require('express');
const router = express.Router();
const { submitContact, getContacts, updateContactStatus } = require('../controllers/contactController');
const { protect } = require('../middleware/authMiddleware');

// Public route - anyone can submit contact form
router.post('/', submitContact);

// Protected routes - only admins can access
router.get('/', protect, getContacts);
router.put('/:id/status', protect, updateContactStatus);

module.exports = router;


