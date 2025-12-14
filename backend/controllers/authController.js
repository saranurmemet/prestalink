const mongoose = require('mongoose');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const asyncHandler = require('../utils/asyncHandler');

const sanitizeUser = (user) => {
  const obj = user.toObject();
  delete obj.password;
  return obj;
};

const baseLogin = async (req, res) => {
  try {
    const { email, password, role: selectedRole } = req.body;
    
    // Check if database is connected
    if (mongoose.connection.readyState !== 1) {
      console.error('❌ [AUTH] Database not connected. ReadyState:', mongoose.connection.readyState);
      return res.status(500).json({ 
        message: 'Database connection error. Please try again later.' 
      });
    }
    
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Çoklu rol desteği
    if (user.roles && user.roles.length > 0) {
      // Belirli role'e zorunlu giriş (ör: /auth/recruiter/login)
      if (req.requiredRole) {
        if (!user.roles.includes(req.requiredRole)) {
          return res.status(403).json({ 
            message: 'You do not have permission for this role',
            availableRoles: user.roles 
          });
        }
        // RequiredRole seç
        user.activeRole = req.requiredRole;
        user.role = req.requiredRole;
      } else if (selectedRole) {
        // Frontend'den gelen rol seçimini kullan
        if (!user.roles.includes(selectedRole)) {
          return res.status(403).json({ 
            message: 'You do not have permission for this role',
            availableRoles: user.roles 
          });
        }
        // ActiveRole'ü güncelle
        user.activeRole = selectedRole;
        user.role = selectedRole;
      } else {
        // Rol seçilmemişse mevcut activeRole veya ilk rol
        user.activeRole = user.activeRole || user.roles[0];
        user.role = user.activeRole;
      }
    } else if (req.requiredRole && user.role !== req.requiredRole) {
      // Eski sistem için fallback - tek role varsa kontrol et
      return res.status(403).json({ message: 'Forbidden for this role' });
    }

    // Update last login time
    user.lastLogin = new Date();
    await user.save();

    // Check if JWT_SECRET is set
    if (!process.env.JWT_SECRET) {
      console.error('❌ [AUTH] JWT_SECRET is not defined');
      return res.status(500).json({ 
        message: 'Server configuration error. Please contact support.' 
      });
    }

    const token = generateToken({ id: user._id, role: user.role });
    res.json({
      user: sanitizeUser(user),
      token,
      availableRoles: user.roles || [user.role]
    });
  } catch (error) {
    console.error('❌ [AUTH] Login error:', error);
    console.error('❌ [AUTH] Error stack:', error.stack);
    // Re-throw to be caught by asyncHandler
    throw error;
  }
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

exports.updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const {
    name,
    phone,
    country,
    experienceLevel,
    bio,
    languages,
    // Recruiter/Employer fields
    companyName,
    companyDescription,
    industry,
    city,
    email: contactEmail,
  } = req.body;

  // Kullanıcıyı bul
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // String alanları güncelle
  if (name) user.name = name;
  if (phone) user.phone = phone;
  if (country) user.country = country;
  if (experienceLevel) user.experienceLevel = experienceLevel;
  if (bio) user.bio = bio;
  
  // Languages - array
  if (languages) {
    // languages[] şeklinde gelebilir veya languages
    const langs = Array.isArray(languages) ? languages : (languages ? [languages] : []);
    user.languages = langs.filter(l => l); // empty values filtreleme
  }

  // Recruiter/Employer fields
  if (companyName) user.companyName = companyName;
  if (companyDescription) user.companyDescription = companyDescription;
  if (industry) user.industry = industry;
  if (city) user.city = city;

  // File uploads - Dosya yüklüyse path'i kaydet
  if (req.files) {
    // Profile Photo
    if (req.files.profilePhoto && req.files.profilePhoto[0]) {
      user.profilePhoto = `/uploads/profilePhotos/${req.files.profilePhoto[0].filename}`;
    }

    // CV
    if (req.files.cv && req.files.cv[0]) {
      user.cvUrl = `/uploads/cvs/${req.files.cv[0].filename}`;
    }

    // Certificates
    if (req.files.certificates && req.files.certificates.length > 0) {
      user.certificates = req.files.certificates.map(
        (file) => `/uploads/certificates/${file.filename}`
      );
    }
  }

  // Save user
  await user.save();

  res.json({
    user: sanitizeUser(user),
    message: 'Profile updated successfully',
  });
});

