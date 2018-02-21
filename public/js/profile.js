console.log("profile.js");

//Get data for polls this user has created and display to profile page
$.getJSON('/users/user-polls', function(data) {
  var pollsCreated = data;
  var listItem = "";

  for (var i = 0; i < pollsCreated.length; i++) {
    listItem = '<li><span class="title"><a href="/poll/view/' +
      pollsCreated[i]._id + '">' +
      pollsCreated[i].question +
      '</span><span class="caption">Created on ' +
      pollsCreated[i].date +
      '</a></span></li><li><a href="/poll/delete/' + pollsCreated[i]._id + '" class="delete-btn">X</a></li>';
    $(".display-polls").prepend(listItem);
  }
  
});
