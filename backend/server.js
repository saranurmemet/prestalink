console.log('🚀 [STARTUP] Starting PrestaLink Backend Server');
console.log(`🕐 [STARTUP] Timestamp: ${new Date().toISOString()}`);
console.log(`📁 [STARTUP] Working directory: ${process.cwd()}`);

const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

console.log('📦 [STARTUP] Loading .env file...');
dotenv.config();
console.log(`🔧 [STARTUP] NODE_ENV: ${process.env.NODE_ENV}`);

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorMiddleware');

console.log('🗄️  [STARTUP] Connecting to MongoDB...');
connectDB();
console.log('✅ [STARTUP] MongoDB connection initiated');

const app = express();
console.log('📱 [STARTUP] Express app created');

// CORS Configuration - CRITICAL for stability
// Must explicitly list allowed origins - never use wildcard with credentials
const allowedOrigins = [];

// Development: Always allow localhost
if (process.env.NODE_ENV !== 'production') {
  allowedOrigins.push('http://localhost:3000');
  // Allow any local IP for PWA/mobile testing on same network
  allowedOrigins.push(/^http:\/\/192\.168\.\d{1,3}\.\d{1,3}:3000$/);
  allowedOrigins.push(/^http:\/\/10\.\d{1,3}\.\d{1,3}\.\d{1,3}:3000$/);
  allowedOrigins.push(/^http:\/\/172\.(1[6-9]|2[0-9]|3[01])\.\d{1,3}\.\d{1,3}:3000$/);
}

// Production: Use CLIENT_URL from environment (required)
if (process.env.CLIENT_URL) {
  const urls = process.env.CLIENT_URL.split(',').map(url => url.trim());
  allowedOrigins.push(...urls);
}

// Fallback production URLs (explicit, no wildcards)
if (process.env.NODE_ENV === 'production') {
  if (process.env.CLIENT_URL) {
    // Already configured above
  } else {
    // These should come from environment - only add if explicitly needed
    allowedOrigins.push('https://prestalink.vercel.app');
    allowedOrigins.push('https://prestalink.onrender.com');
  }
}

app.use(cors({ 
  origin: (origin, callback) => {
    // Allow requests without origin (mobile apps, some servers, etc.)
    if (!origin) {
      return callback(null, true);
    }
    
    // Check against allowed origins
    const isAllowed = allowedOrigins.some(allowed => {
      if (allowed instanceof RegExp) {
        return allowed.test(origin);
      }
      return allowed === origin;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS policy'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept-Language'],
  maxAge: 86400, // 24 hours
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Test endpoint to verify API is working
app.get('/api/test', (req, res) => {
  console.log('✅ [TEST] GET /api/test called');
  res.json({ ok: true, message: 'API Test Endpoint Working', timestamp: new Date().toISOString() });
});

// Load and mount routes with detailed logging
console.log('🔌 [STARTUP] Mounting API routes...');

try {
  const authRoutes = require('./routes/authRoutes');
  console.log('📍 [ROUTE] Loading authRoutes...');
  app.use('/api/auth', authRoutes);
  console.log('✅ [ROUTE] Auth routes mounted at /api/auth');
} catch (err) {
  console.error('❌ [ROUTE] Failed to load auth routes:', err.message);
}

try {
  const jobRoutes = require('./routes/jobRoutes');
  console.log('📍 [ROUTE] Loading jobRoutes...');
  app.use('/api/jobs', jobRoutes);
  console.log('✅ [ROUTE] Job routes mounted at /api/jobs');
} catch (err) {
  console.error('❌ [ROUTE] Failed to load job routes:', err.message);
}

try {
  const applicationRoutes = require('./routes/applicationRoutes');
  console.log('📍 [ROUTE] Loading applicationRoutes...');
  app.use('/api/applications', applicationRoutes);
  console.log('✅ [ROUTE] Application routes mounted at /api/applications');
} catch (err) {
  console.error('❌ [ROUTE] Failed to load application routes:', err.message);
}

try {
  const notificationRoutes = require('./routes/notificationRoutes');
  console.log('📍 [ROUTE] Loading notificationRoutes...');
  app.use('/api/notifications', notificationRoutes);
  console.log('✅ [ROUTE] Notification routes mounted at /api/notifications');
} catch (err) {
  console.error('❌ [ROUTE] Failed to load notification routes:', err.message);
}

try {
  const adminRoutes = require('./routes/adminRoutes');
  console.log('📍 [ROUTE] Loading adminRoutes...');
  app.use('/api/admin', adminRoutes);
  console.log('✅ [ROUTE] Admin routes mounted at /api/admin');
} catch (err) {
  console.error('❌ [ROUTE] Failed to load admin routes:', err.message);
}

console.log('📍 [ROUTE] All routes mounting complete');

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Prestalink API is running' });
});

// Debug: Log all registered routes
app.get('/api/debug/routes', (req, res) => {
  const routes = [];
  app._router.stack.forEach(middleware => {
    if (middleware.route) {
      routes.push(middleware.route.path);
    } else if (middleware.name === 'router') {
      middleware.handle.stack.forEach(handler => {
        routes.push(handler.route?.path);
      });
    }
  });
  res.json({ routes: routes.filter(r => r) });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

const server = app.listen(PORT, HOST, () => {
  console.log('\n═══════════════════════════════════════════');
  console.log('🎉 [SUCCESS] PrestaLink Backend is LIVE!');
  console.log('═══════════════════════════════════════════');
  console.log(`🌐 Server: http://${HOST}:${PORT}`);
  console.log(`🔒 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📡 CORS Origins: ${process.env.CLIENT_URL || 'prestalink.vercel.app'}`);
  console.log('═══════════════════════════════════════════\n');
  
  // List all mounted routes
  console.log('📍 Mounted API Endpoints:');
  console.log('   ✅ GET  /api/test');
  console.log('   ✅ GET  /api/debug/routes');
  console.log('   ✅ POST /api/auth/register');
  console.log('   ✅ POST /api/auth/login');
  console.log('   ✅ GET  /api/auth/me');
  console.log('   ✅ GET  /api/jobs');
  console.log('   ✅ POST /api/applications');
  console.log('═══════════════════════════════════════════\n');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 [SHUTDOWN] SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('✅ [SHUTDOWN] HTTP server closed');
  });
});

