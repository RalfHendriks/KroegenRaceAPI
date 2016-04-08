module.exports = function(){
    var env = {};
    switch ('development') {
    case 'development':
        env = require('./development');
        break;
    case 'testing':
        env = require('./testing');
        break;
    case 'acceptance':
        env = require('./acceptance');
        break;
    case 'production':
        env = require('./production');
        break;
    default:
        console.error("Unrecognized NODE_ENV: " + process.env.NODE_ENV);
        process.exit(1);
    }
    return env;
};


