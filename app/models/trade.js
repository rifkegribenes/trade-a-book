const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = require('./user.js');
const Book = require('./book.js');
const TradeSchema = Schema({
  fromUser: {
    _id: { type: String },
    name: { type: String },
    avatarUrl: { type: String }
  },
  toUser: {
    _id: { type: String },
    name: { type: String },
    avatarUrl: { type: String }
  },
  bookRequested: {
    _id: { type: String },
    title: { type: String },
    thumbnail: { type: String }
  },
  bookOffered: {
    _id: { type: String },
    title: { type: String },
    thumbnail: { type: String }
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