const mongoose = require('mongoose');

const cashBackLogsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'A User must have an email'],
    unique: true,
    trim: true,
    lowercase: true,
  },
  cashBackAmount: {
    type: Number,
    default: 0,
  },
  CreatedAt: { type: Date, default: new Date() },
  isVerified: { type: Boolean, default: false },
});
// Create the User model based on the user schema
const CashBackModel = mongoose.model('CashBackLogs', cashBackLogsSchema);

module.exports = CashBackModel;