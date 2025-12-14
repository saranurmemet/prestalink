const express = require('express');
const {
  createApplication,
  getApplicationsByUser,
  getApplicationsByJob,
  updateApplicationStatus,
} = require('../controllers/applicationController');
const { authMiddleware, authorizeRoles } = require('../middleware/authMiddleware');
const upload = require('../utils/upload');

const router = express.Router();

router.post(
  '/',
  authMiddleware,
  upload.fields([
    { name: 'cv', maxCount: 1 },
    { name: 'certificates', maxCount: 5 },
  ]),
  createApplication,
);

router.get('/user/:id', authMiddleware, getApplicationsByUser);
router.get('/job/:id', authMiddleware, authorizeRoles('recruiter', 'admin', 'superadmin'), getApplicationsByJob);
router.put('/:id/status', authMiddleware, authorizeRoles('recruiter', 'admin', 'superadmin'), updateApplicationStatus);

module.exports = router;