const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/User');
const { translate } = require('../utils/i18n');

const authMiddleware = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ message: translate('unauthorized', req) });
  }

  try {
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: translate('serverError', req) });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: translate('userNotFound', req) });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    res.status(401).json({ message: translate('invalidToken', req) });
  }
});

const authorizeRoles = (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: translate('forbidden', req) });
    }
    next();
  };

module.exports = {
  authMiddleware,
  authorizeRoles,
};

