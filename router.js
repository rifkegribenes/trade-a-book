const APP_HOST = process.env.APP_HOST;
const CLIENT_URL = process.env.NODE_ENV === 'production' ? APP_HOST : 'localhost:3000';

const AuthController = require('./app/controllers/auth.ctrl');
const UserController = require('./app/controllers/user.ctrl');
const StaticController = require('./app/controllers/static.ctrl');
const BookController = require('./app/controllers/book.ctrl');
const TradeController = require('./app/controllers/trade.ctrl');

const express = require('express');
const passport = require('passport');
const Auth = require('./app/config/auth');
const helpers = require('./app/utils/index');

/* =========================== ROUTE MIDDLEWARE ============================ */

const requireAuth = (req, res, next) => {
  passport.authenticate('jwt', { session: false },
    (err, user, info) => {
      console.log('requireAuth');
      if (err) {
        console.log(`router.js > 22: ${err}`);
        return res.status(422).send({ success : false, message : err.message });
      }
      if (!user) {
        return res.status(422).send({ success : false, message : 'Sorry, you must log in to view this page.' });
      }
      if (user) {
        console.log(`router.js > 29: user found`);
        req.login(user, (loginErr) => {
          if (loginErr) {
            console.log(`router.js > 32: ${loginErr}`);
            return next(loginErr);
          } else {
            console.log(`router.js > 35: returning next`);
            return next(loginErr, user);
          }
        }); // req.login
      }
    })(req, res, next);
  };

module.exports = function (app) {
  // Initializing route groups
  const apiRoutes = express.Router(),
    authRoutes = express.Router(),
    userRoutes = express.Router(),
    bookRoutes = express.Router(),
    tradeRoutes = express.Router();

  // app.use(passport.initialize());
  // app.use(passport.session());

// ============================================================================
// AUTHENTICATE ===============================================================
// ============================================================================

  // Set auth routes as subgroup/middleware to apiRoutes
  apiRoutes.use('/auth', authRoutes);

  // Google authentication with passport
  authRoutes.get('/google',
    passport.authenticate('google', {scope : ['profile', 'email']} ));


  // Handle callback after Google auth
  // return user object and token to client
  // need to handle login errors client-side here if redirected to login
  authRoutes.get('/google/callback',
    passport.authenticate('google'), AuthController.socialAuthCallback
    );

  //= ========================
  // User Routes
  //= ========================

  // Set user routes as a subgroup/middleware to apiRoutes
  apiRoutes.use('/user', userRoutes);

  // View full user profile route (secured)
  // Returns fail status + message -or- user object
  userRoutes.get('/:userId', requireAuth, UserController.viewProfile);

  // Get partial user profile route (unsecured)
  // Returns fail status + message -or- first name, avatar, city, and state
  userRoutes.get('/partial/:userId', UserController.partialProfile);

  // Update a user's profile. (secured)
  // Returns fail status + message -or- updated user object
  userRoutes.put('/:userId', requireAuth, UserController.updateProfile);


  //= ========================
  // Book Routes
  //= ========================

  // Set book routes as a subgroup/middleware to apiRoutes
  apiRoutes.use('/book', bookRoutes);

  // Get all books (unsecured)
  // Returns fail status + message -or- array of all books
  bookRoutes.get('/allbooks', BookController.getAllBooks);

  // Get a single book by Id (unsecured)
  // Returns fail status + message -or- book object
  bookRoutes.get('/:bookId', BookController.getBookById);

  // Get all books for one user (unsecured)
  // Returns fail status + message -or- array of user's books
  bookRoutes.get('/userbooks/:userId', BookController.getUserBooks);

  // Search book (unsecured)
  // Returns fail status + message -or- array of possible books
  bookRoutes.get('/search/:title/:author', BookController.searchBook);

  // Add new book (secured)
  // Returns fail status + message -or- book object
  bookRoutes.put('/new', requireAuth, BookController.addBook);

  // Remove book (secured)
  // Returns fail status + message -or- book object
  bookRoutes.put('/remove/:bookId', requireAuth, BookController.removeBook);

  // Update book owner (secured)
  // Returns fail status + message -or- book object
  bookRoutes.put('/update/:userId/:bookId', requireAuth, BookController.updateBookOwner);

  // remove book ?


  //= ========================
  // Trade Routes
  //= ========================

  // Set trade routes as a subgroup/middleware to apiRoutes
  apiRoutes.use('/trade', tradeRoutes);

  // Get all trades for a user (unsecured)
  // Returns fail status + message -or- array of user's trades
  tradeRoutes.get('/usertrades/:userId', TradeController.getUserTrades);

  // Propose new trade (secured)
  // Returns fail status + message -or- trade object
  tradeRoutes.put('/new/:toUser/:fromUser/:bookId', requireAuth, TradeController.proposeTrade);

  // Update trade (secured)
  // Returns fail status + message -or- trade object
  tradeRoutes.put('/update/:tradeId/:userId/:status', requireAuth, TradeController.updateTrade);


  // Set url for API group routes
  app.use('/api', apiRoutes);

  // Catch client-side routes that don't exist on the back-end.
  // Redirects to /#/redirect={route}/{optional_id}
  app.get('/:client_route/:id?', StaticController.redirectHash);

};