var express = require('express');
var router = express.Router();

//Required Models --> This gives us access to these
var Fooditem = require('../models/fooditem');
var User = require('../models/user');

// Get Homepage
router.get('/', ensureAuthenticated, function(req, res){
	res.render('index1');
});


function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		//console.log('you are not')
		res.render('login');
		
	}
}

// Get food item objects from database
router.get('/fooditem', function(req, res){
    console.log('GET all food');
    Fooditem.find({})
        .exec(function(err, fooditem){
            if(err){
                res.send('An error has occured');
            }	else{
                console.log(fooditem);
                //req.json(Fooditem); //returns the data in json format
                res.send(fooditem);
            }
        });

});

// Find one food object from database
router.get('/fooditem/:id', function(req, res){
    console.log('GET one food');
    Fooditem.findOne({_id: req.params.id})
        .exec(function(err, fooditem){
            if(err){
                res.send('An error has occured');
            }	else{
                console.log(fooditem)
                res.json(fooditem);
            }
        });

});

// Add food Item object to database
router.post('/fooditem', function(req, res){
    var newFoodItem = new Fooditem();

    newFoodItem.name = req.body.name;
    newFoodItem.description = req.body.description;
    newFoodItem.calories = req.body.calories;
    newFoodItem.price = req.body.price;
    newFoodItem.img_url = req.body.img_url;

    newFoodItem.save(function(err,Fooditem){
        if(err){
            res.send('Error saving Food Item');
        }else{
            console.log(Fooditem);
            res.send(Fooditem);
        }
    });
});

// Add food Item2 object to database
router.post('/fooditem2', function(req, res){
    Fooditem.create(req.body,function(err, fooditem){
        if(err){
            res.send('error saving meal');


        }else{
            console.log('Fooditem');
            res.send(fooditem);
        }
    });

});

// Update food Item object to database
router.put('/fooditem/:id', function(req, res){
    Fooditem.findOneAndUpdate({_id: req.params.id},
        {$set:{name: req.body.name,
            description: req.body.description,
            calories: req.body.calories,
            price: req.body.price,
            img_url: req.body.img_url
        }},
        {upsert: true},
        function(err, newFoodItem){
            if(err){
                res.send('error occured');
            }
            else{
                console.log(newFoodItem);
                res.send(newFoodItem);
            }

        });
});

router.delete('/fooditem/:id', function(req, res){
    Fooditem.findOneAndRemove({
        _id:req.params.id
    },function(err,Fooditem){
        if(err){
            res.send('Error deleting');
        }else{
            console.log(Fooditem);
            res.status(204);
        }
    });
});

router.post('/delete', function(req, res) {
    var condition = req.body;
    Fooditem.remove(condition, function (err, message) {
        if (err) {
            res.send(err.message)
            return console.error(err);
        }
        res.send(message);
    });

});

router.post('/update', function(req, res) {
    var data = req.body;
    delete data.$$hashKey;

    Fooditem.update({_id: data._id}, data, {multi: true}, function (err, message) {
        if (err) {
            res.send(err.message)
            return console.error(err);
        }
        res.send(message);
    });

});


// Get food item objects from database
router.get('/users', function(req, res){
    console.log('GET all users');
    User.find({})
        .exec(function(err, user){
            if(err){
                res.send('An error has occured');
            }   else{
                console.log(user);
                //req.json(Fooditem); //returns the data in json format
                res.send(user);
            }
        });

});



module.exports = router;

