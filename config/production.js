var config = module.exports = {};

config.googleplaces = {
    key: 'AIzaSyD3PUPRq9aJRVeCXaIJo2_FDb6mEAxTSWE',
    baseurl: 'https://maps.googleapis.com/maps/api/place/nearbysearch/'
};

config.facebookAuth = {
        'clientID'      : '600322860116047',
        'clientSecret'  : '080f432b8098bc46565de184bb16f934',
        'callbackURL'   : 'http://localhost:5000/auth/facebook/callback'
    },
config.googleAuth = {
		'clientID' 		: '1057465675223-t3s3ub3d0e77o0hh3uq1rv8a9hcucf8d.apps.googleusercontent.com',
		'clientSecret' 	: 'h5UI6G2kYD82IZwfhgfLhdRH',
		'callbackURL' 	: 'http://localhost:5000/auth/google/callback'
	}

config.server = {
  host: '0.0.0.0',
  port: process.env.PORT || 3000
};

config.mlab = {
  host: 'mongodb://Ralf:Test123@ds023118.mlab.com:23118/kroegenraceapi',
  port: 6379,
  options: {

  }
};

config.logger = {
    "api": "logs/api.log",
    "exception": "logs/exceptions.log"
};
