const User = require('../models/user');
const helpers = require('../utils/index');

//= =======================================
// User Routes
//= =======================================
exports.viewProfile = (req, res, next) => {
  console.log('viewProfile');
  console.log(req.params.userId);
  const userId = req.params.userId;

  User.findById(userId)
    .exec()
    .then((user) => {
      console.log(`user.ctrl.js > 15: user found, generating token`);
      // Respond with JWT and user object
      const userInfo = helpers.setUserInfo(user);
      const token = helpers.generateToken(userInfo);
      return res.status(201).json({
        token,
        user
      });
    })
    .catch((err) => {
      console.log(`user.ctrl.js > 22: ${err}`);
      return res.status(400).json({ message: 'No user found.' });
    });
};

exports.partialProfile = (req, res, next) => {
  const userId = req.params.userId;
  console.log('user.ctrl.js > 30');
  console.log(userId);
  if (userId) {
    User.findById(userId)
      .exec()
      .then((user) => {
          // Respond with first name, avatar, city, and state from user object
          return res.status(201).json({
            avatarUrl: user.profile.avatarUrl,
            firstName: user.profile.firstName,
            city: user.profile.city,
            state: user.profile.state
          });
       })
      .catch((err) => {
          console.log('user.ctrl.js > 44');
          console.log(err);
          return res.status(400).json({ message: 'No user found.' });
       });
  } else {
    return next;
  }

};

exports.updateProfile = (userObj, req, res, next) => {
  const userId = req._id;

  const target = {
    _id: req.body._id
  };

  // kick off promise chain
  new Promise( (resolve, reject) => {

    // make sure the requesting user ID and target user ID match
    if (target._id.toString() === req.params.userId.toString()) {
      resolve(target);
    } else {
      reject('Error: user ID mismatch.');
    }

  })
  .then( () => {
    // map enumerable req body properties to updates object
    const updates = { ...req.body };
    // return updated document rather than the original
    const options = { new: true };

    User.findOneAndUpdate(target, updates, options)
      .exec()
      .then( user => {
        if (!user) {
          return res
            .status(404)
            .json({message: 'User not found!'});
        } else {
          return res
            .status(200)
            .json({
              message: 'User updated!',
              user
          });
        }
      })
      .catch( err => {
      return res
        .status(400)
        .json({ message: err});
      });
    })
  .catch( err => {
    return res
      .status(400)
      .json({ message: err});
  });
}