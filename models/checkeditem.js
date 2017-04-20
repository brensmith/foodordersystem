var mongoose = require('mongoose');

// Checkeditem Schema
var CheckeditemSchema = mongoose.Schema({

	name: {
		type: String,
		index: true
	},
	price: {
		type: String,
	},
	quantity: {
		type: String
	},
	
});

const Checkeditem = module.exports = mongoose.model('Checkeditem', CheckeditemSchema);




// Get Books
module.exports.getCheckeditems = (callback, limit) => {
	Checkeditem.find(callback).limit(limit);
}

// Get Book
module.exports.getCheckeditemById = (id, callback) => {
	Checkeditem.findById(id, callback);
}

// Add Book
module.exports.addCheckeditem = (checkeditem, callback) => {
	Checkeditem.create(Checkeditem, callback);
}

// Update Book
module.exports.updateCheckeditem = (id, checkeditem, options, callback) => {
	var query = {_id: id};
	var update = {
		name: checkeditem.name,
		price: checkeditem.price,
		quantity: checkeditem.quantity,
		
		
	}
	Checkeditem.findOneAndUpdate(query, update, options, callback);
}

// Delete Book
module.exports.removeCheckeditem = (id, callback) => {
	var query = {_id: id};
	Checkeditem.remove(query, callback);
}


