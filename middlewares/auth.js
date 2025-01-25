const jwt = require('jsonwebtoken');

const AppError = require('../utils/appError');
const User = require('../models/users');

const { ACCESS_TOKEN_SECRET } = process.env;

// Authentication middleware to verify the user's identity using Firebase custom tokens
const protect = async (req, res, next) => {
  // Extracting the token from the request headers
  const headerToken = req.cookies.accessToken;

  // Check if a token is provided
  if (!headerToken) {
    return next(new AppError('No token provided', 401));
  }

  // Check if the token format is valid
  if (headerToken && headerToken.split(' ')[0] !== 'Bearer') {
    return next(new AppError('Invalid token', 401));
  }

  // Extracting the actual token from the header
  const token = headerToken.split(' ')[1];

  return jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const currentUser = User.findById(user.userId);
    req.user = currentUser;
    return next();
  });
};

module.exports = protect;
