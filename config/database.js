const mongoose = require('mongoose');
// const debug = require('debug')('mongo');

// const DB_URL = process.env.MONGODB_URL;

// mongoose.connection.on('error', (err) => {
//   debug('MongoDB connection error:', err);
// });

// mongoose.connection.on('connected', () => {
//   debug('MongoDB connected');
// });

// mongoose.connection.on('disconnected', () => {
//   debug('MongoDB disconnected');
// });

// mongoose.connect(DB_URL, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

const DBConnection = (DB) => {
  mongoose
    .connect(DB)
    .then(() => console.log('DB Connection is established 🚀'));
};

module.exports = DBConnection;
