const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 4,
    },
    role: {
      type: String,
      enum: ['user', 'recruiter', 'admin', 'superadmin'],
      default: 'user',
    },
    languages: {
      type: [String],
      default: [],
    },
    country: {
      type: String,
    },
    experienceLevel: {
      type: String,
    },
    bio: {
      type: String,
    },
    profilePhoto: {
      type: String,
    },
    cvUrl: {
      type: String,
    },
    certificates: {
      type: [String],
      default: [],
    },
    companyName: {
      type: String,
    },
    companyDescription: {
      type: String,
    },
    industry: {
      type: String,
    },
    city: {
      type: String,
    },
    lastLogin: {
      type: Date,
    },
    pwaInstalled: {
      type: Boolean,
      default: false,
    },
    pwaInstalledAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

