'use strict';

module.exports = {
	'googleAuth': {
		'clientID': process.env.GOOGLE_KEY,
		'clientSecret': process.env.GOOGLE_SECRET,
		'callbackURL': `${process.env.SERVER_URL}/api/auth/google/callback`
	}
};
