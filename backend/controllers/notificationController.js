const Notification = require('../models/Notification');
const asyncHandler = require('../utils/asyncHandler');

exports.getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ targetUserId: req.user._id }).sort({ createdAt: -1 });
  res.json(notifications);
});

exports.markRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { targetUserId: req.user._id, read: false },
    { $set: { read: true } },
  );
  res.json({ message: 'Notifications marked as read' });
});

