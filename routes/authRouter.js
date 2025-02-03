// Importing necessary modules and controllers
const express = require('express');

const { verifyPhone } = require('../controllers/authController'); // Importing authentication controllers

// Creating an Express Router instance
const authRouter = express.Router();

// Routes for user registration and login
// authRouter.post('/register', register);
// authRouter.post('/login', login);
authRouter.post('/verify-phone', verifyPhone);

module.exports = authRouter;
