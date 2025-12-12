const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const asyncHandler = require('../utils/asyncHandler');

// Get admin statistics
exports.getStats = asyncHandler(async (req, res) => {
  // Total users count
  const totalUsers = await User.countDocuments();
  
  // Active users (logged in within last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const activeUsers = await User.countDocuments({
    lastLogin: { $gte: thirtyDaysAgo },
  });
  
  // PWA installed users
  const pwaInstalledUsers = await User.countDocuments({
    pwaInstalled: true,
  });
  
  // Total jobs
  const totalJobs = await Job.countDocuments();
  
  // Total recruiters
  const totalRecruiters = await User.countDocuments({ role: 'recruiter' });
  
  // Total applications
  const totalApplications = await Application.countDocuments();
  
  // Users by role
  const usersByRole = await User.aggregate([
    {
      $group: {
        _id: '$role',
        count: { $sum: 1 },
      },
    },
  ]);
  
  // Recent registrations (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentRegistrations = await User.countDocuments({
    createdAt: { $gte: sevenDaysAgo },
  });
  
  // Recent jobs (last 7 days)
  const recentJobs = await Job.countDocuments({
    createdAt: { $gte: sevenDaysAgo },
  });

  res.json({
    totalUsers,
    activeUsers,
    pwaInstalledUsers,
    totalJobs,
    totalRecruiters,
    totalApplications,
    usersByRole: usersByRole.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {}),
    recentRegistrations,
    recentJobs,
  });
});

// Get all users (for admin user management)
exports.getUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, role, search } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const filter = {};
  if (role) {
    filter.role = role;
  }
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const users = await User.find(filter)
    .select('-password')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await User.countDocuments(filter);

  res.json({
    users,
    total,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages: Math.ceil(total / parseInt(limit)),
  });
});

// Update user role
exports.updateUserRole = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;

  if (!['user', 'recruiter', 'admin', 'superadmin'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  user.role = role;
  await user.save();

  res.json({ user: user.toObject({ transform: (doc, ret) => { delete ret.password; return ret; } }) });
});

// Mark PWA as installed
exports.markPWAInstalled = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (!user.pwaInstalled) {
    user.pwaInstalled = true;
    user.pwaInstalledAt = new Date();
    await user.save();
  }

  res.json({ message: 'PWA installation recorded', pwaInstalled: user.pwaInstalled });
});




