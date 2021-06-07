var path = require("path");
var express = require("express");
var passport = require("passport");

var User = require("./models/user");
const GameInfo = require('./models/gameInfo');
const GameSettings = require('./models/gameSettings');
const GameSettingsJS = require('./gameSettings');

var router = express.Router();
var bcrypt = require("bcrypt-nodejs");
var SALT_FACTOR = 10;

//function ensureAuthenticated(req, res, next) {
//  if (req.isAuthenticated()) {
//    next();
//  } else {
//    req.flash("info", "You must be logged in to see this page.");
//    res.redirect("/login");
//  }
//}

router.use(function(req, res, next) {
  res.locals.currentUserjy = req.user;
  res.locals.errors = req.flash("error");
  res.locals.infos = req.flash("info");
  next();
});


//added below for mongo
const myDatabase = require('./myDatabase');
//added above for mongo

let db = new myDatabase();


var ident = 0;
var gameIdent = 0;

function initIdent(){ // check everytime a ident is gotten to update it to the largest value
  if (ident == 0)
  {
    User.find({},function(err,user) { // doe a find and lookss through all users ids
      if (!err) {
        let objs = [];
        for (let i=0;i<user.length;i++) {
          if (ident < user[i].ident)
            ident = user[i].ident;
        }
      }
    });
//    ident = 3;   //this was temp to check if User.find above is an issue.
  }
}
function initGameIdent(){ // check everytime a ident is gotten to update it to the largest value
  if (gameIdent == 0)
  {
    GameSettings.find({},function(err,game) { // doe a find and lookss through all users ids
      if (!err) {
        let objs = [];
        for (let i=0;i<game.length;i++) {
          if (gameIdent < game[i].ident)
            gameIdent = game[i].ident;
        }
        console.log("in it game ident " + gameIdent);
      }
    });
//    ident = 3;   //this was temp to check if User.find above is an issue.
  }
}


router.get("/successroot", function(req, res) {
console.log("get successroot");
	res.json({redirect:"/"});
});

router.get("/failroot", function(req, res) {
console.log("get failroot");
	res.json({redirect:"/login"});
});

router.get("/successsignup", function(req, res) {
console.log("get successsignup");
      res.json({redirect:"/account"});
});

router.get("/failsignup", function(req, res) {
console.log("get failsignup");
	res.json({redirect:"/login"});
});

router.get("/successlogin", function(req, res) {
console.log("get successlogin");
      res.json({redirect:"/account"});
});

router.get("/faillogin", function(req, res) {
console.log("get faillogin");
	res.json({redirect:"/login"});

});
router.get("/successcreate", function(req, res) {
console.log("get successcreate");
	res.json({redirect:"/sendCreate"});
});
router.get("/failcreate", function(req, res) {
console.log("get failcreate");
	res.json({redirect:"/login"});
});



router.get("/", function(req, res, next) {
console.log("get root");

	let thePath = path.resolve(__dirname,"public/views/login.html");
	res.sendFile(thePath);

 // User.find()
 // .sort({ createdAt: "descending" })
 // .exec(function(err, users) {
 //   if (err) { return next(err); }
 //   res.render("index", { users: users });
 // });
});

// vv this is the only time we look for a new id
router.get("/signup", function(req, res) {
console.log("get signup");
  initIdent(); // checks the id t largest value

	let thePath = path.resolve(__dirname,"public/views/signup.html");
	res.sendFile(thePath);

});

router.get("/login", function(req, res) {
console.log("get login");

	let thePath = path.resolve(__dirname,"public/views/login.html");
	res.sendFile(thePath);

});


router.get("/account", function(req, res) {
  console.log("get account");
  if (req.isAuthenticated()) {

    if (req.user.username == "admin") // admin is a special user built into the code - ie hardcoded
    {
       let thePath = path.resolve(__dirname,"public/views/adminsession.html"); // sends the admin specific html to admin
       res.sendFile(thePath);
    }
    else
    {
	     let thePath = path.resolve(__dirname,"public/views/account.html");
	     res.sendFile(thePath);
     }
  } else {
  	let thePath = path.resolve(__dirname,"public/views/login.html");
	res.sendFile(thePath);
  }
});






