const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = require('./user.js');
const Book = require('./book.js');
const TradeSchema = Schema({
  from: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  to: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  bookRequested: {
    type: Schema.Types.ObjectId,
    ref: 'Book'
  },
  bookOffered: {
    type: Schema.Types.ObjectId,
    ref: 'Book'
  },
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