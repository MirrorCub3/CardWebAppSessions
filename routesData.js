let path = require("path");
let express = require("express");
var passport = require("passport");

//added below for mongo
//var mongoose = require("mongoose");
var User = require("./models/user");
const GameInfo = require('./models/gameInfo');
const GameSettings = require('./models/gameSettings');

//added above for mongo

//Look at below web page for info on express.Router()
//https://scotch.io/tutorials/learn-to-use-the-new-router-in-expressjs-4
let router = express.Router();




router.use(function(req, res, next) {
  res.locals.currentUserjy = req.user;
  res.locals.errors = req.flash("error");
  res.locals.infos = req.flash("info");
  next();
});

//request is info sending to server from client.
//response is info sending to client from server.

//router.get("/",function(req,res){
//	res.sendFile(path.resolve(__dirname + "/public/views/index.html"));  //changed
//});

//added below for mongo
const myDatabase = require('./myDatabase');
//added above for mongo

let db = new myDatabase();
const Student = require('./Student');
const GameSettingsJS = require('./gameSettings');


router.get('/read', function(req, res){ // the read from sessions
	if (req.isAuthenticated()) {
		return(db.getStudent(req.user.ident,res));
	}
	else
		res.json(null);
});


// router.get('/readAdmin', function(req, res){
// 	if (req.isAuthenticated()) {
// 		if (req.user.username == "admin")
// 		{

//added below for mongo

// console.log("readAdmin " + req.query.ident);
// 		return(db.getStudent(req.query.ident,res));
// 		}
// 		else
// 			res.json(null);
// 	}
// 	else
// 		res.json(null);
// });





router.post('/create', function(req, res){

	if (req.isAuthenticated()) {

		if (/^[ ]*[ ]*$/.test($(req.body.name))) { // the .name is from the req.authenticated student pointer not from the original request
			res.json(null);
			return;
		}
    //
		// if (req.user.username == "admin") {
		// 	res.json(null);
		// 	return;
		// }

		console.log(req.body.grade);
		console.log(req.body.volleyball);
console.log("Routes data create driver = " + req.body.driver);
//added below for mongo
	let obj = new Student(req.user.ident,req.user.username,req.body.grade,req.body.volleyball, // calling the database and creating this new student document -- - same as the previous session concept
		req.body.basketball,req.body.soccer,req.body.driver);
		return(db.postStudent(obj,res)); // calling the dtatbase

	}
	else
		res.json(null);
});



router.put('/updateAdmin', function(req, res){ // called in admin session

	if (req.isAuthenticated()) {


console.log(req.body.ident);
console.log(req.body.name);
console.log(req.body.grade);


		if (req.body.name == "") {
			res.json(null);
			return;
		}
    console.log("Routes data admin driver = " + req.body.driver);
//added below for mongo
	let obj = new Student(req.body.ident,req.body.name,req.body.grade,req.body.volleyball,req.body.basketball,req.body.soccer, req.body.driver);
		return(db.putStudent(obj,res));
	}
	else
		res.json(null);
});

router.delete('/deleteAdmin/:identifier', function(req, res){
	return( db.deleteStudent(req.params.identifier,res));	// sending in the id
  // db.deleteStudent(req.params.identifier,res);	// sending in the id
  // if (req.isAuthenticated()) {
  //   res.redirect("/successlogin");
  // } else {
  //   res.redirect("/faillogin");
  // }
});


router.put('/update', function(req, res){ // called on /update in the session

	if (req.isAuthenticated()) {

		if (req.body.name == "") {
			res.json(null);
			return;
		}
    console.log("Routes data driver = " + req.body.driver);
//added below for mongo
	let obj = new Student(req.user.ident,req.user.username,req.body.grade,req.body.volleyball,req.body.basketball,req.body.soccer,req.body.driver);
		return(db.putStudent(obj,res));

	}
	else
		res.json(null);
});

module.exports = router;
