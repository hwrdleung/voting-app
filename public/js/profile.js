console.log("profile.js");


//Get data for polls this user has created and display to profile page
$.getJSON('/users/user-polls', function(data){

var pollsCreated = data;
console.log(pollsCreated);
for(var i=0; i<pollsCreated.length; i++){
  $(".display-polls").append('<li><a href="/poll/view/' + pollsCreated[i]._id + '">Question: ' + pollsCreated[i].question + '     Date created: ' + pollsCreated[i].date + '</a></li>');
}

});


/*
//Get data for polls this user has voted on and display to profile page
$.getJSON('/users/user-data', function(data){

  var pollsVoted = data.pollsVoted;
  console.log(pollsVoted);
  $(".polls-voted").append(pollsVoted);

  //Get poll data for each poll id in pollsVoted
});
*/
