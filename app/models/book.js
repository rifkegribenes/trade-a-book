const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  authors: [{ type: String }],
  owner: {
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