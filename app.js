// Importing required modules
const express = require('express'); // Express.js for building the web application
const morgan = require('morgan'); // Morgan for HTTP request logging
const cors = require('cors'); // Cors for handling Cross-Origin Resource Sharing
const cookieParser = require('cookie-parser');



// const AppError = require("./utils/appError.js");
const globalErrorHandler = require('./controllers/errorHandle');
const userRouter = require('./routes/usersRouter');
const authRouter = require('./routes/authRouter');

const app = express(); // Creating an Express application instance
app.use(cors({
  origin: "http://localhost:5173", // React app's origin
    credentials: true, // Allow cookies and credentials
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
}));
app.use(cookieParser());

// Middleware setup
app.use(express.json()); // Parsing JSON request bodies

// Enable CORS with the desired configuration


app.use(morgan('dev')); // Using 'dev' format for HTTP request logging
app.use('/api/v1/auth', authRouter); // Mounting the auth routers
app.use('/api/v1/users', userRouter); // Mounting the user router at the specified path

app.get('/', (req, res) => res.send('welcome to the project'));
// Catch-all route for handling undefined routes
app.all('*', (req, res) =>
  res.status(404).json({ message: 'Page not found!' }),
);
app.use(globalErrorHandler); // Error handlers
// Exporting the Express application instance for external use
module.exports = app;
