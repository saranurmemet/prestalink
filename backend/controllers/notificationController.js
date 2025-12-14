const Notification = require('../models/Notification');
const asyncHandler = require('../utils/asyncHandler');

exports.getNotifications = asyncHandler(async (req, res) => {
  // Filter notifications by user ID and role
  // Show notifications that match user ID AND (no targetRole OR targetRole matches user's current role)
  const userRole = req.user.activeRole || req.user.role?.[0] || 'user';
  
  const notifications = await Notification.find({
    targetUserId: req.user._id,
    $or: [
      { targetRole: { $exists: false } }, // Backward compatibility: show notifications without targetRole
      { targetRole: userRole }, // Show notifications for current role
    ],
  }).sort({ createdAt: -1 });
  
  res.json(notifications);
});

exports.markRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { targetUserId: req.user._id, read: false },
    { $set: { read: true } },
  );
  res.json({ message: 'Notifications marked as read' });
});

