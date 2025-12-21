/**
 * Job Utility Functions
 * Centralized job-related helper functions to reduce code duplication
 */

/**
 * Remove duplicate jobs based on title + location + salary + employerId
 * Only removes duplicates from the same employer
 * @param {Array} jobs - Array of job objects
 * @returns {Array} - Array of unique jobs
 */
const removeDuplicateJobs = (jobs) => {
  const uniqueJobsMap = new Map();

  jobs.forEach((job) => {
    // Handle both populated and unpopulated employerId
    const employerId = typeof job.employerId === 'object' && job.employerId !== null
      ? (job.employerId._id?.toString() || job.employerId.toString())
      : (job.employerId?.toString() || '');

    // Create unique key: title + location + salary + employerId
    const key = `${job.title}|${job.location}|${job.salary}|${employerId}`;

    if (!uniqueJobsMap.has(key)) {
      uniqueJobsMap.set(key, job);
    } else {
      // Keep the more recent one (if same employer)
      const existing = uniqueJobsMap.get(key);
      const existingDate = existing.createdAt ? new Date(existing.createdAt) : new Date(0);
      const currentDate = job.createdAt ? new Date(job.createdAt) : new Date(0);

      if (currentDate > existingDate) {
        uniqueJobsMap.set(key, job);
      }
    }
  });

  return Array.from(uniqueJobsMap.values());
};

/**
 * Get employer ID from job (handles both populated and unpopulated)
 * @param {Object} job - Job object
 * @returns {string} - Employer ID as string
 */
const getEmployerId = (job) => {
  if (typeof job.employerId === 'object' && job.employerId !== null) {
    return job.employerId._id?.toString() || job.employerId.toString();
  }
  return job.employerId?.toString() || '';
};

/**
 * Check if user is job owner or admin
 * @param {Object} job - Job object
 * @param {Object} user - User object
 * @returns {boolean} - True if user can modify job
 */
const canModifyJob = (job, user) => {
  if (!job || !user) return false;
  
  // Admin and superadmin can modify any job
  if (['admin', 'superadmin'].includes(user.role)) {
    return true;
  }

  // Check if user is the employer
  const jobEmployerId = getEmployerId(job);
  return jobEmployerId === user._id.toString();
};

module.exports = {
  removeDuplicateJobs,
  getEmployerId,
  canModifyJob,
};

