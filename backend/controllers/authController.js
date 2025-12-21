const mongoose = require('mongoose');
const { OAuth2Client } = require('google-auth-library');
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

const { ensureDatabaseConnected } = require('../utils/dbCheck');
const { validateProfileData, isValidEmail } = require('../utils/validation');
const logger = require('../utils/logger');

exports.updateProfile = asyncHandler(async (req, res) => {
  // Ensure database is connected
  ensureDatabaseConnected();

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

  // Recruiter/Employer fields (use sanitized values)
  if (validation.sanitized.companyName) user.companyName = validation.sanitized.companyName;
  if (validation.sanitized.companyDescription) user.companyDescription = validation.sanitized.companyDescription;
  if (validation.sanitized.industry) user.industry = validation.sanitized.industry;
  if (validation.sanitized.city) user.city = validation.sanitized.city;

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

  logger.info('Profile updated', { userId: user._id });

  res.json({
    user: sanitizeUser(user),
    message: 'Profile updated successfully',
  });
});

// Change Password
exports.changePassword = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Current password and new password are required' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ message: 'New password must be at least 6 characters long' });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Check if user has a password (Google users might not have one)
  if (!user.password || user.password === 'google-oauth-placeholder') {
    return res.status(400).json({ message: 'Password change not available for Google-authenticated accounts' });
  }

  // Verify current password
  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    return res.status(401).json({ message: 'Current password is incorrect' });
  }

  // Update password
  user.password = newPassword;
  await user.save();

  res.json({
    message: 'Password changed successfully',
  });
});

// Google OAuth Login/Register
exports.googleAuth = asyncHandler(async (req, res) => {
  const { idToken, role: selectedRole } = req.body;

  if (!idToken) {
    return res.status(400).json({ message: 'Google ID token is required' });
  }

  // Check if GOOGLE_CLIENT_ID is configured
  if (!process.env.GOOGLE_CLIENT_ID) {
    console.error('❌ [GOOGLE_AUTH] GOOGLE_CLIENT_ID environment variable is not set');
    return res.status(500).json({ 
      message: 'Google authentication is not configured on the server. Please contact support.' 
    });
  }

  // Initialize Google OAuth client
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  try {
    // Verify the token
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    if (!email) {
      return res.status(400).json({ message: 'Google account email not found' });
    }

    // Check if user exists by Google ID or email
    let user = await User.findOne({
      $or: [{ googleId }, { email: email.toLowerCase() }],
    });

    if (user) {
      // Existing user - login
      if (!user.googleId) {
        // Link Google account to existing email-based account
        user.googleId = googleId;
      }
      
      // Update profile photo if available
      if (picture && !user.profilePhoto) {
        user.profilePhoto = picture;
      }
    } else {
      // New user - register
      const defaultRole = selectedRole || 'user';
      
      // Create user without phone (Google users may not have phone)
      // Schema allows phone to be optional for Google users (conditional required)
      const newUserData = {
        googleId,
        email: email.toLowerCase(),
        name: name || email.split('@')[0],
        password: 'google-oauth-placeholder', // Placeholder - will be hashed but never used
        role: defaultRole,
        roles: [defaultRole],
        activeRole: defaultRole,
      };
      
      // Phone is optional for Google users (schema checks googleId)
      // We don't set phone field, letting schema validation handle it
      
      if (picture) {
        newUserData.profilePhoto = picture;
      }
      
      user = await User.create(newUserData);
    }

    // Handle role selection (similar to baseLogin)
    if (user.roles && user.roles.length > 0) {
      if (selectedRole) {
        if (!user.roles.includes(selectedRole)) {
          return res.status(403).json({
            message: 'You do not have permission for this role',
            availableRoles: user.roles,
          });
        }
        user.activeRole = selectedRole;
        user.role = selectedRole;
      } else {
        user.activeRole = user.activeRole || user.roles[0];
        user.role = user.activeRole;
      }
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    const token = generateToken({ id: user._id, role: user.role });
    
    res.json({
      user: sanitizeUser(user),
      token,
      availableRoles: user.roles || [user.role],
    });
  } catch (error) {
    console.error('❌ [GOOGLE_AUTH] Error:', error);
    console.error('❌ [GOOGLE_AUTH] Error message:', error.message);
    console.error('❌ [GOOGLE_AUTH] Error stack:', error.stack);
    
    // More specific error messages
    if (error.message && error.message.includes('Token used too early')) {
      return res.status(400).json({ message: 'Invalid Google token: Token used too early' });
    }
    if (error.message && error.message.includes('invalid_token')) {
      return res.status(400).json({ message: 'Invalid Google token: Token verification failed' });
    }
    if (error.message && error.message.includes('audience')) {
      return res.status(400).json({ message: 'Invalid Google token: Token audience mismatch' });
    }
    
    // Return detailed error message for debugging (in development)
    const errorMessage = process.env.NODE_ENV === 'production' 
      ? 'Google authentication failed. Please try again.' 
      : `Google authentication failed: ${error.message || 'Unknown error'}`;
    
    return res.status(401).json({ message: errorMessage });
  }
});

