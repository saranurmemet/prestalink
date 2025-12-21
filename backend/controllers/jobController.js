const Job = require('../models/Job');
const asyncHandler = require('../utils/asyncHandler');
const { ensureDatabaseConnected } = require('../utils/dbCheck');
const { validateJobData } = require('../utils/validation');
const { removeDuplicateJobs, canModifyJob } = require('../utils/jobUtils');
const logger = require('../utils/logger');

exports.createJob = asyncHandler(async (req, res) => {
  // Ensure database is connected
  ensureDatabaseConnected();

  // Validate and sanitize job data
  const validation = validateJobData(req.body);
  if (!validation.valid) {
    return res.status(400).json({ 
      message: 'Validation failed', 
      errors: validation.errors 
    });
  }

  const job = await Job.create({
    ...validation.sanitized,
    employerId: req.user._id,
  });

  logger.info('Job created', { jobId: job._id, employerId: req.user._id });
  res.status(201).json(job);
});

exports.getJobs = asyncHandler(async (req, res) => {
  // Ensure database is connected
  ensureDatabaseConnected();

  const filters = {};
  if (req.query.language) {
    filters.requiredLanguage = req.query.language;
  }
  // Sadece açık (closed: false) iş ilanlarını göster
  filters.closed = { $ne: true };
  
  const allJobs = await Job.find(filters).sort({ createdAt: -1 }).populate('employerId', 'name companyName');
  
  // Remove duplicates using utility function
  const uniqueJobs = removeDuplicateJobs(allJobs);
  
  logger.debug('Jobs fetched', { 
    total: allJobs.length, 
    unique: uniqueJobs.length,
    filters 
  });
  
  res.json(uniqueJobs);
});

exports.getJobById = asyncHandler(async (req, res) => {
  // Ensure database is connected
  ensureDatabaseConnected();

  const job = await Job.findById(req.params.id);
  if (!job) {
    return res.status(404).json({ message: 'Job not found' });
  }
  res.json(job);
});

exports.updateJob = asyncHandler(async (req, res) => {
  // Ensure database is connected
  ensureDatabaseConnected();

  const job = await Job.findById(req.params.id);
  if (!job) {
    return res.status(404).json({ message: 'Job not found' });
  }

  // Check permissions
  if (!canModifyJob(job, req.user)) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  // Validate and sanitize update data
  const validation = validateJobData(req.body);
  if (!validation.valid) {
    return res.status(400).json({ 
      message: 'Validation failed', 
      errors: validation.errors 
    });
  }

  Object.assign(job, validation.sanitized);
  await job.save();

  logger.info('Job updated', { jobId: job._id, updatedBy: req.user._id });
  res.json(job);
});

exports.deleteJob = asyncHandler(async (req, res) => {
  // Ensure database is connected
  ensureDatabaseConnected();

  const job = await Job.findById(req.params.id);
  if (!job) {
    return res.status(404).json({ message: 'Job not found' });
  }

  // Check permissions
  if (!canModifyJob(job, req.user)) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  await job.deleteOne();
  
  logger.info('Job deleted', { jobId: req.params.id, deletedBy: req.user._id });
  res.json({ message: 'Job removed' });
});

