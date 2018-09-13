'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Exercise = new Schema({

	userId: String,
	// exerId: String,
	description: String,
	duration: String,	
	date: String,
	active: Boolean
	
});

module.exports = mongoose.model('Exercise', Exercise);

