var mongoose = require('mongoose');
var bcrypt = require('bcryptjs'); //for hashing password

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

//This function encrypts the password.
//This function is called from routes/users.js after
    //after new user data has passed validation
module.exports.createUser = function(newUser, callback){
  //use bcrypt to hash password
  bcrypt.genSalt(10, function(err, salt){
    bcrypt.hash(newUser.password, salt, function(err, hash){
      //store hash in your password DB
      newUser.password = hash;
      newUser.save(function(){
        console.log('New user is now registered')
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
