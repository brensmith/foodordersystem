var mongoose = require('mongoose');

// Purchaseditem Schema
var PurchaseditemSchema = mongoose.Schema({

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

const Purchaseditem = module.exports = mongoose.model('Purchaseditem', PurchaseditemSchema);




// 
module.exports.getPurchaseditems = (callback, limit) => {
	Checkeditem.find(callback).limit(limit);
}

// 
module.exports.getPurchaseditemById = (id, callback) => {
	Checkeditem.findById(id, callback);
}

// 
module.exports.addPurchaseditem = (checkeditem, callback) => {
	Checkeditem.create(Checkeditem, callback);
}

// 
module.exports.updatePurchaseditemitem = (id, purchaseditem, options, callback) => {
	var query = {_id: id};
	var update = {
		name: purchaseditem.name,
		price: purchaseditem.price,
		quantity: purchaseditem.quantity,
		
		
	}
	Purchaseditem.findOneAndUpdate(query, update, options, callback);
}

// Delete Book
module.exports.removePurchaseditem = (id, callback) => {
	var query = {_id: id};
	Purchaseditem.remove(query, callback);
}


