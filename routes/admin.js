var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

//Initialize fooditem model
//Required Models --> This gives us access to these
var Fooditem = require('../models/fooditem');
var User = require('../models/user');

// Get admin page
router.get('/', function(req, res){
    res.render('admin');
});

// Get food menu
router.get('/api/foodmenu', function(req, res){
    res.render('foodmenu');
});

// Get food item objects from database
router.get('/api/fooditem', function(req, res){
    console.log('GET all food');
    Fooditem.find({})
        .exec(function(err, fooditem){
            if(err){
                res.send('An error has occured');
            }	else{
                console.log(fooditem);
                res.send(fooditem);
                
            }
        });

});

// Find one food object from database
router.get('/api/fooditem/:id', function(req, res){
    console.log('GET one food');
    Fooditem.findOne({_id: req.params.id})
        .exec(function(err, fooditem){
            if(err){
                res.send('An error has occured');
            }	else{
                console.log(fooditem);
                res.send(fooditem);
            }
        });

});

// Add food Item object to database
router.post('/api/fooditem', function(req, res){
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
router.post('/api/fooditem2', function(req, res){
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
router.put('/api/fooditem/:id', function(req, res){
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

router.delete('/api/fooditem/:id', function(req, res){
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

// Get user menu
router.get('/api/usermenu', function(req, res){
    res.render('usermenu');
});

module.exports = router;