const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const AppError = require('../utils/appError');
const User = require('../models/users');

const { ACCESS_TOKEN_SECRET } = process.env;

// Authentication middleware to verify the user's identity using Firebase custom tokens
const protect = async (req, res, next) => {
  // Extracting the token from the request headers
  const headerToken = req.headers.authorization; // Fix the extraction of the token
  // console.log(headerToken);

  if(!headerToken) {
    return next(new AppError('Unauthenticated. Please login first.', 401));
  }
  const token = headerToken.split(' ')[1];
  if(!token) {
    return next(new AppError('Unauthenticated. Please login first.', 401));
  }

  return jwt.verify(token, ACCESS_TOKEN_SECRET,async (err, user) => {
    if (err) return res.sendStatus(403);
    const currentUser = await User.findOne({ _id: new mongoose.Types.ObjectId(user.userId) });
    req.user = currentUser;
    return next();
  });
};

module.exports = protect;
