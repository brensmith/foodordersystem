var express = require('express');
var router = express.Router();
var multer = require('multer');

//Required Models --> This gives us access to these
var Fooditem = require('../models/fooditem');
var User = require('../models/user');
var Checkeditem = require('../models/purchaseditem');
//set image upload to save to disk
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});

var upload = multer({storage: storage}).single('foodimage');

router.post('/uploads', function (req, res) {
  upload(req, res, function (err) {
    if (err) {
      // An error occurred when uploading
        res.send('An error has occured Image not uploaded');
        }
     // Everything went fine
    res.json({success: true, message: 'Image Uploaded'});
  })
});

// Get Homepage and check is user authenticated, if not authenticated render login view
router.get('/', ensureAuthenticated, function(req, res){
    //if authenticated user role is === to "ADMIN" load the staff dashboard
    var userRole = req.user ? req.user.role : 'anon';
if (req.user.role ==='ADMIN')
  res.render('staff', {
    role: userRole
  });
else{
    //if authenicated user role === to "USER" load the user dashboard
    if (req.user.role ==='USER')
  res.render('index', {
    role: userRole
  });
}
})

router.get('/checkout', function(req, res) {
  res.render('checkout', {user: req.user});
});
	

//check is user authenticated, if not than display message "you are not logged in" and render login view
function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		req.flash('error_msg','You are not logged in');
		console.log('you are not logged in')
		res.render('login');
		
	}
}

// Get food item objects from database, check first if user making the request is authenticated
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

// Add food Item object to database, check first if user is authenticated
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


// Add purchased Item object to database
router.post('/api/purchaseditem',ensureAuthenticated, function(req, res){
    var newPurchaseditem = new Purchaseditem();

    newPurchaseditem.name = req.body.name;
    newPurchaseditem.price = req.body.price;
    newPurchaseditem.quantity = req.body.quantity;
    

    newPurchaseditem.save(function(err,Purchaseditem){
        if(err){
            res.send('Error saving Checked Item');
        }else{
            console.log(Purchaseditem);
            res.send(Purchaseditem);
        }
    });
});

// Get purchased item objects from database
router.get('/api/purchaseditem',ensureAuthenticated, function(req, res){
    console.log('GET all Purchased items');
    Purchaseditem.find({})
        .exec(function(err, purchaseditem){
            if(err){
                res.send('An error has occured');
            }   else{
                console.log(purchaseditem);
                //req.json(purchaseditem); //returns the data in json format
                res.send(purchaseditem);
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

