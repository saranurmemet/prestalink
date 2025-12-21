const Job = require('../models/Job');
const asyncHandler = require('../utils/asyncHandler');
const { ensureDatabaseConnected } = require('../utils/dbCheck');

exports.createJob = asyncHandler(async (req, res) => {
  // Ensure database is connected
  ensureDatabaseConnected();

  const job = await Job.create({
    ...req.body,
    employerId: req.user._id,
  });
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
  
  // Remove duplicates based on title + location + salary + employerId
  // Only remove if same employer created duplicate (not different employers with same job details)
  const uniqueJobsMap = new Map();
  allJobs.forEach((job) => {
    // Include employerId in key to avoid removing legitimate duplicates from different employers
    const employerId = job.employerId?._id?.toString() || job.employerId?.toString() || '';
    const key = `${job.title}|${job.location}|${job.salary}|${employerId}`;
    
    if (!uniqueJobsMap.has(key)) {
      uniqueJobsMap.set(key, job);
    } else {
      // Keep the more recent one (only if same employer)
      const existing = uniqueJobsMap.get(key);
      if (new Date(job.createdAt) > new Date(existing.createdAt)) {
        uniqueJobsMap.set(key, job);
      }
    }
  });
  
  const uniqueJobs = Array.from(uniqueJobsMap.values());
  console.log(`📊 [JOBS API] Returning ${uniqueJobs.length} jobs (from ${allJobs.length} total)`);
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

  if (job.employerId.toString() !== req.user._id.toString() && !['admin', 'superadmin'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  Object.assign(job, req.body);
  await job.save();
  res.json(job);
});

exports.deleteJob = asyncHandler(async (req, res) => {
  // Ensure database is connected
  ensureDatabaseConnected();

  const job = await Job.findById(req.params.id);
  if (!job) {
    return res.status(404).json({ message: 'Job not found' });
  }

  if (job.employerId.toString() !== req.user._id.toString() && !['admin', 'superadmin'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  await job.deleteOne();
  res.json({ message: 'Job removed' });
});

