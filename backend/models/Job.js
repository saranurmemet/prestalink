const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    salary: {
      type: String,
    },
    location: {
      type: String,
      required: true,
    },
    requiredExperience: {
      type: String,
    },
    requiredLanguage: {
      type: String,
    },
    workType: {
      type: String,
      enum: ['full-time', 'part-time', 'seasonal'],
      default: 'full-time',
    },
    closed: {
      type: Boolean,
      default: false,
    },
    employerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Job', jobSchema);

