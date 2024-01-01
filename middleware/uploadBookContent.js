const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/pdf');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedImageTypes = ['.pdf'];

  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedImageTypes.includes(ext)) {
    cb(null, true);
  } else {
    req.flash('fail', 'Only support PDF files')
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

module.exports = upload;
