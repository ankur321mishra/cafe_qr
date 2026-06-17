import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';
import { authenticate } from '../middleware/authenticate.js';
import { success } from '../utils/apiResponse.js';
import { ValidationError } from '../utils/apiError.js';

import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Ensure uploads directory exists for local fallback
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Local disk storage
const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = crypto.randomBytes(8).toString('hex');
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  }
});

// Cloudinary storage
const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'brewhouse_menu',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  },
});

// Use Cloudinary if configured, else local
const storage = process.env.CLOUDINARY_URL ? cloudinaryStorage : diskStorage;

const fileFilter = (req, file, cb) => {
  // Accept images only
  if (!file.mimetype.startsWith('image/')) {
    return cb(new ValidationError([{ field: 'file', message: 'Only image files are allowed!' }]), false);
  }
  cb(null, true);
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

const router = Router();

// Upload image (requires authentication)
router.post('/', authenticate, upload.single('image'), (req, res) => {
  if (!req.file) {
    throw new ValidationError([{ field: 'image', message: 'No image file provided' }]);
  }
  
  // Return the path relative to the server for local, or absolute URL for cloudinary
  const imageUrl = process.env.CLOUDINARY_URL ? req.file.path : `/uploads/${req.file.filename}`;
  return success(res, { url: imageUrl }, 'Image uploaded successfully');
});

export default router;
