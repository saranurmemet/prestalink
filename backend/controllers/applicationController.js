const Application = require('../models/Application');
const asyncHandler = require('../utils/asyncHandler');
const { ensureDatabaseConnected } = require('../utils/dbCheck');
const { notifyApplicationCreated, notifyApplicationStatusUpdated } = require('../utils/notificationHelper');
const { isValidObjectId } = require('../utils/validation');
const logger = require('../utils/logger');
const User = require('../models/User');

exports.createApplication = asyncHandler(async (req, res) => {
  // Ensure database is connected
  ensureDatabaseConnected();

  const cvFile = req.files?.cv?.[0];
  const certificateFiles = req.files?.certificates || [];

  // Validate jobId
  if (!req.body.jobId) {
    return res.status(400).json({ message: 'Job is required' });
  }

  if (!isValidObjectId(req.body.jobId)) {
    return res.status(400).json({ message: 'Invalid job ID format' });
  }

  // CV handling: Use uploaded file or fallback to user's profile CV
  let cvUrl;
  if (cvFile) {
    // New CV file uploaded
    cvUrl = cvFile.path.replace(/\\/g, '/');
  } else if (req.body.useProfileCV === 'true') {
    // Frontend requested to use profile CV (when fetch fails)
    const user = await User.findById(req.user._id);
    if (user && user.cvUrl) {
      cvUrl = user.cvUrl;
    } else {
      return res.status(400).json({ message: 'CV is required. Please upload a CV file or ensure your profile has a CV.' });
    }
  } else {
    // No CV file and no useProfileCV flag - try to use profile CV as fallback
    const user = await User.findById(req.user._id);
    if (user && user.cvUrl) {
      cvUrl = user.cvUrl;
    } else {
      return res.status(400).json({ message: 'CV is required. Please upload a CV file or ensure your profile has a CV.' });
    }
  }

  // Ensure database is connected
  ensureDatabaseConnected();

  const application = await Application.create({
    userId: req.user._id,
    jobId: req.body.jobId,
    cvUrl: cvUrl,
    certificates: certificateFiles.map((file) => file.path.replace(/\\/g, '/')),
  });

  // Notify employer about new application (non-blocking)
  notifyApplicationCreated(application._id).catch(err => {
    logger.error('Failed to send notification', { error: err.message, applicationId: application._id });
  });

  logger.info('Application created', { 
    applicationId: application._id, 
    userId: req.user._id, 
    jobId: req.body.jobId 
  });

  res.status(201).json(application);
});

exports.getApplicationsByUser = asyncHandler(async (req, res) => {
  // Ensure database is connected
  ensureDatabaseConnected();

  const { id } = req.params;
  
  // Validate user ID
  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid user ID format' });
  }

  // Check permissions
  if (req.user._id.toString() !== id && !['recruiter', 'admin', 'superadmin'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const applications = await Application.find({ userId: id }).populate('jobId');
  logger.debug('Applications fetched by user', { userId: id, count: applications.length });
  res.json(applications);
});

exports.getApplicationsByJob = asyncHandler(async (req, res) => {
  // Ensure database is connected
  ensureDatabaseConnected();

  const { id } = req.params;
  
  // Validate job ID
  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid job ID format' });
  }

  const applications = await Application.find({ jobId: id }).populate('userId');
  logger.debug('Applications fetched by job', { jobId: id, count: applications.length });
  res.json(applications);
});

exports.updateApplicationStatus = asyncHandler(async (req, res) => {
  // Ensure database is connected
  ensureDatabaseConnected();

  const { id } = req.params;
  const { status, message } = req.body;
  const application = await Application.findById(id);
  if (!application) {
    return res.status(404).json({ message: 'Application not found' });
  }

  const oldStatus = application.status;
  application.status = status || application.status;
  if (message) {
    application.messages.push({
      sender: req.user.role,
      body: message,
    });
  }

  await application.save();

  // Notify applicant about status change (non-blocking)
  if (status && status !== oldStatus) {
    notifyApplicationStatusUpdated(application._id, status, req.user.role).catch(err => {
      logger.error('Failed to send notification', { error: err.message, applicationId: application._id });
    });
  }

  logger.info('Application status updated', { 
    applicationId: application._id, 
    oldStatus, 
    newStatus: status,
    updatedBy: req.user._id 
  });

  res.json(application);
});

