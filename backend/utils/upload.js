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

// CV için sadece PDF ve DOCX, profil fotoğrafı için image
const allowedMimeCV = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
  'application/msword' // DOC (eski format)
];

const allowedMimeImage = ['image/png', 'image/jpeg', 'image/jpg'];

const fileFilter = (req, file, cb) => {
  // CV veya sertifika için
  if (file.fieldname === 'cv' || file.fieldname === 'certificate') {
    if (allowedMimeCV.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type — only PDF and DOCX allowed for CV/certificates'), false);
    }
  }
  // Profil fotoğrafı için
  else if (file.fieldname === 'profilePhoto') {
    if (allowedMimeImage.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type — only PNG, JPG, JPEG allowed for profile photos'), false);
    }
  }
  // Diğer fieldlar için (güvenlik)
  else {
    cb(new Error('Unsupported file field'), false);
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

