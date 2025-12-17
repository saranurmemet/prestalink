const webpush = require('web-push');
const asyncHandler = require('../utils/asyncHandler');
const PushSubscription = require('../models/PushSubscription');
const User = require('../models/User');

function requireVapid() {
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT || process.env.CLIENT_URL || 'mailto:hello@prestalink.app';

  if (!publicKey || !privateKey) {
    const err = new Error('Missing VAPID keys. Set VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY in backend environment.');
    err.statusCode = 500;
    throw err;
  }

  webpush.setVapidDetails(subject, publicKey, privateKey);
  return { publicKey };
}

async function sendToUserSubscriptions(userId, payload) {
  requireVapid();

  const subs = await PushSubscription.find({ userId });
  if (!subs.length) {
    const err = new Error('User has no push subscriptions');
    err.statusCode = 404;
    throw err;
  }

  const body = JSON.stringify(payload);

  const results = await Promise.allSettled(
    subs.map(async (s) => {
      try {
        await webpush.sendNotification(s.subscription, body);
        return { ok: true };
      } catch (e) {
        const status = e?.statusCode;
        // Clean up expired/invalid subscriptions
        if (status === 404 || status === 410) {
          await PushSubscription.deleteOne({ _id: s._id });
        }
        throw e;
      }
    })
  );

  return results;
}

exports.getVapidPublicKey = asyncHandler(async (req, res) => {
  const { publicKey } = requireVapid();
  res.json({ key: publicKey });
});

exports.getMyPushStatus = asyncHandler(async (req, res) => {
  const count = await PushSubscription.countDocuments({ userId: req.user._id });
  res.json({ subscribed: count > 0, subscriptions: count });
});

exports.subscribe = asyncHandler(async (req, res) => {
  const { subscription, deviceName } = req.body || {};
  const endpoint = subscription?.endpoint;

  if (!endpoint || !subscription?.keys?.p256dh || !subscription?.keys?.auth) {
    return res.status(400).json({ message: 'Invalid subscription payload' });
  }

  // Ensure endpoint uniqueness across users: upsert by endpoint
  await PushSubscription.findOneAndUpdate(
    { endpoint },
    {
      userId: req.user._id,
      endpoint,
      subscription,
      userAgent: req.headers['user-agent'],
      deviceName: deviceName || null,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  res.json({ success: true });
});

exports.unsubscribe = asyncHandler(async (req, res) => {
  const { endpoint } = req.body || {};
  if (!endpoint) return res.status(400).json({ message: 'endpoint is required' });

  await PushSubscription.deleteOne({ userId: req.user._id, endpoint });
  res.json({ success: true });
});

// For quick testing: send a push notification to yourself
exports.sendTestToMe = asyncHandler(async (req, res) => {
  const payload = {
    title: req.body?.title || 'PrestaLink',
    body: req.body?.body || 'Test bildirimi: Push çalışıyor.',
    url: req.body?.url || '/user/notifications',
  };

  const results = await sendToUserSubscriptions(req.user._id, payload);
  res.json({ success: true, results });
});

// Admin helper: send push to user by email
exports.sendToUserByEmail = asyncHandler(async (req, res) => {
  const { email, title, body, url } = req.body || {};
  if (!email) return res.status(400).json({ message: 'email is required' });

  const user = await User.findOne({ email: String(email).toLowerCase() }).select('_id email name');
  if (!user) return res.status(404).json({ message: 'User not found' });

  const payload = {
    title: title || 'PrestaLink',
    body: body || 'Yeni bir bildiriminiz var.',
    url: url || '/user/dashboard',
  };

  const results = await sendToUserSubscriptions(user._id, payload);
  res.json({ success: true, user, results });
});

