/**
 * Job Utility Functions (Frontend)
 * Centralized job-related helper functions to reduce code duplication
 */

import type { Job } from '@/services/types';

/**
 * Get employer ID from job (handles both populated and unpopulated)
 */
export const getEmployerId = (job: Job): string => {
  if (!job.employerId) return '';
  if (typeof job.employerId === 'object' && job.employerId !== null) {
    return (job.employerId as any)._id?.toString() || (job.employerId as any).toString();
  }
  return (job.employerId as string)?.toString() || '';
};

/**
 * Remove duplicate jobs based on title + location + salary + employerId
 * Only removes duplicates from the same employer
 */
export const removeDuplicateJobs = (jobs: Job[]): Job[] => {
  const uniqueJobsMap = new Map<string, Job>();

  jobs.forEach((job) => {
    const employerId = getEmployerId(job);
    const key = `${job.title}|${job.location}|${job.salary}|${employerId}`;

    if (!uniqueJobsMap.has(key)) {
      uniqueJobsMap.set(key, job);
    } else {
      // Keep the more recent one
      const existing = uniqueJobsMap.get(key)!;
      const existingDate = existing.createdAt ? new Date(existing.createdAt) : new Date(0);
      const currentDate = job.createdAt ? new Date(job.createdAt) : new Date(0);

      if (currentDate > existingDate) {
        uniqueJobsMap.set(key, job);
      }
    }
  });

  return Array.from(uniqueJobsMap.values());
};

