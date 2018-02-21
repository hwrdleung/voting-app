var mongoose = require('mongoose');

//User Schema
var PollSchema = mongoose.Schema({
  username: {
    type: String
    // index: true
  },
  date: {
    type: String
  },
  question: {
    type: String
  },
  results: [{
    option: {
      type: Number,
    },
    name: {
      type: String,
    },
    votes: {
      type: Number,
    },
    _id: false
  }],
  voters: [{
    type: String,
  }]
});

var Poll = module.exports = mongoose.model('Poll', PollSchema);
