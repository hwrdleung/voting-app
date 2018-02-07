var express = require('express');
var router = express.Router();

//Get homepage
router.get('/', function(request, response){
  response.render('index');
});

module.exports = router;
