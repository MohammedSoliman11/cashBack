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

// Controller function for refreshing the access token
exports.refreshToken = async (req, res) => {
  try {
    // Get the refresh token from the cookie
    const { refreshToken } = req.cookies;

    // Check if a refresh token is provided
    if (!refreshToken)
      return res.status(401).json({ message: 'Not Authorized' });

    // Verify the refresh token
    const decoded = jwt.verify(
      refreshToken,
      REFRESH_TOKEN_SECRET,
      (err, userId) => {
        if (err)
          return res.status(401).json({ message: 'Token refresh failed' });
        return userId;
      },
    );

    const { userId } = decoded;

    // Generate a new access token
    const accessToken = jwt.sign({ userId }, ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    });

    return res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'None', // Allows cross-site requests
      path: '/', // Cookie valid for all routes
    });
  } catch (error) {
    // Handle token refresh failure and respond with error status
    console.error(error);
    return res.status(401).json({ message: 'Token refresh failed' });
  }
};

exports.logout = async (req, res) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: true,
    sameSite: 'None', // Allows cross-site requests
    path: '/', // Cookie valid for all routes,
  });
  return res.status(204).json({ message: 'Logged out successfully' });
};
