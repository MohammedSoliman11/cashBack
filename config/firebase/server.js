require("dotenv").config({ path: "../../.env" }); // To load the environment variables
const admin = require("firebase-admin");

// Decode the base64 string from the .env file
const serviceAccountBase64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
const serviceAccount = JSON.parse(
  Buffer.from(serviceAccountBase64, "base64").toString("utf-8")
);

const startServer = () => {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
};

module.exports = startServer;
