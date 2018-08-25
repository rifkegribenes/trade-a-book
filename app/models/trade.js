const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = require('./user.js');
const Book = require('./book.js');
const TradeSchema = Schema({
  fromUser: { type: String },
  toUser: { type: String },
  bookRequested: { type: String },
  bookOffered: { type: String },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Trade', TradeSchema);