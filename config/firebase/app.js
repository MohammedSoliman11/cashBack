require('dotenv').config({ path: '../../.env' }); // To load the environment variables
const { initializeApp } = require('firebase/app');

const startApp = () => {
  const firebaseConfig = {
    apiKey: process.env.FIREBASE_APIKEY,
    authDomain: process.env.FIREBASE_AUTHADMIN,
    projectId: process.env.FIREBASE_PROJECTID,
    storageBucket: process.env.FIREBASE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGINGSENDERID,
    appId: process.env.FIREBASE_APPID,
    measurementId: process.env.FIREBASE_MEASUREMENTID,
  };

  // Initialize Firebase
  initializeApp(firebaseConfig);
};

module.exports = startApp;
