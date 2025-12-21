/**
 * Input Validation Utilities
 * Centralized validation functions for request data
 */

const validator = require('validator');
const mongoose = require('mongoose');

/**
 * Validate MongoDB ObjectId
 */
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

/**
 * Validate email
 */
const isValidEmail = (email) => {
  return validator.isEmail(email);
};

/**
 * Validate required fields
 */
const validateRequired = (data, fields) => {
  const missing = fields.filter(field => !data[field]);
  if (missing.length > 0) {
    return {
      valid: false,
      error: `Missing required fields: ${missing.join(', ')}`,
    };
  }
  return { valid: true };
};

/**
 * Sanitize string input
 */
const sanitizeString = (str, maxLength = 1000) => {
  if (typeof str !== 'string') return '';
  return validator.trim(validator.escape(str)).substring(0, maxLength);
};

/**
 * Validate and sanitize job data
 */
const validateJobData = (data) => {
  const errors = [];

  if (!data.title || typeof data.title !== 'string' || data.title.trim().length < 3) {
    errors.push('Title must be at least 3 characters');
  }

  if (!data.description || typeof data.description !== 'string' || data.description.trim().length < 10) {
    errors.push('Description must be at least 10 characters');
  }

  if (!data.location || typeof data.location !== 'string' || data.location.trim().length < 2) {
    errors.push('Location is required');
  }

  if (data.workType && !['full-time', 'part-time', 'seasonal'].includes(data.workType)) {
    errors.push('Invalid work type');
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  // Sanitize
  return {
    valid: true,
    sanitized: {
      title: sanitizeString(data.title, 200),
      description: sanitizeString(data.description, 5000),
      location: sanitizeString(data.location, 200),
      salary: data.salary ? sanitizeString(data.salary, 100) : undefined,
      requiredExperience: data.requiredExperience ? sanitizeString(data.requiredExperience, 500) : undefined,
      requiredLanguage: data.requiredLanguage ? sanitizeString(data.requiredLanguage, 100) : undefined,
      workType: data.workType || 'full-time',
      closed: data.closed === true || data.closed === 'true',
    },
  };
};

/**
 * Validate and sanitize user profile data
 */
const validateProfileData = (data) => {
  const errors = [];

  if (data.name && (typeof data.name !== 'string' || data.name.trim().length < 2)) {
    errors.push('Name must be at least 2 characters');
  }

  if (data.email && !isValidEmail(data.email)) {
    errors.push('Invalid email format');
  }

  if (data.phone && typeof data.phone === 'string' && !validator.isMobilePhone(data.phone.replace(/\s/g, ''), 'any', { strictMode: false })) {
    // Phone validation is lenient - just check it's not empty
    if (data.phone.trim().length < 5) {
      errors.push('Phone number is too short');
    }
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  // Sanitize
  const sanitized = {};
  if (data.name) sanitized.name = sanitizeString(data.name, 100);
  if (data.phone) sanitized.phone = sanitizeString(data.phone, 20);
  if (data.bio) sanitized.bio = sanitizeString(data.bio, 1000);
  if (data.companyName) sanitized.companyName = sanitizeString(data.companyName, 200);
  if (data.companyDescription) sanitized.companyDescription = sanitizeString(data.companyDescription, 2000);
  if (data.city) sanitized.city = sanitizeString(data.city, 100);
  if (data.industry) sanitized.industry = sanitizeString(data.industry, 100);

  return { valid: true, sanitized };
};

module.exports = {
  isValidObjectId,
  isValidEmail,
  validateRequired,
  sanitizeString,
  validateJobData,
  validateProfileData,
};

