const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedImageTypes = ['.png', '.jpeg', '.jpg', '.gif', '.pdf'];
  const allowedVideoTypes = ['.mp4'];

  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedImageTypes.includes(ext)) {
    cb(null, true);
  } else if (allowedVideoTypes.includes(ext)) {
    cb(null, true);
  } else {
    console.log('Only PNG, JPEG, JPG, GIF, PDF and MP4 files are supported.');
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

module.exports = upload;