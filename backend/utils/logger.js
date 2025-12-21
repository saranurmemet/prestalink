/**
 * Structured Logging Utility
 * Replaces console.log/error/warn with structured logging
 */

const LOG_LEVELS = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug',
};

const getTimestamp = () => new Date().toISOString();

const formatMessage = (level, message, metadata = {}) => {
  return {
    timestamp: getTimestamp(),
    level,
    message,
    ...metadata,
  };
};

const logger = {
  error: (message, metadata = {}) => {
    const log = formatMessage(LOG_LEVELS.ERROR, message, metadata);
    console.error('❌', JSON.stringify(log, null, process.env.NODE_ENV === 'development' ? 2 : 0));
  },

  warn: (message, metadata = {}) => {
    const log = formatMessage(LOG_LEVELS.WARN, message, metadata);
    console.warn('⚠️', JSON.stringify(log, null, process.env.NODE_ENV === 'development' ? 2 : 0));
  },

  info: (message, metadata = {}) => {
    const log = formatMessage(LOG_LEVELS.INFO, message, metadata);
    console.log('ℹ️', JSON.stringify(log, null, process.env.NODE_ENV === 'development' ? 2 : 0));
  },

  debug: (message, metadata = {}) => {
    if (process.env.NODE_ENV === 'development') {
      const log = formatMessage(LOG_LEVELS.DEBUG, message, metadata);
      console.log('🔍', JSON.stringify(log, null, 2));
    }
  },
};

module.exports = logger;

