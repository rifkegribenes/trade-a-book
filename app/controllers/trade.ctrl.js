const Book = require('../models/book');
const User = require('../models/user');
const Trade = require('../models/trade');


// takes an array of user trades and
// populates user and book data before returning to client
const populateTradeData = (trades) => {
  return new Promise((resolve, reject) => {
    const enrichedTradeList = trades.map((trade) => {
      console.log('trade.ctrl.js > 10');
      console.log(trade);
      console.log(trade.bookRequested);
      Book.findOne({ _id: trade.bookRequested })
        .then((bookRequested) => {
          if (bookRequested) {
            console.log('trade.ctrl.js > 16')
            console.log(bookRequested);
            console.log(bookRequested.title);
            console.log(bookRequested.thumbnail);
            const bookRequestedData = {
              title: bookRequested.title,
              thumbnail: bookRequested.thumbnail
            };
            console.log(bookRequestedData);

            Book.findOne({ _id: trade.bookOffered })
            .then((bookOffered) => {
              if (bookOffered) {
              const bookOfferedData = {
                title: bookOffered.title,
                thumbnail: bookOffered.thumbnail
                };

              User.findOne({ _id: trade.toUser })
                .then((toUser) => {
                  if (toUser) {
                    const toUserData = {
                      firstName: toUser.profile.firstName,
                      avatarUrl: toUser.profile.avatarUrl
                      };
                    console.log('trade.ctrl.js > 36');
                    console.log({ ...trade._doc, bookRequestedData, bookOfferedData, toUserData });
                    return { ...trade._doc, bookRequestedData, bookOfferedData, toUserData };
                    } else {
                      console.log(`trade.ctrl.js > 41: toUser not found`);
                      reject('toUser not found');
                    }
                })
                .catch(err => {
                  console.log(`trade.ctrl.js > 45: ${err}`);
                  reject(err);
                });


              } else {
                console.log(`trade.ctrl.js > 51: bookOffered not found`);
                reject('bookOffered not found');
              }

              })
            .catch(err => {
              console.log(`trade.ctrl.js > 57: ${err}`);
              reject(err);
            });
            } else {
              console.log(`trade.ctrl.js > 61: bookRequested not found`);
              reject('bookRequested not found');
            }
          })
      .catch(err => {
        console.log(`trade.ctrl.js > 66: ${err}`);
        reject(err);
      });
    });
    // need to figure out how to resolve whole map / array, not just one item
    resolve(enrichedTradeList);
  });
}



// get all trades for given user. params = userId
exports.getUserTrades = (req, res, next) => {
  console.log('getUserTrades');
  const userId = req.params.userId;
  console.log(userId);

  Trade.find({
    $or: [
      { "toUser": userId },
      { "fromUser": userId }
    ]})
    .exec()
    .then((trades) => {
      console.log('trade.ctrl.js > 70');
      console.log(trades);
      populateTradeData(trades)
        .then((enrichedTradeList) => {
          console.log('trade.ctrl.js > 73');
          console.log(enrichedTradeList); // this is a single object and should be an array of objects ????
          return res.status(200).json({ trades: enrichedTradeList });
        })
        .catch((err) => {
          console.log(`trade.ctrl.js > 78: ${err}`);
          return handleError(res, err);
        });

    })
    .catch((err) => {
  		console.log(`trade.ctrl.js > 84: ${err}`);
  		return handleError(res, err);
  	});

}

// proposeTrade. body =
//  bookRequested (bookId),
//  bookOffered (bookId),
//  fromUser (userId),
//  toUser (userId),
exports.proposeTrade = (req, res, next) => {
	const { bookRequested, bookOffered, fromUser, toUser } = req.body;
	const today = new Date();

	const trade = new Trade({
      toUser,
      fromUser,
      bookRequested,
      bookOffered,
      status: "pending",
  		createdAt: today
    });
    console.log(trade);

    trade.save()
	    .then((trade) => {
	      console.log('new trade saved');
	      console.log(trade);
	      return res.status(200).json({
	          message: 'Trade saved successfully',
	          trade
	        });
	    })
	    .catch((err) => {
	      console.log(`trade.ctrl.js > proposeTrade: ${err}`);
      return handleError(res, err);
	    });
}


// updateTrade status. body: tradeId, userId, status
// after this, update book owner of traded book
exports.updateTrade = (req, res, next) => {
	const { tradeId, userId, status } = req.body;
	const target = { _id: tradeId };
  const updates = { status };
  const options = { new: true };

  Trade.findOneAndUpdate(target, updates, options)
    .exec()
    .then((trade) => {
    	return res.status(200).json({trade});
      })
    .catch((err) => {
      console.log(`trade.ctrl.js > updateTrade: ${err}`);
      return handleError(res, err);
    });
}

const handleError = (res, err) => {
  return res.status(500).json({message: err});
}