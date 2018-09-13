'use strict';

var path = process.cwd();
var DbHandler = require(path + '/app/controllers/dbHandler.server.js');

module.exports = function (app) {

	var dbHandler = new DbHandler();

	app.route('/api/exercise/new-user')
		.post(dbHandler.addUser); 
		//accepts username, returns username and _id.

	app.route('/api/exercise/users')
		.get(dbHandler.returnUsers); 
		//returns array of all users

	app.route('/api/exercise/add')
		.post(dbHandler.addExercise); 
		//accepts userId(_id), description, duration, and optionally date
		//returns user object with also with the exercise fields added

	app.route('/api/exercise/log')
		.get(dbHandler.getLog); 
		//accepts parameter of userId(_id)
		//optionally accepts parameters of from & to or limit. (Date format yyyy-mm-dd, limit = int)
		//returns user object with added array log and count (total exercise count)
		//optionally returns (part of the log) based on parameters



};