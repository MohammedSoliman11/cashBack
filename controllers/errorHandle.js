// // const AppError = require("../utils/appError");

// const sendErrorDev = (err, req, res) => {
//   // A) API
//   if (req.originalUrl.startsWith("/api")) {
//     return res.status(err.statusCode).json({
//       status: err.status,
//       error: err,
//       message: err.message,
//       stack: err.stack,
//     });
//   }
// };

// const sendErrorProd = (err, req, res) => {
//   // A) API
//   if (req.originalUrl.startsWith("/api")) {
//     // A) Operational, trusted error: send message to client
//     if (err.isOperational) {
//       return res.status(err.statusCode).json({
//         status: err.status,
//         message: err.message,
//       });
//     }
//     // B) Programming or other unknown error: don't leak error details
//     // 1) Log error
//     console.error("ERROR 💥", err);
//     // 2) Send generic message
//     return res.status(500).json({
//       status: "error",
//       message: "Something went very wrong!",
//     });
//   }

//   // B) RENDERED WEBSITE
//   // A) Operational, trusted error: send message to client
//   if (err.isOperational) {
//     return res.status(err.statusCode).render("error", {
//       title: "Something went wrong!",
//       msg: err.message,
//     });
//   }
//   // B) Programming or other unknown error: don't leak error details
//   // 1) Log error
//   console.error("ERROR 💥", err);
//   // 2) Send generic message
//   return res.status(err.statusCode).render("error", {
//     title: "Something went wrong!",
//     msg: "Please try again later.",
//   });
// };

// module.exports = AppError = (err, req, res, next) => {
//   // console.log(err.stack);

//   err.statusCode = err.statusCode || 500;
//   err.status = err.status || "error";

//   if (process.env.NODE_ENV === "development") {
//     sendErrorDev(err, req, res);
//   } else if (process.env.NODE_ENV === "production") {
//     let error = { ...err };
//     error.message = err.message;
//     sendErrorProd(error, req, res);
//   }
// };

const AppError = require("../utils/appError.js");

const globalErrorHandler = (err, req, res, next) => {
  // Set default error values
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // Send error response to the client
  res.status(err.statusCode).json({
    status: err.status,
    message: err.isOperational ? err.message : "Something went wrong",
    // Only show error details in development mode
    ...(process.env.NODE_ENV === "development" && {
      error: err,
      stack: err.stack,
    }),
  });
};

module.exports = globalErrorHandler;
