const { initializeApp } = require("firebase/app");
const { getStorage } = require("firebase/storage");

const firebaseConfig = {
    apiKey: "AIzaSyBcDEVLtLmS3efWtFSujxYTEhrTS7xkZPw",
    authDomain: "signbridge-5e0de.firebaseapp.com",
    projectId: "signbridge-5e0de",
    storageBucket: "signbridge-5e0de.appspot.com",
    messagingSenderId: "19684228565",
    appId: "1:19684228565:web:c6e52fc9a81cd03b99915c",
    measurementId: "G-HXG3NEK4DN"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

const storage = getStorage(app);

module.exports = { storage };;
