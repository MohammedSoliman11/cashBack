// Importing necessary modules and controllers
const express = require("express");
const { getMe } = require("../controllers/userController.js"); // Importing user-related controllers
const protect = require("../middlewares/auth.js"); // Importing authentication middleware

// Creating an Express Router instance
const userRouter = express.Router();

// Middleware for authentication - Protects routes below this point
userRouter.use(protect);
// Protected routes for user-related operations
userRouter.get("/me", getMe); // Route to get information about the authenticated user

// Exporting the user router for use in the main application
module.exports = userRouter;
