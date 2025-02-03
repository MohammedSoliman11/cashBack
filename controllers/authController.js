// const auth = require('firebase-admin');
// const { getAuth, signInWithPhoneNumber } = require('firebase/auth');
const auth = require('../config/firebase/server');
const { User } = require('../models/users');

const verifyOTP = async (token) => {
  try {
    // Verify the Firebase ID token from the client
    const decodedToken = await auth.verifyIdToken(token);
    console.log('User authenticated:', decodedToken.uid);
    return decodedToken;
  } catch (error) {
    console.error('Error verifying OTP:', error);
    throw error;
  }
};

exports.verifyPhone = async (req, res) => {
  try {
    const { token } = req.body;
    const decodedToken = await verifyOTP(token);

    const phoneNumber = decodedToken.phone_number;
    const userId = decodedToken.uid;

    let user = await User.find({ phoneNumber });
    if (!user) {
      user = await user.create({ userId, phoneNumber, cashback: 0 });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
