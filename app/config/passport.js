// Importing Passport, strategies, and config
const passport = require('passport'),
  User = require('../models/user'),
  Auth = require('../config/auth'),
  JwtStrategy = require('passport-jwt').Strategy,
  ExtractJwt = require('passport-jwt').ExtractJwt,
  GoogleStrategy = require('passport-google-oauth2').Strategy;

module.exports = (passport) => {

  // JWT strategy options
  const jwtOptions = {
    // Telling Passport to check authorization headers for JWT
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    // Telling Passport where to find the secret
    secretOrKey: process.env.JWT_SECRET,
    passReqToCallback : true
  };

  // JWT login strategy
  passport.use('jwt', new JwtStrategy(jwtOptions,
    (req, payload, done) => {
      // console.log(payload);
      User.findById(payload._id, (err, user) => {
        if (err) { return done(err, false); }

        if (user) {
          done(null, user);
        } else {
          done(null, false);
        }
      });
  }));

  //= ========================
  // Social logins
  //= ========================

  // helper methods for updating existing profile with social login info

  const findExistingUser = (profile, token, done) => {
    // if mongo user exists with empty platform key,
    // update with platform info and return updated user
    const target = {
      'profile.email': profile.emails[0].value
      };
    const updates = {
      google: {
        id: profile.id,
        token: token,
        email: profile.emails[0].value
      },
      profile: {
        firstName: profile.displayName.split(' ')[0],
        lastName: profile.displayName.split(' ').slice(1),
        email: profile.emails[0].value,
        avatarUrl: profile.photos[0].value,
      }
    };
    // return updated document rather than the original
    const options = { new: true };

    User.findOneAndUpdate(target, updates, options)
    .exec()
    .then( (user) => {
      if (!user) {
        saveNewUser(updates, options, profile, token, done);
      } else {
        // found user with matching id and empty fb key
        // update & return new user
        return done(null, user);
      }
    }) // then
    .catch( (err) => {
      console.log(err);
      return done(err);
    }); // catch
  }

  // save new user
  const saveNewUser = (updates, options, profile, token, done) => {
    const target = {
      'profile.email': profile.emails[0].value
    };
    User.findOneAndUpdate(target, updates, options)
    .exec()
    .then( (user) => {
      if (!user) {
        // if no user found with that email, create one
        var newUser = new User();
        newUser[platform].id = profile.id;
        newUser[platform].token = token;
        newUser[platform].email = profile.emails[0].value;
        newUser.profile.firstName = profile.displayName.split(' ')[0],
        newUser.profile.lastName = profile.displayName.split(' ').slice(1),
        newUser.profile.email = profile.emails[0].value;
        newUser.profile.avatarUrl = profile.photos[0].value,

        console.log(newUser);

        // save new user to database
        newUser.save((err) => {
          console.log(`saving new user to db`);
          if (err) {
            console.log(err);
            throw err;
          }
          return done(err, newUser);
        });
      } else {
        // found user with matching id and different platform key.
        // update & return new user
        return done(null, user);
      }
    }) // then
    .catch( (err) => {
      console.log(err);
      return done(err);
    }); // catch
  }


    // Google strategy options
  const googleOptions = {
    clientID: Auth.googleAuth.clientID,
    clientSecret: Auth.googleAuth.clientSecret,
    callbackURL: Auth.googleAuth.callbackURL,
    passReqToCallback: true,
    profileFields: ['id', 'emails', 'name', 'photos'],
    scope: ['profile', 'email'],
  };

  // Google login strategy
  passport.use('google', new GoogleStrategy(googleOptions,
    (req, token, refreshToken, profile, done) => {
      console.log(`Google login by ${profile.name.givenName} ${profile.name.familyName}, ID: ${profile.id}`);
      process.nextTick( () => {
        // console.log(req.user);
        // check if user is already logged in
        if (!req.user) {
          findExistingUser(profile, token, 'google', done)
        } else {
          // return existing user
          console.log('user with existing google id');
          console.log(req.user);
          return done(null, req.user);
        }
      }); // process.nextTick()
    }) // GoogleStrategy
  );

}
