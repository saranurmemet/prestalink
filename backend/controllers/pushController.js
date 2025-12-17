const webpush = require('web-push');
const asyncHandler = require('../utils/asyncHandler');
const PushSubscription = require('../models/PushSubscription');
const User = require('../models/User');

const SUPPORTED_LOCALES = ['en', 'tr', 'fr', 'ar'];

function normalizeLocale(input) {
  if (!input) return 'en';
  const v = String(input).trim().toLowerCase();
  // accept-language like: "tr-TR,tr;q=0.9,en;q=0.8"
  const first = v.split(',')[0] || v;
  const base = first.split('-')[0] || first;
  return SUPPORTED_LOCALES.includes(base) ? base : 'en';
}

function getLocalizedNewMatch(locale) {
  const map = {
    tr: { title: 'Yeni eşleşme', body: 'Yeni bir eşleşme aldınız.' },
    en: { title: 'New match', body: 'You received a new match.' },
    fr: { title: 'Nouvelle correspondance', body: 'Vous avez reçu une nouvelle correspondance.' },
    ar: { title: 'مطابقة جديدة', body: 'لديك مطابقة جديدة.' },
  };
  return map[locale] || map.en;
}

function getVapidPublicKeyOnly() {
  const publicKey = String(process.env.VAPID_PUBLIC_KEY || '')
    .trim()
    .replace(/\s+/g, '');
  if (!publicKey) {
    const err = new Error('Missing VAPID_PUBLIC_KEY in backend environment.');
    err.statusCode = 500;
    throw err;
  }
  return publicKey;
}

function requireVapidForSend() {
  const publicKey = String(process.env.VAPID_PUBLIC_KEY || '')
    .trim()
    .replace(/\s+/g, '');
  const privateKey = String(process.env.VAPID_PRIVATE_KEY || '')
    .trim()
    .replace(/\s+/g, '');
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
  requireVapidForSend();

  const subs = await PushSubscription.find({ userId });
  if (!subs.length) {
    const err = new Error('User has no push subscriptions');
    err.statusCode = 404;
    throw err;
  }

  const results = await Promise.allSettled(
    subs.map(async (s) => {
      try {
        const locale = normalizeLocale(s.locale || s.acceptLanguage);

        const resolvedPayload =
          payload && payload.i18nKey === 'newMatch'
            ? {
                title: getLocalizedNewMatch(locale).title,
                body: getLocalizedNewMatch(locale).body,
                url: payload.url || '/user/dashboard',
              }
            : payload;

        const body = Buffer.from(JSON.stringify(resolvedPayload), 'utf8');
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
  const publicKey = getVapidPublicKeyOnly();
  res.json({ key: publicKey });
});

exports.getMyPushStatus = asyncHandler(async (req, res) => {
  const count = await PushSubscription.countDocuments({ userId: req.user._id });
  res.json({ subscribed: count > 0, subscriptions: count });
});

exports.subscribe = asyncHandler(async (req, res) => {
  const { subscription, deviceName, language } = req.body || {};
  const endpoint = subscription?.endpoint;

  if (!endpoint || !subscription?.keys?.p256dh || !subscription?.keys?.auth) {
    return res.status(400).json({ message: 'Invalid subscription payload' });
  }

  const locale = normalizeLocale(language || req.headers['accept-language']);

  // Ensure endpoint uniqueness across users: upsert by endpoint
  await PushSubscription.findOneAndUpdate(
    { endpoint },
    {
      userId: req.user._id,
      endpoint,
      subscription,
      userAgent: req.headers['user-agent'],
      deviceName: deviceName || null,
      locale,
      acceptLanguage: req.headers['accept-language'] || null,
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
  const payload =
    req.body?.body || req.body?.title
      ? {
          title: req.body?.title || 'PrestaLink',
          body: req.body?.body || 'Test',
          url: req.body?.url || '/user/notifications',
        }
      : {
          i18nKey: 'newMatch',
          url: req.body?.url || '/user/dashboard',
        };

  const results = await sendToUserSubscriptions(req.user._id, payload);
  res.json({ success: true, results });
});

// Admin helper: send push to user by email
exports.sendToUserByEmail = asyncHandler(async (req, res) => {
  const { email, title, body, url, i18nKey } = req.body || {};
  if (!email) return res.status(400).json({ message: 'email is required' });

  const user = await User.findOne({ email: String(email).toLowerCase() }).select('_id email name');
  if (!user) return res.status(404).json({ message: 'User not found' });

  const payload =
    body || title
      ? {
          title: title || 'PrestaLink',
          body: body || '',
          url: url || '/user/dashboard',
        }
      : {
          i18nKey: i18nKey || 'newMatch',
          url: url || '/user/dashboard',
        };

  const results = await sendToUserSubscriptions(user._id, payload);
  res.json({ success: true, user, results });
});

