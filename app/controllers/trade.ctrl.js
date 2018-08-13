const Book = require('../models/book');
const User = require('../models/user');
const Trade = require('../models/trade');

// get all trades for given user. params = userId
exports.getUserTrades = (req, res, next) => {
  const userId = req.params.userId;

  Trade.find({
    $or: [
      { "to": userId },
      { "from": userId }
    ]})
    .exec()
    .then((trades) => {
      return res.status(200).json({ trades });
    })
    .catch((err) => {
  		console.log(`trade.ctrl.js > getUserTrades: ${err}`);
  		return handleError(res, err);
  	});

}

// proposeTrade. params = toUser (userId), fromUser (userId), bookId
exports.proposeTrade = (req, res, next) => {
	const { toUser, fromUser, bookId } = req.params;
	const today = new Date();

	const trade = new Trade({
      to: toUser,
      from: fromUser,
      book: bookId,
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


// updateTrade status. params: tradeId, userId, status
// after this, update book owner of traded book
exports.updateTrade = (req, res, next) => {
	const { tradeId, userId, status } = req.params;
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