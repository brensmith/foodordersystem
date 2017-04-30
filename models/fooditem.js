var mongoose = require('mongoose');
var User = require('../models/user');

// FoodMenu Schema
var FoodItemSchema = mongoose.Schema({

	name: {
		type: String,
		index: true
	},
	description: {
		type: String
	},
	calories: {
		type: String
	},
	price: {
		type: String
	},
	img_url: {
		type: String
	},
	user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
});

const Fooditem = module.exports = mongoose.model('Fooditem', FoodItemSchema);




// Get Books
module.exports.getFooditems = (callback, limit) => {
	Fooditem.find(callback).limit(limit);
}

// Get Book
module.exports.getFooditemById = (id, callback) => {
	Fooditem.findById(id, callback);
}

// Add Book
module.exports.addFooditem = (fooditem, callback) => {
	Fooditem.create(Fooditem, callback);
}

// Update Book
module.exports.updateFooditem = (id, fooditem, options, callback) => {
	var query = {_id: id};
	var update = {
		name: fooditem.name,
		description: fooditem.description,
		calories: fooditem.calories,
		price: fooditem.price,
		img_url: fooditem.img_url
		
	}
	Fooditem.findOneAndUpdate(query, update, options, callback);
}

// Delete Book
module.exports.removeFooditem = (id, callback) => {
	var query = {_id: id};
	Fooditem.remove(query, callback);
}


