var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var bcrypt   = require('bcrypt-nodejs');

var passport = require('passport');
var flash    = require('connect-flash');
var session  = require('express-session');
var config = require('./config')();
var mongoose = require('mongoose');
var socket_io = require('socket.io');
var authorization = require('./utils/authorization');
// Mongoose
mongoose.connect(config.mlab.host);

// Models
var User = require('./models/user')(mongoose,bcrypt);
var Race = require('./models/race')(mongoose);

var app = express();

// Socket.io
var io = socket_io();
app.io = io;

require('./config/passport')(passport,User);

// view engine setup
app.set('views', path.join(__dirname, 'views/pages'));
app.set('view engine', 'ejs');
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
      res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type");
      res.setHeader('Access-Control-Allow-Credentials', true);
      next();
});

app.use(session({ secret: 'idreamofaworldwherenanythingispossible' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(authorization.roles.middleware());
app.use(flash());



// Helpers
var pageHelper = require('./helpers/page')();
var barHelper = require('./helpers/bar')();
// Controllers
var authController = require('./controllers/auth')(pageHelper);
var userController = require('./controllers/user')(pageHelper, User);
var raceController = require('./controllers/race')(pageHelper, barHelper, Race, User);
var participantController = require('./controllers/participant')(pageHelper, Race, User);
var barController = require('./controllers/bar')(pageHelper, barHelper, Race, User);
var visitorController = require('./controllers/visitor')(pageHelper, Race, User);

// Routes
var routes = require('./routes/index')(pageHelper, barHelper);
var settings = require('./routes/settings')(pageHelper);
var auth = require('./routes/auth')(authController,passport);
var races = require('./routes/races')(raceController, participantController, barController, visitorController);
var users = require('./routes/users')(userController);

app.use('/', routes);
app.use('/auth',auth);
app.use('/races',authorization.checkAuth, races);
app.use('/admin',authorization.checkAuth,authorization.roles.is('admin'),settings);
app.use('/users',authorization.checkAuth,authorization.roles.is('admin'), users);

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
