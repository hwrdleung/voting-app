console.log("main.js");

//Circle text script
var message = "Vote!";
var message = message.toUpperCase().split('');
var messageIndex = 0;
var circleText = document.querySelector("#circle-text");

var timer = setInterval(function() {
  if (circleText.style.color !== "red") {
    circleText.style.color = "red";
  } else {
    circleText.style.color = "blue";
  }
  if (messageIndex === message.length) {
    messageIndex = 0;
  }
  circleText.innerHTML = message[messageIndex];
  messageIndex++;
}, 1000);

//These vars are for the 'create a poll' page
var minOptions = 2;
var maxOptions = 20;
var optionCount = 3;//The page loads with 2 options. Initialize to 3.

function addOption() {
  if (optionCount <= maxOptions) {
    console.log(optionCount);
    //When user clicks "add option" on the create page,
    //Append another option field to class .create-poll
    var lastOptionCount = optionCount - 1;
    var lastId = "option" + lastOptionCount.toString();
    var newOptionId = "option" + optionCount.toString();

    var newInputField = '<input id="' + newOptionId +
      '" type="text" placeholder="Option ' + optionCount.toString() +
      '" name="option' + optionCount.toString() + '">';

    $(newInputField).insertAfter($('#'+lastId));
    optionCount++;
  }
}

function removeOption() {
  //When user clicks "remove option" on the create page,
  //Remove last text input field and decrement lastOptionCount
  if (optionCount > minOptions + 1) {
    optionCount--;
    var optionId = "#option" + optionCount.toString();
    $(optionId).remove();
  }
}
