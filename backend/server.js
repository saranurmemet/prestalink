// Global error handler for uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ [FATAL] Uncaught Exception:', error);
  console.error('Stack:', error.stack);
  // Don't exit - allow server to continue
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ [FATAL] Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit - allow server to continue
});

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
try {
  dotenv.config();
  console.log(`🔧 [STARTUP] NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
  
  // Check critical environment variables
  const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET'];
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  if (missingVars.length > 0) {
    console.error('❌ [STARTUP] Missing required environment variables:', missingVars.join(', '));
    console.error('❌ [STARTUP] Please set these in your .env file');
  } else {
    console.log('✅ [STARTUP] All required environment variables are set');
  }
} catch (err) {
  console.warn('⚠️  [STARTUP] Error loading .env file:', err.message);
}

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorMiddleware');

console.log('🗄️  [STARTUP] Connecting to MongoDB...');
// MongoDB connection is async - don't block server startup
try {
  connectDB().catch(err => {
    console.error('⚠️  [STARTUP] MongoDB connection failed, but server will continue:', err.message);
  });
  console.log('✅ [STARTUP] MongoDB connection initiated (async)');
} catch (err) {
  console.error('⚠️  [STARTUP] Error initiating MongoDB connection:', err.message);
  console.warn('⚠️  [STARTUP] Server will continue without database');
}

const app = express();
console.log('📱 [STARTUP] Express app created');

// CORS Configuration - CRITICAL for stability
// Development: Allow all localhost origins
// Production: Use explicit CLIENT_URL from environment
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, Postman, curl, health checks)
    if (!origin) {
      return callback(null, true);
    }
    
    // Development: Allow all localhost and local network origins
    if (process.env.NODE_ENV !== 'production') {
      if (origin.startsWith('http://localhost:') || 
          origin.startsWith('http://127.0.0.1:') ||
          /^http:\/\/192\.168\.\d{1,3}\.\d{1,3}:\d+$/.test(origin) ||
          /^http:\/\/10\.\d{1,3}\.\d{1,3}\.\d{1,3}:\d+$/.test(origin) ||
          /^http:\/\/172\.(1[6-9]|2[0-9]|3[01])\.\d{1,3}\.\d{1,3}:\d+$/.test(origin)) {
        return callback(null, true);
      }
    }
    
    // Production: Use CLIENT_URL from environment
    if (process.env.CLIENT_URL) {
      const allowedUrls = process.env.CLIENT_URL.split(',').map(url => url.trim());
      // Check if origin matches any allowed URL (exact match or subdomain)
      const isAllowed = allowedUrls.some(allowedUrl => {
        try {
          const allowedHost = new URL(allowedUrl).hostname;
          const originHost = new URL(origin).hostname;
          // Exact match
          if (originHost === allowedHost) return true;
          // Subdomain match (e.g., *.vercel.app)
          if (originHost.endsWith('.' + allowedHost)) return true;
          // Vercel preview deployments pattern (*-git-*-*.vercel.app)
          if (allowedHost.includes('vercel.app') && originHost.includes('vercel.app')) {
            // Allow all vercel.app subdomains for preview deployments
            return true;
          }
          return false;
        } catch (e) {
          return origin === allowedUrl || origin.startsWith(allowedUrl);
        }
      });
      
      if (isAllowed) {
        return callback(null, true);
      }
    }
    
    console.warn(`CORS blocked origin: ${origin}`);
    callback(new Error('Not allowed by CORS policy'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept-Language', 'X-Requested-With'],
  exposedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Serve profile photos from public directory
app.use('/uploads/profile-photos', express.static(path.join(__dirname, 'public', 'profile-photos')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Test endpoint to verify API is working
app.get('/api/test', (req, res) => {
  console.log('✅ [TEST] GET /api/test called');
  res.json({ ok: true, message: 'API Test Endpoint Working', timestamp: new Date().toISOString() });
});

// Keep-alive endpoint for Render free tier (prevents spin down)
app.get('/api/keepalive', (req, res) => {
  res.json({ 
    status: 'alive', 
    timestamp: new Date().toISOString(),
    message: 'Service is active'
  });
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

let server;

try {
  server = app.listen(PORT, HOST, () => {
    console.log('\n═══════════════════════════════════════════');
    console.log('🎉 [SUCCESS] PrestaLink Backend is LIVE!');
    console.log('═══════════════════════════════════════════');
    console.log(`🌐 Server: http://${HOST}:${PORT}`);
    console.log(`🔒 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📡 CORS Origins: ${process.env.CLIENT_URL || 'http://localhost:3000 (development)'}`);
    console.log('═══════════════════════════════════════════\n');
    
    // List all mounted routes
    console.log('📍 Mounted API Endpoints:');
    console.log('   ✅ GET  /api/health');
    console.log('   ✅ GET  /api/test');
    console.log('   ✅ GET  /api/debug/routes');
    console.log('   ✅ POST /api/auth/register');
    console.log('   ✅ POST /api/auth/login');
    console.log('   ✅ GET  /api/auth/me');
    console.log('   ✅ GET  /api/jobs');
    console.log('   ✅ POST /api/applications');
    console.log('═══════════════════════════════════════════\n');
  });

  // Error handling for server
  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`❌ [ERROR] Port ${PORT} is already in use`);
      console.error('   Please stop the process using this port or change PORT in .env');
    } else {
      console.error('❌ [ERROR] Server error:', error);
    }
  });
} catch (error) {
  console.error('❌ [FATAL] Failed to start server:', error);
  console.error('Stack:', error.stack);
  process.exit(1);
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 [SHUTDOWN] SIGTERM signal received: closing HTTP server');
  if (server) {
    server.close(() => {
      console.log('✅ [SHUTDOWN] HTTP server closed');
      process.exit(0);
    });
  }
});

process.on('SIGINT', () => {
  console.log('🛑 [SHUTDOWN] SIGINT signal received: closing HTTP server');
  if (server) {
    server.close(() => {
      console.log('✅ [SHUTDOWN] HTTP server closed');
      process.exit(0);
    });
  }
});

