const jwt = require('jsonwebtoken');

exports.setUserInfo = (request) => {
  const getUserInfo = {
    _id: request._id
  };

  return getUserInfo;
};

// Generate JWT
exports.generateToken = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
}