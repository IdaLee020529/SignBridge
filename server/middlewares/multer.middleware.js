// multerMiddleware.js

const multer = require('multer');

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

module.exports = upload.single('video');
