console.log("getPolls.js is linked");

$.getJSON('/poll/all', function(data) {

  if(data.length > 0){
    console.log("data", data);
    $("#no-polls").remove();

  data.forEach(function(poll) {
    var question = poll.question;
    var username = poll.username;
    var date = poll.date;
    var id = poll._id;
    var listItem = '<li><span class="title"><a href="/poll/view/' + id + '">' + question +
      '</span></a></li>';
    $(".display-polls").prepend(listItem);
  });
}
});
