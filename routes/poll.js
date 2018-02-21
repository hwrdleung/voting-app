var express = require('express');
var router = express.Router();
var Poll = require('../models/poll.js');
var User = require('../models/user.js');

//Get create poll page
router.get('/create', function(request, response) {
  response.render('create');
});

//Get poll data by adding poll id as param
router.get('/poll-data/:id', function(request, response) {
  var id = request.params.id;
  Poll.findOne({_id: id}, function(err, poll) {
    if(err){
      console.log(err);
    }
    response.json(poll);
  });
})

router.get('/delete/:id*', function(request, response) {
  var id = request.params.id;
  var username = request.user.username;

  Poll.findOne({_id: id}, function(err, poll) {
    if (err) {
      console.log(err);
    }
    //Check: was this poll created by the current user?
    if (poll.username === username) {
      //delete this poll from database
      poll.remove();
      response.redirect('/users/profile');
    }
  });
});

//User clicks on a poll on the front page
router.get('/view/:id', function(request, response) {
  //query database by inputs
  var id = request.params.id;

  Poll.findOne({_id: id}, function(err, data) {
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


  Poll.findById(id, function(err, poll) {
    if (err) {
      console.log(err);
    }

    //User must log in to vote
    if (request.user) {
      var voters = poll.voters;
      var userId = request.user._id.toString();
      console.log("-------------------------", voters, userId);
      console.log(voters.includes(userId));
      if (!voters.includes(userId)) {
        var results = poll.results[choice].votes;
        results += 1;
        poll.results[choice].votes = results;
        poll.voters.push(request.user._id);
        poll.save();
      } else if (voters.includes(userId)) {
        request.flash('success_msg', 'You can only vote once!');
      }
    } else if (!request.user) {
      request.flash('success_msg', 'You must log in to vote!');
    }

    response.redirect('/poll/view/' + id);
  });

});

//Handle getJSON call from getPolls.js to display all polls on Index
router.get('/all', function(request, response) {
  //Get list of all polls from DATABASE
  Poll.find(function(err, data) {
    response.json(data);
  });
  //response.json
});

//User submits a form to create a poll
router.post('/create', function(request, response) {
  var username = request.user.username;
  var date = new Date();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var year = date.getFullYear();
  date = month + "/" + day + "/" + year;

  var pollArr = [];
  for (var arg in request.body) {
    pollArr.push(request.body[arg]);
  }
  var question = pollArr.shift();
  var results = [];
  var obj = {};

  //Create results array and use $set to save
  for (var i = 0; i < pollArr.length; i++) {
    obj = {
      option: i,
      name: pollArr[i],
      votes: 0
    }
    results.push(obj);
  }

  var newPoll = new Poll({
    "username": username,
    "date": date,
    "question": question,
    "voters": [],
    "results": results
  });

  newPoll.save(function(err) {
    if (err) {
      console.log(err);
    }
  });
  response.redirect('/');
});


module.exports = router;
