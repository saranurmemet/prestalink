/**
 * Database Connection Check Utility
 * Tüm database işlemlerinden önce kullanılmalı
 */

const mongoose = require('mongoose');

/**
 * Check if database is connected
 * @returns {boolean} - true if connected, false otherwise
 */
const isDatabaseConnected = () => {
  return mongoose.connection.readyState === 1;
};

/**
 * Ensure database is connected before operation
 * @throws {Error} - If database is not connected
 */
const ensureDatabaseConnected = () => {
  if (!isDatabaseConnected()) {
    throw new Error('Database is not connected. Please try again later.');
  }
};

/**
 * Get database connection status message
 * @returns {string} - Connection status message
 */
const getDatabaseStatus = () => {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };
  return states[mongoose.connection.readyState] || 'unknown';
};

module.exports = {
  isDatabaseConnected,
  ensureDatabaseConnected,
  getDatabaseStatus,
};

