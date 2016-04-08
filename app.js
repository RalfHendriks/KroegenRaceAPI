var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var bcrypt   = require('bcrypt-nodejs');

var express = require('express');
var passport = require('passport');
var flash    = require('connect-flash');
var session  = require('express-session');
var config = require('./config')();
var ConnectRoles = require('connect-roles');
var mongoose = require('mongoose');

// Logger
winston.add(winston.transports.File, {
  filename: config.logger.api
});
winston.handleExceptions(new winston.transports.File({
  filename: config.logger.exception
}));

// Mongoose
mongoose.connect(config.mlab.host);

var user = new ConnectRoles({
  failureHandler: function (req, res, action) {
    // optional function to customise code that runs when
    // user fails authorisation
    var accept = req.headers.accept || '';
    res.status(403);
    if (~accept.indexOf('html')) {
      res.render('access-denied', {action: action});
    } else {
      res.send('Access Denied - You don\'t have permission to: ' + action);
    }
  }
});

var User = require('./models/user')(mongoose,bcrypt);
var Race = require('./models/race')(mongoose);

var routes = require('./routes/index')(passport);
var races = require('./routes/race')(Race);
var users = require('./routes/users')(User);



require('./config/passport')(passport,User);
/*User.findOne({ name: 'Ralf' }, function(err, thor) {
  /*if (err) return console.error(err);
  var Ralf = thor;
  console.log(Ralf);
    var KroegenRaceBudel = new Race({
        name:  'KroegenRaceBudel',
        created_at: new Date(),
        updated_at: new Date(),
        users: Ralf._id
    });
    console.log(KroegenRaceBudel);
});*/

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views/pages'));
app.set('view engine', 'ejs');
// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'idreamofaworldwherenothingislimited' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(user.middleware());
app.use(flash());

app.use('/', routes);
app.use('/races',races);
app.use('/users', users);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('pages/error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
