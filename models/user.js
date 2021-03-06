var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var User = require('../models/user');
// User Schema
var UserSchema = mongoose.Schema({
	username: {
		type: String, required: true, 
		
	},
	password: {
		type: String, required: true,
	},
	email: {
		type: String, required: true, 
	},
	name: {
		type: String, required: true,
	},
	role: {
		type: String, enum: ['USER', 'ADMIN'], default: 'USER'
	},
	resetPasswordToken: String,
  	resetPasswordExpires: Date,
  	items: {type: mongoose.Schema.Types.ObjectId, ref: 'Fooditem'},
});

var User = module.exports = mongoose.model('User', UserSchema);

UserSchema.pre('save', function(next) {
  var user = this;
  var SALT_FACTOR = 5;

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

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

