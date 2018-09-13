'use strict';
var config = process.env.MLAB_URI;

var Exercise = require('../models/exercise.js');
var Users = require('../models/users.js');
var mongoose = require('mongoose');
var dateFormat = require('dateformat');

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
		
		//TODO: change to find by user id not username

		var newEx = new Exercise();
		let uId = req.body.userId;//_id
		let descr = req.body.description | 'none';
		let dura = req.body.duration;
		let nowDate = new Date();		
		let date = req.body.date || 
			dateFormat(nowDate, "yyyy-mm-dd"); // yyyy-mm-dd

		let exDate =  new Date(
			parseInt(date.slice(0, 4)),
			parseInt(date.slice(5, 7)),
			parseInt(date.slice(8, 10))
		); // yyyy-mm-dd

		
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
		let uId = req.query.userId;//_id

		let limit = parseInt(req.query.limit) || -1;
		let fromString = req.query.from || "0001-01-01";
		let todString = req.query.to || "9999-12-31";

		let from =  new Date(
			parseInt(fromString.slice(0, 4)),
			parseInt(fromString.slice(5, 7)),
			parseInt(fromString.slice(8, 10))
		); // yyyy-mm-dd

		console.log("from is " + from);

		let to = new Date(
			parseInt(todString.slice(0, 4)),
			parseInt(todString.slice(5, 7)),
			parseInt(todString.slice(8, 10))
		); // yyyy-mm-dd
		console.log("to is: " + to);

		//TODO: optionally limit query before executing (date and a count)

		var rawId = mongoose.Types.ObjectId(uId);
		var userQuery = Users.find().where('_id').equals(rawId);		

		if(limit > -1){
			//include user's limit
			userQuery.slice('exercises', limit)
			.where('exercises.date').lt(to)
			.where('exercises.date').gt(from)
			.exec(function (err, usersBack) {
				if (err){
					console.log(err);
					res.sendStatus(500);
				}else{
					console.log(usersBack);
					res.json(usersBack);
				}
			});

		}else{
			//ignore limit		
			userQuery
			.lt('exercises.date', to)
			.gt('exercises.date',from)
			.exec(function (err, usersBack) {
				if (err){
					console.log(err);
					res.sendStatus(500);
				}else{
					console.log(usersBack);
					res.json(usersBack);
				}
			});
		}


	}//getLog

}//DbHandler

module.exports = DbHandler;
