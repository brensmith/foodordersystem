process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
//Connect-flash allows for passing session flashdata messages. 
var flash = require('connect-flash');
var session = require('express-session');
//load passport module
var passport = require('passport');
//load passport local module and create an instance of strategy
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
//Mongoose is object modeling for our MongoDB database. 
var mongoose = require('mongoose');
var logger = require('morgan');
var configDB = require('./config/database.js');

//Connect mongoose to local mongo db
//mongodb://localhost/olfos

//connect to olfos mlab database mongodb://admin:root@ds151060.mlab.com:51060/olfos
 // connect to our database
mongoose.connect(configDB.url);
var db = mongoose.connection;
// require files from route folder, no need for .js at the end of the file name
var routes = require('./routes/index');
var users = require('./routes/users');
var admin = require('./routes/admin');
var staff = require('./routes/staff');






// Init App
var app = express();

app.use(logger('dev'));
  
// View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({
  defaultview: 'index1'
}));
app.set('view engine', 'handlebars');

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));
// Set Static Folder
app.use(express.static(path.join(__dirname, 'bower_components')));

// Express Session
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
    var namespace = param.split('.'),
      root = namespace.shift(),
      formParam = root;

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

app.use('/', routes);
app.use('/users', users);
app.use('/admin', admin);
app.use('/staff', staff);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


// Set Port
app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function() {
  console.log('Server started on port ' + app.get('port'));
});

//var UserService = require("./models/user.service.js")(FoodApp, User, passport);