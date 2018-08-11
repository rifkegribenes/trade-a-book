var mongoose = require('mongoose');

var User = require('./user.js');
var Book = require('./book.js');
var Schema = mongoose.Schema;
var TradeSchema = mongoose.Schema({
  from: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  to: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  book: {
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