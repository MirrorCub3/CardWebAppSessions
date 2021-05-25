// promises is good especially when you dont know how long it will take between function calls/requests - think of it like setting a path that ypiu know it will follow. 
let path = require("path");
let express = require("express");
var passport = require("passport");

var Promise = require('promise'); // the package reqired for promise

//added below for mongo
//var mongoose = require("mongoose");
var User = require("./models/user");
var BookModel = require("./models/Book");

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
const myDatabaseBook = require('./myDatabaseBook');
//added above for mongo

let dbBook = new myDatabaseBook();
const Student = require('./Student');
const Book = require('./Book');


var identBook = 0;
function initIdentBook(){
  // two function pointers: if the code works good, then it runs resolve, the identbook changing code below.
// if there is a problem, then we use the reject function call
  return new Promise(function(resolve,reject) { // an instance of a promise, putting the code we want to happen first inside that promise
		if (identBook == 0) {
			BookModel.find({},function(err,user) { // without promise this allback will be called too late
				console.log("BookModel.find()");
				if (err) {
					reject(err); // reject if bad
				}
				else {
					for (let i=0;i<user.length;i++) { // this code finds the most recent ident
						if (identBook < user[i].ident) {
							identBook = user[i].ident;
						}
					}
					identBook++; // adds one so the new book will be the next one
					console.log("identBook = " + identBook);
					resolve(identBook); // calls the resove function with  the new identbook
				}
			});
		}
		else {
			identBook++;
			console.log("identBook = " + identBook);
			resolve(identBook); // calls the resove function with  the new identbook
		}
	});
}

router.post('/createBook', function(req, res){
console.log("in post createBook");


	if (req.isAuthenticated()) {

		console.log(req.body.title);
		console.log(req.body.author);
		console.log(req.body.pages);
		if (req.body.title == "") {
			res.json({retVal:null});
			return;
		}

		console.log(req.user.username);
		if (req.user.username != "librarian") {
			console.log("bad username");
			res.json({retVal:null});
			return;
		}


//		initIdentBook();
	  var Prom1 = initIdentBook(); // this stores wahtever is returned from the promise (initidentBook) int the Prom1 pointer
// theres two function here: if the promise sent back the resolve function, it will use this top function here function(result)
// if the promise had retuned the reject, it would call and run the second function (err)
// Either function can only be called when the rsove or reject is sent back from the initIdentBook, this is the "waiting" concept of promise
    Prom1.then(
	  	function(result) { // the good function
    			console.log("identBook = " + identBook);
    		  if (identBook == 0) // without the promise feature, this would stop all creates since ident book would be updated AFTER it was needed due tpo async nonblocking
    		  {
    			res.json({retVal:null});
    			return;
    		  }
    		  let obj = new Book(identBook,req.body.title,req.body.author,req.body.pages);
    		  console.log(obj);
    		  console.log("will do dbBook.postBook");
    		  return(dbBook.postBook(obj,res));
	    },
	    function(err) { // the reject function
  	      console.log("error");
  	      res.json({retVal:null});
	    }
	  );


	}
	else
		res.json({retVal:null});
});


router.get("/listBook",function(req,res){
      console.log("top listBook");
  if (req.isAuthenticated()) {
      console.log("userInfo is auth");
      dbBook.getBooks(res);
	}
	else {
		res.json({retVal:null});
	}
});


module.exports = router;
