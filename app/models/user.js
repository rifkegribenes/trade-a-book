const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const toLower = (str) => {
  return str.toLowerCase();
};

//= ===============================
// User Schema
//= ===============================
const UserSchema = new Schema(
  {
    profile: {
      firstName: { type: String },
      lastName: { type: String },
      avatarUrl: { type: String },
      city: { type: String },
      state: { type: String }
    },
    google: {
      token: { type: String },
      id: { type: String },
      email: { type: String, set: toLower }
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('User', UserSchema);