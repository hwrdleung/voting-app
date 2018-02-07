
console.log("main.js");

function vote(option){

  var url = window.location.href;
  var id = url.split("/");
  id = id[id.length-1];
  console.log(option, id);

  

}
