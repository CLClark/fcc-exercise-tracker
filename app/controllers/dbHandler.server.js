'use strict';
var config = process.env.MLAB_URI;

var Exercise = require('../models/exercise.js');
var Users = require('../models/users.js');
var mongoose = require('mongoose');

function DbHandler () {

	this.addUser = function  (req, res) {
		console.log('handler.server.js.addUser');

		//accepts param "username"
		//returns "username" + "_id"

		var singleUser = new Users();
		let uName = req.body.username;				

		singleUser.username = uName;

		singleUser.save(function (err, newUser) {
			if (err){
				res.sendStatus(500);
			}else{
				let dupeUser = {};	
				//filter for only username and _id fields			
				dupeUser.username = newUser.username;
				dupeUser["_id"] = newUser["_id"];
				//send the data
				res.json(dupeUser);
			}
		});	

		
	}//addUser

	this.returnUsers = function  (req, res) {
		console.log('handler.server.js.returnUsers');
		//returns array object of all users

		var userQuery = Users.find().where('username').exists();
		userQuery.select('username').exec(function (err, usersBack) {
			if (err){
				console.log(err);
				res.sendStatus(500);
			}else{
				console.log(usersBack);
				res.json(usersBack);
			}
		});

	}//returnUsers


	this.addExercise = function  (req, res) {
		console.log('handler.server.js.addExercise');
		//accepts userId(_id), description, duration, and optionally date
		//returns user object with also with the exercise fields added
		
		var newEx = new Exercise();
		let uId = req.body.userId;//_id
		let descr = req.body.description | 'none';
		let dura = req.body.duration;
		let date = null; // yyyy-mm-dd

		newEx.description = descr;
		newEx.duration = dura;
		newEx.date = date;
		newEx.userId = uId;
		newEx.active = true;
		
		Users.findByIdAndUpdate(uId, { $push: { exercises: newEx} },(err, docBack) => {
			if(err){
				console.log(err);
				res.sendStatus(500);
			}else{
				console.log("no err");
				console.log(docBack);				
				res.json(docBack);
			}
		});

	}//addExercise

	this.getLog = function  (req, res) {
		//accepts parameter of userId(_id)
		//optionally accepts parameters of from & to or limit. (Date format yyyy-mm-dd, limit = int)
		//returns user object with added array log and count (total exercise count)
		//optionally returns (part of the log) based on parameters

		var singleUser = new Users();
		let uId = req.body.userId;//_id
		
		let limit = req.body.limit | 'none';
		let from = null; // yyyy-mm-dd
		let to = null; //

		//TODO: optionally limit query before executing (date and a count)

		var userQuery = Users.find().where('_id').equals('uId');
		userQuery.where();
		userQuery.where();


	}//getLog

}//DbHandler

module.exports = DbHandler;
