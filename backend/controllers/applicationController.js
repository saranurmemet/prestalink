const Application = require('../models/Application');
const asyncHandler = require('../utils/asyncHandler');

exports.createApplication = asyncHandler(async (req, res) => {
  const cvFile = req.files?.cv?.[0];
  const certificateFiles = req.files?.certificates || [];

  if (!cvFile) {
    return res.status(400).json({ message: 'CV is required' });
  }

  if (!req.body.jobId) {
    return res.status(400).json({ message: 'Job is required' });
  }

  const application = await Application.create({
    userId: req.user._id,
    jobId: req.body.jobId,
    cvUrl: cvFile.path.replace(/\\/g, '/'),
    certificates: certificateFiles.map((file) => file.path.replace(/\\/g, '/')),
  });

  res.status(201).json(application);
});

exports.getApplicationsByUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (req.user._id.toString() !== id && !['recruiter', 'admin', 'superadmin'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  const applications = await Application.find({ userId: id }).populate('jobId');
  res.json(applications);
});

exports.getApplicationsByJob = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const applications = await Application.find({ jobId: id }).populate('userId');
  res.json(applications);
});

exports.updateApplicationStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, message } = req.body;
  const application = await Application.findById(id);
  if (!application) {
    return res.status(404).json({ message: 'Application not found' });
  }

  application.status = status || application.status;
  if (message) {
    application.messages.push({
      sender: req.user.role,
      body: message,
    });
  }

  await application.save();
  res.json(application);
});

