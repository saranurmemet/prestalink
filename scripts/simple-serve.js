#!/usr/bin/env node
// Simple HTTP server to serve Next.js .next build output
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const FRONTEND_DIR = path.join(__dirname, '..', 'frontend');
const NEXT_BUILD_DIR = path.join(FRONTEND_DIR, '.next');
const PUBLIC_DIR = path.join(FRONTEND_DIR, 'public');

console.log(`🚀 Starting Frontend Server on port ${PORT}...`);

// Check if build exists
if (!fs.existsSync(NEXT_BUILD_DIR)) {
  console.error('❌ Build not found at:', NEXT_BUILD_DIR);
  console.error('   Run: cd frontend && npm run build');
  process.exit(1);
}

const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  let filePath = req.url;
  if (filePath === '/') filePath = '/index.html';
  
  // Try .next/static first (assets)
  let tryPath = path.join(NEXT_BUILD_DIR, 'static', filePath.replace(/^\/_next/, ''));
  
  // Then try public
  if (!fs.existsSync(tryPath)) {
    tryPath = path.join(PUBLIC_DIR, filePath);
  }
  
  // Then try .next/server (SSG pages)
  if (!fs.existsSync(tryPath)) {
    tryPath = path.join(NEXT_BUILD_DIR, 'server', filePath);
  }

  // Fallback to index.html for SPA routing
  if (!fs.existsSync(tryPath) || (fs.statSync(tryPath).isDirectory && fs.statSync(tryPath).isDirectory())) {
    tryPath = path.join(PUBLIC_DIR, 'index.html');
    if (!fs.existsSync(tryPath)) {
      tryPath = path.join(FRONTEND_DIR, 'app', 'page.tsx'); // Next.js app page
    }
  }

  try {
    const content = fs.readFileSync(tryPath);
    const ext = path.extname(tryPath);
    
    const mimeTypes = {
      '.html': 'text/html; charset=utf-8',
      '.js': 'application/javascript',
      '.css': 'text/css',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.woff': 'font/woff',
      '.woff2': 'font/woff2'
    };
    
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/plain' });
    res.end(content);
  } catch (err) {
    // Return 404 HTML page
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end(`
      <!DOCTYPE html>
      <html>
      <head><title>404 Not Found</title></head>
      <body>
        <h1>404 - Page Not Found</h1>
        <p>Requested: ${filePath}</p>
        <a href="/">← Back to Home</a>
      </body>
      </html>
    `);
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Frontend ready on:`);
  console.log(`   http://localhost:${PORT}`);
  console.log(`   http://127.0.0.1:${PORT}`);
  console.log(`\n📁 Serving from: ${NEXT_BUILD_DIR}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} already in use!`);
    console.error(`   Try: PORT=4000 node scripts/serve-frontend.js`);
  } else {
    console.error('Server error:', err);
  }
  process.exit(1);
});
