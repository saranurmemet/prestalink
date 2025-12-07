const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: String,
      enum: ['user', 'recruiter', 'admin'],
      default: 'user',
    },
    body: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const applicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    cvUrl: {
      type: String,
      required: true,
    },
    certificates: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['pending', 'reviewing', 'viewed', 'interview', 'accepted', 'rejected'],
      default: 'pending',
    },
    messages: [messageSchema],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Application', applicationSchema);

