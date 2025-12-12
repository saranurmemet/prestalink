const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const asyncHandler = require('../utils/asyncHandler');

const sanitizeUser = (user) => {
  const obj = user.toObject();
  delete obj.password;
  return obj;
};

const baseLogin = async (req, res) => {
  let { email, password } = req.body;
  
  // Transform email if role-based login (e.g., sara@prestalink.app + admin -> sara_admin@prestalink.app)
  if (req.requiredRole && email && !email.includes('_')) {
    const emailParts = email.split('@');
    if (emailParts.length === 2) {
      email = `${emailParts[0]}_${req.requiredRole}@${emailParts[1]}`;
    }
  }
  
  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  if (req.requiredRole && user.role !== req.requiredRole) {
    return res.status(403).json({ message: 'Forbidden for this role' });
  }

  // Update last login time
  user.lastLogin = new Date();
  await user.save();

  const token = generateToken({ id: user._id, role: user.role });
  res.json({
    user: sanitizeUser(user),
    token,
  });
};

exports.register = asyncHandler(async (req, res) => {
  const { name, email, phone, password, role, languages } = req.body;
  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(400).json({ message: 'Email already registered' });
  }

  const user = await User.create({
    name,
    email,
    phone,
    password,
    role: role || 'user',
    languages: languages || [],
  });

  const token = generateToken({ id: user._id, role: user.role });
  res.status(201).json({
    user: sanitizeUser(user),
    token,
  });
});

exports.login = asyncHandler(baseLogin);

exports.loginForRole = (role) =>
  asyncHandler(async (req, res) => {
    req.requiredRole = role;
    await baseLogin(req, res);
  });

exports.me = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});

