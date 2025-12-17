const mongoose = require('mongoose');

const pushSubscriptionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    endpoint: { type: String, required: true, unique: true },
    subscription: { type: mongoose.Schema.Types.Mixed, required: true },
    userAgent: { type: String },
    deviceName: { type: String },
    // UI language at time of subscribe (drives localized push content)
    locale: { type: String, default: 'en', index: true },
    acceptLanguage: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PushSubscription', pushSubscriptionSchema);

