// Importing necessary modules and controllers
const express = require("express");

const { register, login } = require("../controllers/authController.js"); // Importing authentication controllers

// Creating an Express Router instance
const authRouter = express.Router();

// Routes for user registration and login
authRouter.post("/register", register);
authRouter.post("/login", login);

module.exports = authRouter;
