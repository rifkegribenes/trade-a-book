const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  authors: [{ type: String }],
  owner: {
    type: String
  },
  published: {
    type: String
  },
  thumbnail: String,
  googleId: String
});

module.exports = mongoose.model('Book', BookSchema);