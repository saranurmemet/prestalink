const Application = require('../models/Application');
const asyncHandler = require('../utils/asyncHandler');
const { ensureDatabaseConnected } = require('../utils/dbCheck');
const { notifyApplicationCreated, notifyApplicationStatusUpdated } = require('../utils/notificationHelper');

const User = require('../models/User');

exports.createApplication = asyncHandler(async (req, res) => {
  const cvFile = req.files?.cv?.[0];
  const certificateFiles = req.files?.certificates || [];

  if (!req.body.jobId) {
    return res.status(400).json({ message: 'Job is required' });
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
    console.error('Failed to send notification:', err);
  });

  res.status(201).json(application);
});

exports.getApplicationsByUser = asyncHandler(async (req, res) => {
  // Ensure database is connected
  ensureDatabaseConnected();

  const { id } = req.params;
  if (req.user._id.toString() !== id && !['recruiter', 'admin', 'superadmin'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  const applications = await Application.find({ userId: id }).populate('jobId');
  res.json(applications);
});

exports.getApplicationsByJob = asyncHandler(async (req, res) => {
  // Ensure database is connected
  ensureDatabaseConnected();

  const { id } = req.params;
  const applications = await Application.find({ jobId: id }).populate('userId');
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
      console.error('Failed to send notification:', err);
    });
  }

  res.json(application);
});