router.get("/adminInfo",function(req,res){ // called on admin session document.load

  if (req.isAuthenticated()) {

        if (req.user.username == "admin")
        {
            initAdmin(req,res);
        }
        else
          res.json(null);

  }
  else {
    res.json(null);
  }
});
router.get("/sendCreate",function(req,res){ // called on admin session document.load

  if (req.isAuthenticated()) {
console.log("auth in get create" + __dirname);
let thePath = path.resolve(__dirname,"public/views/create.html");
res.sendFile(thePath);
  }
  else {
  console.log("fail get create");
  let thePath = path.resolve(__dirname,"public/views/login.html");
  res.sendFile(thePath);
  }
});

router.get("/create",function(req,res){ // called on admin session document.load

  if (req.isAuthenticated()) {
return res.redirect("/successcreate");
  }
  else {
  return res.redirect("/failcreate");
  }
});



//==================

function initAdmin(req,res) {// called on document.ready for the adminsessions
  console.log("initAdmin");
  console.log(req.user.ident);
  console.log(req.user.username);

            Info.find({},function(error,info) { //does an empty parameter find on all documents in infos collection
              if (error) {
                return res.json(null);
              } else {
                let list = [];
                for (let i=0;i<info.length;i++) { // loop trough all returned documents and store into array
                  list.push({ident:info[i].ident,name:info[i].name}); // store the id and name into an array
                }          //vv admins ident and username                    vv the list of students
                res.json ({ ident:req.user.ident,username: req.user.username,userList:list});
              }
            });
}


router.get("/userInfo",function(req,res){// called on document.ready for the sessions
      console.log("top userInfo");
  if (req.isAuthenticated()) {
      console.log("userInfo is auth");
      db.getUser(req.user.ident,res); // call to the myDatabse to find this students info
	}
	else {
		res.redirect("/failsignup");
	}
});


//==================




router.get("/logout", function(req, res) {
  if (req.isAuthenticated()) {
    req.logout(); // takes out of session
    res.redirect("/successroot");
  } else {
    res.redirect("/failroot");
  }
});

router.post("/signup", function(req, res, next) { // post sign up called in user clicked
console.log("post signup");

  var username = req.body.username;
  var password = req.body.password;
  ident++; // plus one to ident = notice how the id is already ++ even though it hasn't passes the find null check yet - try moving this below the return line and see if it causes issues

  User.findOne({ username: username }, function(err, user) { //the find should return null , if the username is already taken

    if (err) { return next(err); }
    if (user) { // this is why no repeat names - will find the student and pointerf will not be null = sends the /failsignup
      req.flash("error", "User already exists");
      return res.redirect("/failsignup");
    }

    var newUser = new User({ // should only get to here id the user doesnt alredy exist
      username: username,
      password: password,
      ident: ident // variable at the top
    });
    newUser.save(next);    //this line has to be called. this is what stores the above info into the users collection
  });


}, passport.authenticate("login", { // same authenticate as in the student bycrypt
  successRedirect: "/successsignup",
  failureRedirect: "/failsignup",
  failureFlash: true
}));
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var noop = function() {};

router.post('/changepsw', function(req, res){
  console.log("in change pass");
    if (req.isAuthenticated()) {
        bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
            if (err) { res.json(null); }
            bcrypt.hash(req.body.password, salt, noop, function(err, hashedPassword) {
                if (err) {  res.json(null); }
                User.findOneAndUpdate({ident:req.user.ident},{password:hashedPassword},function(error,info) {
                    if (error) {
                        res.json(null);
                    }
                    else if (info == null) {
                        res.json(null);
                    }
                    res.json({retVal:true});
                });
            });
        });
    }
    else
        res.json(null);
});
/////////////////////////////////////////////////////////////////////////////////////////////////////
router.post("/login", passport.authenticate("login", { // if incorect password willmot pass the match test and will return null, if the user doesnt exist will return null int the user.findOne and return null back here
  successRedirect: "/successlogin",
  failureRedirect: "/faillogin",
  failureFlash: true
}));

//
// router.post("/creategame", function(req, res) {
//   console.log(req);
//   initGameIdent();
// console.log("post creategame");
//
//   gameIdent++; // plus one to ident = notice how the id is already ++ even though it hasn't passes the find null check yet - try moving this below the return line and see if it causes issues
//
//   var newGame = new GameSettingsJS(
//     gameIdent,
//     req.body.hostName,
//     req.body.name,
//     req.body.players,
//     req.body.gameActive,
//     req.body.private,
//   	req.body.password,
//
//     req.body.dealAll,
//     req.body.startHand,
//   	req.body.jokers,
//   	req.body.infinite,
//   	req.body.replace,
//   );
// console.log(newGame);
// return(db.postGame(newGame,res));
// });

module.exports = router;
