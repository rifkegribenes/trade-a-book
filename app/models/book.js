
var mongoose = require('mongoose');

var BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  addedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  published: {
    type: Date,
    default: Date.now()
  },
  thumbnail: String
});

module.exports = mongoose.model('Book', BookSchema);