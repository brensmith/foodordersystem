var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// User Schema
var UserSchema = mongoose.Schema({
	username: {
		type: String, required: true
		
	},
	password: {
		type: String, required: true
	},
	email: {
		type: String, required: true
	},
	name: {
		type: String, required: true
	},
	role: {
		type: String, enum: ['USER', 'STAFF'], default: 'USER'
	}
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        newUser.save(callback);
	    });
	});
}

module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};
	User.findOne(query, callback);
	console.log(query);
}

module.exports.isUserAdmin = function(username, callback)
  {
    User.findOne({username: username}, function(err, foundUser)
    {
      if(foundUser.roles.indexOf('admin') > -1)
      {
        callback(foundUser);
      }
      else
      {
        callback('0');
      }
    });
  }



module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}

