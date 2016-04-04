var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var express = require('express');
var passport = require('passport');
var flash    = require('connect-flash');
var session  = require('express-session');
var config = require('./config')();

var router = express.Router();
console.log(router);
var mongoose = require('./data/db')(config.mlab.host);

//Db.save();

var routes = require('./routes/index')(router,passport);
var users = require('./routes/users');

//var User = require('./models/user')();
var Race = require('./models/race')(mongoose);

require('./config/passport')(passport);

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


/*var Ralf = new User({
  name: 'Ralf',
  local: {
      email: 'Walfie@gmail.com',
      password: 'Test123'
  }, 
});

Ralf.save(function (err,Ralf) {
  if (err) return console.error(err);
  console.dir(Ralf);
});*/

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views/pages'));
app.set('view engine', 'ejs');
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'idreamofaworldwherenothingislimited' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash());

app.use('/', routes);
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
