
console.log("getPolls.js is linked");

$.getJSON('/poll/all', function(data){
  data.forEach(function(poll){
    var question = poll.question;
    var username = poll.username;
    var date = poll.date;
    var id = poll._id;
    var listItem = '<li><a href="/poll/view/' + id +'">' + question +
    '<span class="small"> Created by: ' + username + ' on ' + date +'</span></a></li>';
    $(".display-polls").prepend(listItem);
  });
});
