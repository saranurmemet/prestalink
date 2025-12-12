#!/usr/bin/env node
// Simple HTTP server to serve Next.js .next build output
const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const PORT = process.env.PORT || 3000;
const BUILD_DIR = path.join(__dirname, '..', 'frontend', '.next', 'standalone');
const PUBLIC_DIR = path.join(__dirname, '..', 'frontend', 'public');

console.log(`🚀 Starting Frontend Server on port ${PORT}...`);

// Check if build exists
if (!fs.existsSync(BUILD_DIR)) {
  console.error('❌ Build not found. Run: npm run build first');
  process.exit(1);
}

// Import Next.js built server
process.chdir(path.join(__dirname, '..', 'frontend'));

// Load Next.js internal server
try {
  const { createServer } = require('next');
  
  createServer({
    hostname: 'localhost',
    port: PORT,
    dev: false
  }).then((server) => {
    console.log(`✅ Frontend ready on http://localhost:${PORT}`);
  }).catch(err => {
    console.error('Error starting server:', err);
    process.exit(1);
  });
} catch (e) {
  // Fallback: use standalone Next.js server
  console.log('Using standalone server...');
  
  const server = http.createServer((req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }

    let filePath = path.join(PUBLIC_DIR, req.url === '/' ? 'index.html' : req.url);
    
    // Try .next static files first
    if (!fs.existsSync(filePath)) {
      filePath = path.join(BUILD_DIR, req.url);
    }
    
    // Default to index.html for SPA
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(PUBLIC_DIR, 'index.html');
    }

    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found\n');
      } else {
        const ext = path.extname(filePath);
        const mimeTypes = {
          '.html': 'text/html',
          '.js': 'application/javascript',
          '.css': 'text/css',
          '.json': 'application/json',
          '.png': 'image/png',
          '.jpg': 'image/jpeg',
          '.gif': 'image/gif',
          '.svg': 'image/svg+xml'
        };
        
        res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
        res.end(content);
      }
    });
  });

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Frontend ready on http://localhost:${PORT}`);
  });

  server.on('error', (err) => {
    console.error('Server error:', err);
    process.exit(1);
  });
}
