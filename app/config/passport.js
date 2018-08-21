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
    console.log('findExistingUser');
    User.findOne({'google.id': profile.id})
    .exec()
    .then(user => {
      if (!user) {
        console.log('user not found, going to saveNewUser');
        return saveNewUser(profile, token, done);
      } else {
        return done(null, user);
      }
    })
    .catch( (err) => {
      console.log(err);
      return done(err);
    });
  }

  // save new user
  const saveNewUser = (profile, token, done) => {
    console.log('saveNewUser');
    const newUser = new User();
    newUser.google.id = profile.id;
    newUser.google.token = token;
    newUser.google.email = profile.emails[0].value;
    newUser.profile.firstName = profile.displayName.split(' ')[0],
    newUser.profile.lastName = profile.displayName.split(' ').slice(1),
    newUser.profile.avatarUrl = profile.photos[0].value,

    // save new user to database
    newUser.save()
      .then((user) => {
        console.log(`saving new user to db`);
        return done(null, user);
      })
      .catch(err => {
        console.log(err);
        return done(err, null);
      });
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
          console.log('passport.js > 140');
          findExistingUser(profile, token, done);
        } else {
          // return existing user
          console.log('user with existing google id');
          // console.log(req.user);
          return done(null, req.user);
        }
      }); // process.nextTick()
    }) // GoogleStrategy
  );
}
