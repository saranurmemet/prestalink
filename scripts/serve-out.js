const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || process.argv[2] || 3000;
const HOST = '127.0.0.1';
const baseDir = path.join(__dirname, '..', 'frontend', 'out');

const mime = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

function send404(res) {
  res.statusCode = 404;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Not found');
}

const server = http.createServer((req, res) => {
  try {
    let reqPath = decodeURIComponent(req.url.split('?')[0]);
    if (reqPath === '/') reqPath = '/index.html';
    const filePath = path.join(baseDir, reqPath);

    if (!filePath.startsWith(baseDir)) {
      send404(res);
      return;
    }

    fs.stat(filePath, (err, stats) => {
      if (err || !stats.isFile()) {
        send404(res);
        return;
      }
      const ext = path.extname(filePath);
      const contentType = mime[ext.toLowerCase()] || 'application/octet-stream';
      res.statusCode = 200;
      res.setHeader('Content-Type', contentType);
      const stream = fs.createReadStream(filePath);
      stream.pipe(res);
    });
  } catch (e) {
    console.error(e);
    send404(res);
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Static server serving ${baseDir} on http://${HOST}:${PORT}`);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception', err);
});
process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection', err);
});
