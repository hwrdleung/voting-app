var mongoose = require('mongoose');

//User Schema
var UserSchema = mongoose.Schema({
    username: {
      type: String,
      index: true
    },
    date: {
      type: String
    },
    question: {
      type: String
    },
    options: {
      option1 : {
        str: {
          type: String
        },
        votes: {
          type: Number
        }
      },
      option2 : {
        str: {
          type: String
        },
        votes: {
          type: Number
        }
      },
      option3 : {
        str: {
          type: String
        },
        votes: {
          type: Number
        },
      },
      option4 : {
        str: {
          type: String
        },
        votes: {
          type: Number
        }
      }
    }
});

var Poll = module.exports = mongoose.model('Poll', UserSchema);
