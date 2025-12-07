const mongoose = require('mongoose');

const PWAInstallSchema = new mongoose.Schema(
  {
    deviceId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userAgent: {
      type: String,
    },
    platform: {
      type: String, // 'android', 'ios', 'desktop'
    },
    installedAt: {
      type: Date,
      default: Date.now,
    },
    lastSeen: {
      type: Date,
      default: Date.now,
    },
    version: {
      type: String, // PWA version
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
PWAInstallSchema.index({ lastSeen: -1 });
PWAInstallSchema.index({ installedAt: -1 });
PWAInstallSchema.index({ isActive: 1 });

module.exports = mongoose.model('PWAInstall', PWAInstallSchema);

