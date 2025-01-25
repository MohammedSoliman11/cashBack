const jwt = require('jsonwebtoken');
const User = require('../models/users');
const CashBackModel = require('../models/cashLogs');

const { 
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRES_IN,
  ACCESS_TOKEN_EXPIRES_IN,
} = process.env;

// Controller function for user registration
exports.register = async (req, res) => {
  try {
    // Check if passwords match
    if (req.body.password !== req.body.passwordConfirm) {
      return res
        .status(400)
        .json({ status: 'Bad Request', message: "Passwords don't match" });
    }

    // Create a new user based on request data
    const userData = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    };
    const user = await User.create(userData);
    user.password = undefined;

    // Respond with success status, user data, and the custom token
    return res
      .status(201)
      .json({ status: 'OK', data: user });
  } catch (err) {
    // Handle registration failure and respond with error status
    return res.status(400).json({ status: 'fail', message: err.message });
  }
};

// Controller function for user login
exports.login = async (req, res) => {
  try {
    
    const fun = async () => { await CashBackModel.create({ userId: "66f440547bc925c1b4da4921", cashBackAmount: 0, isVerified: false}) }
    fun();

    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password)
      return res.status(400).json({ status: 'Bad Request' });

    // Find the user by email and retrieve the hashed password
    const user = await User.findOne({ email }).select('+password');

    // Check if user exists and the provided password is correct
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({ message: 'Incorrect email or password' });
    }
    user.password = undefined;
    // Generate a custom token for the authenticated user
    const userId = user._id.toString();
    
    // Generate tokens
    const accessToken = jwt.sign({ userId }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });
    const refreshToken = jwt.sign({ userId }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });


    // Set the refresh token in an HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'Strict',
    });
    res.cookie('accessToken', refreshToken, {
      httpOnly: true,
      sameSite: 'Strict',
    });

    // Respond with the custom token
    return res.status(201).json({ user, token: accessToken });
  } catch (error) {
    // Handle login failure and respond with error status
    console.error(error);
    return res.status(401).json({ message: 'Authentication failed' });
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
    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, userId) => { 
      if (err) return res.status(401).json({ message: 'Token refresh failed' });
      return userId;
    });

    const {userId} = decoded;

    // Generate a new access token
    const accessToken = jwt.sign({ userId }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });

    return res.cookie('accessToken', accessToken, {
      httpOnly: true,
      sameSite: 'Strict',
    });
  }
  catch (error) {
    // Handle token refresh failure and respond with error status
    console.error(error);
    return res.status(401).json({ message: 'Token refresh failed' });
  }
}

exports.logout = async (req, res) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
  });
  return res.status(204).json({ message: 'Logged out successfully' });
};
