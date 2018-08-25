const Book = require('../models/book');
const User = require('../models/user');
const Trade = require('../models/trade');

// get all trades for given user. params = userId
exports.getUserTrades = (req, res, next) => {
  const userId = req.params.userId;

  Trade.find({
    $or: [
      { "toUser._id": userId },
      { "fromUser._id": userId }
    ]})
    .exec()
    .then((trades) => {
      return res.status(200).json({ trades });
    })
    .catch((err) => {
  		console.log(`trade.ctrl.js > 19: ${err}`);
  		return handleError(res, err);
  	});

}

// proposeTrade. body =
//  bookRequested {_id, title, thumbnail},
//  bookOffered {_id, title, thumbnail},
//  fromUser {_id, firstName, avatarUrl},
//  toUser {_id, firstName, avatarUrl},
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

    trade.save()
	    .then((trade) => {
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