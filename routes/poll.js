var express = require('express');
var router = express.Router();
var Poll = require('../models/poll.js');
var User = require('../models/user.js');

//Get create poll page
router.get('/create', function(request, response) {
  response.render('create');
});

//User clicks on a poll on the front page
router.get('/view/:id', function(request, response) {
  //query database by inputs
  var id = request.params.id;

  Poll.findOne({
    "_id": id
  }, function(err, data) {
    if (err) {
      console.log(err);
    }

    response.render('poll', {
      "data": data
    });
  })
});

//User votes on a poll
router.get('/vote/:id*', function(request, response) {
  var id = request.params.id;
  var choice = request.query.choice;
  //Check: is user logged in?
  if (request.user) {
    //user is logged in.
    //Check: has user already voted on this poll?  Check user's pollsVoted array for id
    User.findOne({
      username: request.user.username
    }, function(err, user) {
      if (err) {
        console.log(err);
      }
      if (user.pollsVoted.includes(id)) {
        //Found poll id in user's polls voted array.  Send alert.
        console.log(request.user.username + " has already voted on this poll");
      } else {
        //User has not voted on this poll.
        user.pollsVoted.push(id);
        //Add this poll's id to user's pollsVoted array.
        user.save(function(err) {
          if (err) {
            console.log(err);
          }
        });
        //increment this poll option's votes by 1
        Poll.findOne({
          _id: id
        }, function(err, poll) {
          if (err) {
            console.log(err);
          }
          poll.options[choice].votes = poll.options[choice].votes + 1;
          poll.save(function(err) {
            if (err) {
              console.log(err);l
            }
          });
        });
      }
    });
  } else {
    console.log("User must log in to vote.");
    request.flash('success_msg', 'You must be logged in to vote!');
  }
  //Redirect to login page.
  response.redirect('../view/' + id);
});

//Handle getJSON call from getPolls.js to display on Index
router.get('/all', function(request, response) {
  //Get list of all polls from DATABASE
  Poll.find(function(err, data) {
    response.json(data);
  });
  //response.json
});

router.post('/create', function(request, response) {
  var question = request.body.question;
  var option1 = request.body.option1;
  var option2 = request.body.option2;
  var option3 = request.body.option3;
  var option4 = request.body.option4;
  var username = request.user.username;
  var date = new Date();
  var month= date.getMonth()+1;
  var day = date.getDate();
  var year = date.getFullYear();
  date = month + "/" + day + "/" + year;
  //TODO: FORMAT TEXT.  FIX CAPITALIZATIONS AND PUNCUATIONS

  var newPoll = new Poll({
    "username": username,
    "date": date,
    "question": question,
    "options": {
      "option1": {
        "str": option1,
        "votes": 0
      },
      "option2": {
        "str": option2,
        "votes": 0
      },
      "option3": {
        "str": option3,
        "votes": 0
      },
      "option4": {
        "str": option4,
        "votes": 0
      },
    }
  });

  //save new poll to polls collection
  newPoll.save(function(err) {
    if (err) {
      console.log(err);
    }
    response.redirect('/');
  });
});


module.exports = router;
