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
var socket_io = require('socket.io');
var auth = require('./controllers/auth');

// Mongoose
mongoose.connect(config.mlab.host);

var user = new ConnectRoles({
  failureHandler: function (req, res, action) {
    var accept = req.headers.accept || '';
    res.status(403);
    if (~accept.indexOf('html')) {
      res.render('access-denied', {action: action});
    } else {
      res.send('Access Denied - You don\'t have permission to: ' + action);
    }
  }
});

// Models
var User = require('./models/user')(mongoose,bcrypt);
var Race = require('./models/race')(mongoose);

// Auth
var authController = new auth(User);

// Helpers
var pageHelper = require('./helpers/page')(authController);
var barHelper = require('./helpers/bar')();

// Controllers
var userController = require('./controllers/user')(pageHelper, User);
var raceController = require('./controllers/race')(pageHelper, barHelper, Race, User);
var participantController = require('./controllers/participant')(pageHelper, Race, User);
var barController = require('./controllers/bar')(pageHelper, barHelper, Race, User);
var visitorController = require('./controllers/visitor')(pageHelper, Race, User);

// Routes
var routes = require('./routes/index')(authController);
var auth = require('./routes/auth')(authController,passport);
var races = require('./routes/races')(raceController, participantController, barController, visitorController);
var users = require('./routes/users')(userController);

require('./config/passport')(passport,User);

var app = express();

// Socket.io
var io = socket_io();
app.io = io;

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

app.use(session({ secret: 'idreamofaworldwherenothingislimited' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(user.middleware());
app.use(flash());

app.use('/', routes);
app.use('/auth',auth);
app.use('/races', races);
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
