const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/farmers');
  },
  filename: function (req, file, cb) {
    cb(null, 'temp_' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

module.exports = upload;
