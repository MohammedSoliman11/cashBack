// Importing necessary modules and controllers
const express = require('express');

const { register, login, refreshToken, logout } = require('../controllers/authController'); // Importing authentication controllers

// Creating an Express Router instance
const authRouter = express.Router();

// Routes for user registration and login
authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/refresh-token', refreshToken);
authRouter.post('/logout', logout);

module.exports = authRouter;
