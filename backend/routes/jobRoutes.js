const express = require('express');
const {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
} = require('../controllers/jobController');
const { authMiddleware, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(getJobs)
  .post(authMiddleware, authorizeRoles('recruiter', 'admin', 'superadmin'), createJob);

router.route('/:id')
  .get(getJobById)
  .put(authMiddleware, authorizeRoles('recruiter', 'admin', 'superadmin'), updateJob)
  .delete(authMiddleware, authorizeRoles('recruiter', 'admin', 'superadmin'), deleteJob);

module.exports = router;

