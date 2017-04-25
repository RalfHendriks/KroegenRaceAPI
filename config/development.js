var config = module.exports = {};

config.googleplaces = {
    key: '',
    baseurl: 'https://maps.googleapis.com/maps/api/place/nearbysearch/'
};

config.facebookAuth = {
        'clientID'      : '',
        'clientSecret'  : '',
        'callbackURL'   : ''
    },
config.googleAuth = {
		'clientID' 		: ',
		'clientSecret' 	: '',
		'callbackURL' 	: ''
	}

config.server = {
  host: '0.0.0.0',
  port: process.env.PORT || 3000
};

config.mlab = {
  host: '',
  port: 6379,
  options: {

  }
};

config.logger = {
    "api": "logs/api.log",
    "exception": "logs/exceptions.log"
};
