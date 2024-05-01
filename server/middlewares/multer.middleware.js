// multerMiddleware.js

const multer = require('multer');

// Function to upload videos
function uploadVideo(req, res, next) {
    const storage = multer.memoryStorage({
        // Configure storage options for videos
        // For example:
        // destination: function (req, file, cb) {
        //     cb(null, 'uploads/videos');
        // },
        // filename: function (req, file, cb) {
        //     cb(null, Date.now() + '-' + file.originalname);
        // },
    });

    const upload = multer({ storage: storage }).single('video');
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ message: 'File upload error', error: err });
        } else if (err) {
            return res.status(500).json({ message: 'Server error', error: err });
        }
        next();
    });
}

// Function to upload images
function uploadImage(req, res, next) {
    const storage = multer.memoryStorage({
        // Configure storage options for images
        // For example:
        // destination: function (req, file, cb) {
        //     cb(null, 'uploads/images');
        // },
        // filename: function (req, file, cb) {
        //     cb(null, Date.now() + '-' + file.originalname);
        // },
    });

    const upload = multer({ storage: storage }).single('image');
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ message: 'File upload error', error: err });
        } else if (err) {
            return res.status(500).json({ message: 'Server error', error: err });
        }
        next();
    });
}

module.exports = { uploadVideo, uploadImage };
