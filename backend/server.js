const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorMiddleware');

connectDB();

const app = express();

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

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

app.get('/', (req, res) => {
  res.json({ message: 'Prestalink API is running' });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';
app.listen(PORT, HOST, () => {
  console.log(`Server listening on ${HOST}:${PORT}`);
});

