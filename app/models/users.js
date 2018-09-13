'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// var Exercise = require('../models/exercise.js');

var Exercise = new Schema({

	// userId: String,
	exerId: String,	
	description: String,
	duration: String,	
	date: Date,
	active: Boolean

});

var User = new Schema({

	//_id: String,
	username: String,
	userId: String,	
	active: Boolean,

	exercises: [ Exercise ]
});



module.exports = mongoose.model('User', User);

