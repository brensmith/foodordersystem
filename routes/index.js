var express = require('express');
var router = express.Router();

//Required Models --> This gives us access to these
var Fooditem = require('../models/fooditem');
var User = require('../models/user');
var Checkeditem = require('../models/checkeditem');

// Get Homepage
router.get('/', ensureAuthenticated, function(req, res){
    var userRole = req.user ? req.user.role : 'anon';
if (req.user.role ==='ADMIN')
  res.render('staff', {
    role: userRole
  });
else{
    if (req.user.role ==='USER')
  res.render('index', {
    role: userRole
  });
}
})
	


function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		req.flash('error_msg','You are not logged in');
		console.log('you are not logged in')
		res.render('login');
		
	}
}

// Get food item objects from database
router.get('/api/fooditem',ensureAuthenticated, function(req, res){
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
router.get('/api/fooditem/:id', function(req, res){
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
router.post('/api/fooditem',ensureAuthenticated, function(req, res){
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


// Add food Item object to database
router.post('/api/checkeditem',ensureAuthenticated, function(req, res){
    var newCheckeditem = new Checkeditem();

    newCheckeditem.name = req.body.name;
    newCheckeditem.price = req.body.price;
    newCheckeditem.quantity = req.body.quantity;
    

    newCheckeditem.save(function(err,Checkeditem){
        if(err){
            res.send('Error saving Checked Item');
        }else{
            console.log(Checkeditem);
            res.send(Checkeditem);
        }
    });
});

// Get food item objects from database
router.get('/api/checkeditem',ensureAuthenticated, function(req, res){
    console.log('GET all checkeditem');
    Checkeditem.find({})
        .exec(function(err, checkeditem){
            if(err){
                res.send('An error has occured');
            }   else{
                console.log(checkeditem);
                //req.json(Fooditem); //returns the data in json format
                res.send(checkeditem);
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
router.put('/api/fooditem/:id',ensureAuthenticated, function(req, res){
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

router.post('/api/delete', function(req, res) {
    var condition = req.body;
    Fooditem.remove(condition, function (err, message) {
        if (err) {
            res.send(err.message)
            return console.error(err);
        }
        res.send(message);
    });

});

router.post('/api/update', function(req, res) {
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


// Get user object from database
router.get('/api/users',ensureAuthenticated, function(req, res){
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

