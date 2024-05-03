// const { Storage } = require('@google-cloud/storage');
// const storage = new Storage();
// const bucketName = 'your-bucket-name'; // Replace with your GCS bucket name

// async function uploadVideoToGCS(req) {
//     try {
//         if (!req.file) {
//             throw new Error('No file uploaded');
//         }

//         const bucket = storage.bucket(bucketName);
//         const file = bucket.file(req.file.originalname);

//         await file.save(req.file.buffer, {
//             contentType: req.file.mimetype,
//             public: true, // Make the file publicly accessible (optional)
//         });

//         // Get the public URL of the uploaded file
//         const url = `https://storage.googleapis.com/${bucketName}/${file.name}`;
//         return url;
//     } catch (error) {
//         throw new Error(`Error uploading file to Google Cloud Storage: ${error.message}`);
//     }
// }

// module.exports = async function gcsUploadMiddleware(req, res, next) {
//     try {
//         const gcsUrl = await uploadVideoToGCS(req);
//         req.gcsUrl = gcsUrl; // Attach the GCS URL to the request object
//         next();
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };
