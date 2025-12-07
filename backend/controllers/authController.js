const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const asyncHandler = require('../utils/asyncHandler');

const sanitizeUser = (user) => {
  const obj = user.toObject();
  delete obj.password;
  return obj;
};

const baseLogin = async (req, res) => {
  const { email, password } = req.body;
  
  // Eğer role-specific login ise, email'i role ile birleştir
  // Örnek: ahmet@prestalink.app + user role → ahmet_user@prestalink.app
  let searchEmail = email;
  if (req.requiredRole) {
    // Email'den base name'i çıkar (ahmet@prestalink.app → ahmet)
    const emailParts = email.split('@');
    if (emailParts.length === 2) {
      const baseName = emailParts[0];
      const domain = emailParts[1];
      // Eğer zaten role suffix'i varsa (ahmet_user@), direkt kullan
      // Yoksa role ekle (ahmet → ahmet_user)
      if (!baseName.includes('_')) {
        searchEmail = `${baseName}_${req.requiredRole}@${domain}`;
      }
    }
  }
  
  const user = await User.findOne({ email: searchEmail });

  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  if (req.requiredRole && user.role !== req.requiredRole) {
    return res.status(403).json({ message: 'Forbidden for this role' });
  }

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
  res.json({ user: sanitizeUser(req.user) });
});

exports.updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Update allowed fields from req.body
  const allowedFields = ['name', 'email', 'phone', 'country', 'experienceLevel', 'bio'];
  
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined && req.body[field] !== null && req.body[field] !== '') {
      user[field] = req.body[field];
    }
  });

  // Handle languages array
  // FormData sends arrays as 'languages[]' or 'languages[0]', 'languages[1]', etc.
  if (req.body.languages) {
    if (Array.isArray(req.body.languages)) {
      user.languages = req.body.languages;
    } else {
      user.languages = [req.body.languages];
    }
  } else if (req.body['languages[]']) {
    const languagesArray = Array.isArray(req.body['languages[]']) 
      ? req.body['languages[]'] 
      : [req.body['languages[]']];
    user.languages = languagesArray;
  }

  // Handle file uploads
  if (req.files) {
    // Handle profile photo
    if (req.files.profilePhoto && req.files.profilePhoto[0]) {
      user.profilePhoto = `/uploads/profilePhotos/${req.files.profilePhoto[0].filename}`;
    }
    
    // Handle CV
    if (req.files.cv && req.files.cv[0]) {
      user.cvUrl = `/uploads/cvs/${req.files.cv[0].filename}`;
    }

    // Handle certificates (multiple files)
    if (req.files.certificates && Array.isArray(req.files.certificates)) {
      const newCertificates = req.files.certificates.map((file) => `/uploads/certificates/${file.filename}`);
      // Append to existing certificates or replace
      user.certificates = [...(user.certificates || []), ...newCertificates];
    }
  }

  await user.save();

  res.json({ user: sanitizeUser(user) });
});

exports.checkUserCV = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId).select('cvUrl');
  
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json({
    hasCV: !!user.cvUrl,
    cvUrl: user.cvUrl || null,
  });
});

