const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');

// Seed endpoint - Sadece production'da bir kez çalıştırılmalı
router.post('/seed-users', async (req, res) => {
  try {
    // Güvenlik: Sadece production'da ve belirli bir secret key ile
    const secretKey = req.headers['x-seed-secret'] || req.body.secretKey;
    const expectedSecret = process.env.SEED_SECRET || 'prestalink-seed-2024';
    
    if (secretKey !== expectedSecret) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Check if database is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({ 
        message: 'Database not connected',
        readyState: mongoose.connection.readyState
      });
    }

    const testUsers = [
      {
        name: 'Sara Yılmaz',
        email: 'sara@prestalink.app',
        phone: '+213555111111',
        password: 'sara',
        role: 'user',
        languages: ['FR', 'AR']
      },
      {
        name: 'Sarad Admin',
        email: 'sarad@prestalink.app',
        phone: '+213555222222',
        password: 'sarad',
        role: 'admin',
        languages: ['TR', 'EN', 'FR', 'AR']
      },
      {
        name: 'Ahmet Kaya',
        email: 'ahmet@prestalink.app',
        phone: '+905551234567',
        password: 'ahmet',
        role: 'recruiter',
        languages: ['TR', 'EN']
      },
      {
        name: 'Mehmet Demir',
        email: 'mehmet@prestalink.app',
        phone: '+213555333333',
        password: 'mehmet',
        role: 'user',
        languages: ['TR', 'FR']
      }
    ];

    const results = [];
    
    for (const userData of testUsers) {
      try {
        const existing = await User.findOne({ email: userData.email });
        if (existing) {
          results.push({ 
            email: userData.email, 
            status: 'exists', 
            message: 'User already exists' 
          });
          continue;
        }
        
        const user = await User.create(userData);
        results.push({ 
          email: userData.email, 
          status: 'created', 
          message: 'User created successfully' 
        });
      } catch (error) {
        results.push({ 
          email: userData.email, 
          status: 'error', 
          message: error.message 
        });
      }
    }

    res.json({
      success: true,
      message: 'Seed operation completed',
      results: results,
      users: results.filter(r => r.status === 'created').length
    });
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({ 
      message: 'Seed failed', 
      error: error.message 
    });
  }
});

module.exports = router;
