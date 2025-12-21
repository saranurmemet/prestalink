/**
 * Notification Helper Utility
 * Bildirim oluşturma işlemlerini kolaylaştırır
 */

const Notification = require('../models/Notification');
const Job = require('../models/Job');
const Application = require('../models/Application');
const User = require('../models/User');
const { ensureDatabaseConnected } = require('./dbCheck');
const logger = require('./logger');

/**
 * Create a notification for a user
 * @param {string} userId - Target user ID
 * @param {string} title - Notification title
 * @param {string} message - Notification message
 * @returns {Promise<Object>} - Created notification
 */
const createNotification = async (userId, title, message) => {
  try {
    ensureDatabaseConnected();
    
    const notification = await Notification.create({
      targetUserId: userId,
      title,
      message,
      read: false,
    });
    
    logger.info('Notification created', { notificationId: notification._id, userId, title });
    return notification;
  } catch (error) {
    logger.error('Error creating notification', { error: error.message, userId, title });
    // Don't throw - notification failure shouldn't break the main operation
    return null;
  }
};

/**
 * Create notification when application is created
 * @param {string} applicationId - Application ID
 * @returns {Promise<Object>} - Created notification or null
 */
const notifyApplicationCreated = async (applicationId) => {
  try {
    ensureDatabaseConnected();
    
    const application = await Application.findById(applicationId)
      .populate('jobId', 'title employerId')
      .populate('userId', 'name');
    
    if (!application || !application.jobId) {
      return null;
    }
    
    const job = application.jobId;
    const applicant = application.userId;
    
    // Notify employer
    if (job.employerId) {
      const employer = await User.findById(job.employerId);
      if (employer) {
        return await createNotification(
          job.employerId,
          'Yeni Başvuru Aldınız',
          `${applicant?.name || 'Bir aday'} "${job.title}" pozisyonu için başvuru yaptı.`
        );
      }
    }
    
    return null;
  } catch (error) {
    logger.error('Error in notifyApplicationCreated', { error: error.message, applicationId });
    return null;
  }
};

/**
 * Create notification when application status is updated
 * @param {string} applicationId - Application ID
 * @param {string} newStatus - New status
 * @param {string} updaterRole - Role of person updating (recruiter, admin, etc.)
 * @returns {Promise<Object>} - Created notification or null
 */
const notifyApplicationStatusUpdated = async (applicationId, newStatus, updaterRole) => {
  try {
    ensureDatabaseConnected();
    
    const application = await Application.findById(applicationId)
      .populate('jobId', 'title')
      .populate('userId', 'name');
    
    if (!application || !application.userId) {
      return null;
    }
    
    const job = application.jobId;
    const applicant = application.userId;
    
    // Status messages in Turkish
    const statusMessages = {
      pending: 'Başvurunuz alındı ve inceleniyor.',
      reviewing: 'Başvurunuz değerlendiriliyor.',
      viewed: 'Başvurunuz görüntülendi.',
      interview: 'Tebrikler! Mülakat için davet edildiniz.',
      accepted: 'Harika haber! Başvurunuz kabul edildi.',
      rejected: 'Başvurunuz değerlendirildi.',
    };
    
    const message = statusMessages[newStatus] || 'Başvuru durumunuz güncellendi.';
    
    // Notify applicant
    return await createNotification(
      application.userId._id || application.userId,
      `Başvuru Durumu Güncellendi: ${job?.title || 'İş İlanı'}`,
      message
    );
  } catch (error) {
    logger.error('Error in notifyApplicationStatusUpdated', { 
      error: error.message, 
      applicationId, 
      newStatus 
    });
    return null;
  }
};

module.exports = {
  createNotification,
  notifyApplicationCreated,
  notifyApplicationStatusUpdated,
};

