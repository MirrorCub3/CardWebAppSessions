var path = require("path");
var express = require("express");
var passport = require("passport");

var User = require("./models/user");
//const GameInfo = require('./models/gameInfo');
const GameInfoJS = require('./gameInfo');

const GameSettings = require('./models/gameSettings');
const GameSettingsJS = require('./gameSettings');

const Deck = require("./cards.js");
const Player = require("./Player.js");
var allGameInfos = [];

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
const myDatabaseGame = require('./myDatabaseGame');
//added above for mongo

let db = new myDatabaseGame();

var gameIdent = 0;
function initGameIdent(){
  // two function pointers: if the code works good, then it runs resolve, the identbook changing code below.
// if there is a problem, then we use the reject function call
  return new Promise(function(resolve,reject) { // an instance of a promise, putting the code we want to happen first inside that promise
		if (gameIdent == 0) {
			GameSettings.find({},function(err,game) { // without promise this allback will be called too late
				console.log("BookModel.find()");
				if (err) {
					reject(err); // reject if bad
				}
				else {
          console.log("existing games");
          let objs = [];
          for (let i=0;i<game.length;i++) {
            if (gameIdent < game[i].ident)
              gameIdent = game[i].ident;
          }
					resolve(gameIdent); // calls the resove function with  the new identbook
				}
			});
		}
    else {
			resolve(gameIdent); // calls the resove function with  the new identbook
		}
	});
}
// function initGameIdent(){ // check everytime a ident is gotten to update it to the largest value
//   if (gameIdent == 0)
//   {
//     GameSettings.find({},function(err,game) { // doe a find and lookss through all users ids
//       if (!err) {
//         console.log("existing games");
//         let objs = [];
//         for (let i=0;i<game.length;i++) {
//           if (gameIdent < game[i].ident)
//             gameIdent = game[i].ident;
//         }
//         console.log("in it game ident " + gameIdent);
//       }
//     });
//   }
// }

// router.get("/successsendtogame", function(req, res) {
//   console.log("get successsendtogame");
//         res.json({redirect:"/*game id number*/"});
//   });
//
//   router.get("/failsendtogame", function(req, res) {
//   console.log("get failsendtogame");
//     res.json({redirect:"/join"});
//
//   });

router.get("/getGameList", function(req,res,next){
  return(db.getGameList(res));
//	return(db.getStudent(req.user.ident,res));
});
router.get("/getGame", function(req, res) {
console.log("get game");
    if (req.isAuthenticated()) {
        return(db.getGame(req.query.ident,res));
    }
});
router.get("/getGameInfo", function(req, res) {
console.log("get gameinfo");
    if (req.isAuthenticated()) {
        //code here to loop through all info and find the game
    }
});

router.post("/creategame", function(req, res) {
  //console.log(req);
console.log("post creategame");
  var Prom1 = initGameIdent();
  Prom1.then(
    function(result) { // the good function
      gameIdent++; // plus one to ident = notice how the id is already ++ even though it hasn't passes the find null check yet - try moving this below the return line and see if it causes issues
      var newGame = new GameSettingsJS(
        gameIdent,
        req.body.hostName,
        req.body.name,
        req.body.players,
        req.body.gameActive,
        req.body.private,
        req.body.password,

        req.body.dealAll,
        req.body.startHand,
        req.body.jokers,
        req.body.infinite,
        req.body.replace,
      );
    console.log(newGame);
    return(db.postGame(newGame,res));
    },
    function(err) { // the reject function
        console.log("error");
        res.json({retVal:null});
    }
  );
});

router.post("/creategameinfo", function(req, res) {
console.log("post gameinfo");
    if (req.isAuthenticated()) {
      let deck = new Deck(req.body.replace,req.body.jokers);

      let players = [];
      players.length = req.body.playerNum;
      players[0] = new Player(req.user.ident, req.user.username);
      var info = new GameInfoJS(
        req.body.ident,
        req.body.playerNum,
        players,
        deck
      );
      allGameInfos.push(info);
      console.log(allGameInfos);
      //return(db.postGameInfo(allGameInfos,res));
      return res.json({retVal:true});
    }
    return res.json({retVal:false});
});
router.get("/successplayer", function(req, res) {
console.log("get successplayer");
	res.json({redirect:"/player"});
});
router.get("/failplayer", function(req, res) {
console.log("get failplayer");
	res.json({redirect:"/login"});
});

router.post("/postPlayer", function(req, res) {
console.log("post postPlayer");
if (req.isAuthenticated()) {
  ////check if this is player 1
for (var i = 0; i < allGameInfos.length; i++) {
    if(allGameInfos[i].ident == req.body.gameIdent){
      for (var x = 0; x < allGameInfos[i].players.length; x++) {
        if(allGameInfos[i].players[x] && allGameInfos[i].players[x].ident == req.user.ident){
          console.log("player is in the game already");
        }
        else{
          console.log("bacic player post request");
          allGameInfos[i].players.push(new Player(req.user.ident, req.user.username));
        }
        console.log(allGameInfos[i].players);
      }
    }
  }
return res.redirect("/successplayer");
}
else {
return res.redirect("/failplayer");
}
});
router.get("/player", function (req,res){
  console.log("get player");
  if (req.isAuthenticated()) {
    console.log("success get player");
    for (var i = 0; i < allGameInfos.length; i++) {
        if(allGameInfos[i].players[0].name == req.user.username){
          console.log("send player 1 html");
          let thePath = path.resolve(__dirname,"public/views/playerone.html");
          res.sendFile(thePath);
        }
        else{
          console.log("send player basic html");
          let thePath = path.resolve(__dirname,"public/views/player.html");
          res.sendFile(thePath);
        }
      }
    let thePath = path.resolve(__dirname,"public/views/player.html");
    res.sendFile(thePath);
  }
  else {
    console.log("fail get create");
    let thePath = path.resolve(__dirname,"public/views/login.html");
    res.sendFile(thePath);
  }
});


module.exports = router;
