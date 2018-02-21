var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

//User Schema
var UserSchema = mongoose.Schema({
    username: {
      type: String,
      index: true
    },
    password: {
      type: String
    },
    email: {
      type: String
    },
    first: {
      type: String
    },
    last: {
      type: String
    },
    pollsCreated: {
      type: Array
    },
    pollsVoted: {
      type: Array
    }
});

var User = module.exports = mongoose.model('User', UserSchema);

//When a new user registers:  encrypt password and save newUser to db
module.exports.createUser = function(newUser, callback){
  //use bcrypt to hash password
  bcrypt.genSalt(10, function(err, salt){
    bcrypt.hash(newUser.password, salt, function(err, hash){
      //store hash in your password DB
      newUser.password = hash;
      newUser.save(function(){
        console.log('New user is now registered');
      });
    });
  });
}

//Hash and save new password for an existing record in the db
module.exports.updatePassword = function(user, callback){
    //salt and hash new password
    //save new hash to this user's document
    bcrypt.genSalt(10, function(err, salt){
      bcrypt.hash(user.password, salt, function(err, hash){
        //store hash in your password DB
        user.password = hash;
        user.save(function(){
          console.log("User's password has been updated");
        });
      });
    });
}

//These functions are called in routes/users.js when user tries to login
module.exports.getUserByUsername = function(username, callback){
  console.log('Searching database for username ' + username);
  var query = {username: username};
  User.findOne(query, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
  console.log('Checking password');
  bcrypt.compare(candidatePassword, hash, function(err, isMatch){
    if(err) throw err;
    console.log('Password matches, user is logged in');
    callback(null, isMatch);
  })
}

module.exports.getUserById = function(id, callback){
  console.log('Getting user by ID');
  User.findById(id, callback);
}
