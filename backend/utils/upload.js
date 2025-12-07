const path = require('path');
const fs = require('fs');
const multer = require('multer');

const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let baseDir = './uploads/certificates';
    if (file.fieldname === 'cv') {
      baseDir = './uploads/cvs';
    } else if (file.fieldname === 'profilePhoto') {
      baseDir = './uploads/profilePhotos';
    }
    const resolved = path.join(__dirname, '..', baseDir);
    ensureDir(resolved);
    cb(null, resolved);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const safeName = file.originalname.replace(/\s+/g, '_');
    cb(null, `${timestamp}-${safeName}`);
  },
});

const allowedMime = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];

const fileFilter = (req, file, cb) => {
  if (allowedMime.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

module.exports = upload;

