var express = require('express');
var router = express.Router();

var FoodItem = require('../models/fooditem');


// Get staff page
router.get('/', function(req, res){
	res.render('staff');
});

// Get food menu
router.get('/foodmenu', function(req, res){
	res.render('foodmenu');
});


module.exports = router;