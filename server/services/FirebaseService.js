const { ref, uploadBytesResumable, getDownloadURL } = require("firebase/storage");
const { storage } = require('../config/firebase.config');
const FirebaseService = {
    async uploadVideoToStorageAndGetURL(videoFile) {
        const timestamp = new Date().getTime(); // Get current timestamp
        const filename = `${timestamp}_${videoFile.originalname}`; // Append timestamp to original filename
        // Reference to the file in Firebase Storage
        const fileRef = ref(storage, `demoVid/${filename}`);
        const metaData = {
            contentType: videoFile.mimetype,
        }
        const uploadTask = uploadBytesResumable(fileRef, videoFile.buffer, metaData);
        try {
            await uploadTask;
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            return downloadURL;
        } catch (error) {
            throw error;
        }
    }
};


module.exports = FirebaseService