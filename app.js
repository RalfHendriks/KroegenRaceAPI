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
var Bar  = require('./models/bar')(mongoose);
var Race = require('./models/race')(mongoose);


var routes = require('./routes/index')(passport);
var races = require('./routes/races')(Race,User,Bar);
var users = require('./routes/users')(User);
var bars = require('./routes/bars')(Bar);

require('./config/passport')(passport,User);

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

app.use(function (req, res, next) {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
      res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      res.setHeader('Access-Control-Allow-Credentials', true);
      next();
});

app.use(session({ secret: 'idreamofaworldwherenothingislimited' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(user.middleware());
app.use(flash());

app.use('/', routes);
app.use('/races', races);
app.use('/users', users);
app.use('/bars', bars);

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
