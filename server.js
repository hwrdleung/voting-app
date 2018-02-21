var express = require('express');
var expressValidator = require('express-validator');
var session = require("express-session");
var cookieParser = require("cookie-parser");
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var flash = require("connect-flash");
var path = require('path');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
mongoose.connect('mongodb://noodles01:noodles0101@ds115768.mlab.com:15768/noodlesdb');
var db = mongoose.connection;

//Create instance of app
var app = express();

//bodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(''));

//Express session
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));

//Passport Init
app.use(passport.initialize());
app.use(passport.session());

//Express validator Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value){
      var namespace = param.split('.')
      , root = namespace.shift('.')
      , formParam = root;

      while(namespace.length){
        formParam += '[' + namespace.shift() + ']';
      }
      return {
        param: formParam,
        msg: msg,
        value: value
      }
  }
}));

//Define path to index.js
var index = require('./routes/index');
var users = require('./routes/users');
var poll = require('./routes/poll');


//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

//View engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'layout'}));
app.set('view engine', 'handlebars');

//Connect flash
app.use(flash());

//Global Vars
app.use(function(request, response, next){
  response.locals.success_msg = request.flash('success_msg');
  response.locals.error_msg = request.flash('error_msg');
  response.locals.error = request.flash('error');
  response.locals.user = request.user || null; console.log("user: ", response.locals.user);
  next();
});

//Route
app.use('/', index);
app.use('/users', users);
app.use('/poll', poll);

//Start server
app.listen(process.env.PORT || 3000, function(){
  console.log('Server started on port 3000');
});
