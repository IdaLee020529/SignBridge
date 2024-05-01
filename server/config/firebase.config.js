const { initializeApp } = require("firebase/app");
const { getStorage } = require("firebase/storage");

const firebaseConfig = {
    apiKey: "AIzaSyDPYIDHLOImw98JVqf4bPVjK0tmNJMq4ko",
    authDomain: "signbridge2.firebaseapp.com",
    projectId: "signbridge2",
    storageBucket: "signbridge2.appspot.com",
    messagingSenderId: "261183623336",
    appId: "1:261183623336:web:c16959f120474f5e11f29d",
    measurementId: "G-JK83E22W15"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

const storage = getStorage(app);

module.exports = { storage };;
