const PWAInstall = require('../models/PWAInstall');
const asyncHandler = require('../middleware/asyncHandler');

// PWA yükleme kaydı oluştur veya güncelle
exports.trackPWAInstall = asyncHandler(async (req, res) => {
  const { deviceId, userAgent, platform, version } = req.body;
  const userId = req.user?._id || null;

  if (!deviceId) {
    return res.status(400).json({ message: 'Device ID is required' });
  }

  // Mevcut kaydı bul veya yeni oluştur
  let install = await PWAInstall.findOne({ deviceId });

  if (install) {
    // Mevcut kaydı güncelle
    install.lastSeen = new Date();
    install.isActive = true;
    if (version) install.version = version;
    if (userId) install.userId = userId;
    await install.save();
  } else {
    // Yeni kayıt oluştur
    install = await PWAInstall.create({
      deviceId,
      userAgent,
      platform,
      version,
      userId,
      installedAt: new Date(),
      lastSeen: new Date(),
    });
  }

  res.json({
    success: true,
    install: {
      id: install._id,
      installedAt: install.installedAt,
      lastSeen: install.lastSeen,
    },
  });
});

// PWA heartbeat (aktif kullanıcı takibi)
exports.pwaHeartbeat = asyncHandler(async (req, res) => {
  const { deviceId } = req.body;

  if (!deviceId) {
    return res.status(400).json({ message: 'Device ID is required' });
  }

  const install = await PWAInstall.findOne({ deviceId });
  if (install) {
    install.lastSeen = new Date();
    install.isActive = true;
    await install.save();
  }

  res.json({ success: true });
});

// İstatistikleri getir (Admin only)
exports.getAnalytics = asyncHandler(async (req, res) => {
  // Admin kontrolü
  if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'superadmin')) {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }

  // Toplam yükleme sayısı
  const totalInstalls = await PWAInstall.countDocuments();

  // Aktif kullanıcılar (son 24 saatte görülen)
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const activeUsers = await PWAInstall.countDocuments({
    lastSeen: { $gte: oneDayAgo },
    isActive: true,
  });

  // Son 7 günde yeni yüklemeler
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const recentInstalls = await PWAInstall.countDocuments({
    installedAt: { $gte: sevenDaysAgo },
  });

  // Platform dağılımı
  const platformStats = await PWAInstall.aggregate([
    {
      $group: {
        _id: '$platform',
        count: { $sum: 1 },
      },
    },
  ]);

  // Son yüklemeler
  const latestInstalls = await PWAInstall.find()
    .sort({ installedAt: -1 })
    .limit(10)
    .select('deviceId platform installedAt lastSeen version')
    .lean();

  res.json({
    totalInstalls,
    activeUsers,
    recentInstalls,
    platformStats: platformStats.reduce((acc, item) => {
      acc[item._id || 'unknown'] = item.count;
      return acc;
    }, {}),
    latestInstalls,
  });
});

