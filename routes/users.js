var express = require('express');
var router = express.Router();
var User = require('../models/user.js');
var Poll = require('../models/poll.js')
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

//Route to register.handlebars
router.get('/register', function(request, response) {
  response.render('register');
});

//Route to login.handlebars
router.get('/login', function(request, response) {
  response.render('login');
});

//Route to profile.handlebars
router.get('/profile', function(request, response) {
  response.render('profile');
});

//User clicks link on profile page to change password
router.get('/change-password', function(request, response) {
  response.render('changePassword');
});

//User submits form on changePassword page
router.post('/change-password', function(request, response) {
  var currentPassword = request.body.currentPassword;
  var newPassword = request.body.newPassword;
  var newPassword2 = request.body.newPassword2;

  request.checkBody('newPassword', 'Please enter a new password').notEmpty();
  request.checkBody('newPassword2', 'Please re-type your new password').equals(request.body.newPassword);

  var errors = request.validationErrors();

  if (errors) {
    console.log(errors);
    response.render('changePassword', {
      errors: errors
    });
  } else {
    //Check current password with the User.comparPassword function
    User.comparePassword(currentPassword, request.user.password, function(err, isMatch) {
      if(err){
        console.log(err);
      }
      if(isMatch){
        //if current matches current password, and new matches new2, then:
        //update user's document with new password
        User.findOne({_id: request.user._id}, function(err, user) {
          if(err){
            console.log(err);
          }
          user.password = newPassword;
          User.updatePassword(user, function(err) {
            if(err){
              console.log(err);
            }
          });
          console.log("New password has been saved");
          response.render('profile');
        });
      }else if(!isMatch) {
        response.json({
          "password": "invalid"
        });
      }
    });
  }
});

router.get('/user-polls', function(request, response) {
  var username = request.user.username;
  Poll.find({
    username: username
  }, function(err, data) {
    if (err) {
      console.log(err);
    }
    response.json(data);
  });
});

router.get('/user-data', function(request, response) {
  var username = request.user.username;
  User.findOne({username: username}, function(err, data) {
    if (err) {
      console.log(err);
    }
    response.json(data);
  });
});

//User registers new information from registration.handlebars
router.post('/register', function(request, response) {
  var first = request.body.first;
  var last = request.body.last;
  var username = request.body.username;
  var email = request.body.email;
  var password = request.body.password;
  var password2 = request.body.password2;

  //VALIDATE DATA -- these are express-validator functions
  request.checkBody('first', 'First name is required').notEmpty();
  request.checkBody('last', 'Last name is required').notEmpty();
  request.checkBody('username', 'Username is required').notEmpty();
  request.checkBody('email', 'Email is required').notEmpty();
  request.checkBody('email', 'Please enter a valid email').isEmail();
  request.checkBody('password', 'Password is required').notEmpty();
  request.checkBody('password2', 'Password do not match').equals(request.body.password);

  var errors = request.validationErrors();

  if (errors) {
    console.log(errors);
    response.render('register', {
      errors: errors
    });
  } else {
    //If there are no errors, then save new user's data to DATABASE
    //Route to index
    var newUser = new User({
      username: username,
      password: password,
      email: email,
      first: first,
      last: last
    });

    //createUser function is located in models.js
    //It encrypts the password and saves all user data to database
    User.createUser(newUser, function(err, user) {
      if (err) throw err;
      console.log(user);
    });
    //Registration successful -- redirect user to login page
    request.flash('success_msg', 'You are registered!');
    response.redirect('/users/login');
  }
});

//User clicks logout
router.get('/logout', function(request, response) {
  request.logout();
  console.log('User logged out');
  request.flash('success_msg', 'You are logged out.');
  response.redirect('/users/login');
});


passport.use(new LocalStrategy(
  function(username, password, done) {
    User.getUserByUsername(username, function(err, user) {
      if (err) throw err;
      if (!user) {
        console.log('Unknown User');
        return done(null, false, {
          message: 'Invalid username'
        });
      }

      User.comparePassword(password, user.password, function(err, isMatch) {
        if (err) throw err;
        if (isMatch) {
          return done(null, user);
        } else {
          console.log('Invalid password');
          return done(null, false, {
            message: 'Invalid password'
          });
        }
      });
    });
  }));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

//User signs in with username and password from login.handlebars
//AUTHENTICATE
router.post('/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
  }),
  function(request, response) {
    request.redirect('/');
  });
module.exports = router;
