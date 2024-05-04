const { ref, uploadBytesResumable, getDownloadURL, getMetadata } = require("firebase/storage");
const { storage } = require('../config/firebase.config');
const FirebaseService = {
    async uploadVideoToStorageAndGetURL(videoFile) {
        const timestamp = new Date();
        const year = timestamp.getFullYear();
        const month = ('0' + (timestamp.getMonth() + 1)).slice(-2); // Adding leading zero if needed
        const day = ('0' + timestamp.getDate()).slice(-2);
        const hours = ('0' + timestamp.getHours()).slice(-2);
        const minutes = ('0' + timestamp.getMinutes()).slice(-2);
        const seconds = ('0' + timestamp.getSeconds()).slice(-2);

        const formattedDateTime = `${year}${month}${day}${hours}${minutes}${seconds}`;
        // const filename = `${timestamp}_${videoFile.originalname}`; // Append timestamp to original filename
        const filename = `${formattedDateTime}`; // Append timestamp to original filename
        // Reference to the file in Firebase Storage
        const fileRef = ref(storage, `demoVid/${filename}`);
        const metaData = {
            contentType: videoFile.mimetype,
        }
        const uploadTask = uploadBytesResumable(fileRef, videoFile.buffer, metaData);
        try {
            await uploadTask;
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            return { downloadURL, timestamp, formattedDateTime };
        } catch (error) {
            throw error;
        }
    },

    //  upload image
    async uploadImageToStorageAndGetURL(imageFile) {
        const timestamp = new Date().getTime();
        const filename = `${timestamp}_${imageFile.originalname}`;
        const fileRef = ref(storage, `demoIssueScreenShot/${filename}`);
        const metaData = {
            contentType: imageFile.mimetype,
        }

        const uploadTask = uploadBytesResumable(fileRef, imageFile.buffer, metaData);

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